import jwt
from typing import Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from bson import ObjectId

from app.core.database import get_database
from app.auth.jwt_service import JWTService, SECRET_KEY, ALGORITHM
from app.student.repository import StudentRepository

# Standard Bearer auth header injection helper
security = HTTPBearer()

async def get_token_payload(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """
    Dependency to validate the Bearer token and return decoded JWT claims.
    """
    token = credentials.credentials
    try:
        payload = JWTService.decode_token(token)
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(payload: Dict[str, Any] = Depends(get_token_payload)) -> Dict[str, Any]:
    """
    Enforces authentication, resolves the type (student or admin), and retrieves the profile.
    """
    db = get_database()
    sub = payload.get("sub")
    role = payload.get("role")
    
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload is missing subject claim",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 1. Check if the token explicitly identifies as a student
    if role == "student":
        student_repo = StudentRepository(db)
        student = await student_repo.get_by_id(sub)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Student profile not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        if student.get("status") != "active":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Student profile is inactive",
            )
        student["_id"] = str(student["_id"])
        return student

    # 2. Check if the token identifies as an admin/superadmin
    elif role in ["admin", "superadmin"]:
        # Sub can be username or object ID depending on creation context
        admin = await db.admin_users.find_one({"username": sub})
        if not admin and ObjectId.is_valid(sub):
            admin = await db.admin_users.find_one({"_id": ObjectId(sub)})
            
        if not admin:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Admin user not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        admin["_id"] = str(admin["_id"])
        # Ensure role property is explicitly loaded
        if "role" not in admin:
            admin["role"] = "admin"
        return admin

    # 3. Fallback compatibility mode for legacy admin tokens (which contain subject only)
    else:
        # Check if subject matches an admin user in MongoDB
        admin = await db.admin_users.find_one({"username": sub})
        if admin:
            admin["_id"] = str(admin["_id"])
            if "role" not in admin:
                admin["role"] = "admin"
            return admin

        # If not, check if it's a student ID
        student_repo = StudentRepository(db)
        student = await student_repo.get_by_id(sub)
        if student:
            if student.get("status") != "active":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Student profile is inactive",
                )
            student["_id"] = str(student["_id"])
            return student

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not resolve user role from token",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_student(user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """
    Enforces student-only access.
    """
    if user.get("role") != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Student permissions required"
        )
    return user

async def get_current_admin_user(user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """
    Enforces admin-only access.
    """
    if user.get("role") not in ["admin", "superadmin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Admin permissions required"
        )
    return user

def require_authenticated(user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """
    Enforces that the user is authenticated (either student or admin).
    """
    return user
