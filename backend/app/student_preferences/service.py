from datetime import datetime, timezone
from fastapi import HTTPException, status
from typing import Dict, Any, Optional

from app.student_preferences.repository import PreferencesRepository
from app.student_preferences.models import StudentPreferencesModel
from app.student_preferences.schemas import (
    StudentPreferencesUpdateRequest,
    StudentPreferencesPartialUpdateRequest
)

class PreferencesService:
    def __init__(self, repo: PreferencesRepository):
        self.repo = repo

    async def get_preferences(self, student_id: str) -> Dict[str, Any]:
        """
        Retrieves student preferences. Creates default settings dynamically if not found (self-healing).
        """
        pref = await self.repo.get_preferences(student_id)
        if not pref:
            # Self-healing setup
            pref = await self.create_default_preferences(student_id)
        return pref

    async def create_default_preferences(self, student_id: str) -> Dict[str, Any]:
        """
        Creates and stores default settings document.
        """
        # Ensure we don't duplicate existing settings
        existing = await self.repo.get_preferences(student_id)
        if existing:
            return existing

        default_model = StudentPreferencesModel(student_id=student_id)
        return await self.repo.create_preferences(student_id, default_model.to_dict())

    async def update_preferences(
        self,
        student_id: str,
        request: StudentPreferencesUpdateRequest
    ) -> Dict[str, Any]:
        """
        Updates the full preference settings block.
        """
        # Ensure profile exists
        pref = await self.get_preferences(student_id)

        update_data = {
            "preferred_language": request.preferred_language,
            "theme": request.theme,
            "notifications": request.notifications.dict(),
            "ai_response_style": request.ai_response_style,
            "default_home_page": request.default_home_page,
            "updated_at": datetime.now(timezone.utc)
        }

        updated = await self.repo.update_preferences(student_id, update_data)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update student preferences"
            )
        return updated

    async def partial_update_preferences(
        self,
        student_id: str,
        request: StudentPreferencesPartialUpdateRequest
    ) -> Dict[str, Any]:
        """
        Partially updates provided settings, performing deep-merges on nested notification settings.
        """
        existing = await self.get_preferences(student_id)

        update_data: Dict[str, Any] = {
            "updated_at": datetime.now(timezone.utc)
        }

        if request.preferred_language is not None:
            update_data["preferred_language"] = request.preferred_language
        if request.theme is not None:
            update_data["theme"] = request.theme
        if request.ai_response_style is not None:
            update_data["ai_response_style"] = request.ai_response_style
        if request.default_home_page is not None:
            update_data["default_home_page"] = request.default_home_page

        # Handle deep-merge of notifications setting
        if request.notifications is not None:
            existing_notifications = existing.get("notifications") or {}
            # Merge existing attributes with partial update payload
            merged_notifications = {**existing_notifications}
            for k, v in request.notifications.items():
                if isinstance(v, bool):
                    merged_notifications[k] = v
            update_data["notifications"] = merged_notifications

        # Handle any dynamic extra properties in model_extra (future compatibility)
        if request.model_extra:
            for extra_key, extra_value in request.model_extra.items():
                update_data[extra_key] = extra_value

        updated = await self.repo.update_preferences(student_id, update_data)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to partially update student preferences"
            )
        return updated

    async def reset_preferences(self, student_id: str) -> Dict[str, Any]:
        """
        Resets all preferences back to system defaults.
        """
        # Ensure settings record exists
        await self.get_preferences(student_id)

        default_model = StudentPreferencesModel(student_id=student_id)
        default_dict = default_model.to_dict()
        # Keep created_at intact, update updated_at
        del default_dict["created_at"]

        updated = await self.repo.update_preferences(student_id, default_dict)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to reset student preferences"
            )
        return updated
