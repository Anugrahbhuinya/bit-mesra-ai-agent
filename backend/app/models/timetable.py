from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
import uuid

class ClassEntryModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Unique ID of the class entry")
    day: str = Field(..., description="Day of the week (Monday, Tuesday, etc.)")
    subject: str = Field(..., min_length=2, description="Subject name")
    faculty: str = Field(..., min_length=2, description="Faculty member name")
    classroom: str = Field(..., description="Classroom location")
    building: Optional[str] = Field(None, description="Building name/code")
    start_time: str = Field(..., description="Start time in HH:MM format (24-hour)")
    end_time: str = Field(..., description="End time in HH:MM format (24-hour)")
    remarks: Optional[str] = Field(None, description="Optional remarks")

class TimetableModel:
    def __init__(
        self,
        student_id: str,
        semester: int,
        department: str,
        section: str,
        academic_year: int,
        classes: Optional[List[Dict[str, Any]]] = None
    ):
        self.student_id = student_id
        self.semester = semester
        self.department = department
        self.section = section
        self.academic_year = academic_year
        self.classes = classes or []
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
            "classes": self.classes,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

# Response Schemas
class ClassEntryResponseSchema(BaseModel):
    id: str
    day: str
    subject: str
    faculty: str
    classroom: str
    building: Optional[str] = None
    start_time: str
    end_time: str
    remarks: Optional[str] = None

class TimetableResponseSchema(BaseModel):
    student_id: str
    semester: int
    department: str
    section: str
    academic_year: int
    classes: List[ClassEntryResponseSchema]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={
            datetime: lambda v: v.isoformat()
        }
    )

class WeeklyGroupedTimetableResponse(BaseModel):
    Monday: List[ClassEntryResponseSchema] = []
    Tuesday: List[ClassEntryResponseSchema] = []
    Wednesday: List[ClassEntryResponseSchema] = []
    Thursday: List[ClassEntryResponseSchema] = []
    Friday: List[ClassEntryResponseSchema] = []
    Saturday: List[ClassEntryResponseSchema] = []

class ClassEntryCreateRequest(BaseModel):
    day: str = Field(..., description="Day of the week")
    subject: str = Field(..., min_length=2, description="Subject name")
    faculty: str = Field(..., min_length=2, description="Faculty member name")
    classroom: str = Field(..., description="Classroom location")
    building: Optional[str] = None
    start_time: str = Field(..., pattern=r"^\d{2}:\d{2}$", description="Start time (HH:MM)")
    end_time: str = Field(..., pattern=r"^\d{2}:\d{2}$", description="End time (HH:MM)")
    remarks: Optional[str] = None

class ClassEntryUpdateRequest(BaseModel):
    day: Optional[str] = None
    subject: Optional[str] = None
    faculty: Optional[str] = None
    classroom: Optional[str] = None
    building: Optional[str] = None
    start_time: Optional[str] = Field(None, pattern=r"^\d{2}:\d{2}$", description="Start time (HH:MM)")
    end_time: Optional[str] = Field(None, pattern=r"^\d{2}:\d{2}$", description="End time (HH:MM)")
    remarks: Optional[str] = None

class TimetableConfirmRequest(BaseModel):
    classes: List[ClassEntryCreateRequest] = Field(..., description="List of verified class entries to persist")
