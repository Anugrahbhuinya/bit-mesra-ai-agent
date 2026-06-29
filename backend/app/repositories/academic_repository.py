from typing import Optional, Dict, Any
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

class AcademicRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db.academic_workspaces

    async def find_by_student_id(self, student_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves the academic workspace matching a student ID.
        """
        try:
            return await self.collection.find_one({"student_id": student_id})
        except Exception:
            return None

    async def create(self, workspace_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Creates an academic workspace document in the database.
        """
        result = await self.collection.insert_one(workspace_data)
        workspace_data["_id"] = result.inserted_id
        return workspace_data

    async def update(self, student_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Performs updates to an academic workspace document.
        """
        try:
            await self.collection.update_one(
                {"student_id": student_id},
                {"$set": update_data}
            )
            return await self.find_by_student_id(student_id)
        except Exception:
            return None
