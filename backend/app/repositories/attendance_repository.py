from typing import List, Optional, Dict, Any
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

class AttendanceRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.records_collection = db.attendance_records
        self.logs_collection = db.attendance_logs

    # --- Attendance Record Operations ---

    async def get_record_by_id(self, record_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a single attendance record by MongoDB ObjectId string."""
        try:
            record = await self.records_collection.find_one({"_id": ObjectId(record_id)})
            if record:
                record["_id"] = str(record["_id"])
            return record
        except Exception:
            return None

    async def get_record_by_subject_id(self, student_id: str, subject_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a student's attendance record for a specific subject ID."""
        try:
            record = await self.records_collection.find_one({
                "student_id": student_id,
                "subject_id": subject_id
            })
            if record:
                record["_id"] = str(record["_id"])
            return record
        except Exception:
            return None

    async def get_record_by_subject_name(self, student_id: str, subject_name: str) -> Optional[Dict[str, Any]]:
        """Retrieves a student's attendance record for a subject name (case-insensitive)."""
        try:
            # Match exactly or case-insensitively
            record = await self.records_collection.find_one({
                "student_id": student_id,
                "subject_name": {"$regex": f"^{subject_name.strip()}$", "$options": "i"}
            })
            if record:
                record["_id"] = str(record["_id"])
            return record
        except Exception:
            return None

    async def get_records_by_student(self, student_id: str) -> List[Dict[str, Any]]:
        """Retrieves all attendance records for a student."""
        try:
            cursor = self.records_collection.find({"student_id": student_id})
            records = []
            async for doc in cursor:
                doc["_id"] = str(doc["_id"])
                records.append(doc)
            return records
        except Exception:
            return []

    async def create_record(self, record_data: Dict[str, Any]) -> Dict[str, Any]:
        """Creates a new attendance record."""
        # Convert _id to ObjectId if it's in record_data or let Mongo generate it
        result = await self.records_collection.insert_one(record_data)
        record_data["_id"] = str(result.inserted_id)
        return record_data

    async def update_record(self, record_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Updates an attendance record's fields."""
        try:
            await self.records_collection.update_one(
                {"_id": ObjectId(record_id)},
                {"$set": update_data}
            )
            return await self.get_record_by_id(record_id)
        except Exception:
            return None

    # --- Attendance Log Operations ---

    async def get_log_by_id(self, log_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves an attendance log by its UUID string ID."""
        try:
            return await self.logs_collection.find_one({"id": log_id})
        except Exception:
            return None

    async def get_log_by_record_and_date(self, record_id: str, class_date: str) -> Optional[Dict[str, Any]]:
        """Checks if a log exists for a given record ID and date."""
        try:
            return await self.logs_collection.find_one({
                "attendance_record_id": record_id,
                "class_date": class_date
            })
        except Exception:
            return None

    async def get_logs_by_record_id(self, record_id: str) -> List[Dict[str, Any]]:
        """Retrieves all logs for a specific attendance record, sorted by date descending."""
        try:
            cursor = self.logs_collection.find({"attendance_record_id": record_id}).sort("class_date", -1)
            logs = []
            async for doc in cursor:
                if "_id" in doc:
                    doc["_id"] = str(doc["_id"])
                logs.append(doc)
            return logs
        except Exception:
            return []

    async def get_all_logs_for_records(self, record_ids: List[str]) -> List[Dict[str, Any]]:
        """Retrieves all logs across a list of attendance record IDs, sorted by date descending."""
        if not record_ids:
            return []
        try:
            cursor = self.logs_collection.find({
                "attendance_record_id": {"$in": record_ids}
            }).sort("class_date", -1)
            logs = []
            async for doc in cursor:
                if "_id" in doc:
                    doc["_id"] = str(doc["_id"])
                logs.append(doc)
            return logs
        except Exception:
            return []

    async def create_log(self, log_data: Dict[str, Any]) -> Dict[str, Any]:
        """Creates a new attendance log."""
        await self.logs_collection.insert_one(log_data)
        if "_id" in log_data:
            log_data["_id"] = str(log_data["_id"])
        return log_data

    async def update_log(self, log_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Updates fields on an attendance log."""
        try:
            await self.logs_collection.update_one(
                {"id": log_id},
                {"$set": update_data}
            )
            return await self.get_log_by_id(log_id)
        except Exception:
            return None

    async def delete_log(self, log_id: str) -> bool:
        """Deletes an attendance log by ID."""
        try:
            result = await self.logs_collection.delete_one({"id": log_id})
            return result.deleted_count > 0
        except Exception:
            return False
