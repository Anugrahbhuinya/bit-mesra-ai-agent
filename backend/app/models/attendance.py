from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
import uuid

# MongoDB Database Models
class AttendanceRecordModel:
    def __init__(
        self,
        student_id: str,
        subject_id: str,
        subject_name: str,
        faculty: str,
        semester: int,
        section: str,
        department: str,
        total_conducted: int = 0,
        total_attended: int = 0,
        attendance_percentage: float = 100.0,
        safe_leaves: int = 0,
        required_classes: int = 0,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None
    ):
        self.student_id = student_id
        self.subject_id = subject_id
        self.subject_name = subject_name
        self.faculty = faculty
        self.semester = semester
        self.section = section
        self.department = department
        self.total_conducted = total_conducted
        self.total_attended = total_attended
        self.attendance_percentage = attendance_percentage
        self.safe_leaves = safe_leaves
        self.required_classes = required_classes
        self.created_at = created_at or datetime.now(timezone.utc)
        self.updated_at = updated_at or datetime.now(timezone.utc)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "student_id": self.student_id,
            "subject_id": self.subject_id,
            "subject_name": self.subject_name,
            "faculty": self.faculty,
            "semester": self.semester,
            "section": self.section,
            "department": self.department,
            "total_conducted": self.total_conducted,
            "total_attended": self.total_attended,
            "attendance_percentage": self.attendance_percentage,
            "safe_leaves": self.safe_leaves,
            "required_classes": self.required_classes,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

class AttendanceLogModel:
    def __init__(
        self,
        attendance_record_id: str,
        class_date: str,  # YYYY-MM-DD
        status: str,      # Present, Absent, Cancelled, Holiday, Medical Leave
        remarks: Optional[str] = None,
        log_id: Optional[str] = None,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None
    ):
        self.id = log_id or str(uuid.uuid4())
        self.attendance_record_id = attendance_record_id
        self.class_date = class_date
        self.status = status
        self.remarks = remarks or ""
        self.created_at = created_at or datetime.now(timezone.utc)
        self.updated_at = updated_at or datetime.now(timezone.utc)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "attendance_record_id": self.attendance_record_id,
            "class_date": self.class_date,
            "status": self.status,
            "remarks": self.remarks,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

# Response Schemas (Pydantic)
class AttendanceLogResponseSchema(BaseModel):
    id: str
    attendance_record_id: str
    class_date: str
    status: str
    remarks: Optional[str] = ""
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={datetime: lambda v: v.isoformat()}
    )

class AttendanceRecordResponseSchema(BaseModel):
    id: str = Field(..., alias="_id")
    student_id: str
    subject_id: str
    subject_name: str
    faculty: str
    semester: int
    section: str
    department: str
    total_conducted: int
    total_attended: int
    attendance_percentage: float
    safe_leaves: int
    required_classes: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={datetime: lambda v: v.isoformat()}
    )

# Dashboard & Analytics Schemas
class SubjectSummarySchema(BaseModel):
    subject_id: str
    subject_name: str
    faculty: str
    attendance_percentage: float
    total_conducted: int
    total_attended: int
    safe_leaves: int
    required_classes: int
    updated_at: datetime

class DashboardSummaryResponseSchema(BaseModel):
    overall_attendance: float
    total_conducted: int
    total_attended: int
    best_subject: Optional[SubjectSummarySchema] = None
    lowest_subject: Optional[SubjectSummarySchema] = None
    below_threshold_count: int
    recent_logs: List[Dict[str, Any]] = []
    today_attendance: List[Dict[str, Any]] = []
    weekly_summary: Dict[str, Any] = {}
    monthly_summary: Dict[str, Any] = {}

class AttendanceAnalyticsResponseSchema(BaseModel):
    weekly_trend: List[Dict[str, Any]] = []
    monthly_trend: List[Dict[str, Any]] = []
    subject_comparison: List[Dict[str, Any]] = []
    status_distribution: Dict[str, int] = {}
    average_attendance: float

# Request Schemas
class AttendanceLogCreateRequest(BaseModel):
    subject_name: str = Field(..., min_length=1, description="Name of the subject")
    class_date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$", description="Class date in YYYY-MM-DD format")
    status: str = Field(..., description="Present, Absent, Cancelled, Holiday, or Medical Leave")
    remarks: Optional[str] = Field(None, max_length=200, description="Optional remarks")

class AttendanceLogUpdateRequest(BaseModel):
    status: Optional[str] = Field(None, description="Present, Absent, Cancelled, Holiday, or Medical Leave")
    remarks: Optional[str] = Field(None, max_length=200, description="Optional remarks")
    class_date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$", description="Class date in YYYY-MM-DD format")
