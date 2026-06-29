from fastapi import APIRouter, Depends, status, HTTPException
from typing import Dict, Any, List

from app.core.database import get_database
from app.repositories.attendance_repository import AttendanceRepository
from app.repositories.timetable_repository import TimetableRepository
from app.services.attendance_service import AttendanceService

# Schemas
from app.models.attendance import (
    AttendanceRecordResponseSchema,
    AttendanceLogResponseSchema,
    DashboardSummaryResponseSchema,
    AttendanceAnalyticsResponseSchema,
    AttendanceLogCreateRequest,
    AttendanceLogUpdateRequest
)

# Authentication Middleware
from app.middleware.auth import get_current_student

router = APIRouter(prefix="/api/attendance", tags=["attendance"])

def get_attendance_service() -> AttendanceService:
    db = get_database()
    repo = AttendanceRepository(db)
    timetable_repo = TimetableRepository(db)
    return AttendanceService(repo, timetable_repo)

@router.get("", response_model=List[AttendanceRecordResponseSchema])
async def get_attendance_records(
    current_student: dict = Depends(get_current_student),
    service: AttendanceService = Depends(get_attendance_service)
):
    """Retrieves all course attendance records for the authenticated student."""
    return await service.get_all_records(current_student["_id"], current_student)

@router.get("/summary", response_model=DashboardSummaryResponseSchema)
async def get_attendance_summary(
    current_student: dict = Depends(get_current_student),
    service: AttendanceService = Depends(get_attendance_service)
):
    """Retrieves the overall, weekly/monthly summary, and today's schedule logging details."""
    return await service.get_dashboard_summary(current_student["_id"], current_student)

@router.get("/history/{subject_id}", response_model=List[AttendanceLogResponseSchema])
async def get_subject_attendance_history(
    subject_id: str,
    current_student: dict = Depends(get_current_student),
    service: AttendanceService = Depends(get_attendance_service)
):
    """Retrieves the detailed class-by-class attendance logs for a specific subject."""
    return await service.get_history(current_student["_id"], subject_id)

@router.post("/log", response_model=AttendanceRecordResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_attendance_log(
    payload: AttendanceLogCreateRequest,
    current_student: dict = Depends(get_current_student),
    service: AttendanceService = Depends(get_attendance_service)
):
    """Creates a class attendance log entry. Enforces duplicate checking, future checks, and triggers stats recalculation."""
    return await service.create_log(current_student["_id"], current_student, payload)

@router.put("/log/{log_id}", response_model=AttendanceRecordResponseSchema)
async def update_attendance_log(
    log_id: str,
    payload: AttendanceLogUpdateRequest,
    current_student: dict = Depends(get_current_student),
    service: AttendanceService = Depends(get_attendance_service)
):
    """Modifies details on a historical class attendance entry and updates total stats."""
    return await service.update_log(current_student["_id"], log_id, payload)

@router.delete("/log/{log_id}", response_model=AttendanceRecordResponseSchema)
async def delete_attendance_log(
    log_id: str,
    current_student: dict = Depends(get_current_student),
    service: AttendanceService = Depends(get_attendance_service)
):
    """Deletes an attendance log, restoring cumulative stats automatically."""
    return await service.delete_log(current_student["_id"], log_id)

@router.get("/analytics", response_model=AttendanceAnalyticsResponseSchema)
async def get_attendance_analytics(
    current_student: dict = Depends(get_current_student),
    service: AttendanceService = Depends(get_attendance_service)
):
    """Compiles statistics for trends and distribution charts."""
    return await service.get_analytics(current_student["_id"])
