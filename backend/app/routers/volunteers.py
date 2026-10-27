import time
import random
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional

from app.models.schemas import (
    AttendanceSessionCreate, VolunteerCheckInRequest,
    VolunteerCheckOutRequest, VolunteerHoursApproval, VolunteerRecordOut
)
from app.routers.auth import require_role, get_current_user

router = APIRouter(prefix="/volunteers", tags=["Volunteers"])

ACTIVE_SESSIONS: Dict[str, Dict[str, Any]] = {
    "vol-kolar-kitchen": {
        "token": "SETU-7492",
        "created_at": time.time(),
        "expires_at": time.time() + 600,
        "is_active": True
    }
}

VOLUNTEER_RECORDS: List[Dict[str, Any]] = [
    {
        "record_id": "VOL-REC-2026-9041",
        "volunteer_name": "Mayank Sharma",
        "volunteer_email": "mayank@example.com",
        "opportunity_id": "vol-kolar-kitchen",
        "opportunity_title": "Weekend Meal Packaging & Hygiene Quality Inspection",
        "ngo_name": "Akshaya Seva Foundation",
        "session_date": "2026-10-11",
        "check_in_time": "08:02 AM",
        "check_out_time": "12:05 PM",
        "hours_logged": 4.0,
        "status": "APPROVED",
        "approved_by": "Ananya Hegde (Field Lead)",
        "approval_notes": "Punctual attendance, completed meal packaging line 2 with zero defects.",
        "certificate_id": "SEVA-CERT-2026-11082",
        "qr_verification_url": "https://sevasetu.vercel.app/verify?id=SEVA-CERT-2026-11082"
    }
]

@router.post("/sessions/create-code")
async def create_session_code(
    payload: AttendanceSessionCreate,
    user: Dict[str, Any] = Depends(require_role(["field_lead", "platform_admin"]))
):
    token = f"SETU-{random.randint(1000, 9999)}"
    now = time.time()
    ACTIVE_SESSIONS[payload.opportunity_id] = {
        "token": token,
        "created_at": now,
        "expires_at": now + 600, # 10 minutes
        "is_active": True,
        "created_by": user["name"]
    }
    return {
        "opportunity_id": payload.opportunity_id,
        "session_token": token,
        "expires_in_seconds": 600,
        "is_active": True
    }

@router.post("/sessions/revoke")
async def revoke_session_code(
    payload: AttendanceSessionCreate,
    user: Dict[str, Any] = Depends(require_role(["field_lead", "platform_admin"]))
):
    if payload.opportunity_id in ACTIVE_SESSIONS:
        ACTIVE_SESSIONS[payload.opportunity_id]["is_active"] = False
    return {"message": "Session code revoked successfully."}

@router.post("/check-in", response_model=VolunteerRecordOut)
async def volunteer_check_in(payload: VolunteerCheckInRequest):
    sess = ACTIVE_SESSIONS.get(payload.opportunity_id)
    if not sess or not sess["is_active"] or time.time() > sess["expires_at"]:
        raise HTTPException(status_code=400, detail="No active attendance session found or code has expired (10-minute window).")

    if payload.session_token.strip().upper() != sess["token"]:
        raise HTTPException(status_code=400, detail="Invalid attendance token. Please check with your on-ground Field Lead.")

    rec_id = f"VOL-REC-2026-{random.randint(1000, 9999)}"
    now_str = datetime.now().strftime("%I:%M %p")
    today_str = datetime.now().strftime("%Y-%m-%d")

    record = {
        "record_id": rec_id,
        "volunteer_name": payload.volunteer_name,
        "volunteer_email": payload.volunteer_email,
        "opportunity_id": payload.opportunity_id,
        "opportunity_title": "Verified Community Service Drive",
        "ngo_name": "SevaSetu Verified Partner",
        "session_date": today_str,
        "check_in_time": now_str,
        "check_out_time": None,
        "hours_logged": 4.0,
        "status": "CHECKED_IN",
        "approved_by": None,
        "approval_notes": "Awaiting checkout and field lead review.",
        "certificate_id": None,
        "qr_verification_url": None
    }
    VOLUNTEER_RECORDS.insert(0, record)
    return record

@router.post("/check-out", response_model=VolunteerRecordOut)
async def volunteer_check_out(payload: VolunteerCheckOutRequest):
    record = next((r for r in VOLUNTEER_RECORDS if r["record_id"] == payload.record_id), None)
    if not record:
        raise HTTPException(status_code=404, detail="Attendance record not found.")

    record["check_out_time"] = datetime.now().strftime("%I:%M %p")
    record["status"] = "PENDING_APPROVAL"
    return record

@router.post("/approve-hours", response_model=VolunteerRecordOut)
async def approve_volunteer_hours(
    payload: VolunteerHoursApproval,
    user: Dict[str, Any] = Depends(require_role(["field_lead", "platform_admin"]))
):
    record = next((r for r in VOLUNTEER_RECORDS if r["record_id"] == payload.record_id), None)
    if not record:
        raise HTTPException(status_code=404, detail="Attendance record not found.")

    cert_id = f"SEVA-CERT-2026-{random.randint(10000, 99999)}"
    record["status"] = "APPROVED"
    record["hours_logged"] = payload.hours_approved
    record["approval_notes"] = payload.reviewer_notes
    record["approved_by"] = f"{user['name']} (Field Lead)"
    record["certificate_id"] = cert_id
    record["qr_verification_url"] = f"https://sevasetu.vercel.app/verify?id={cert_id}"
    return record

@router.get("/records", response_model=List[VolunteerRecordOut])
async def list_volunteer_records(user: Optional[Dict[str, Any]] = Depends(get_current_user)):
    if not user:
        return []
    if user["role"] in ["field_lead", "platform_admin"]:
        return VOLUNTEER_RECORDS
    return [r for r in VOLUNTEER_RECORDS if r["volunteer_email"] == user["email"]]
