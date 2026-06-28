from typing import Optional, Dict, Any, List
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

class StudentRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db.students

    async def create(self, student_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Inserts a new student document into MongoDB.
        """
        # Ensure is_deleted is initialized
        student_data["is_deleted"] = False
        result = await self.collection.insert_one(student_data)
        student_data["_id"] = result.inserted_id
        return student_data

    async def get_by_id(self, student_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves an active student by their ID.
        """
        try:
            if not ObjectId.is_valid(student_id):
                return None
            return await self.collection.find_one({"_id": ObjectId(student_id), "is_deleted": {"$ne": True}})
        except Exception:
            return None

    async def get_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves an active student by email.
        """
        return await self.collection.find_one({"email": email, "is_deleted": {"$ne": True}})

    async def get_by_roll_number(self, roll_number: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves an active student by roll number.
        """
        return await self.collection.find_one({"roll_number": roll_number, "is_deleted": {"$ne": True}})

    async def update(self, student_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Updates a student profile in MongoDB.
        """
        try:
            if not ObjectId.is_valid(student_id):
                return None
            await self.collection.update_one(
                {"_id": ObjectId(student_id)},
                {"$set": update_data}
            )
            return await self.get_by_id(student_id)
        except Exception:
            return None

    async def list_students(self, query: Dict[str, Any], skip: int = 0, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Retrieves a paginated list of students matching the query filters.
        """
        query["is_deleted"] = {"$ne": True}
        cursor = self.collection.find(query).skip(skip).limit(limit)
        return await cursor.to_list(length=limit)

    async def count_students(self, query: Dict[str, Any]) -> int:
        """
        Counts students matching query filters.
        """
        query["is_deleted"] = {"$ne": True}
        return await self.collection.count_documents(query)

    async def update_profile(self, student_id: str, profile_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Updates allowed student profile fields (name, email, profile_picture).
        """
        return await self.update(student_id, profile_data)

    async def update_status(self, student_id: str, status: str) -> Optional[Dict[str, Any]]:
        """
        Updates account active/suspended status.
        """
        return await self.update(student_id, {"status": status})

    async def update_password(self, student_id: str, password_hash: str) -> Optional[Dict[str, Any]]:
        """
        Sets a new password hash for the student.
        """
        return await self.update(student_id, {"password_hash": password_hash})

    async def soft_delete(self, student_id: str) -> bool:
        """
        Performs a soft delete by marking the student record as deleted.
        """
        try:
            if not ObjectId.is_valid(student_id):
                return False
            result = await self.collection.update_one(
                {"_id": ObjectId(student_id)},
                {"$set": {"is_deleted": True, "status": "inactive"}}
            )
            return result.modified_count > 0
        except Exception:
            return False
