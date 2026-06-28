from typing import Optional, Dict, Any, List
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime

class RefreshTokenRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db.refresh_tokens

    async def create(self, token_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Saves a hashed refresh token session to the database.
        """
        await self.collection.insert_one(token_data)
        return token_data

    async def get_by_hash(self, token_hash: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves a token session by its SHA-256 hash.
        """
        return await self.collection.find_one({"token_hash": token_hash})

    async def revoke(self, token_hash: str) -> bool:
        """
        Deletes/revokes a specific refresh token.
        """
        result = await self.collection.delete_one({"token_hash": token_hash})
        return result.deleted_count > 0

    async def revoke_all_for_user(self, user_id: str) -> bool:
        """
        Revokes all active refresh tokens for a specific user ID.
        """
        result = await self.collection.delete_many({"user_id": user_id})
        return result.deleted_count > 0
        
    async def get_all_for_user(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Retrieves all active refresh token sessions for a specific user ID.
        """
        cursor = self.collection.find({"user_id": user_id})
        return await cursor.to_list(length=100)
