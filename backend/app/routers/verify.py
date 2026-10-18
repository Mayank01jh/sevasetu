from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.database import get_db, in_memory_store

router = APIRouter(prefix="/verify", tags=["Public Verification"])

@router.get("/receipt")
async def verify_receipt(bill_id: str = Query(..., description="Unique 80G Bill ID e.g. SS-2026-XXXX")):
    db = await get_db()
    receipt = None
    if db is not None:
        try:
            receipt = await db.donations.find_one({"bill_id": bill_id})
        except Exception:
            pass

    if not receipt:
        for d in in_memory_store["donations"]:
            if d.get("bill_id") == bill_id:
                receipt = d
                break

    if not receipt:
        raise HTTPException(status_code=404, detail="Receipt not found or invalid Bill ID")

    return {
        "valid": True,
        "bill_id": receipt.get("bill_id"),
        "donor_name": receipt.get("donor_name"),
        "masked_pan": (receipt.get("donor_pan", "")[:2] + "XXXXX" + receipt.get("donor_pan", "")[-1:]) if receipt.get("donor_pan") else "N/A",
        "amount": receipt.get("amount"),
        "tax_exemption_80g": receipt.get("tax_exemption_80g"),
        "eligible_deduction": receipt.get("amount", 0) * 0.5,
        "ngo_id": receipt.get("ngo_id"),
        "campaign_id": receipt.get("campaign_id"),
        "timestamp": receipt.get("timestamp"),
        "statutory_compliance": "Section 80G(5)(vi) & Form 10BD compliant",
        "qr_verification_status": "AUTHENTIC_SEVASETU_RECORD"
    }

@router.get("/certificate")
async def verify_certificate(certificate_id: str = Query(..., description="Certificate ID e.g. SS-CERT-2026-XXXX")):
    db = await get_db()
    cert = None
    if db is not None:
        try:
            cert = await db.certificates.find_one({"certificate_id": certificate_id})
        except Exception:
            pass

    if not cert:
        for c in in_memory_store["certificates"]:
            if c.get("certificate_id") == certificate_id:
                cert = c
                break

    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found or invalid Certificate ID")

    return {
        "valid": True,
        "certificate_id": cert.get("certificate_id"),
        "volunteer_name": cert.get("volunteer_name"),
        "event_title": cert.get("event_title"),
        "hours_credited": cert.get("hours_credited"),
        "issued_by": cert.get("issued_by"),
        "issued_at": cert.get("issued_at"),
        "qr_verification_status": "VERIFIED_GENUINE_SEVASETU_VOLUNTEER_HOURS"
    }
