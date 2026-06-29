from typing import Dict, Any, List
from datetime import timedelta
from app.repositories.timetable_repository import TimetableRepository
from app.services.timetable_service import get_india_now

class TimetableContextProvider:
    def __init__(self, repo: TimetableRepository):
        self.repo = repo

    async def get_context(self, student_id: str) -> Dict[str, Any]:
        """Assembles day-wise timetable structure and ongoing/upcoming classes context."""
        timetable = await self.repo.get_by_student_id(student_id)
        if not timetable or not timetable.get("classes"):
            return {
                "timetable_configured": False,
                "busiest_day": None,
                "max_classes_in_a_day": 0,
                "day_wise_schedule": {},
                "today_classes": [],
                "tomorrow_classes": []
            }

        classes = timetable["classes"]
        
        # Organize classes by day of week
        day_wise: Dict[str, List[Dict[str, Any]]] = {}
        for c in classes:
            day = c.get("day", "").strip()
            if not day:
                continue
            if day not in day_wise:
                day_wise[day] = []
            day_wise[day].append({
                "id": c.get("id"),
                "subject": c.get("subject"),
                "faculty": c.get("faculty"),
                "classroom": c.get("classroom"),
                "building": c.get("building"),
                "start_time": c.get("start_time"),
                "end_time": c.get("end_time"),
                "time": f"{c.get('start_time')} - {c.get('end_time')}"
            })

        # Sort classes inside each day chronologically by start time
        for day in day_wise:
            day_wise[day].sort(key=lambda x: x.get("start_time", ""))

        # Identify busiest day
        busiest_day = None
        max_classes = 0
        for day, list_cls in day_wise.items():
            if len(list_cls) > max_classes:
                max_classes = len(list_cls)
                busiest_day = day

        # Retrieve Today/Tomorrow list in IST
        india_now = get_india_now()
        today_day = india_now.strftime("%A")
        tomorrow_day = (india_now + timedelta(days=1)).strftime("%A")

        today_classes = day_wise.get(today_day, [])
        tomorrow_classes = day_wise.get(tomorrow_day, [])

        return {
            "timetable_configured": True,
            "busiest_day": busiest_day,
            "max_classes_in_a_day": max_classes,
            "day_wise_schedule": day_wise,
            "today_day": today_day,
            "today_classes": today_classes,
            "tomorrow_day": tomorrow_day,
            "tomorrow_classes": tomorrow_classes
        }
