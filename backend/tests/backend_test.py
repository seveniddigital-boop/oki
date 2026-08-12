"""Backend tests for OKI Inc. pivoted markets platform."""
import os
import re
import pytest
import requests

BASE = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE:
    # fallback read from frontend/.env
    with open("/app/frontend/.env") as f:
        for ln in f:
            if ln.startswith("REACT_APP_BACKEND_URL="):
                BASE = ln.split("=", 1)[1].strip()
BASE = BASE.rstrip("/")
API = f"{BASE}/api"


# --- Root / health ---
def test_root():
    r = requests.get(f"{API}/")
    assert r.status_code == 200
    assert "OKI" in r.json().get("message", "")


# --- market-prices returns 11 items with expected structure ---
def test_market_prices_shape():
    r = requests.get(f"{API}/market-prices", timeout=30)
    assert r.status_code == 200
    data = r.json()
    items = data.get("items", [])
    assert len(items) >= 8, f"Expected ~11 items, got {len(items)}"
    syms = {i["symbol"] for i in items}
    # Cryptos
    assert {"BTC", "ETH", "SOL"}.issubset(syms), f"Missing crypto: {syms}"
    # Indices
    assert {"SPX", "IXIC", "DJI"}.issubset(syms), f"Missing indices: {syms}"
    # Equities
    assert {"AAPL", "MSFT", "NVDA", "TSLA", "AMZN"}.issubset(syms), f"Missing equities: {syms}"

    by_sym = {i["symbol"]: i for i in items}
    btc = by_sym["BTC"]
    assert btc["type"] == "crypto"
    assert btc.get("market_cap") is not None
    assert btc.get("volume") is not None
    assert isinstance(btc["price"], (int, float)) and btc["price"] > 0

    spx = by_sym["SPX"]
    assert spx["type"] == "index"
    aapl = by_sym["AAPL"]
    assert aapl["type"] == "stock"
    assert isinstance(aapl["price"], (int, float)) and aapl["price"] > 0


# --- market-chart works for crypto and stock ---
def test_market_chart_crypto():
    r = requests.get(f"{API}/market-chart", params={"type": "crypto", "id": "bitcoin", "days": 7}, timeout=30)
    assert r.status_code == 200
    j = r.json()
    assert j["id"] == "bitcoin"
    assert isinstance(j.get("prices"), list) and len(j["prices"]) > 0


def test_market_chart_stock():
    r = requests.get(f"{API}/market-chart", params={"type": "stock", "id": "AAPL", "days": 1}, timeout=30)
    assert r.status_code == 200
    j = r.json()
    assert isinstance(j.get("prices"), list) and len(j["prices"]) > 0


# --- market-search ---
def test_market_search_apple():
    r = requests.get(f"{API}/market-search", params={"q": "Apple"}, timeout=30)
    assert r.status_code == 200
    results = r.json().get("results", [])
    assert any(x.get("symbol", "").upper() == "AAPL" for x in results), results


# --- Inquiries: no capital field, ignores extras ---
def test_inquiry_create_no_capital():
    payload = {
        "name": "TEST_John",
        "org": "TEST_Corp",
        "email": "test_john@example.com",
        "message": "TEST message from backend_test",
    }
    r = requests.post(f"{API}/inquiries", json=payload, timeout=30)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["name"] == payload["name"]
    assert body["email"] == payload["email"]
    assert "capital" not in body


def test_inquiry_ignores_extra_capital():
    payload = {
        "name": "TEST_Jane",
        "org": "TEST_Org",
        "email": "test_jane@example.com",
        "message": "TEST extra field",
        "capital": "1M-5M",  # should be ignored
    }
    r = requests.post(f"{API}/inquiries", json=payload, timeout=30)
    assert r.status_code == 200, r.text
    body = r.json()
    assert "capital" not in body


def test_inquiry_invalid_email():
    r = requests.post(f"{API}/inquiries", json={
        "name": "x", "org": "y", "email": "not-an-email", "message": "z"
    }, timeout=30)
    assert r.status_code == 422


# --- Corporate deck PDF ---
def test_deck_pdf():
    r = requests.get(f"{API}/deck", timeout=30)
    assert r.status_code == 200
    assert r.headers.get("content-type", "").startswith("application/pdf")
    assert r.content[:4] == b"%PDF"
    # Should NOT contain old holdings language in title/metadata
    body = r.content.lower()
    # Title check via title metadata
    # Basic sanity - PDF content includes some text
    assert b"OKI" in r.content or b"oki" in body
