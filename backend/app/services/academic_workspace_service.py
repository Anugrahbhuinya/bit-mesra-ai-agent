from datetime import datetime, timezone
from fastapi import HTTPException, status
from typing import Dict, Any, Optional

from app.repositories.academic_repository import AcademicRepository
from app.models.academic_workspace import AcademicWorkspaceModel, AcademicWorkspaceInitializeRequest

class AcademicWorkspaceService:
    def __init__(self, repo: AcademicRepository):
        self.repo = repo

    async def get_or_create_workspace(self, student_id: str, student_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Gets the academic workspace. Creates one automatically using student profile fields if not found.
        """
        workspace = await self.repo.find_by_student_id(student_id)
        if not workspace:
            # Create a new workspace, auto-filling details from the student profile
            # but setting initialized to False until they verify/complete it.
            semester = student_profile.get("semester")
            department = student_profile.get("department")
            section = student_profile.get("section")
            # Map student year (int) to academic_year
            academic_year = student_profile.get("year")

            model = AcademicWorkspaceModel(
                student_id=student_id,
                semester=semester,
                department=department,
                section=section,
                academic_year=academic_year,
                initialized=False  # Must start as false as per requirements
            )
            workspace = await self.repo.create(model.to_dict())
        
        return workspace

    async def initialize_workspace(
        self, 
        student_id: str, 
        request: AcademicWorkspaceInitializeRequest
    ) -> Dict[str, Any]:
        """
        Initializes academic workspace and marks initialized = True.
        """
        workspace = await self.repo.find_by_student_id(student_id)
        if not workspace:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Academic workspace not found"
            )

        update_data = {
            "semester": request.semester,
            "department": request.department,
            "section": request.section,
            "academic_year": request.academic_year,
            "initialized": True,
            "updated_at": datetime.now(timezone.utc)
        }

        updated = await self.repo.update(student_id, update_data)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to initialize academic workspace"
            )
        return updated

    async def update_workspace(
        self,
        student_id: str,
        update_fields: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Updates basic academic workspace information.
        """
        workspace = await self.repo.find_by_student_id(student_id)
        if not workspace:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Academic workspace not found"
            )

        update_fields["updated_at"] = datetime.now(timezone.utc)
        updated = await self.repo.update(student_id, update_fields)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update academic workspace"
            )
        return updated
