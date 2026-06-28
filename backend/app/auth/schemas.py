import re
from pydantic import BaseModel, Field, field_validator
from typing import Optional
from app.student.schemas import StudentResponse

class StudentLoginRequest(BaseModel):
    email: str = Field(..., description="Student email address")
    password: str = Field(..., description="Student password")

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        if not re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", v):
            raise ValueError("Invalid email format")
        return v


class LoginResponse(BaseModel):
    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="JWT refresh token")
    token_type: str = Field("bearer", description="Token type")
    user: StudentResponse = Field(..., description="Student profile details")

class TokenRefreshRequest(BaseModel):
    refresh_token: str = Field(..., description="JWT refresh token")

class TokenRefreshResponse(BaseModel):
    access_token: str = Field(..., description="New JWT access token")
    refresh_token: str = Field(..., description="New JWT refresh token")
    token_type: str = Field("bearer", description="Token type")
