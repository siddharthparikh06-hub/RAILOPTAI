from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.db.schemas import LoginRequest, TokenResponse, UserProfile
from app.core.security import create_access_token, decode_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)) -> UserProfile:
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return UserProfile(
        employee_id=payload.get("sub", "CONTROL001"),
        name=payload.get("name", "Demo Control Officer"),
        department=payload.get("department", "Operations Control Office"),
        role=payload.get("role", "Control Officer")
    )

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest):
    # Accept CONTROL001 demo user or any valid credentials for SIH demo
    if request.employee_id.upper() == "CONTROL001" and request.password in ["demo123", "password", "demo"]:
        user_profile = UserProfile(
            employee_id="CONTROL001",
            name="Demo Control Officer",
            department="Operations Control Office",
            role="Control Officer"
        )
        token = create_access_token(
            subject=user_profile.employee_id,
            claims={
                "name": user_profile.name,
                "department": user_profile.department,
                "role": user_profile.role
            }
        )
        return TokenResponse(access_token=token, token_type="bearer", user=user_profile)
    
    # Generic fallback token for demo user testing
    user_profile = UserProfile(
        employee_id=request.employee_id,
        name=f"Officer {request.employee_id}",
        department="Operations Control Office",
        role="Control Officer"
    )
    token = create_access_token(
        subject=user_profile.employee_id,
        claims={
            "name": user_profile.name,
            "department": user_profile.department,
            "role": user_profile.role
        }
    )
    return TokenResponse(access_token=token, token_type="bearer", user=user_profile)

@router.post("/logout")
def logout():
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserProfile)
def read_current_user(current_user: UserProfile = Depends(get_current_user)):
    return current_user
