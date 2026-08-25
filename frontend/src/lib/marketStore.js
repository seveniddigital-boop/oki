import { useCallback, useSyncExternalStore } from "react";

const HTTP = process.env.REACT_APP_BACKEND_URL;
const WS_URL = `${HTTP.replace(/^http/, "ws")}/api/ws/prices`;
const REST_URL = `${HTTP}/api/market-prices`;

const HEARTBEAT_MS = 25000;
const STALE_MS = 90000;
const IDLE_GRACE_MS = 60000; // disconnect this long after the tab is hidden
const UNMOUNT_GRACE_MS = 30000; // survive route changes before tearing down
const POLL_MS = 60000;
const WS_MAX_FAILURES = 3;
const WS_RETRY_MS = 5 * 60 * 1000;

let items = [];
let bySymbol = {};
let status = "idle"; // idle | connecting | live | reconnecting | offline
let ts = 0;
let snapshot = { items, status, ts };

const listeners = new Set();
let refCount = 0;

let socket = null;
let mode = "ws"; // ws | rest
let paused = false;
let intentionalClose = false;
let wsFailures = 0;
let reconnectAttempts = 0;

let reconnectTimer = null;
let heartbeatTimer = null;
let staleTimer = null;
let idleTimer = null;
let unmountTimer = null;
let pollTimer = null;
let wsRetryTimer = null;

// Reuse per-symbol object references when values are unchanged so granular
// subscribers (e.g. the nav BTC ticker) do not re-render on every push.
function rebuildBySymbol(next) {
  const map = {};
  for (const it of next) {
    const prev = bySymbol[it.symbol];
    if (
      prev &&
      prev.price === it.price &&
      prev.change === it.change &&
      prev.market_cap === it.market_cap &&
      prev.volume === it.volume
    ) {
      map[it.symbol] = prev;
    } else {
      map[it.symbol] = it;
    }
  }
  bySymbol = map;
}

function emit() {
  snapshot = { items, status, ts };
  listeners.forEach((l) => l());
}

function applyItems(next) {
  if (Array.isArray(next) && next.length) {
    rebuildBySymbol(next);
    items = next.map((it) => bySymbol[it.symbol]);
    status = "live";
    ts = Date.now();
  } else if (!items.length) {
    status = "offline";
  }
  emit();
}

function setStatus(s) {
  if (status !== s) {
    status = s;
    emit();
  }
}

function clearTimers() {
  clearTimeout(reconnectTimer);
  reconnectTimer = null;
  clearInterval(heartbeatTimer);
  heartbeatTimer = null;
  clearTimeout(staleTimer);
  staleTimer = null;
  clearInterval(pollTimer);
  pollTimer = null;
}

function startHeartbeat() {
  clearInterval(heartbeatTimer);
  heartbeatTimer = setInterval(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(JSON.stringify({ type: "ping" }));
      } catch {
        /* ignore */
      }
    }
  }, HEARTBEAT_MS);
}

function resetStale() {
  clearTimeout(staleTimer);
  staleTimer = setTimeout(() => {
    if (socket) {
      intentionalClose = true;
      try {
        socket.close();
      } catch {
        /* ignore */
      }
      socket = null;
      intentionalClose = false;
    }
    scheduleReconnect();
  }, STALE_MS);
}

function connectWS() {
  if (paused || refCount === 0) return;
  clearTimeout(reconnectTimer);
  reconnectTimer = null;
  if (!items.length) setStatus("connecting");
  try {
    socket = new WebSocket(WS_URL);
  } catch {
    onWSClosed();
    return;
  }
  socket.onopen = () => {
    reconnectAttempts = 0;
    wsFailures = 0;
    startHeartbeat();
    resetStale();
  };
  socket.onmessage = (ev) => {
    resetStale();
    let msg;
    try {
      msg = JSON.parse(ev.data);
    } catch {
      return;
    }
    if (msg.type === "pong") return;
    if ((msg.type === "snapshot" || msg.type === "update") && Array.isArray(msg.items)) {
      applyItems(msg.items);
    }
  };
  socket.onerror = () => {
    /* handled by onclose */
  };
  socket.onclose = () => {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
    clearTimeout(staleTimer);
    staleTimer = null;
    socket = null;
    if (intentionalClose) return;
    onWSClosed();
  };
}

function onWSClosed() {
  if (paused || refCount === 0) return;
  wsFailures += 1;
  if (wsFailures >= WS_MAX_FAILURES) {
    // Graceful degradation: the WebSocket is blocked — fall back to REST polling.
    mode = "rest";
    startPolling();
    clearTimeout(wsRetryTimer);
    wsRetryTimer = setTimeout(() => {
      wsFailures = 0;
      mode = "ws";
      stopPolling();
      connectWS();
    }, WS_RETRY_MS);
    return;
  }
  scheduleReconnect();
}

function scheduleReconnect() {
  if (paused || refCount === 0) return;
  setStatus(items.length ? "reconnecting" : "connecting");
  const delay = Math.min(30000, 1000 * 2 ** reconnectAttempts) + Math.random() * 500;
  reconnectAttempts += 1;
  clearTimeout(reconnectTimer);
  reconnectTimer = setTimeout(connectWS, delay);
}

async function pollOnce() {
  try {
    const res = await fetch(REST_URL, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error("rest");
    const data = await res.json();
    applyItems(data.items || []);
  } catch {
    if (!items.length) setStatus("offline");
  }
}

function startPolling() {
  setStatus(items.length ? "live" : "connecting");
  pollOnce();
  clearInterval(pollTimer);
  pollTimer = setInterval(() => {
    if (!document.hidden) pollOnce();
  }, POLL_MS);
}

function stopPolling() {
  clearInterval(pollTimer);
  pollTimer = null;
}

function startConnection() {
  if (paused || refCount === 0) return;
  if (mode === "ws") connectWS();
  else startPolling();
}

function teardown() {
  intentionalClose = true;
  if (socket) {
    try {
      socket.close();
    } catch {
      /* ignore */
    }
    socket = null;
  }
  intentionalClose = false;
  clearTimers();
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (document.hidden && refCount > 0) {
          paused = true;
          teardown();
        }
      }, IDLE_GRACE_MS);
    } else {
      clearTimeout(idleTimer);
      if (paused) {
        paused = false;
        reconnectAttempts = 0;
        startConnection(); // server replies with a fresh snapshot — no stale backlog
      } else if (mode === "rest" && refCount > 0) {
        pollOnce();
      } else if (refCount > 0 && !socket && mode === "ws" && !reconnectTimer) {
        startConnection();
      }
    }
  });
}

function subscribe(listener) {
  listeners.add(listener);
  refCount += 1;
  clearTimeout(unmountTimer);
  if (refCount === 1 && !paused) startConnection();
  return () => {
    listeners.delete(listener);
    refCount -= 1;
    if (refCount === 0) {
      clearTimeout(unmountTimer);
      unmountTimer = setTimeout(() => {
        if (refCount === 0) teardown();
      }, UNMOUNT_GRACE_MS);
    }
  };
}

function getSnapshot() {
  return snapshot;
}

export function useMarketData() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useMarketItem(symbol) {
  const sub = useCallback((cb) => subscribe(cb), []);
  const get = useCallback(() => bySymbol[symbol] || null, [symbol]);
  return useSyncExternalStore(sub, get, get);
}
