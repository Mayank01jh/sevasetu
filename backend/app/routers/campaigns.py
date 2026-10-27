import uuid
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from app.models.schemas import CampaignCreate, CampaignOut, FundAllocationItem, MilestoneItem
from app.routers.auth import require_role

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])

# Seed Campaigns
CAMPAIGNS_DB: List[Dict[str, Any]] = [
    {
        "id": "cmp-midday-meals",
        "ngo_id": "ngo-akshaya",
        "ngo_name": "Akshaya Seva Foundation",
        "title": "Mid-Day Nutrition For 2,500 Rural School Children",
        "category": "Education & Nutrition",
        "short_desc": "Wholesome, micronutrient-enriched hot lunches ensuring children stay in school across Kolar & Bengaluru.",
        "full_desc": "Classroom hunger is the biggest cause of school dropouts among rural adolescent students. Akshaya Seva Foundation's centralized hygienic kitchens cook protein-rich lentils, seasonal vegetables, fortified rice, and millet milk.",
        "goal_amount": 1800000.0,
        "raised_amount": 1425000.0,
        "donor_count": 486,
        "days_left": 14,
        "status": "PUBLISHED",
        "is_80g_eligible": True,
        "fund_allocation": [
            {"category": "Raw Food Procurement (Millets, Dal, Fortified Rice)", "percent": 65, "amount": 1170000.0},
            {"category": "Kitchen Operations, Fuel & Cook Honorariums", "percent": 18, "amount": 324000.0},
            {"category": "Insulated Delivery Van & Distribution", "percent": 10, "amount": 180000.0},
            {"category": "Third-Party Food Safety Lab Testing", "percent": 7, "amount": 126000.0}
        ],
        "milestones": [
            {"id": "m1", "title": "Adopt First 5 Schools in Kolar", "target": "800 Children", "status": "COMPLETED", "date": "Aug 2026"},
            {"id": "m2", "title": "Scale to 9 Additional Higher Primary Schools", "target": "2,500 Total Children", "status": "IN_PROGRESS", "date": "Oct 2026"},
            {"id": "m3", "title": "Pediatric BMI & Nutrition Audit", "target": "Zero malnutrition deficiency", "status": "PLANNED", "date": "Dec 2026"}
        ],
        "impact_updates": [
            {"id": "u1", "date": "2026-10-12", "title": "Fresh Harvest Millets Added", "text": "Enhanced protein intake by 32% for all children.", "author": "Radhika Iyer, Chief Dietitian", "verified": True}
        ]
    },
    {
        "id": "cmp-pediatric-icu",
        "ngo_id": "ngo-nanhi-jaan",
        "ngo_name": "Nanhi Jaan Healthcare Society",
        "title": "Neonatal Ventilators & Oxygen Concentrators for Govt NICU",
        "category": "Healthcare",
        "short_desc": "Funding 3 specialized neonatal bubble-CPAP machines and infant oxygenators for district hospitals.",
        "full_desc": "District Civil Hospitals often face severe equipment shortages in Neonatal Intensive Care Units (NICUs), forcing impoverished families into catastrophic debt.",
        "goal_amount": 2400000.0,
        "raised_amount": 1890000.0,
        "donor_count": 620,
        "days_left": 9,
        "status": "PUBLISHED",
        "is_80g_eligible": True,
        "fund_allocation": [
            {"category": "Direct Procurement of 3x Bubble CPAP & Infant Warmers", "percent": 74, "amount": 1776000.0},
            {"category": "Sterile Breathing Circuits & Consumables", "percent": 14, "amount": 336000.0},
            {"category": "Biomedical Calibration & 3-Yr Warranty", "percent": 8, "amount": 192000.0},
            {"category": "Platform Compliance & Asset Verification", "percent": 4, "amount": 96000.0}
        ],
        "milestones": [
            {"id": "m1", "title": "PO Issued to Certified Medical Manufacturer", "target": "3 CPAP Units & 4 Warmers", "status": "COMPLETED", "date": "Sep 2026"},
            {"id": "m2", "title": "Installation in Civil Hospital Ward", "target": "Zero-error biomedical calibration", "status": "IN_PROGRESS", "date": "Oct 2026"}
        ],
        "impact_updates": []
    },
    {
        "id": "cmp-aravali-reforest",
        "ngo_id": "ngo-vriksha",
        "ngo_name": "Vriksha Green India Trust",
        "title": "Aravali Native Green Shield: 25,000 Indigenous Trees",
        "category": "Environment & Climate",
        "short_desc": "Combating desertification and revitalizing natural groundwater recharge zones in Rajasthan.",
        "full_desc": "The Aravali hill range serves as the critical green barrier preventing the Thar Desert from encroaching into fertile plains. Native drought-resistant species are planted and geo-tagged.",
        "goal_amount": 1200000.0,
        "raised_amount": 840000.0,
        "donor_count": 345,
        "days_left": 22,
        "status": "PUBLISHED",
        "is_80g_eligible": True,
        "fund_allocation": [
            {"category": "Native Sapling Nursery & Soil Compost Prep", "percent": 50, "amount": 600000.0},
            {"category": "Women SHG Tree Stewards & Watering Wages (18 Months)", "percent": 30, "amount": 360000.0},
            {"category": "Rainwater Trenching & Mulching", "percent": 12, "amount": 144000.0},
            {"category": "Drone Mapping & Independent Survival Audits", "percent": 8, "amount": 96000.0}
        ],
        "milestones": [
            {"id": "m1", "title": "Panchayat Demarcation & Fencing", "target": "45 Hectares fenced", "status": "COMPLETED", "date": "Jul 2026"},
            {"id": "m2", "title": "Planting Phase 1: 12,500 Native Trees", "target": "Dhak, Khejri, Rohida", "status": "COMPLETED", "date": "Aug 2026"}
        ],
        "impact_updates": []
    }
]

