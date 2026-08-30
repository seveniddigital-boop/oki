from fastapi import FastAPI, APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
import io
import json
import asyncio
import time
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
OWNER_EMAIL = os.environ["OWNER_EMAIL"]

logger = logging.getLogger(__name__)


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class InquiryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    org: str = Field(min_length=1, max_length=200)
    email: EmailStr
    message: str = Field(min_length=1, max_length=5000)

class Inquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    org: str
    email: EmailStr
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


@api_router.get("/")
async def root():
    return {"message": "OKI Inc. API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


@api_router.post("/inquiries", response_model=Inquiry)
async def create_inquiry(input: InquiryCreate):
    inquiry = Inquiry(**input.model_dump())
    doc = inquiry.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.inquiries.insert_one(doc)

    html = f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:40px 0;">
      <tr><td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid #2a2a2a;">
          <tr><td style="padding:32px 40px;border-bottom:1px solid #2a2a2a;">
            <span style="font-family:Arial,sans-serif;font-size:18px;letter-spacing:6px;color:#C5A059;font-weight:bold;">OKI_INC.</span>
            <p style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;color:#737373;margin:8px 0 0;">NEW CORPORATE INQUIRY</p>
          </td></tr>
          <tr><td style="padding:32px 40px;font-family:Arial,sans-serif;font-size:13px;color:#A3A3A3;line-height:1.8;">
            <p style="margin:0 0 4px;color:#737373;font-size:10px;letter-spacing:2px;">NAME</p>
            <p style="margin:0 0 20px;color:#F5F5F5;">{inquiry.name}</p>
            <p style="margin:0 0 4px;color:#737373;font-size:10px;letter-spacing:2px;">ORGANIZATION</p>
            <p style="margin:0 0 20px;color:#F5F5F5;">{inquiry.org}</p>
            <p style="margin:0 0 4px;color:#737373;font-size:10px;letter-spacing:2px;">EMAIL</p>
            <p style="margin:0 0 20px;color:#F5F5F5;">{inquiry.email}</p>
            <p style="margin:0 0 4px;color:#737373;font-size:10px;letter-spacing:2px;">MESSAGE</p>
            <p style="margin:0;color:#F5F5F5;">{inquiry.message}</p>
          </td></tr>
          <tr><td style="padding:20px 40px;border-top:1px solid #2a2a2a;">
            <p style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;color:#737373;margin:0;">OKI INC. · ONE WORLD TRADE CENTER, 85TH FLOOR, NEW YORK, NY 10007 · +1 (212) 220-8443 · CONTACT@OKIINC.GLOBAL</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
    """
    payload = {
        "to": [OWNER_EMAIL],
        "subject": f"Corporate Inquiry — {inquiry.org}",
        "html": html,
        "from_name": EMAIL_FROM_NAME,
        "contact_email": inquiry.email,
    }
    try:
        async with httpx.AsyncClient(timeout=30) as http:
            resp = await http.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
    except Exception as e:
        logger.error(f"Inquiry email failed: {e}")

    return inquiry

@api_router.get("/inquiries", response_model=List[Inquiry])
async def list_inquiries():
    docs = await db.inquiries.find({}, {"_id": 0}).sort("timestamp", -1).to_list(500)
    for d in docs:
        if isinstance(d['timestamp'], str):
            d['timestamp'] = datetime.fromisoformat(d['timestamp'])
    return docs


@api_router.get("/deck")
async def corporate_deck():
    from reportlab.pdfgen import canvas as rl_canvas
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.colors import Color

    W, H = A4
    gold = Color(197/255, 160/255, 89/255)
    gold_dark = Color(138/255, 109/255, 59/255)
    crimson = Color(153/255, 27/255, 27/255)
    white = Color(0.92, 0.92, 0.92)
    muted = Color(0.55, 0.55, 0.55)
    faint = Color(0.42, 0.42, 0.42)

    buf = io.BytesIO()
    c = rl_canvas.Canvas(buf, pagesize=A4)
    c.setTitle("OKI Inc. — Corporate Deck")

    c.setFillColor(Color(0.02, 0.02, 0.02))
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setStrokeColor(gold_dark)
    c.setLineWidth(0.75)
    c.rect(28, 28, W - 56, H - 56, stroke=1, fill=0)

    # Logo mark
    mx, my, s = 56, H - 96, 22
    c.setStrokeColor(gold)
    c.setLineWidth(3.5)
    c.rect(mx, my, s, s, stroke=1, fill=0)
    c.setFillColor(gold)
    p = c.beginPath()
    p.moveTo(mx + s, my)
    p.lineTo(mx + s + 5, my - 5)
    p.lineTo(mx + s, my - 5)
    p.close()
    c.drawPath(p, stroke=0, fill=1)
    c.setLineWidth(4)
    c.line(mx + 44, my + s, mx + 30, my + s / 2)
    c.line(mx + 30, my + s / 2, mx + 44, my)
    c.rect(mx + 52, my, 5, s, stroke=0, fill=1)

    c.setFillColor(gold)
    c.setFont("Helvetica-Bold", 15)
    c.drawString(mx + 70, my + 8, "OKI_INC.")
    c.setFillColor(faint)
    c.setFont("Helvetica", 5.5)
    c.drawString(mx + 70, my - 2, "INTERNATIONAL HOLDINGS & INVESTMENTS  ·  PRIVATE CAPITAL")

    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 30)
    c.drawString(56, H - 170, "Strategic Capital.")
    c.drawString(56, H - 204, "Long-Term Ownership.")
    c.setFillColor(muted)
    c.setFont("Helvetica", 9.5)
    c.drawString(56, H - 232, "An international holdings and investments corporation - acquiring, investing in, and managing for the long term.")

    c.setStrokeColor(Color(0.16, 0.16, 0.16))
    c.setLineWidth(0.5)
    c.line(56, H - 262, W - 56, H - 262)
    c.setFillColor(gold)
    c.setFont("Helvetica", 7)
    c.drawString(56, H - 276, "01  —  THE MANDATE")

    markets = ["OPERATING BUSINESSES & COMPANIES", "TECHNOLOGY & DIGITAL OPERATIONS", "BRANDS & INTELLECTUAL PROPERTY", "REAL ASSETS & STRATEGIC HOLDINGS"]
    y = H - 306
    for m in markets:
        c.setFillColor(gold)
        c.rect(56, y, 6, 6, stroke=0, fill=1)
        c.setFillColor(white)
        c.setFont("Helvetica", 9)
        c.drawString(72, y + 1, m)
        y -= 26

    c.setStrokeColor(Color(0.16, 0.16, 0.16))
    c.line(56, y - 8, W - 56, y - 8)
    c.setFillColor(gold)
    c.setFont("Helvetica", 7)
    c.drawString(56, y - 22, "02  —  THE PROCESS")

    doctrine = [
        ("IDENTIFY", "Opportunity and review.", "Fundamentals first. Always."),
        ("ACQUIRE", "Diligence and structure.", "Deliberate, private, patient."),
        ("DEVELOP", "Growth and management.", "Improve. Scale. Compound."),
    ]
    col_w = (W - 112) / 3
    ty = y - 46
    for i, (t, s1, s2) in enumerate(doctrine):
        x = 56 + i * col_w
        c.setFillColor(gold)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(x, ty, f"0{i+1}  {t}")
        c.setFillColor(white)
        c.setFont("Helvetica", 7.5)
        c.drawString(x, ty - 16, s1)
        c.setFillColor(faint)
        c.drawString(x, ty - 28, s2)

    c.setStrokeColor(Color(0.16, 0.16, 0.16))
    c.line(56, ty - 52, W - 56, ty - 52)
    c.setFillColor(gold)
    c.setFont("Helvetica", 7)
    c.drawString(56, ty - 66, "03  —  CORPORATE ARCHITECTURE")
    c.setFillColor(muted)
    c.setFont("Helvetica", 8)
    c.drawString(56, ty - 84, "OKI Inc. is a Delaware C-Corporation headquartered in New York — young, disciplined, and building in public.")
    c.drawString(56, ty - 96, "The corporation does not publish portfolio contents or performance figures. Nothing here is investment advice.")

    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(56, 96, "CORPORATE HEADQUARTERS")
    c.setFillColor(muted)
    c.setFont("Helvetica", 8)
    c.drawString(56, 82, "One World Trade Center, 85th Floor, New York, NY 10007  ·  +1 (212) 220-8443  ·  contact@okiinc.global")
    c.drawString(56, 70, "Incorporated in the State of Delaware, United States of America")
    c.setFillColor(crimson)
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(56, 60, "INFORMATION ONLY · NOTHING HERE CONSTITUTES INVESTMENT ADVICE.")
    c.setFillColor(faint)
    c.setFont("Helvetica", 6.5)
    c.drawRightString(W - 56, 40, "OKI INC. · DELAWARE C-CORPORATION · ESTABLISHED 2026")

    c.showPage()
    c.save()
    buf.seek(0)
    return Response(
        content=buf.read(),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=OKI-Inc-Corporate-Deck.pdf"},
    )


_chart_cache = {}
_search_cache = {}
_market_cache = {"data": None, "ts": 0.0}


class PriceHub:
    """Fan-out queues for connected WebSocket clients (bounded — no growing backlog)."""

    def __init__(self):
        self.queues = set()

    def connect(self):
        q = asyncio.Queue(maxsize=8)
        self.queues.add(q)
        return q

    def disconnect(self, q):
        self.queues.discard(q)

    def broadcast(self, message):
        for q in list(self.queues):
            try:
                q.put_nowait(message)
            except asyncio.QueueFull:
                try:
                    q.get_nowait()
                    q.put_nowait(message)
                except Exception:
                    pass


hub = PriceHub()

YAHOO_HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"}


async def _yahoo_chart_prices(symbol, range_, interval):
    async with httpx.AsyncClient(timeout=15, headers=YAHOO_HEADERS) as http:
        resp = await http.get(
            f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}",
            params={"range": range_, "interval": interval},
        )
    resp.raise_for_status()
    result = resp.json()["chart"]["result"][0]
    ts = result.get("timestamp", [])
    closes = result["indicators"]["quote"][0]["close"]
    return [[t * 1000, c] for t, c in zip(ts, closes) if c is not None]


# CoinGecko id -> Coinbase base symbol. Coinbase is keyless with high rate limits
# and is used as the PRIMARY crypto chart source; CoinGecko is the long-tail fallback.
COINBASE_BASE = {
    "bitcoin": "BTC", "ethereum": "ETH", "solana": "SOL", "dogecoin": "DOGE",
    "cardano": "ADA", "ripple": "XRP", "litecoin": "LTC", "chainlink": "LINK",
    "polkadot": "DOT", "avalanche-2": "AVAX", "stellar": "XLM", "bitcoin-cash": "BCH",
    "uniswap": "UNI", "aave": "AAVE", "cosmos": "ATOM", "ethereum-classic": "ETC",
    "filecoin": "FIL", "internet-computer": "ICP", "near": "NEAR", "aptos": "APT",
    "arbitrum": "ARB", "optimism": "OP", "the-graph": "GRT", "maker": "MKR",
    "shiba-inu": "SHIB", "polygon": "MATIC", "sui": "SUI", "algorand": "ALGO",
    "tezos": "XTZ", "hedera-hashgraph": "HBAR", "render-token": "RNDR",
}


# Instant, always-available search index for popular coins so crypto results
# surface immediately even when CoinGecko search is rate-limited. Every id here
# maps to a Coinbase base above, so the chart resolves via the keyless source.
POPULAR_CRYPTO = [
    {"id": "bitcoin", "name": "Bitcoin", "symbol": "BTC", "rank": 1},
    {"id": "ethereum", "name": "Ethereum", "symbol": "ETH", "rank": 2},
    {"id": "ripple", "name": "XRP", "symbol": "XRP", "rank": 4},
    {"id": "solana", "name": "Solana", "symbol": "SOL", "rank": 5},
    {"id": "dogecoin", "name": "Dogecoin", "symbol": "DOGE", "rank": 8},
    {"id": "cardano", "name": "Cardano", "symbol": "ADA", "rank": 9},
    {"id": "shiba-inu", "name": "Shiba Inu", "symbol": "SHIB", "rank": 11},
    {"id": "avalanche-2", "name": "Avalanche", "symbol": "AVAX", "rank": 12},
    {"id": "polygon", "name": "Polygon", "symbol": "MATIC", "rank": 14},
    {"id": "chainlink", "name": "Chainlink", "symbol": "LINK", "rank": 15},
    {"id": "polkadot", "name": "Polkadot", "symbol": "DOT", "rank": 16},
    {"id": "sui", "name": "Sui", "symbol": "SUI", "rank": 17},
    {"id": "bitcoin-cash", "name": "Bitcoin Cash", "symbol": "BCH", "rank": 18},
    {"id": "near", "name": "NEAR Protocol", "symbol": "NEAR", "rank": 19},
    {"id": "litecoin", "name": "Litecoin", "symbol": "LTC", "rank": 20},
    {"id": "hedera-hashgraph", "name": "Hedera", "symbol": "HBAR", "rank": 21},
    {"id": "stellar", "name": "Stellar", "symbol": "XLM", "rank": 22},
    {"id": "uniswap", "name": "Uniswap", "symbol": "UNI", "rank": 24},
    {"id": "aptos", "name": "Aptos", "symbol": "APT", "rank": 25},
    {"id": "internet-computer", "name": "Internet Computer", "symbol": "ICP", "rank": 26},
    {"id": "ethereum-classic", "name": "Ethereum Classic", "symbol": "ETC", "rank": 27},
    {"id": "cosmos", "name": "Cosmos", "symbol": "ATOM", "rank": 28},
    {"id": "render-token", "name": "Render", "symbol": "RNDR", "rank": 29},
    {"id": "aave", "name": "Aave", "symbol": "AAVE", "rank": 30},
    {"id": "filecoin", "name": "Filecoin", "symbol": "FIL", "rank": 35},
    {"id": "algorand", "name": "Algorand", "symbol": "ALGO", "rank": 38},
    {"id": "arbitrum", "name": "Arbitrum", "symbol": "ARB", "rank": 40},
    {"id": "optimism", "name": "Optimism", "symbol": "OP", "rank": 42},
    {"id": "the-graph", "name": "The Graph", "symbol": "GRT", "rank": 45},
    {"id": "maker", "name": "Maker", "symbol": "MKR", "rank": 50},
    {"id": "tezos", "name": "Tezos", "symbol": "XTZ", "rank": 48},
]


def _stock_range(days):
    if days <= 1:
        return ("1d", "5m")
    if days <= 7:
        return ("5d", "30m")
    return ("1mo", "1d")


async def _coinbase_candles(base, days):
    from datetime import datetime as _dt, timezone as _tz
    if days <= 1:
        gran = 300
    elif days <= 7:
        gran = 3600
    else:
        gran = 21600
    end = time.time()
    start = end - days * 86400
    async with httpx.AsyncClient(timeout=15, headers=YAHOO_HEADERS) as http:
        resp = await http.get(
            f"https://api.exchange.coinbase.com/products/{base}-USD/candles",
            params={
                "granularity": gran,
                "start": _dt.fromtimestamp(start, _tz.utc).isoformat(),
                "end": _dt.fromtimestamp(end, _tz.utc).isoformat(),
            },
        )
    resp.raise_for_status()
    rows = resp.json()  # [[time, low, high, open, close, volume], ...] newest first
    pts = [[int(r[0]) * 1000, r[4]] for r in rows if isinstance(r, list) and len(r) >= 5]
    pts.sort(key=lambda p: p[0])
    return pts


async def _yahoo_spark(symbols):
    """One call returns every symbol — drastically reduces Yahoo rate-limit hits."""
    async with httpx.AsyncClient(timeout=15, headers=YAHOO_HEADERS) as http:
        resp = await http.get(
            "https://query1.finance.yahoo.com/v7/finance/spark",
            params={"symbols": ",".join(symbols), "range": "1d", "interval": "5m"},
        )
    resp.raise_for_status()
    out = {}
    for r in resp.json().get("spark", {}).get("result", []):
        try:
            m = r["response"][0]["meta"]
            price = m.get("regularMarketPrice")
            prev = m.get("chartPreviousClose") or m.get("previousClose")
            if price and prev:
                out[r["symbol"]] = (price, ((price - prev) / prev) * 100)
        except Exception:
            continue
    return out


async def fetch_market_snapshot():
    """Single upstream fetch shared by every client (REST fallback + WebSocket)."""
    items = []
    try:
        async with httpx.AsyncClient(timeout=15) as http:
            resp = await http.get(
                "https://api.coingecko.com/api/v3/simple/price",
                params={
                    "ids": "bitcoin,ethereum,solana",
                    "vs_currencies": "usd",
                    "include_24hr_change": "true",
                    "include_market_cap": "true",
                    "include_24hr_vol": "true",
                },
            )
        resp.raise_for_status()
        cg = resp.json()
        for cid, sym in [("bitcoin", "BTC"), ("ethereum", "ETH"), ("solana", "SOL")]:
            if cid in cg:
                items.append({
                    "symbol": sym, "name": cid.capitalize(), "id": cid,
                    "price": cg[cid]["usd"], "change": cg[cid].get("usd_24h_change", 0),
                    "market_cap": cg[cid].get("usd_market_cap"), "volume": cg[cid].get("usd_24h_vol"),
                    "type": "crypto",
                })
    except Exception as e:
        logger.error(f"CoinGecko fetch failed: {e}")

    equity_specs = [
        ("^GSPC", "S&P 500", "SPX", "index"),
        ("^IXIC", "NASDAQ Composite", "IXIC", "index"),
        ("^DJI", "Dow Jones", "DJI", "index"),
        ("AAPL", "Apple", "AAPL", "stock"),
        ("MSFT", "Microsoft", "MSFT", "stock"),
        ("NVDA", "NVIDIA", "NVDA", "stock"),
        ("TSLA", "Tesla", "TSLA", "stock"),
        ("AMZN", "Amazon", "AMZN", "stock"),
    ]

    quotes = {}
    try:
        quotes = await _yahoo_spark([s[0] for s in equity_specs])
    except Exception as e:
        logger.error(f"Yahoo spark failed: {e}")

    if quotes:
        for sym, name, label, typ in equity_specs:
            if sym in quotes:
                price, change = quotes[sym]
                items.append({"symbol": label, "name": name, "id": sym, "price": price, "change": change, "type": typ})
    else:
        async def fetch_equity(sym, name, label, typ):
            try:
                async with httpx.AsyncClient(timeout=15, headers=YAHOO_HEADERS) as http:
                    resp = await http.get(f"https://query1.finance.yahoo.com/v8/finance/chart/{sym}", params={"range": "1d", "interval": "5m"})
                resp.raise_for_status()
                meta = resp.json()["chart"]["result"][0]["meta"]
                price = meta.get("regularMarketPrice")
                prev = meta.get("chartPreviousClose") or meta.get("previousClose")
                if price and prev:
                    return {"symbol": label, "name": name, "id": sym, "price": price, "change": ((price - prev) / prev) * 100, "type": typ}
            except Exception as e:
                logger.error(f"Yahoo fetch failed for {sym}: {e}")
            return None
        for result in await asyncio.gather(*(fetch_equity(*spec) for spec in equity_specs)):
            if result:
                items.append(result)

    if items:
        # Merge by symbol against the last-known snapshot so a partial upstream
        # failure (e.g. CoinGecko 429) preserves prior values instead of evicting them.
        order = ["BTC", "ETH", "SOL", "SPX", "IXIC", "DJI", "AAPL", "MSFT", "NVDA", "TSLA", "AMZN"]
        merged = {it["symbol"]: it for it in (_market_cache["data"] or {}).get("items", [])}
        for it in items:
            merged[it["symbol"]] = it
        ordered = [merged[s] for s in order if s in merged]
        ordered += [it for s, it in merged.items() if s not in order]
        _market_cache["data"] = {"items": ordered}
        _market_cache["ts"] = time.time()
    return _market_cache["data"] or {"items": items}


@api_router.get("/market-prices")
async def market_prices(response: Response):
    """REST fallback for clients where the WebSocket feed cannot connect."""
    response.headers["Cache-Control"] = "public, max-age=15, stale-while-revalidate=60"
    now = time.time()
    if _market_cache["data"] and now - _market_cache["ts"] < 120:
        return _market_cache["data"]
    return await fetch_market_snapshot()


@app.websocket("/api/ws/prices")
async def ws_prices(websocket: WebSocket):
    await websocket.accept()
    q = hub.connect()
    snap = _market_cache["data"] or await fetch_market_snapshot()
    try:
        q.put_nowait({"type": "snapshot", "ts": time.time(), "items": (snap or {}).get("items", [])})
    except Exception:
        pass

    async def sender():
        while True:
            msg = await q.get()
            await websocket.send_json(msg)

    async def receiver():
        while True:
            raw = await websocket.receive_text()
            try:
                data = json.loads(raw)
            except Exception:
                data = {}
            if data.get("type") == "ping":
                try:
                    q.put_nowait({"type": "pong", "ts": time.time()})
                except Exception:
                    pass

    send_task = asyncio.create_task(sender())
    recv_task = asyncio.create_task(receiver())
    try:
        await asyncio.wait({send_task, recv_task}, return_when=asyncio.FIRST_COMPLETED)
    except WebSocketDisconnect:
        pass
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        send_task.cancel()
        recv_task.cancel()
        hub.disconnect(q)


async def market_poller():
    """One server-side poller (~60s) fans the latest snapshot out to all clients."""
    while True:
        try:
            snap = await fetch_market_snapshot()
            if snap and snap.get("items"):
                hub.broadcast({"type": "update", "ts": time.time(), "items": snap["items"]})
        except Exception as e:
            logger.error(f"Market poller error: {e}")
        await asyncio.sleep(60)


@app.on_event("startup")
async def _start_market_poller():
    asyncio.create_task(market_poller())


@api_router.get("/market-search")
async def market_search(response: Response, q: str = ""):
    response.headers["Cache-Control"] = "public, max-age=300"
    q = q.strip()
    if len(q) < 2:
        return {"results": []}
    key = q.lower()
    now = time.time()
    cached = _search_cache.get(key)
    if cached and now - cached["ts"] < 600:
        return cached["data"]
    results = []
    try:
        async with httpx.AsyncClient(timeout=15, headers=YAHOO_HEADERS) as http:
            resp = await http.get(
                "https://query1.finance.yahoo.com/v1/finance/search",
                params={"q": q, "quotesCount": 6, "newsCount": 0, "listsCount": 0},
            )
        resp.raise_for_status()
        for qt in resp.json().get("quotes", []):
            if qt.get("quoteType") in ("EQUITY", "ETF", "INDEX") and qt.get("symbol"):
                results.append({
                    "id": qt["symbol"],
                    "name": qt.get("shortname") or qt.get("longname") or qt["symbol"],
                    "symbol": qt["symbol"],
                    "type": "stock",
                    "rank": None,
                })
    except Exception as e:
        logger.error(f"Yahoo search failed: {e}")
    try:
        async with httpx.AsyncClient(timeout=15) as http:
            resp = await http.get("https://api.coingecko.com/api/v3/search", params={"query": key})
        resp.raise_for_status()
        for c in resp.json().get("coins", [])[:6]:
            results.append({"id": c["id"], "name": c["name"], "symbol": c["symbol"], "type": "crypto", "rank": c.get("market_cap_rank")})
    except Exception as e:
        logger.error(f"CoinGecko search failed: {e}")
    data = {"results": results[:12]}
    _search_cache[key] = {"data": data, "ts": now}
    return data

@api_router.get("/market-chart")
async def market_chart(response: Response, type: str = "crypto", id: str = "bitcoin", days: int = 7, symbol: str = ""):
    import re
    response.headers["Cache-Control"] = "public, max-age=120, stale-while-revalidate=600"
    days = min(max(days, 1), 30)
    key = f"{type}:{id}:{days}"
    now = time.time()
    cached = _chart_cache.get(key)
    if cached and now - cached["ts"] < 300:
        return cached["data"]

    prices = None
    if type == "stock":
        if not re.fullmatch(r"[A-Za-z0-9.^=-]{1,12}", id):
            raise HTTPException(status_code=400, detail="Unsupported symbol")
        range_, interval = _stock_range(days)
        for attempt in range(3):
            try:
                prices = await _yahoo_chart_prices(id, range_, interval)
                if prices:
                    break
            except Exception:
                pass
            if attempt < 2:
                await asyncio.sleep(1.5)
    else:
        if not re.fullmatch(r"[a-z0-9-]{1,60}", id):
            raise HTTPException(status_code=400, detail="Unsupported asset")
        base = (symbol or COINBASE_BASE.get(id, "")).strip().upper()
        if base and re.fullmatch(r"[A-Z0-9]{1,15}", base):
            try:
                prices = await _coinbase_candles(base, days)
            except Exception:
                prices = None
        if not prices:
            for attempt in range(3):
                try:
                    async with httpx.AsyncClient(timeout=20) as http:
                        resp = await http.get(
                            f"https://api.coingecko.com/api/v3/coins/{id}/market_chart",
                            params={"vs_currency": "usd", "days": str(days)},
                        )
                    resp.raise_for_status()
                    prices = resp.json().get("prices", [])
                    if prices:
                        break
                except Exception:
                    pass
                if attempt < 2:
                    await asyncio.sleep(1.5)

    if prices:
        data = {"id": id, "days": days, "prices": prices, "status": "ok"}
        _chart_cache[key] = {"data": data, "ts": now}
        return data
    # Never hard-fail: serve stale data if we have any, else a structured recoverable state.
    if cached:
        stale = dict(cached["data"])
        stale["status"] = "stale"
        return stale
    return {"id": id, "days": days, "prices": [], "status": "unavailable", "reason": "rate_limited"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
