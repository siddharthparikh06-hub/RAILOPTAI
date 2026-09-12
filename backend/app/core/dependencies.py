from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import List, Callable
from app.core.security import decode_access_token
from app.db.schemas import UserProfile, UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)) -> UserProfile:
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    role_str = payload.get("role", "ENGINEERING")
    try:
        role_enum = UserRole(role_str)
    except ValueError:
        role_enum = UserRole.ENGINEERING

    return UserProfile(
        id=payload.get("id", "user-id-001"),
        employee_id=payload.get("sub", "ENG001"),
        name=payload.get("name", "Demo Officer"),
        department=payload.get("department", "Engineering / P-Way"),
        role=role_enum,
        is_active=True
    )

def require_role(*allowed_roles: UserRole):
    def role_checker(current_user: UserProfile = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: User role '{current_user.role.value}' does not have required permissions."
            )
        return current_user
    return role_checker

def verify_department_ownership(record_department: str, current_user: UserProfile):
    """
    Server-Side Departmental Authorization Check.
    Engineering users can only modify Engineering records.
    Traction users can only modify Traction records.
    S&T users can only modify S&T records.
    """
    user_dept = current_user.department.lower()
    rec_dept = record_department.lower()
    
    # Check departmental match
    if "engineering" in user_dept or "p-way" in user_dept:
        if "engineering" not in rec_dept and "p-way" not in rec_dept:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"RBAC Authorization Failed: Engineering users cannot modify {record_department} records."
            )
    elif "traction" in user_dept or "ohe" in user_dept or "trd" in user_dept:
        if "traction" not in rec_dept and "ohe" not in rec_dept and "trd" not in rec_dept:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"RBAC Authorization Failed: Traction users cannot modify {record_department} records."
            )
    elif "signal" in user_dept or "telecom" in user_dept or "s&t" in user_dept:
        if "signal" not in rec_dept and "telecom" not in rec_dept and "s&t" not in rec_dept:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"RBAC Authorization Failed: Signal & Telecom users cannot modify {record_department} records."
            )
