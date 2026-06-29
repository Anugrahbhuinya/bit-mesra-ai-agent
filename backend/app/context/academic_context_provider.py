from typing import Dict, Any
from app.repositories.academic_repository import AcademicRepository

class AcademicContextProvider:
    def __init__(self, repo: AcademicRepository):
        self.repo = repo

    async def get_context(self, student_id: str) -> Dict[str, Any]:
        """Loads and returns details of the student's initialized academic workspace."""
        workspace = await self.repo.find_by_student_id(student_id)
        if not workspace:
            return {
                "initialized": False,
                "semester": None,
                "department": None,
                "section": None,
                "academic_year": None
            }

        return {
            "initialized": workspace.get("initialized", False),
            "semester": workspace.get("semester"),
            "department": workspace.get("department"),
            "section": workspace.get("section"),
            "academic_year": workspace.get("academic_year")
        }
