from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, campaigns, ngos, donations, volunteers, verify

app = FastAPI(
    title="SevaSetu Platform API",
    description="Statutory Compliance, Dual-DB (MongoDB & Supabase), 80G Tax Deductions, and Volunteer Verification API for SevaSetu.",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS configuration to support Next.js frontend on Vercel and local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api")
app.include_router(campaigns.router, prefix="/api")
app.include_router(ngos.router, prefix="/api")
app.include_router(donations.router, prefix="/api")
app.include_router(volunteers.router, prefix="/api")
app.include_router(verify.router, prefix="/api")

@app.get("/")
def root():
    return {
        "platform": "SevaSetu",
        "description": "Connecting Donors, Field Leads, and Verified NGOs with Complete Transparency",
        "version": "1.0.0",
        "api_docs": "/api/docs",
        "status": "online"
    }

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "database": {
            "mongodb_configured": bool(settings.MONGODB_URI),
            "supabase_configured": bool(settings.SUPABASE_URL and settings.SUPABASE_KEY)
        }
    }
