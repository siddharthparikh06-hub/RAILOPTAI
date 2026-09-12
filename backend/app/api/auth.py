from fastapi import APIRouter, Depends, HTTPException, status
from app.db.schemas import LoginRequest, TokenResponse, UserProfile, UserRole
from app.core.security import create_access_token
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

DEMO_USERS = {
    "ENG001": {
        "name": "Demo Engineering Officer",
        "department": "Engineering / P-Way",
        "role": UserRole.ENGINEERING,
        "password": "demo123"
    },
    "TRD001": {
        "name": "Demo Traction Officer",
        "department": "Traction Distribution / OHE",
        "role": UserRole.TRACTION,
        "password": "demo123"
    },
    "SNT001": {
        "name": "Demo Signal & Telecom Officer",
        "department": "Signal & Telecommunication / S&T",
        "role": UserRole.SIGNAL_TELECOM,
        "password": "demo123"
    },
    "CONTROL001": {
        "name": "Demo Control Officer",
        "department": "Operations Control Office",
        "role": UserRole.ENGINEERING,
        "password": "demo123"
    }
}

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest):
    emp_id = request.employee_id.upper()
    
    if emp_id in DEMO_USERS:
        u_info = DEMO_USERS[emp_id]
        if request.password in [u_info["password"], "demo", "password"]:
            profile = UserProfile(
                id=f"usr-{emp_id.lower()}",
                employee_id=emp_id,
                name=u_info["name"],
                department=u_info["department"],
                role=u_info["role"],
                is_active=True
            )
            token = create_access_token(
                subject=profile.employee_id,
                claims={
                    "id": profile.id,
                    "name": profile.name,
                    "department": profile.department,
                    "role": profile.role.value
                }
            )
            return TokenResponse(access_token=token, token_type="bearer", user=profile)

    # Dynamic account authentication for testing
    role = UserRole.ENGINEERING
    dept = "Engineering / P-Way"
    if "TRD" in emp_id or "TRACTION" in emp_id:
        role = UserRole.TRACTION
        dept = "Traction Distribution / OHE"
    elif "SNT" in emp_id or "SIGNAL" in emp_id:
        role = UserRole.SIGNAL_TELECOM
        dept = "Signal & Telecommunication / S&T"
        
    profile = UserProfile(
        id=f"usr-{emp_id.lower()}",
        employee_id=emp_id,
        name=f"Officer {emp_id}",
        department=dept,
        role=role,
        is_active=True
    )
    token = create_access_token(
        subject=profile.employee_id,
        claims={
            "id": profile.id,
            "name": profile.name,
            "department": profile.department,
            "role": profile.role.value
        }
    )
    return TokenResponse(access_token=token, token_type="bearer", user=profile)

@router.post("/logout")
def logout():
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserProfile)
def read_current_user(current_user: UserProfile = Depends(get_current_user)):
    return current_user
