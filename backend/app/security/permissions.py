from typing import List
from fastapi import Depends, HTTPException, status
from app.middleware.auth import get_current_user

class RoleRequired:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: dict = Depends(get_current_user)) -> dict:
        """
        Validates user role against the list of allowed roles.
        """
        user_role = current_user.get("role")
        if user_role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: role must be one of {self.allowed_roles}"
            )
        return current_user

# Pre-instantiated helpers for clean usage:
student_required = RoleRequired(["student"])
admin_required = RoleRequired(["admin", "superadmin"])
authenticated = get_current_user
