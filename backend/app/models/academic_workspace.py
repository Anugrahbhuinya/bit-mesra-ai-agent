from datetime import datetime, timezone
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field, ConfigDict

class AcademicWorkspaceModel:
    def __init__(
        self,
        student_id: str,
        semester: Optional[int] = None,
        department: Optional[str] = None,
        section: Optional[str] = None,
        academic_year: Optional[int] = None,
        initialized: bool = False
    ):
        self.student_id = student_id
        self.semester = semester
        self.department = department
        self.section = section
        self.academic_year = academic_year
        self.initialized = initialized
        self.created_at = datetime.now(timezone.utc)
        self.updated_at = datetime.now(timezone.utc)

    def to_dict(self) -> Dict[str, Any]:
        """
        Serializes model instance properties into a MongoDB-ready dictionary.
        """
        return {
            "student_id": self.student_id,
            "semester": self.semester,
            "department": self.department,
            "section": self.section,
            "academic_year": self.academic_year,
            "initialized": self.initialized,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

class AcademicWorkspaceResponseSchema(BaseModel):
    student_id: str = Field(..., description="ID of the student")
    semester: Optional[int] = Field(None, description="Current semester")
    department: Optional[str] = Field(None, description="Department of study")
    section: Optional[str] = Field(None, description="Section code")
    academic_year: Optional[int] = Field(None, description="Academic year")
    initialized: bool = Field(False, description="Is workspace initialized")
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={
            datetime: lambda v: v.isoformat()
        }
    )

class AcademicWorkspaceApiResponse(BaseModel):
    workspace: AcademicWorkspaceResponseSchema
    initialized: bool

class AcademicWorkspaceInitializeRequest(BaseModel):
    semester: int = Field(..., ge=1, le=10, description="Semester code (1-10)")
    department: str = Field(..., min_length=2, description="Department of study")
    section: str = Field(..., min_length=1, description="Section code")
    academic_year: int = Field(..., ge=1, le=5, description="Academic year (1-5)")
