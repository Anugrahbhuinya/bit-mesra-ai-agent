import re
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import datetime

class StudentBase(BaseModel):
    roll_number: str = Field(..., min_length=3, description="Unique roll number of the student")
    name: str = Field(..., min_length=2, description="Full name of the student")
    email: str = Field(..., description="Unique email address of the student")
    department: str = Field(..., description="Department of the student")
    program: str = Field(..., description="Program name (e.g. B.Tech)")
    year: int = Field(..., ge=1, le=5, description="Academic year (1-5)")
    semester: int = Field(..., ge=1, le=10, description="Academic semester (1-10)")
    section: str = Field(..., min_length=1, description="Section code (e.g. A, B)")
    profile_picture: Optional[str] = Field(None, description="Optional profile picture URL")

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        if not re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", v):
            raise ValueError("Invalid email format")
        return v

class StudentRegisterRequest(StudentBase):
    password: str = Field(..., min_length=6, description="Plaintext password, minimum 6 characters")

class StudentResponse(StudentBase):
    id: str = Field(..., alias="_id")
    role: str = "student"
    status: str = "active"  # "active", "inactive", "suspended"
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

# --- NEW PROFILE & MANAGEMENT SCHEMAS ---

class StudentProfileUpdateRequest(BaseModel):
    name: str = Field(..., min_length=2, description="Full name of the student")
    email: str = Field(..., description="Student email address")

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        if not re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", v):
            raise ValueError("Invalid email format")
        return v

class PasswordChangeRequest(BaseModel):
    current_password: str = Field(..., description="Existing plaintext password")
    new_password: str = Field(..., min_length=6, description="New plaintext password, minimum 6 characters")

class AdminPasswordResetRequest(BaseModel):
    new_password: str = Field(..., min_length=6, description="New administrative plaintext password, minimum 6 characters")

class AdminStudentUpdateRequest(BaseModel):
    roll_number: str = Field(..., min_length=3, description="Unique roll number")
    name: str = Field(..., min_length=2, description="Full name")
    email: str = Field(..., description="Unique email address")
    department: str = Field(..., description="Department")
    program: str = Field(..., description="Program (e.g. B.Tech)")
    year: int = Field(..., ge=1, le=5, description="Year (1-5)")
    semester: int = Field(..., ge=1, le=10, description="Semester (1-10)")
    section: str = Field(..., min_length=1, description="Section code")
    status: str = Field("active", description="Account status (active, inactive, suspended)")

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        if not re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", v):
            raise ValueError("Invalid email format")
        return v
        
    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        v = v.strip().lower()
        if v not in {"active", "inactive", "suspended"}:
            raise ValueError("Status must be active, inactive, or suspended")
        return v

class StudentListResponse(BaseModel):
    students: List[StudentResponse]
    total: int = Field(..., description="Total matching student count")
    page: int = Field(..., description="Current page number")
    limit: int = Field(..., description="Records per page")
    pages: int = Field(..., description="Total number of pages")
