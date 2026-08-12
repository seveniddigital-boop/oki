from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
import io
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
            <p style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;color:#737373;margin:0;">OKI INC. · ONE WORLD TRADE CENTER, 85TH FLOOR, NEW YORK, NY 10007 · +1 (212) 220-8443</p>
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
    c.drawString(mx + 70, my - 2, "GLOBAL MARKET INTELLIGENCE  ·  LIVE PUBLIC DATA")

    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 30)
    c.drawString(56, H - 170, "Global Markets.")
    c.drawString(56, H - 204, "One Window.")
    c.setFillColor(muted)
    c.setFont("Helvetica", 9.5)
    c.drawString(56, H - 232, "A young Delaware corporation publishing a clean, live read of Bitcoin and world equity markets.")

    c.setStrokeColor(Color(0.16, 0.16, 0.16))
    c.setLineWidth(0.5)
    c.line(56, H - 262, W - 56, H - 262)
    c.setFillColor(gold)
    c.setFont("Helvetica", 7)
    c.drawString(56, H - 276, "01  —  COVERAGE")

    markets = ["BITCOIN & DIGITAL NETWORKS", "GLOBAL EQUITY INDICES", "MAJOR PUBLIC COMPANIES", "MARKET COMMENTARY"]
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
    c.drawString(56, y - 22, "02  —  THE METHOD")

    doctrine = [
        ("WATCH", "Continuous market observation.", "Every session. Every index. No noise."),
        ("STUDY", "Structure before sentiment.", "Fundamentals and liquidity, never headlines."),
        ("PUBLISH", "An open window.", "The same live data, free and ungated."),
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
    c.drawString(56, ty - 96, "The platform publishes public market data only. No private positions. Nothing on this page is investment advice.")

    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(56, 96, "CORPORATE HEADQUARTERS")
    c.setFillColor(muted)
    c.setFont("Helvetica", 8)
    c.drawString(56, 82, "One World Trade Center, 85th Floor, New York, NY 10007  ·  +1 (212) 220-8443")
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


@api_router.get("/market-prices")
async def market_prices():
    import time, asyncio
    now = time.time()
    if _market_cache["data"] and now - _market_cache["ts"] < 120:
        return _market_cache["data"]
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
    for result in await asyncio.gather(*(fetch_equity(*spec) for spec in equity_specs)):
        if result:
            items.append(result)
    data = {"items": items}
    if items:
        _market_cache["data"] = data
        _market_cache["ts"] = now
    elif _market_cache["data"]:
        return _market_cache["data"]
    return data


_chart_cache = {}
_search_cache = {}

@api_router.get("/market-search")
async def market_search(q: str = ""):
    import time
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
async def market_chart(type: str = "crypto", id: str = "bitcoin", days: int = 7):
    import time, asyncio, re
    days = min(max(days, 1), 30)
    key = f"{type}:{id}:{days}"
    now = time.time()
    cached = _chart_cache.get(key)
    if cached and now - cached["ts"] < 300:
        return cached["data"]
    data = None
    for attempt in range(3):
        try:
            if type == "stock":
                if not re.fullmatch(r"[A-Za-z0-9.^=-]{1,12}", id):
                    raise HTTPException(status_code=400, detail="Unsupported symbol")
                range_, interval = {1: ("1d", "5m"), 7: ("5d", "30m"), 30: ("1mo", "1d")}[days]
                prices = await _yahoo_chart_prices(id, range_, interval)
                data = {"id": id, "days": days, "prices": prices}
            else:
                if not re.fullmatch(r"[a-z0-9-]{1,50}", id):
                    raise HTTPException(status_code=400, detail="Unsupported asset")
                async with httpx.AsyncClient(timeout=20) as http:
                    resp = await http.get(
                        f"https://api.coingecko.com/api/v3/coins/{id}/market_chart",
                        params={"vs_currency": "usd", "days": str(days)},
                    )
                resp.raise_for_status()
                data = {"id": id, "days": days, "prices": resp.json().get("prices", [])}
            break
        except HTTPException:
            raise
        except Exception:
            if attempt < 2:
                await asyncio.sleep(2)
    if data is None:
        if cached:
            return cached["data"]
        raise HTTPException(status_code=502, detail="Chart feed unavailable")
    _chart_cache[key] = {"data": data, "ts": now}
    return data


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
