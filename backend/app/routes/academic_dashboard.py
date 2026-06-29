from fastapi import APIRouter, Depends, status, HTTPException
from typing import Dict, Any

from app.core.database import get_database
from app.repositories.timetable_repository import TimetableRepository
from app.repositories.attendance_repository import AttendanceRepository
from app.repositories.planner_repository import PlannerRepository

from app.services.timetable_service import TimetableService
from app.services.attendance_service import AttendanceService
from app.services.planner_service import PlannerService
from app.services.timeline_service import TimelineService
from app.services.academic_dashboard_service import AcademicDashboardService

# Authentication
from app.middleware.auth import get_current_student

router = APIRouter(prefix="/api/academics", tags=["academic_dashboard"])

def get_academic_dashboard_service() -> AcademicDashboardService:
    db = get_database()
    
    # Repositories
    timetable_repo = TimetableRepository(db)
    attendance_repo = AttendanceRepository(db)
    planner_repo = PlannerRepository(db)
    
    # Services
    timetable_service = TimetableService(timetable_repo)
    attendance_service = AttendanceService(attendance_repo, timetable_repo)
    planner_service = PlannerService(planner_repo)
    timeline_service = TimelineService(timetable_repo, attendance_repo, planner_repo)
    
    return AcademicDashboardService(
        timetable_service,
        attendance_service,
        planner_service,
        timeline_service
    )

@router.get("/dashboard", response_model=Dict[str, Any])
async def get_academic_dashboard(
    current_student: dict = Depends(get_current_student),
    service: AcademicDashboardService = Depends(get_academic_dashboard_service)
):
    """
    Returns the compiled unified dashboard response containing today's classes,
    attendance summary, upcoming exams, planner metrics, and academic insights.
    """
    try:
        # Resolve student profile fields (e.g. branch, semester)
        student_profile = current_student.get("profile", {})
        if not student_profile:
            student_profile = {
                "branch": current_student.get("branch", "CSE"),
                "semester": current_student.get("semester", 1)
            }
        return await service.get_dashboard_data(current_student["_id"], student_profile)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate academic dashboard: {str(e)}"
        )
