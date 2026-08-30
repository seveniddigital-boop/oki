"""P0 tests for /api/market-chart resilience (Coinbase-first crypto + never-502)."""
import os
import pytest
import requests

BASE = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE:
    with open("/app/frontend/.env") as f:
        for ln in f:
            if ln.startswith("REACT_APP_BACKEND_URL="):
                BASE = ln.split("=", 1)[1].strip()
BASE = BASE.rstrip("/")
API = f"{BASE}/api"


COMMON = ["bitcoin", "ethereum", "solana"]
LONG_TAIL = [
    ("dogecoin", None),
    ("dogecoin", "DOGE"),
    ("cardano", None),
    ("cardano", "ADA"),
    ("ripple", None),
    ("ripple", "XRP"),
    ("litecoin", None),
    ("polkadot", None),
    ("polkadot", "DOT"),
]


@pytest.mark.parametrize("cid", COMMON)
def test_crypto_common_charts_ok(cid):
    r = requests.get(f"{API}/market-chart", params={"type": "crypto", "id": cid, "days": 7}, timeout=30)
    assert r.status_code == 200, f"{cid} -> {r.status_code} {r.text[:200]}"
    j = r.json()
    assert j.get("status") == "ok", f"{cid} status={j.get('status')} body={j}"
    assert isinstance(j.get("prices"), list) and len(j["prices"]) > 0


@pytest.mark.parametrize("cid,sym", LONG_TAIL)
def test_crypto_long_tail_charts_ok(cid, sym):
    params = {"type": "crypto", "id": cid, "days": 7}
    if sym:
        params["symbol"] = sym
    r = requests.get(f"{API}/market-chart", params=params, timeout=45)
    # Must never 502
    assert r.status_code != 502, f"{cid}/{sym} returned 502"
    assert r.status_code == 200, f"{cid}/{sym} -> {r.status_code} {r.text[:200]}"
    j = r.json()
    # Allow 'stale' as acceptable graceful fallback; require ok or stale with prices
    assert j.get("status") in ("ok", "stale"), f"{cid}/{sym} status={j.get('status')}"
    assert isinstance(j.get("prices"), list) and len(j["prices"]) > 0, f"{cid}/{sym} empty prices"


def test_crypto_unknown_returns_unavailable_not_502():
    r = requests.get(f"{API}/market-chart",
                     params={"type": "crypto", "id": "notarealcoinxyz", "days": 7}, timeout=30)
    assert r.status_code == 200, f"unknown -> {r.status_code} {r.text[:200]}"
    j = r.json()
    assert j.get("status") == "unavailable", j
    assert j.get("prices") == []


@pytest.mark.parametrize("sid,days", [("AAPL", 1), ("AAPL", 7), ("AAPL", 30), ("^GSPC", 1), ("^GSPC", 30)])
def test_stock_charts_ok(sid, days):
    r = requests.get(f"{API}/market-chart", params={"type": "stock", "id": sid, "days": days}, timeout=30)
    assert r.status_code == 200, f"{sid}/{days} -> {r.status_code} {r.text[:200]}"
    j = r.json()
    assert j.get("status") in ("ok", "stale"), j.get("status")
    assert isinstance(j.get("prices"), list) and len(j["prices"]) > 0


def test_market_prices_has_11_items():
    r = requests.get(f"{API}/market-prices", timeout=30)
    assert r.status_code == 200
    items = r.json().get("items", [])
    syms = {i["symbol"] for i in items}
    expected = {"BTC", "ETH", "SOL", "SPX", "IXIC", "DJI", "AAPL", "MSFT", "NVDA", "TSLA", "AMZN"}
    missing = expected - syms
    # Allow up to 3 missing due to upstream 429s but log
    assert len(missing) <= 3, f"Too many missing: {missing} (got {syms})"
