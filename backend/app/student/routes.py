from fastapi import APIRouter, Depends, UploadFile, File, Query, status, HTTPException
from typing import Optional
from app.core.database import get_database

# Schemas
from app.student.schemas import (
    StudentResponse,
    StudentProfileUpdateRequest,
    PasswordChangeRequest,
    AdminPasswordResetRequest,
    AdminStudentUpdateRequest,
    StudentListResponse
)

# Repository
from app.student.repository import StudentRepository

# Services
from app.student.service import ProfileService, StudentManagementService

# Authorization / Middleware Dependencies
from app.middleware.auth import get_current_student, get_current_user
from app.security.permissions import admin_required

router = APIRouter()

# Dependency providers
def get_student_repo() -> StudentRepository:
    return StudentRepository(get_database())

# ==============================================================================
# STUDENT PROFILE API (Prefix: /api/student)
# ==============================================================================

@router.get("/api/student/profile", response_model=StudentResponse)
async def get_profile(
    current_student: dict = Depends(get_current_student)
):
    """
    Retrieves the authenticated student's profile.
    """
    return current_student

@router.put("/api/student/profile", response_model=StudentResponse)
async def update_profile(
    request_data: StudentProfileUpdateRequest,
    current_student: dict = Depends(get_current_student),
    student_repo: StudentRepository = Depends(get_student_repo)
):
    """
    Updates the student's profile (name, email) with uniqueness checks.
    """
    service = ProfileService(student_repo)
    return await service.update_student_profile(current_student["_id"], request_data)

@router.patch("/api/student/profile-picture")
async def upload_picture(
    file: UploadFile = File(...),
    current_student: dict = Depends(get_current_student),
    student_repo: StudentRepository = Depends(get_student_repo)
):
    """
    Uploads and validates a student profile picture. Returns the public relative image URL.
    """
    service = ProfileService(student_repo)
    pic_url = await service.update_profile_picture(current_student["_id"], file)
    return {
        "status": "success",
        "message": "Profile picture updated successfully",
        "profile_picture": pic_url
    }

@router.patch("/api/student/change-password")
async def change_password(
    request_data: PasswordChangeRequest,
    current_student: dict = Depends(get_current_student),
    student_repo: StudentRepository = Depends(get_student_repo)
):
    """
    Modifies the student's password after validating their existing password.
    """
    service = ProfileService(student_repo)
    await service.change_student_password(
        student_id=current_student["_id"],
        current_pwd=request_data.current_password,
        new_pwd=request_data.new_password
    )
    return {
        "status": "success",
        "message": "Password changed successfully"
    }

@router.get("/api/student/account")
async def get_account_status(
    current_student: dict = Depends(get_current_student)
):
    """
    Retrieves the student's current account status details.
    """
    return {
        "roll_number": current_student.get("roll_number"),
        "name": current_student.get("name"),
        "email": current_student.get("email"),
        "role": current_student.get("role"),
        "status": current_student.get("status")
    }

# ==============================================================================
# ADMIN STUDENT MANAGEMENT API (Prefix: /api/admin/students)
# ==============================================================================

@router.get("/api/admin/students", response_model=StudentListResponse)
async def admin_list_students(
    search: Optional[str] = Query(None, description="Search by name, roll number, or email"),
    department: Optional[str] = Query(None, description="Filter by department"),
    program: Optional[str] = Query(None, description="Filter by program"),
    year: Optional[int] = Query(None, description="Filter by year"),
    semester: Optional[int] = Query(None, description="Filter by semester"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Records per page"),
    current_admin: dict = Depends(admin_required),
    student_repo: StudentRepository = Depends(get_student_repo)
):
    """
    Retrieves a paginated list of students with filters and search query. Protected by Admin role.
    """
    service = StudentManagementService(student_repo)
    return await service.list_students(
        search=search,
        department=department,
        program=program,
        year=year,
        semester=semester,
        page=page,
        limit=limit
    )

@router.get("/api/admin/students/{student_id}", response_model=StudentResponse)
async def admin_get_student(
    student_id: str,
    current_admin: dict = Depends(admin_required),
    student_repo: StudentRepository = Depends(get_student_repo)
):
    """
    Retrieves detailed profile data for a specific student. Protected by Admin role.
    """
    service = StudentManagementService(student_repo)
    return await service.get_student_by_id(student_id)

@router.put("/api/admin/students/{student_id}", response_model=StudentResponse)
async def admin_update_student(
    student_id: str,
    request_data: AdminStudentUpdateRequest,
    current_admin: dict = Depends(admin_required),
    student_repo: StudentRepository = Depends(get_student_repo)
):
    """
    Modifies student details administratively (name, email, roll number, academics, status). Protected by Admin role.
    """
    service = StudentManagementService(student_repo)
    return await service.update_student_academics(student_id, request_data)

@router.patch("/api/admin/students/{student_id}/status")
async def admin_update_student_status(
    student_id: str,
    status_payload: dict,
    current_admin: dict = Depends(admin_required),
    student_repo: StudentRepository = Depends(get_student_repo)
):
    """
    Administratively toggles a student's active status (active, inactive, suspended). Protected by Admin role.
    """
    status_str = status_payload.get("status")
    if not status_str or status_str.lower() not in {"active", "inactive", "suspended"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be active, inactive, or suspended"
        )
        
    service = StudentManagementService(student_repo)
    updated = await service.update_student_status(student_id, status_str.lower())
    return {
        "status": "success",
        "message": f"Student status changed to {status_str} successfully",
        "student": updated
    }

@router.post("/api/admin/students/{student_id}/reset-password")
async def admin_reset_student_password(
    student_id: str,
    password_payload: AdminPasswordResetRequest,
    current_admin: dict = Depends(admin_required),
    student_repo: StudentRepository = Depends(get_student_repo)
):
    """
    Administratively overwrites a student's password. Protected by Admin role.
    """
    service = StudentManagementService(student_repo)
    await service.reset_student_password(student_id, password_payload.new_password)
    return {
        "status": "success",
        "message": "Student password reset successfully"
    }

@router.delete("/api/admin/students/{student_id}")
async def admin_delete_student(
    student_id: str,
    current_admin: dict = Depends(admin_required),
    student_repo: StudentRepository = Depends(get_student_repo)
):
    """
    Soft-deletes the student profile. Protected by Admin role.
    """
    service = StudentManagementService(student_repo)
    success = await service.soft_delete_student(student_id)
    if not success:
         raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete student: record not found or already deleted"
        )
    return {
        "status": "success",
        "message": "Student account soft-deleted successfully"
    }
