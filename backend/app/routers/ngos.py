from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from app.models.schemas import NgoOut, NgoReviewDecision, NgoCreate
from app.routers.auth import require_role

router = APIRouter(prefix="/ngos", tags=["NGOs"])

NGOS_DB: List[Dict[str, Any]] = [
    {
        "id": "ngo-akshaya",
        "name": "Akshaya Seva Foundation",
        "mission": "Eliminating classroom hunger by providing certified hygienic, wholesome hot meals to government school children across Karnataka.",
        "category": "Education & Nutrition",
        "city": "Bengaluru, Karnataka",
        "founded": 2014,
        "darpan_id": "KA/2018/0194821",
        "pan": "AAETA1294K",
        "reg_12a": "AAETA1294KE20214",
        "sec_80g": "AAETA1294KF20218 (Valid till AY 2028-29)",
        "fcra_status": "Approved (FCRA No: 094421876)",
        "verification_status": "VERIFIED",
        "verified_date": "2026-01-14",
        "reviewer_notes": "All statutory 12A, 80G, and Darpan documents cross-verified with Income Tax & NITI Aayog portals.",
        "trust_score": 98,
        "contacts": {
            "email": "contact@akshayaseva.org",
            "phone": "+91 80 4129 8830",
            "address": "Plot 42, 3rd Block, Koramangala, Bengaluru 560034"
        }
    },
    {
        "id": "ngo-nanhi-jaan",
        "name": "Nanhi Jaan Healthcare Society",
        "mission": "Procuring life-saving pediatric intensive care equipment, oncology meds, and neonatal ventilators for government district hospitals.",
        "category": "Healthcare",
        "city": "Chandigarh & NCR",
        "founded": 2011,
        "darpan_id": "CH/2016/0104829",
        "pan": "AABAN3841M",
        "reg_12a": "AABAN3841ME20202",
        "sec_80g": "AABAN3841MF20216 (Valid till AY 2027-28)",
        "fcra_status": "Not Applicable (Domestic Operations)",
        "verification_status": "VERIFIED",
        "verified_date": "2026-02-01",
        "reviewer_notes": "Pediatric hospital MOUs verified; audited hospital equipment asset registers inspected.",
        "trust_score": 96,
        "contacts": {
            "email": "care@nanhijaan.org",
            "phone": "+91 172 274 9102",
            "address": "House 104, Sector 18-A, Chandigarh 160018"
        }
    },
    {
        "id": "ngo-vriksha",
        "name": "Vriksha Green India Trust",
        "mission": "Reviving degraded forest buffers along the Aravali range through Miyawaki afforestation, native endemic saplings, and community water check-dams.",
        "category": "Environment & Climate",
        "city": "Jaipur, Rajasthan & NCR",
        "founded": 2017,
        "darpan_id": "RJ/2019/0219502",
        "pan": "AACTV5510Q",
        "reg_12a": "AACTV5510QE20221",
        "sec_80g": "AACTV5510QF20225 (Valid till AY 2028-29)",
        "fcra_status": "Approved (FCRA No: 125540091)",
        "verification_status": "VERIFIED",
        "verified_date": "2026-03-10",
        "reviewer_notes": "Forestry department permissions and GIS geo-tagged sapling survival audits confirmed.",
        "trust_score": 94,
        "contacts": {
            "email": "info@vrikshagreen.org",
            "phone": "+91 141 239 8812",
            "address": "7-C, Green Park Colony, Jaipur 302015"
        }
    }
]

@router.get("", response_model=List[NgoOut])
async def list_ngos():
    return NGOS_DB

@router.get("/{ngo_id}", response_model=NgoOut)
async def get_ngo(ngo_id: str):
    for ngo in NGOS_DB:
        if ngo["id"] == ngo_id:
            return ngo
    raise HTTPException(status_code=404, detail="NGO not found")

@router.post("/{ngo_id}/review", response_model=NgoOut)
async def review_ngo(
    ngo_id: str,
    decision_data: NgoReviewDecision,
    user: Dict[str, Any] = Depends(require_role(["platform_admin"]))
):
    for ngo in NGOS_DB:
        if ngo["id"] == ngo_id:
            ngo["verification_status"] = decision_data.decision
            ngo["reviewer_notes"] = f"{decision_data.reviewer_notes} (Reviewed by {user['name']})"
            return ngo
    raise HTTPException(status_code=404, detail="NGO not found")
