from typing import Optional, Dict, Any
from motor.motor_asyncio import AsyncIOMotorDatabase

class TimetableRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db.timetables

    async def get_by_student_id(self, student_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves the timetable matching a student ID.
        """
        try:
            return await self.collection.find_one({"student_id": student_id})
        except Exception:
            return None

    async def create(self, timetable_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Inserts a new timetable document into MongoDB.
        """
        result = await self.collection.insert_one(timetable_data)
        timetable_data["_id"] = result.inserted_id
        return timetable_data

    async def update(self, student_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Performs updates to a student's timetable.
        """
        try:
            await self.collection.update_one(
                {"student_id": student_id},
                {"$set": update_data}
            )
            return await self.get_by_student_id(student_id)
        except Exception:
            return None
