import time
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from passlib.context import CryptContext
from typing import Dict, Any, Optional

from app.config import settings
from app.models.schemas import UserLogin, UserRegister, TokenResponse, UserOut

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)

# Seed Users (matching CREDENTIALS.md)
SEED_USERS: Dict[str, Dict[str, Any]] = {
    "admin@sevasetu.org": {
        "id": "usr_admin",
        "email": "admin@sevasetu.org",
        "username": "admin@sevasetu.org",
        "password": "Admin@SevaSetu2026",
        "name": "Rajesh Kumar",
        "role": "platform_admin",
        "title": "Platform Reviewer & Compliance Lead",
        "phone": "+91 98111 22334"
    },
    "ngo@akshayaseva.org": {
        "id": "usr_ngo",
        "email": "ngo@akshayaseva.org",
        "username": "ngo@akshayaseva.org",
        "password": "Ngo@Akshaya2026",
        "name": "Dr. Ramesh Hegde",
        "role": "ngo_admin",
        "title": "Trustee, Akshaya Seva Foundation",
        "phone": "+91 80 4129 8830"
    },
    "lead@sevasetu.org": {
        "id": "usr_lead",
        "email": "lead@sevasetu.org",
        "username": "lead@sevasetu.org",
        "password": "Lead@Field2026",
        "name": "Ananya Hegde",
        "role": "field_lead",
        "title": "Field Operations & Attendance Lead",
        "phone": "+91 80 4129 8831"
    },
    "volunteer@sevasetu.org": {
        "id": "usr_volunteer",
        "email": "volunteer@sevasetu.org",
        "username": "volunteer@sevasetu.org",
        "password": "Volunteer@2026",
        "name": "Mayank Sharma",
        "role": "volunteer",
        "title": "Registered Civic Volunteer",
        "phone": "+91 98765 43210"
    },
    "donor@sevasetu.org": {
        "id": "usr_donor",
        "email": "donor@sevasetu.org",
        "username": "donor@sevasetu.org",
        "password": "Donor@2026",
        "name": "Mayank Sharma",
        "role": "donor",
        "title": "Verified Contributor",
        "phone": "+91 98765 43210",
        "pan": "ABCDE1234F"
    }
}

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[Dict[str, Any]]:
    if not credentials:
        return None
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        if not email or email not in SEED_USERS:
            raise HTTPException(status_code=401, detail="Invalid session token.")
        return SEED_USERS[email]
    except JWTError:
        raise HTTPException(status_code=401, detail="Expired or invalid credentials.")

def require_role(allowed_roles: list):
    async def role_checker(user: Dict[str, Any] = Depends(get_current_user)):
        if not user:
            raise HTTPException(status_code=401, detail="Authentication required.")
        if user["role"] not in allowed_roles:
            raise HTTPException(
                status_code=403, 
                detail=f"Access denied. Requires one of: {', '.join(allowed_roles)}"
            )
        return user
    return role_checker

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    email = credentials.username.strip().lower()
    user = SEED_USERS.get(email)
    
    if not user or user["password"] != credentials.password.strip():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Refer to CREDENTIALS.md for test accounts."
        )

    token = create_access_token({"sub": user["email"], "role": user["role"]})
    return TokenResponse(
        access_token=token,
        user=UserOut(
            id=user["id"],
            name=user["name"],
            email=user["email"],
            role=user["role"],
            title=user.get("title"),
            phone=user.get("phone"),
            pan=user.get("pan")
        )
    )

@router.post("/register", response_model=TokenResponse)
async def register(req: UserRegister):
    email = req.email.strip().lower()
    if email in SEED_USERS:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    new_user = {
        "id": f"usr_{int(time.time())}",
        "email": email,
        "username": email,
        "password": req.password,
        "name": req.name,
        "role": req.role,
        "title": "Registered Member",
        "phone": req.phone,
        "pan": req.pan.upper() if req.pan else None
    }
    SEED_USERS[email] = new_user

    token = create_access_token({"sub": new_user["email"], "role": new_user["role"]})
    return TokenResponse(
        access_token=token,
        user=UserOut(
            id=new_user["id"],
            name=new_user["name"],
            email=new_user["email"],
            role=new_user["role"],
            title=new_user["title"],
            phone=new_user["phone"],
            pan=new_user["pan"]
        )
    )

@router.get("/me", response_model=UserOut)
async def get_me(user: Dict[str, Any] = Depends(require_role(["donor", "volunteer", "field_lead", "ngo_admin", "platform_admin"]))):
    return UserOut(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        role=user["role"],
        title=user.get("title"),
        phone=user.get("phone"),
        pan=user.get("pan")
    )
