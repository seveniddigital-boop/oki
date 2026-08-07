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
    capital: str = Field(min_length=1, max_length=20)
    message: str = Field(min_length=1, max_length=5000)

class Inquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    org: str
    email: EmailStr
    capital: str
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


CAPITAL_LABELS = {
    "10-50": "$10M — $50M",
    "50-250": "$50M — $250M",
    "250-1b": "$250M — $1B",
    "1b+": "$1B+",
}

@api_router.post("/inquiries", response_model=Inquiry)
async def create_inquiry(input: InquiryCreate):
    inquiry = Inquiry(**input.model_dump())
    doc = inquiry.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.inquiries.insert_one(doc)

    capital_label = CAPITAL_LABELS.get(inquiry.capital, inquiry.capital)
    html = f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:40px 0;">
      <tr><td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid #2a2a2a;">
          <tr><td style="padding:32px 40px;border-bottom:1px solid #2a2a2a;">
            <span style="font-family:Arial,sans-serif;font-size:18px;letter-spacing:6px;color:#C5A059;font-weight:bold;">OKI_INC.</span>
            <p style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;color:#737373;margin:8px 0 0;">NEW INVESTOR INQUIRY</p>
          </td></tr>
          <tr><td style="padding:32px 40px;font-family:Arial,sans-serif;font-size:13px;color:#A3A3A3;line-height:1.8;">
            <p style="margin:0 0 4px;color:#737373;font-size:10px;letter-spacing:2px;">NAME</p>
            <p style="margin:0 0 20px;color:#F5F5F5;">{inquiry.name}</p>
            <p style="margin:0 0 4px;color:#737373;font-size:10px;letter-spacing:2px;">ORGANIZATION</p>
            <p style="margin:0 0 20px;color:#F5F5F5;">{inquiry.org}</p>
            <p style="margin:0 0 4px;color:#737373;font-size:10px;letter-spacing:2px;">EMAIL</p>
            <p style="margin:0 0 20px;color:#F5F5F5;">{inquiry.email}</p>
            <p style="margin:0 0 4px;color:#737373;font-size:10px;letter-spacing:2px;">CAPITAL RANGE</p>
            <p style="margin:0 0 20px;color:#C5A059;">{capital_label}</p>
            <p style="margin:0 0 4px;color:#737373;font-size:10px;letter-spacing:2px;">NATURE OF INQUIRY</p>
            <p style="margin:0;color:#F5F5F5;">{inquiry.message}</p>
          </td></tr>
          <tr><td style="padding:20px 40px;border-top:1px solid #2a2a2a;">
            <p style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;color:#737373;margin:0;">OKI INC. · 16192 COASTAL HIGHWAY, LEWES, DELAWARE 19958</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
    """
    payload = {
        "to": [OWNER_EMAIL],
        "subject": f"Investor Inquiry — {inquiry.org} ({capital_label})",
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
    c.drawString(mx + 70, my - 2, "INTERNATIONAL ASSET HOLDINGS  ·  STRATEGIC INVESTMENTS")

    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 30)
    c.drawString(56, H - 170, "International Asset Holdings.")
    c.drawString(56, H - 204, "Global Control.")
    c.setFillColor(muted)
    c.setFont("Helvetica", 9.5)
    c.drawString(56, H - 232, "We acquire, structure, and hold strategic assets across borders. Ownership is the strategy.")

    c.setStrokeColor(Color(0.16, 0.16, 0.16))
    c.setLineWidth(0.5)
    c.line(56, H - 262, W - 56, H - 262)
    c.setFillColor(gold)
    c.setFont("Helvetica", 7)
    c.drawString(56, H - 276, "01  —  GLOBAL ASSET ALLOCATION")

    alloc = [("EQUITY HOLDINGS", 36, gold), ("STRATEGIC REAL ASSETS", 24, crimson),
             ("DIGITAL ASSETS & CRYPTO", 16, Color(227/255, 200/255, 136/255)),
             ("IP & INTANGIBLES", 14, Color(0.55, 0.55, 0.55)), ("PRIVATE CREDIT & SPECIAL SITUATIONS", 10, Color(0.28, 0.28, 0.28))]
    y = H - 306
    bar_x = 200
    bar_w = W - 56 - bar_x - 40
    for label, pct, col in alloc:
        c.setFillColor(muted)
        c.setFont("Helvetica", 7.5)
        c.drawString(56, y + 3, label)
        c.setFillColor(Color(0.1, 0.1, 0.1))
        c.rect(bar_x, y, bar_w, 9, stroke=0, fill=1)
        c.setFillColor(col)
        c.rect(bar_x, y, bar_w * pct / 50, 9, stroke=0, fill=1)
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(bar_x + bar_w + 8, y + 2, f"{pct}%")
        y -= 24

    c.setStrokeColor(Color(0.16, 0.16, 0.16))
    c.line(56, y - 8, W - 56, y - 8)
    c.setFillColor(gold)
    c.setFont("Helvetica", 7)
    c.drawString(56, y - 22, "02  —  THE DOCTRINE")

    doctrine = [
        ("IDENTIFY", "High-conviction global assets.", "We move before consensus forms."),
        ("STRUCTURE", "Delaware holding architecture.", "Liability-insulated. Jurisdiction-optimized."),
        ("HOLD", "Long-duration control.", "No exit mandates. Generational horizon."),
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
    c.drawString(56, ty - 84, "OKI Inc. is a Delaware C-Corporation — the optimal vehicle for international asset ownership.")
    c.drawString(56, ty - 96, "Governance is centralized. Exposure is not. Capital discipline is enforced by charter.")

    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(56, 96, "REGISTERED OFFICE")
    c.setFillColor(muted)
    c.setFont("Helvetica", 8)
    c.drawString(56, 82, "16192 Coastal Highway, Lewes, Delaware 19958, United States of America")
    c.setFillColor(crimson)
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(56, 60, "SERIOUS CAPITAL AND STRATEGIC CONVERSATIONS ONLY.")
    c.setFillColor(faint)
    c.setFont("Helvetica", 6.5)
    c.drawRightString(W - 56, 40, "OKI INC. · DELAWARE C-CORPORATION · ESTABLISHED FOR PERMANENCE")

    c.showPage()
    c.save()
    buf.seek(0)
    return Response(
        content=buf.read(),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=OKI-Inc-Corporate-Deck.pdf"},
    )


_crypto_cache = {"data": None, "ts": 0.0}

@api_router.get("/crypto-prices")
async def crypto_prices():
    import time
    now = time.time()
    if _crypto_cache["data"] and now - _crypto_cache["ts"] < 120:
        return _crypto_cache["data"]
    try:
        import asyncio
        data = None
        for attempt in range(3):
            try:
                async with httpx.AsyncClient(timeout=15) as http:
                    resp = await http.get(
                        "https://api.coingecko.com/api/v3/simple/price",
                        params={"ids": "bitcoin,ethereum,solana", "vs_currencies": "usd", "include_24hr_change": "true"},
                    )
                resp.raise_for_status()
                data = resp.json()
                break
            except Exception:
                if attempt < 2:
                    await asyncio.sleep(2)
        if data is None:
            raise RuntimeError("all retries failed")
        _crypto_cache["data"] = data
        _crypto_cache["ts"] = now
        return data
    except Exception as e:
        logger.error(f"CoinGecko fetch failed: {e}")
        if _crypto_cache["data"]:
            return _crypto_cache["data"]
        return {}


_chart_cache = {}
_search_cache = {}

@api_router.get("/crypto-search")
async def crypto_search(q: str = ""):
    import time, asyncio
    q = q.strip().lower()
    if len(q) < 2:
        return {"coins": []}
    now = time.time()
    cached = _search_cache.get(q)
    if cached and now - cached["ts"] < 600:
        return cached["data"]
    data = None
    for attempt in range(3):
        try:
            async with httpx.AsyncClient(timeout=15) as http:
                resp = await http.get("https://api.coingecko.com/api/v3/search", params={"query": q})
            resp.raise_for_status()
            coins = [
                {"id": c["id"], "name": c["name"], "symbol": c["symbol"], "rank": c.get("market_cap_rank")}
                for c in resp.json().get("coins", [])[:12]
            ]
            data = {"coins": coins}
            break
        except Exception:
            if attempt < 2:
                await asyncio.sleep(2)
    if data is None:
        if cached:
            return cached["data"]
        raise HTTPException(status_code=502, detail="Search feed unavailable")
    _search_cache[q] = {"data": data, "ts": now}
    return data

@api_router.get("/crypto-chart")
async def crypto_chart(id: str = "bitcoin", days: int = 7):
    import time
    import re
    if not re.fullmatch(r"[a-z0-9-]{1,50}", id):
        raise HTTPException(status_code=400, detail="Unsupported asset")
    days = min(max(days, 1), 30)
    key = f"{id}:{days}"
    now = time.time()
    cached = _chart_cache.get(key)
    if cached and now - cached["ts"] < 300:
        return cached["data"]
    try:
        import asyncio
        data = None
        for attempt in range(3):
            try:
                async with httpx.AsyncClient(timeout=20) as http:
                    resp = await http.get(
                        f"https://api.coingecko.com/api/v3/coins/{id}/market_chart",
                        params={"vs_currency": "usd", "days": str(days)},
                    )
                resp.raise_for_status()
                data = {"id": id, "days": days, "prices": resp.json().get("prices", [])}
                break
            except Exception:
                if attempt < 2:
                    await asyncio.sleep(2)
        if data is None:
            raise RuntimeError("all retries failed")
        _chart_cache[key] = {"data": data, "ts": now}
        return data
    except Exception as e:
        logger.error(f"CoinGecko chart fetch failed: {e}")
        if cached:
            return cached["data"]
        raise HTTPException(status_code=502, detail="Chart feed unavailable")


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
