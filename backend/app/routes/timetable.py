from fastapi import APIRouter, Depends, UploadFile, File, status, HTTPException
from typing import Dict, Any, List
from app.core.database import get_database

# Schemas and Models
from app.models.timetable import (
    TimetableResponseSchema,
    WeeklyGroupedTimetableResponse,
    ClassEntryResponseSchema,
    ClassEntryCreateRequest,
    ClassEntryUpdateRequest,
    TimetableConfirmRequest
)

# Repository & Service
from app.repositories.timetable_repository import TimetableRepository
from app.services.timetable_service import TimetableService
from app.services.timetable_import_service import TimetableImportService

# Middleware
from app.middleware.auth import get_current_student

router = APIRouter(prefix="/api/timetable", tags=["timetable"])

def get_timetable_repo() -> TimetableRepository:
    return TimetableRepository(get_database())

@router.get("", response_model=TimetableResponseSchema)
async def get_timetable(
    current_student: dict = Depends(get_current_student),
    repo: TimetableRepository = Depends(get_timetable_repo)
):
    """
    Retrieves the authenticated student's complete timetable. Creates one if missing.
    """
    service = TimetableService(repo)
    return await service.get_or_create_timetable(current_student["_id"], current_student)

@router.get("/week", response_model=WeeklyGroupedTimetableResponse)
async def get_grouped_week_timetable(
    current_student: dict = Depends(get_current_student),
    repo: TimetableRepository = Depends(get_timetable_repo)
):
    """
    Returns the student's timetable grouped by weekday, sorted by class start time.
    """
    service = TimetableService(repo)
    return await service.get_week_grouped_timetable(current_student["_id"], current_student)

@router.get("/today", response_model=List[ClassEntryResponseSchema])
async def get_today_timetable(
    current_student: dict = Depends(get_current_student),
    repo: TimetableRepository = Depends(get_timetable_repo)
):
    """
    Returns today's active schedule for the student, sorted by start time.
    """
    service = TimetableService(repo)
    return await service.get_today_classes_list(current_student["_id"])

@router.post("", response_model=TimetableResponseSchema)
async def add_class_entry(
    payload: ClassEntryCreateRequest,
    current_student: dict = Depends(get_current_student),
    repo: TimetableRepository = Depends(get_timetable_repo)
):
    """
    Adds a new manual class entry to the student's timetable after checking for timing overlaps.
    """
    service = TimetableService(repo)
    return await service.add_class_entry(current_student["_id"], current_student, payload)

@router.put("/{entry_id}", response_model=TimetableResponseSchema)
async def update_class_entry(
    entry_id: str,
    payload: ClassEntryUpdateRequest,
    current_student: dict = Depends(get_current_student),
    repo: TimetableRepository = Depends(get_timetable_repo)
):
    """
    Modifies an existing class entry in the student's timetable. Enforces overlap validation.
    """
    service = TimetableService(repo)
    return await service.update_class_entry(current_student["_id"], current_student, entry_id, payload)

@router.delete("/{entry_id}", response_model=TimetableResponseSchema)
async def delete_class_entry(
    entry_id: str,
    current_student: dict = Depends(get_current_student),
    repo: TimetableRepository = Depends(get_timetable_repo)
):
    """
    Removes a class entry from the student's timetable.
    """
    service = TimetableService(repo)
    return await service.delete_class_entry(current_student["_id"], current_student, entry_id)

@router.post("/import")
async def import_timetable_file(
    file: UploadFile = File(...),
    current_student: dict = Depends(get_current_student)
):
    """
    Uploads a timetable document (PDF, PNG, JPEG, JPG) and runs Gemini Flash Vision
    to extract structured class schedule preview rows. No DB saving is done yet.
    """
    allowed_mime_types = {
        "application/pdf", 
        "image/png", 
        "image/jpeg", 
        "image/jpg"
    }
    
    if file.content_type not in allowed_mime_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file type. Please upload a PDF, PNG, or JPEG/JPG image."
        )

    file_bytes = await file.read()
    extracted_classes = await TimetableImportService.extract_timetable(file_bytes, file.content_type)
    
    return {
        "status": "success",
        "classes": extracted_classes
    }

@router.post("/confirm", response_model=TimetableResponseSchema)
async def confirm_imported_timetable(
    payload: TimetableConfirmRequest,
    current_student: dict = Depends(get_current_student),
    repo: TimetableRepository = Depends(get_timetable_repo)
):
    """
    Saves the student-reviewed and confirmed timetable list of classes to MongoDB,
    completely replacing any existing timetable items.
    """
    service = TimetableService(repo)
    return await service.confirm_timetable(current_student["_id"], current_student, payload.classes)
