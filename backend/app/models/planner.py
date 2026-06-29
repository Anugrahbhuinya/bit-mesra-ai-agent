from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict

# MongoDB Database Models
class PlannerTaskModel:
    def __init__(
        self,
        student_id: str,
        title: str,
        description: str,
        category: str,       # Study, Assignment, Revision, Exam, Meeting, Personal
        priority: str,       # High, Medium, Low
        due_date: str,       # YYYY-MM-DD
        due_time: Optional[str] = None,       # HH:MM (24-hour format)
        reminder_enabled: bool = False,
        reminder_time: Optional[str] = None,  # YYYY-MM-DD HH:MM or minutes before
        completed: bool = False,
        tags: Optional[List[str]] = None,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None
    ):
        self.student_id = student_id
        self.title = title
        self.description = description
        self.category = category
        self.priority = priority
        self.due_date = due_date
        self.due_time = due_time
        self.reminder_enabled = reminder_enabled
        self.reminder_time = reminder_time
        self.completed = completed
        self.tags = tags or []
        self.created_at = created_at or datetime.now(timezone.utc)
        self.updated_at = updated_at or datetime.now(timezone.utc)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "student_id": self.student_id,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "priority": self.priority,
            "due_date": self.due_date,
            "due_time": self.due_time,
            "reminder_enabled": self.reminder_enabled,
            "reminder_time": self.reminder_time,
            "completed": self.completed,
            "tags": self.tags,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

# Response Schemas (Pydantic)
class PlannerTaskResponseSchema(BaseModel):
    id: str = Field(..., alias="_id")
    student_id: str
    title: str
    description: str
    category: str
    priority: str
    due_date: str
    due_time: Optional[str] = None
    reminder_enabled: bool
    reminder_time: Optional[str] = None
    completed: bool
    tags: List[str] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={datetime: lambda v: v.isoformat()}
    )

# Timeline Event Response Schema
class TimelineEventResponseSchema(BaseModel):
    id: str
    title: str
    description: str
    type: str             # class, exam, quiz, holiday, registration, attendance_alert, task, custom
    date: str             # YYYY-MM-DD
    time: Optional[str] = None
    priority: Optional[str] = None
    completed: Optional[bool] = None
    category: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(
        populate_by_name=True
    )

# Request Schemas
class PlannerTaskCreateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=100, description="Task title")
    description: str = Field("", max_length=500, description="Task description")
    category: str = Field(..., description="Study, Assignment, Revision, Exam, Meeting, or Personal")
    priority: str = Field(..., description="High, Medium, or Low")
    due_date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$", description="Due date in YYYY-MM-DD format")
    due_time: Optional[str] = Field(None, pattern=r"^(\d{2}:\d{2})?$", description="Due time in HH:MM format")
    reminder_enabled: bool = Field(False, description="Enable reminders")
    reminder_time: Optional[str] = Field(None, description="Reminder timestamp or configuration")
    tags: Optional[List[str]] = Field(None, description="Optional tags list")

class PlannerTaskUpdateRequest(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    category: Optional[str] = Field(None)
    priority: Optional[str] = Field(None)
    due_date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    due_time: Optional[str] = Field(None, pattern=r"^(\d{2}:\d{2})?$")
    reminder_enabled: Optional[bool] = None
    reminder_time: Optional[str] = None
    completed: Optional[bool] = None
    tags: Optional[List[str]] = None
