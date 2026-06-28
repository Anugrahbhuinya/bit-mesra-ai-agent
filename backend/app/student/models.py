from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Student(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    roll_number: str = Field(..., description="Unique roll number of the student")
    name: str = Field(..., description="Full name of the student")
    email: str = Field(..., description="Unique email address of the student")
    password_hash: str = Field(..., description="Bcrypt hash of the student's password")
    department: str = Field(..., description="Department of the student")
    program: str = Field(..., description="Program (e.g., B.Tech, M.Tech, MCA)")
    year: int = Field(..., description="Academic year")
    semester: int = Field(..., description="Academic semester")
    section: str = Field(..., description="Section name")
    profile_picture: Optional[str] = Field(None, description="Optional profile picture URL")
    role: str = Field("student", description="Default role is student")
    status: str = Field("active", description="Default status is active")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
