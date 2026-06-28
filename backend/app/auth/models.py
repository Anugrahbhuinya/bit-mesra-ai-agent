from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class RefreshToken(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    token_hash: str = Field(..., description="SHA-256 hash of the refresh token")
    user_id: str = Field(..., description="Reference ID of the authenticated user")
    role: str = Field(..., description="Role of the authenticated user (student or admin)")
    expires_at: datetime = Field(..., description="Timestamp of token expiration")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    device: Optional[str] = Field(None, description="Optional device details extracted from User-Agent")
    ip: Optional[str] = Field(None, description="Optional IP address of the client")

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
