from fastapi import APIRouter, Depends, status, HTTPException
from typing import List, Dict, Any

from app.core.database import get_database
from app.repositories.planner_repository import PlannerRepository
from app.repositories.timetable_repository import TimetableRepository
from app.repositories.attendance_repository import AttendanceRepository

from app.services.planner_service import PlannerService
from app.services.timeline_service import TimelineService

# Schemas
from app.models.planner import (
    PlannerTaskResponseSchema,
    TimelineEventResponseSchema,
    PlannerTaskCreateRequest,
    PlannerTaskUpdateRequest
)

# Authentication
from app.middleware.auth import get_current_student

router = APIRouter(prefix="/api/planner", tags=["planner"])

def get_planner_service() -> PlannerService:
    db = get_database()
    repo = PlannerRepository(db)
    return PlannerService(repo)

def get_timeline_service() -> TimelineService:
    db = get_database()
    timetable_repo = TimetableRepository(db)
    attendance_repo = AttendanceRepository(db)
    planner_repo = PlannerRepository(db)
    return TimelineService(timetable_repo, attendance_repo, planner_repo)

@router.get("/tasks", response_model=List[PlannerTaskResponseSchema])
async def get_planner_tasks(
    current_student: dict = Depends(get_current_student),
    service: PlannerService = Depends(get_planner_service)
):
    """Retrieves all tasks inside the student's planner."""
    return await service.get_tasks(current_student["_id"])

@router.post("/tasks", response_model=PlannerTaskResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_planner_task(
    payload: PlannerTaskCreateRequest,
    current_student: dict = Depends(get_current_student),
    service: PlannerService = Depends(get_planner_service)
):
    """Creates a new task in the student's planner."""
    return await service.create_task(current_student["_id"], payload)

@router.put("/tasks/{task_id}", response_model=PlannerTaskResponseSchema)
async def update_planner_task(
    task_id: str,
    payload: PlannerTaskUpdateRequest,
    current_student: dict = Depends(get_current_student),
    service: PlannerService = Depends(get_planner_service)
):
    """Updates fields on an existing planner task."""
    return await service.update_task(current_student["_id"], task_id, payload)

@router.delete("/tasks/{task_id}")
async def delete_planner_task(
    task_id: str,
    current_student: dict = Depends(get_current_student),
    service: PlannerService = Depends(get_planner_service)
):
    """Removes a planner task by ID."""
    return await service.delete_task(current_student["_id"], task_id)

@router.patch("/tasks/{task_id}/complete", response_model=PlannerTaskResponseSchema)
async def toggle_planner_task_complete(
    task_id: str,
    current_student: dict = Depends(get_current_student),
    service: PlannerService = Depends(get_planner_service)
):
    """Toggles completion status on a planner task."""
    return await service.toggle_task_completion(current_student["_id"], task_id)

@router.get("/timeline", response_model=List[TimelineEventResponseSchema])
async def get_academic_timeline(
    current_student: dict = Depends(get_current_student),
    service: TimelineService = Depends(get_timeline_service)
):
    """Generates the unified, aggregated chronological academic timeline."""
    return await service.generate_unified_timeline(current_student["_id"])

@router.get("/upcoming", response_model=List[TimelineEventResponseSchema])
async def get_upcoming_academic_events(
    current_student: dict = Depends(get_current_student),
    service: TimelineService = Depends(get_timeline_service)
):
    """Generates a filtered subset of upcoming timeline events starting from today."""
    return await service.get_upcoming_events(current_student["_id"])
