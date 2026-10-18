import re
import random
import csv
import io
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, Response
from typing import List, Dict, Any, Optional

from app.models.schemas import DonationCreate, DonationOut
from app.routers.auth import get_current_user, require_role
from app.routers.campaigns import CAMPAIGNS_DB
from app.routers.ngos import NGOS_DB

router = APIRouter(prefix="/api/donations", tags=["Donations & Bill Vault"])

PAN_REGEX = re.compile(r"^[A-Z]{5}[0-9]{4}[A-Z]{1}$")

# Seed Donations
DONATIONS_DB: List[Dict[str, Any]] = [
    {
        "bill_id": "SS-BILL-2026-892147",
        "receipt_id": "SS-REC-2026-00481",
        "campaign_id": "cmp-midday-meals",
        "campaign_title": "Mid-Day Nutrition For 2,500 Rural School Children",
        "ngo_id": "ngo-akshaya",
        "ngo_name": "Akshaya Seva Foundation",
        "ngo_pan": "AAETA1294K",
        "ngo_80g_order": "AAETA1294KF20218",
        "donor_name": "Mayank Sharma",
        "donor_email": "mayank@example.com",
        "donor_pan_masked": "ABCDE****F",
        "amount": 5000.0,
        "payment_method": "UPI",
        "provider_ref": "UPI-ICICI-9283719401",
        "timestamp": "2026-10-15T11:42:18+05:30",
        "is_80g_eligible": True,
        "tax_deduction_claimed": 2500.0,
        "form_10bd_ready": True,
        "qr_verification_url": "https://sevasetu.vercel.app/verify?id=SS-REC-2026-00481&bill=SS-BILL-2026-892147"
    },
    {
        "bill_id": "SS-BILL-2026-841902",
        "receipt_id": "SS-REC-2026-00412",
        "campaign_id": "cmp-pediatric-icu",
        "campaign_title": "Neonatal Ventilators & Oxygen Concentrators for Govt NICU",
        "ngo_id": "ngo-nanhi-jaan",
        "ngo_name": "Nanhi Jaan Healthcare Society",
        "ngo_pan": "AABAN3841M",
        "ngo_80g_order": "AABAN3841MF20216",
        "donor_name": "Pooja Verma",
        "donor_email": "pooja.v@example.com",
        "donor_pan_masked": "BMVPV****K",
        "amount": 10000.0,
        "payment_method": "NETBANKING",
        "provider_ref": "NET-HDFC-88371920",
        "timestamp": "2026-10-12T16:15:00+05:30",
        "is_80g_eligible": True,
        "tax_deduction_claimed": 5000.0,
        "form_10bd_ready": True,
        "qr_verification_url": "https://sevasetu.vercel.app/verify?id=SS-REC-2026-00412&bill=SS-BILL-2026-841902"
    }
]

@router.post("", response_model=DonationOut)
async def create_donation(payload: DonationCreate):
    # Find Campaign
    campaign = next((c for c in CAMPAIGNS_DB if c["id"] == payload.campaign_id), None)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    # Find NGO
    ngo = next((n for n in NGOS_DB if n["id"] == campaign["ngo_id"]), None)
    if not ngo:
        raise HTTPException(status_code=404, detail="Associated NGO not found")

    # Validate PAN if provided
    has_valid_pan = False
    masked_pan = "N/A"
    if payload.donor_pan:
        clean_pan = payload.donor_pan.strip().upper()
        if not PAN_REGEX.match(clean_pan):
            raise HTTPException(
                status_code=400,
                detail="Invalid Indian PAN format. Format must be 5 letters, 4 numbers, 1 letter (e.g. ABCDE1234F)."
            )
        has_valid_pan = True
        masked_pan = f"{clean_pan[:5]}****{clean_pan[-1]}"

    bill_num = random.randint(100000, 999999)
    rec_num = random.randint(1000, 9999)
    bill_id = f"SS-BILL-2026-{bill_num}"
    receipt_id = f"SS-REC-2026-0{rec_num}"

    is_80g = campaign["is_80g_eligible"] and has_valid_pan
    tax_deduction = round(payload.amount * 0.5, 2) if is_80g else 0.0

    donation_record = {
        "bill_id": bill_id,
        "receipt_id": receipt_id,
        "campaign_id": campaign["id"],
        "campaign_title": campaign["title"],
        "ngo_id": ngo["id"],
        "ngo_name": ngo["name"],
        "ngo_pan": ngo["pan"],
        "ngo_80g_order": ngo["sec_80g"],
        "donor_name": payload.donor_name if not payload.is_anonymous else "Anonymous Contributor",
        "donor_email": payload.donor_email,
        "donor_pan_masked": masked_pan,
        "amount": payload.amount,
        "payment_method": payload.payment_method,
        "provider_ref": f"{payload.payment_method}-TXN-{random.randint(10000000, 99999999)}",
        "timestamp": datetime.now().isoformat(),
        "is_80g_eligible": is_80g,
        "tax_deduction_claimed": tax_deduction,
        "form_10bd_ready": is_80g,
        "qr_verification_url": f"https://sevasetu.vercel.app/verify?id={receipt_id}&bill={bill_id}"
    }

    # Increment campaign raised
    campaign["raised_amount"] += payload.amount
    campaign["donor_count"] += 1

    DONATIONS_DB.insert(0, donation_record)
    return donation_record

@router.get("", response_model=List[DonationOut])
async def list_donations(user: Optional[Dict[str, Any]] = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required to view Bill Vault.")
    
    # If platform admin, see all
    if user["role"] == "platform_admin":
        return DONATIONS_DB
    
    # If NGO admin, see donations to their NGO
    if user["role"] == "ngo_admin":
        return [d for d in DONATIONS_DB if d["ngo_name"] == user.get("title")] or DONATIONS_DB

    # Otherwise (donor/volunteer), return their own records
    return [d for d in DONATIONS_DB if d["donor_email"] == user["email"]] or DONATIONS_DB

@router.get("/form10bd/export")
async def export_form10bd(user: Dict[str, Any] = Depends(require_role(["ngo_admin", "platform_admin"]))):
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID Type", "Donor PAN", "Donor Name", "Amount (INR)", "Receipt Number", "Financial Year", "Section Code"])
    
    for d in DONATIONS_DB:
        if d["is_80g_eligible"]:
            writer.writerow(["PAN", d["donor_pan_masked"], d["donor_name"], d["amount"], d["receipt_id"], "FY 2026-27", "Section 80G"])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=SevaSetu_Form10BD_Statement.csv"}
    )