@router.get("", response_model=List[CampaignOut])
async def list_campaigns():
    return CAMPAIGNS_DB

@router.get("/{campaign_id}", response_model=CampaignOut)
async def get_campaign(campaign_id: str):
    for cmp in CAMPAIGNS_DB:
        if cmp["id"] == campaign_id:
            return cmp
    raise HTTPException(status_code=404, detail="Campaign not found")

@router.post("", response_model=CampaignOut)
async def create_campaign(
    payload: CampaignCreate,
    user: Dict[str, Any] = Depends(require_role(["ngo_admin", "platform_admin"]))
):
    campaign_id = f"cmp-{payload.title.lower().replace(' ', '-')[:20]}-{str(uuid.uuid4())[:6]}"
    new_campaign = {
        "id": campaign_id,
        "ngo_id": payload.ngo_id,
        "ngo_name": user.get("title", "Verified NGO Partner"),
        "title": payload.title,
        "category": payload.category,
        "short_desc": payload.short_desc,
        "full_desc": payload.full_desc,
        "goal_amount": payload.goal_amount,
        "raised_amount": 0.0,
        "donor_count": 0,
        "days_left": payload.days_left,
        "status": "PUBLISHED",
        "is_80g_eligible": payload.is_80g_eligible,
        "fund_allocation": payload.fund_allocation or [
            {"category": "Direct Beneficiary Program Procurement", "percent": 75, "amount": payload.goal_amount * 0.75},
            {"category": "Logistics & Field Distribution", "percent": 15, "amount": payload.goal_amount * 0.15},
            {"category": "Independent Quality Audit & Disclosures", "percent": 10, "amount": payload.goal_amount * 0.10}
        ],
        "milestones": payload.milestones or [
            {"id": "m1", "title": "Phase 1 Beneficiary Rollout", "target": "25% of Target", "status": "IN_PROGRESS", "date": "Current"}
        ],
        "impact_updates": []
    }
    CAMPAIGNS_DB.insert(0, new_campaign)
    return new_campaign
