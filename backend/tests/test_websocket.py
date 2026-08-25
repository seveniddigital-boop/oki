"""WebSocket /api/ws/prices test — external wss URL derived from REACT_APP_BACKEND_URL."""
import os
import json
import requests

BASE = os.environ.get("REACT_APP_BACKEND_URL") or ""
if not BASE:
    with open("/app/frontend/.env") as f:
        for ln in f:
            if ln.startswith("REACT_APP_BACKEND_URL="):
                BASE = ln.split("=", 1)[1].strip()
BASE = BASE.rstrip("/")
WS_URL = BASE.replace("https://", "wss://").replace("http://", "ws://") + "/api/ws/prices"
API = BASE + "/api"


def test_ws_snapshot_and_ping_pong():
    from websockets.sync.client import connect
    with connect(WS_URL, open_timeout=15, close_timeout=5) as ws:
        msg = ws.recv(timeout=15)
        data = json.loads(msg)
        assert data.get("type") == "snapshot", f"first msg not snapshot: {data}"
        items = data.get("items", [])
        assert len(items) >= 8, f"Expected >=8 items, got {len(items)}"
        syms = {i["symbol"] for i in items}
        assert {"BTC", "ETH", "SOL", "AAPL"}.issubset(syms), syms
        # ts present
        assert "ts" in data

        ws.send(json.dumps({"type": "ping"}))
        pong_seen = False
        for _ in range(5):
            m = ws.recv(timeout=10)
            try:
                d = json.loads(m)
            except Exception:
                continue
            if d.get("type") == "pong":
                pong_seen = True
                break
        assert pong_seen, "No pong received after ping"


def test_market_chart_repeat_cache_stock():
    """Repeated chart calls succeed (server-side 300s cache) — use stock to avoid CoinGecko 429."""
    for _ in range(2):
        r = requests.get(f"{API}/market-chart", params={"type": "stock", "id": "AAPL", "days": 7}, timeout=30)
        assert r.status_code == 200
        j = r.json()
        assert isinstance(j.get("prices"), list) and len(j["prices"]) > 0


def test_market_chart_stock_days_30():
    r = requests.get(f"{API}/market-chart", params={"type": "stock", "id": "AAPL", "days": 30}, timeout=30)
    assert r.status_code == 200
    assert len(r.json().get("prices", [])) > 0
