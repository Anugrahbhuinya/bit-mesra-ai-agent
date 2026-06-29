from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
from app.repositories.timetable_repository import TimetableRepository
from app.repositories.attendance_repository import AttendanceRepository
from app.repositories.planner_repository import PlannerRepository
from app.utils.loader import load_json

# Load calendar data once at startup
try:
    calendar_data = load_json("academics/academic_calendar/calendar.json")
except Exception:
    calendar_data = []

def get_india_now() -> datetime:
    """Returns current datetime in IST."""
    return datetime.now(timezone(timedelta(hours=5, minutes=30)))

class TimelineService:
    def __init__(
        self,
        timetable_repo: TimetableRepository,
        attendance_repo: AttendanceRepository,
        planner_repo: PlannerRepository
    ):
        self.timetable_repo = timetable_repo
        self.attendance_repo = attendance_repo
        self.planner_repo = planner_repo

    async def generate_unified_timeline(self, student_id: str) -> List[Dict[str, Any]]:
        """
        Dynamically aggregates, normalizes, and sorts academic timeline events:
        1. Academic Calendar
        2. Today's and Tomorrow's Timetable Classes
        3. Attendance Alerts (for subjects < 75%)
        4. Planner Tasks
        """
        events = []
        india_now = get_india_now()
        today_date_str = india_now.strftime("%Y-%m-%d")
        today_day = india_now.strftime("%A")

        tomorrow_dt = india_now + timedelta(days=1)
        tomorrow_date_str = tomorrow_dt.strftime("%Y-%m-%d")
        tomorrow_day = tomorrow_dt.strftime("%A")

        # 1. Academic Calendar Events
        for idx, item in enumerate(calendar_data):
            event_name = item.get("event", "Academic Event")
            start_date = item.get("start_date")
            end_date = item.get("end_date")
            
            # Categorize event type
            event_type = "academic"
            title_lower = event_name.lower()
            if "quiz" in title_lower:
                event_type = "quiz"
            elif "exam" in title_lower or "test" in title_lower:
                event_type = "exam"
            elif "holiday" in title_lower or "break" in title_lower or "vacation" in title_lower:
                event_type = "holiday"
            elif "registration" in title_lower or "commencement" in title_lower:
                event_type = "registration"

            events.append({
                "id": f"calendar-{idx}",
                "title": event_name,
                "description": f"Academic Calendar Event (Spans: {start_date} to {end_date})",
                "type": event_type,
                "date": start_date,
                "time": None,
                "priority": "Medium",
                "completed": None,
                "category": None,
                "metadata": {
                    "start_date": start_date,
                    "end_date": end_date
                }
            })

        # 2. Timetable Classes (Today and Tomorrow)
        timetable = await self.timetable_repo.get_by_student_id(student_id)
        if timetable and timetable.get("classes"):
            for cls in timetable["classes"]:
                class_day = cls.get("day", "").strip()
                
                # Check match for today
                if class_day.lower() == today_day.lower():
                    events.append({
                        "id": f"timetable-today-{cls.get('id')}",
                        "title": f"Class: {cls.get('subject')}",
                        "description": f"Lecture by {cls.get('faculty')} in {cls.get('classroom')}",
                        "type": "class",
                        "date": today_date_str,
                        "time": f"{cls.get('start_time')} - {cls.get('end_time')}",
                        "priority": "Low",
                        "completed": None,
                        "category": None,
                        "metadata": {
                            "faculty": cls.get("faculty"),
                            "classroom": cls.get("classroom"),
                            "building": cls.get("building"),
                            "remarks": cls.get("remarks")
                        }
                    })
                
                # Check match for tomorrow
                elif class_day.lower() == tomorrow_day.lower():
                    events.append({
                        "id": f"timetable-tomorrow-{cls.get('id')}",
                        "title": f"Class: {cls.get('subject')}",
                        "description": f"Lecture by {cls.get('faculty')} in {cls.get('classroom')}",
                        "type": "class",
                        "date": tomorrow_date_str,
                        "time": f"{cls.get('start_time')} - {cls.get('end_time')}",
                        "priority": "Low",
                        "completed": None,
                        "category": None,
                        "metadata": {
                            "faculty": cls.get("faculty"),
                            "classroom": cls.get("classroom"),
                            "building": cls.get("building"),
                            "remarks": cls.get("remarks")
                        }
                    })

        # 3. Attendance Alerts (Attendance < 75%)
        records = await self.attendance_repo.get_records_by_student(student_id)
        for rec in records:
            pct = rec.get("attendance_percentage", 100.0)
            cond = rec.get("total_conducted", 0)
            if cond > 0 and pct < 75.0:
                events.append({
                    "id": f"attendance-alert-{rec['_id']}",
                    "title": f"Low Attendance Warning: {rec['subject_name']}",
                    "description": f"Your current attendance in {rec['subject_name']} is {pct}%, which is below the mandatory 75% threshold. You need to attend the next {rec.get('required_classes', 0)} class(es) to recover.",
                    "type": "attendance_alert",
                    "date": today_date_str,
                    "time": None,
                    "priority": "High",
                    "completed": None,
                    "category": None,
                    "metadata": {
                        "subject_name": rec["subject_name"],
                        "attendance_percentage": pct,
                        "required_classes": rec.get("required_classes", 0),
                        "faculty": rec.get("faculty")
                    }
                })

        # 4. Planner Tasks
        tasks = await self.planner_repo.get_by_student(student_id)
        for task in tasks:
            # Map categories to event types
            event_type = "task"
            cat = task.get("category")
            if cat == "Exam":
                event_type = "exam"
            elif cat == "Quiz":
                event_type = "quiz"

            events.append({
                "id": f"task-{task['_id']}",
                "title": task["title"],
                "description": task.get("description", ""),
                "type": event_type,
                "date": task["due_date"],
                "time": task.get("due_time"),
                "priority": task["priority"],
                "completed": task.get("completed", False),
                "category": cat,
                "metadata": {
                    "tags": task.get("tags", []),
                    "reminder_enabled": task.get("reminder_enabled", False),
                    "reminder_time": task.get("reminder_time")
                }
            })

        # Sort chronologically: Date ascending, then Time ascending if present
        def sort_key(event):
            # Safe parsing
            date_part = event["date"]
            time_part = event["time"] or "00:00"
            if " - " in time_part:
                time_part = time_part.split(" - ")[0]
            # Convert time_part to HH:MM format strictly
            try:
                time_part = time_part.strip()
                if len(time_part) == 5 and time_part[2] == ":":
                    pass
                else:
                    time_part = "00:00"
            except Exception:
                time_part = "00:00"
            return (date_part, time_part)

        events.sort(key=sort_key)
        return events

    async def get_upcoming_events(self, student_id: str, days: int = 14) -> List[Dict[str, Any]]:
        """Retrieves only the future timeline events starting from today in IST."""
        all_events = await self.generate_unified_timeline(student_id)
        today_str = get_india_now().strftime("%Y-%m-%d")
        
        # Filter for upcoming events
        upcoming = [e for e in all_events if e["date"] >= today_str]
        
        # Limit to the N days offset or just return them
        return upcoming

    # --- AI Context Engine Extension Point ---
    async def getTimeline(self, student_id: str) -> List[Dict[str, Any]]:
        """AI Extension: Unified timeline getter."""
        return await self.generate_unified_timeline(student_id)
