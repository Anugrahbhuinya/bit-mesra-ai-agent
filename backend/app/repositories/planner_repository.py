from typing import List, Optional, Dict, Any
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

class PlannerRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db.planner_tasks

    async def get_by_id(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a single planner task by its MongoDB ObjectId string."""
        try:
            task = await self.collection.find_one({"_id": ObjectId(task_id)})
            if task:
                task["_id"] = str(task["_id"])
            return task
        except Exception:
            return None

    async def get_by_student(self, student_id: str) -> List[Dict[str, Any]]:
        """Retrieves all tasks for a student."""
        try:
            cursor = self.collection.find({"student_id": student_id}).sort("due_date", 1)
            tasks = []
            async for doc in cursor:
                doc["_id"] = str(doc["_id"])
                tasks.append(doc)
            return tasks
        except Exception:
            return []

    async def create(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Creates a new planner task in MongoDB."""
        result = await self.collection.insert_one(task_data)
        task_data["_id"] = str(result.inserted_id)
        return task_data

    async def update(self, task_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Updates a planner task's fields by ID."""
        try:
            await self.collection.update_one(
                {"_id": ObjectId(task_id)},
                {"$set": update_data}
            )
            return await self.get_by_id(task_id)
        except Exception:
            return None

    async def delete(self, task_id: str) -> bool:
        """Deletes a planner task by ID."""
        try:
            result = await self.collection.delete_one({"_id": ObjectId(task_id)})
            return result.deleted_count > 0
        except Exception:
            return False

    async def get_upcoming_by_student(self, student_id: str, start_date: str) -> List[Dict[str, Any]]:
        """Retrieves student tasks whose due_date is greater than or equal to start_date."""
        try:
            cursor = self.collection.find({
                "student_id": student_id,
                "due_date": {"$gte": start_date}
            }).sort("due_date", 1)
            tasks = []
            async for doc in cursor:
                doc["_id"] = str(doc["_id"])
                tasks.append(doc)
            return tasks
        except Exception:
            return []
