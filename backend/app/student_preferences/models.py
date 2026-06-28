from datetime import datetime, timezone
from typing import Dict, Any, Optional
from bson import ObjectId

class StudentPreferencesModel:
    def __init__(
        self,
        student_id: str,
        preferred_language: str = "English",
        theme: str = "System",
        notifications: Optional[Dict[str, bool]] = None,
        ai_response_style: str = "Detailed",
        default_home_page: str = "Dashboard"
    ):
        self.student_id = student_id
        self.preferred_language = preferred_language
        self.theme = theme
        
        # System defaults for notifications
        self.notifications = notifications or {
            "email_notifications": True,
            "push_notifications": True,
            "notice_updates": True,
            "event_reminders": True,
            "academic_alerts": True
        }
        
        self.ai_response_style = ai_response_style
        self.default_home_page = default_home_page
        self.created_at = datetime.now(timezone.utc)
        self.updated_at = datetime.now(timezone.utc)

    def to_dict(self) -> Dict[str, Any]:
        """
        Serializes model instance properties into a MongoDB-ready dictionary.
        """
        return {
            "student_id": self.student_id,
            "preferred_language": self.preferred_language,
            "theme": self.theme,
            "notifications": self.notifications,
            "ai_response_style": self.ai_response_style,
            "default_home_page": self.default_home_page,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
