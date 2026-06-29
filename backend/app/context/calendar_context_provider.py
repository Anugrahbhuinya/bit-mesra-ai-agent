from typing import Dict, Any, List
from app.utils.loader import load_json
from app.services.timetable_service import get_india_now

class CalendarContextProvider:
    async def get_context(self) -> Dict[str, Any]:
        """Loads future milestones and event deadlines from the static calendar configuration."""
        try:
            calendar_data = load_json("academics/academic_calendar/calendar.json")
        except Exception:
            calendar_data = []

        today_str = get_india_now().strftime("%Y-%m-%d")

        future_events = []
        for c in calendar_data:
            start = c.get("start_date", "")
            if start >= today_str:
                future_events.append({
                    "event": c.get("event", "Academic Event"),
                    "start_date": start,
                    "end_date": c.get("end_date", start)
                })

        # Sort chronologically by start date
        future_events.sort(key=lambda x: x.get("start_date", ""))

        return {
            "upcoming_academic_calendar_milestones": future_events
        }
