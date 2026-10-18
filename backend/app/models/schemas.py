from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Auth Schemas
class UserLogin(BaseModel):
    username: str
    password: str

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "donor" # donor, volunteer, field_lead, ngo_admin
    phone: Optional[str] = None
    pan: Optional[str] = None

class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str
    title: Optional[str] = None
    phone: Optional[str] = None
    pan: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# Fund Allocation & Milestone Schemas
class FundAllocationItem(BaseModel):
    category: str
    percent: int
    amount: float

class MilestoneItem(BaseModel):
    id: str
    title: str
    target: str
    status: str # COMPLETED, IN_PROGRESS, PLANNED
    date: Optional[str] = None

class ImpactUpdate(BaseModel):
    id: str
    date: str
    title: str
    text: str
    author: str
    verified: bool = True

# Campaign Schemas
class CampaignCreate(BaseModel):
    ngo_id: str
    title: str
    category: str
    short_desc: str
    full_desc: str
    goal_amount: float
    days_left: int = 30
    is_80g_eligible: bool = True
    fund_allocation: Optional[List[FundAllocationItem]] = None
    milestones: Optional[List[MilestoneItem]] = None

class CampaignOut(BaseModel):
    id: str
    ngo_id: str
    ngo_name: str
    title: str
    category: str
    short_desc: str
    full_desc: str
    goal_amount: float
    raised_amount: float = 0.0
    donor_count: int = 0
    days_left: int = 30
    status: str = "PUBLISHED"
    is_80g_eligible: bool = True
    fund_allocation: List[FundAllocationItem]
    milestones: List[MilestoneItem]
    impact_updates: List[ImpactUpdate] = []

# NGO Schemas
class NgoCreate(BaseModel):
    name: str
    mission: str
    category: str
    city: str
    founded: int
    darpan_id: str
    pan: str
    reg_12a: str
    sec_80g: str
    fcra_status: str = "Not Applicable"
    email: EmailStr
    phone: str
    address: str

class NgoReviewDecision(BaseModel):
    decision: str # VERIFIED, UNDER_REVERIFICATION, REJECTED
    reviewer_notes: str

class NgoOut(BaseModel):
    id: str
    name: str
    mission: str
    category: str
    city: str
    founded: int
    darpan_id: str
    pan: str
    reg_12a: str
    sec_80g: str
    fcra_status: str
    verification_status: str
    verified_date: Optional[str] = None
    reviewer_notes: Optional[str] = None
    trust_score: int = 95
    contacts: Dict[str, str]

# Donation Schemas
class DonationCreate(BaseModel):
    campaign_id: str
    amount: float = Field(..., gt=99, description="Minimum donation is INR 100")
    payment_method: str = "UPI" # UPI, CARD, NETBANKING
    donor_name: str
    donor_email: EmailStr
    donor_phone: Optional[str] = None
    donor_pan: Optional[str] = None
    donor_address: Optional[str] = "India"
    is_anonymous: bool = False

class DonationOut(BaseModel):
    bill_id: str
    receipt_id: str
    campaign_id: str
    campaign_title: str
    ngo_id: str
    ngo_name: str
    ngo_pan: str
    ngo_80g_order: str
    donor_name: str
    donor_email: str
    donor_pan_masked: str
    amount: float
    payment_method: str
    provider_ref: str
    timestamp: str
    is_80g_eligible: bool
    tax_deduction_claimed: float
    form_10bd_ready: bool
    qr_verification_url: str

# Volunteer Attendance Schemas
class AttendanceSessionCreate(BaseModel):
    opportunity_id: str

class VolunteerCheckInRequest(BaseModel):
    opportunity_id: str
    session_token: str
    volunteer_name: str
    volunteer_email: EmailStr

class VolunteerCheckOutRequest(BaseModel):
    record_id: str

class VolunteerHoursApproval(BaseModel):
    record_id: str
    hours_approved: float
    reviewer_notes: str

class VolunteerRecordOut(BaseModel):
    record_id: str
    volunteer_name: str
    volunteer_email: str
    opportunity_id: str
    opportunity_title: str
    ngo_name: str
    session_date: str
    check_in_time: str
    check_out_time: Optional[str] = None
    hours_logged: float
    status: str # CHECKED_IN, PENDING_APPROVAL, APPROVED
    approved_by: Optional[str] = None
    approval_notes: Optional[str] = None
    certificate_id: Optional[str] = None
    qr_verification_url: Optional[str] = None

# Audit Log Schema
class AuditLogEntry(BaseModel):
    id: str
    timestamp: str
    actor: str
    role: str
    action: str
    details: str
    ip: str = "127.0.0.1"
