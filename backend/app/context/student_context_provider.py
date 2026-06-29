from typing import Dict, Any, Optional

class StudentContextProvider:
    async def get_context(self, student_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """Compiles base student identification and profile properties."""
        if not student_data:
            return {
                "name": "Student",
                "email": None,
                "roll_number": None,
                "status": "anonymous"
            }

        profile = student_data.get("profile", {})
        return {
            "name": student_data.get("name", "Student"),
            "email": student_data.get("email"),
            "roll_number": student_data.get("roll_number"),
            "status": "authenticated",
            "department": profile.get("branch") or student_data.get("department", "CSE"),
            "semester": profile.get("semester") or student_data.get("semester", 1),
            "section": profile.get("section") or student_data.get("section", "A")
        }
