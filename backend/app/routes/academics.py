from fastapi import APIRouter, Depends, status
from app.core.database import get_database

# Schemas and Models
from app.models.academic_workspace import (
    AcademicWorkspaceApiResponse,
    AcademicWorkspaceInitializeRequest
)

# Repository & Service
from app.repositories.academic_repository import AcademicRepository
from app.services.academic_workspace_service import AcademicWorkspaceService

# Middleware
from app.middleware.auth import get_current_student

router = APIRouter(prefix="/api/academics", tags=["academics"])

def get_academic_repo() -> AcademicRepository:
    return AcademicRepository(get_database())

@router.get("/workspace", response_model=AcademicWorkspaceApiResponse)
async def get_workspace(
    current_student: dict = Depends(get_current_student),
    repo: AcademicRepository = Depends(get_academic_repo)
):
    """
    Fetches the academic workspace. Automatically creates one with student profile defaults if none exists.
    """
    service = AcademicWorkspaceService(repo)
    workspace = await service.get_or_create_workspace(current_student["_id"], current_student)
    
    # Return matched model payload
    return {
        "workspace": workspace,
        "initialized": workspace.get("initialized", False)
    }

@router.post("/workspace/initialize", response_model=AcademicWorkspaceApiResponse)
async def initialize_workspace(
    payload: AcademicWorkspaceInitializeRequest,
    current_student: dict = Depends(get_current_student),
    repo: AcademicRepository = Depends(get_academic_repo)
):
    """
    Verifies and initializes the student's academic workspace layout.
    """
    service = AcademicWorkspaceService(repo)
    # Ensure workspace exists (it will be created if not)
    await service.get_or_create_workspace(current_student["_id"], current_student)
    workspace = await service.initialize_workspace(current_student["_id"], payload)
    
    return {
        "workspace": workspace,
        "initialized": workspace.get("initialized", False)
    }

@router.get("/context")
async def get_academic_context_debug(
    current_student: dict = Depends(get_current_student)
):
    """
    Debug and development endpoint to retrieve the compiled academic context.
    """
    db = get_database()
    
    # Repos
    academic_repo = AcademicRepository(db)
    from app.repositories.timetable_repository import TimetableRepository
    from app.repositories.attendance_repository import AttendanceRepository
    from app.repositories.planner_repository import PlannerRepository
    
    timetable_repo = TimetableRepository(db)
    attendance_repo = AttendanceRepository(db)
    planner_repo = PlannerRepository(db)

    # Providers
    from app.context.student_context_provider import StudentContextProvider
    from app.context.academic_context_provider import AcademicContextProvider
    from app.context.timetable_context_provider import TimetableContextProvider
    from app.context.attendance_context_provider import AttendanceContextProvider
    from app.context.planner_context_provider import PlannerContextProvider
    from app.context.calendar_context_provider import CalendarContextProvider
    from app.services.academic_context_service import AcademicContextService

    service = AcademicContextService(
        StudentContextProvider(),
        AcademicContextProvider(academic_repo),
        TimetableContextProvider(timetable_repo),
        AttendanceContextProvider(attendance_repo),
        PlannerContextProvider(planner_repo),
        CalendarContextProvider()
    )

    ctx = await service.get_academic_context(current_student["_id"], current_student)
    formatted = service.format_context_to_string(ctx)
    
    return {
        "context_dict": ctx,
        "formatted_context_string": formatted
    }

