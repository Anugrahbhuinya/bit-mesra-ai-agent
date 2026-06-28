from fastapi import APIRouter, Depends, status
from app.core.database import get_database

# Schemas
from app.student_preferences.schemas import (
    StudentPreferencesResponse,
    StudentPreferencesUpdateRequest,
    StudentPreferencesPartialUpdateRequest
)

# Repository
from app.student_preferences.repository import PreferencesRepository

# Service
from app.student_preferences.service import PreferencesService

# Middleware dependencies
from app.middleware.auth import get_current_student

router = APIRouter()

def get_preferences_repo() -> PreferencesRepository:
    return PreferencesRepository(get_database())

@router.get("/api/preferences", response_model=StudentPreferencesResponse)
async def get_preferences(
    current_student: dict = Depends(get_current_student),
    repo: PreferencesRepository = Depends(get_preferences_repo)
):
    """
    Fetches the authenticated student's personalized settings.
    """
    service = PreferencesService(repo)
    return await service.get_preferences(current_student["_id"])

@router.put("/api/preferences", response_model=StudentPreferencesResponse)
async def update_preferences(
    payload: StudentPreferencesUpdateRequest,
    current_student: dict = Depends(get_current_student),
    repo: PreferencesRepository = Depends(get_preferences_repo)
):
    """
    Replaces all student personalized preferences.
    """
    service = PreferencesService(repo)
    return await service.update_preferences(current_student["_id"], payload)

@router.patch("/api/preferences", response_model=StudentPreferencesResponse)
async def partial_update_preferences(
    payload: StudentPreferencesPartialUpdateRequest,
    current_student: dict = Depends(get_current_student),
    repo: PreferencesRepository = Depends(get_preferences_repo)
):
    """
    Partially modifies specified settings key-values (e.g. notifications toggle).
    """
    service = PreferencesService(repo)
    return await service.partial_update_preferences(current_student["_id"], payload)

@router.post("/api/preferences/reset", response_model=StudentPreferencesResponse)
async def reset_preferences(
    current_student: dict = Depends(get_current_student),
    repo: PreferencesRepository = Depends(get_preferences_repo)
):
    """
    Resets the student personalized preferences back to default system values.
    """
    service = PreferencesService(repo)
    return await service.reset_preferences(current_student["_id"])
