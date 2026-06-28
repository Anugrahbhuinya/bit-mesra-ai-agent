from typing import Optional, Dict, Any
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

class PreferencesRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db.student_preferences

    async def get_preferences(self, student_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves preference document matching a student ID.
        """
        return await self.collection.find_one({"student_id": student_id})

    async def create_preferences(self, student_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Creates preference document in the collection.
        """
        data["student_id"] = student_id
        result = await self.collection.insert_one(data)
        data["_id"] = result.inserted_id
        return data

    async def update_preferences(self, student_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Performs updates to a student's preference settings.
        """
        await self.collection.update_one(
            {"student_id": student_id},
            {"$set": data}
        )
        return await self.get_preferences(student_id)

    async def delete_preferences(self, student_id: str) -> bool:
        """
        Permanently revokes a student's preference profile.
        """
        result = await self.collection.delete_one({"student_id": student_id})
        return result.deleted_count > 0
