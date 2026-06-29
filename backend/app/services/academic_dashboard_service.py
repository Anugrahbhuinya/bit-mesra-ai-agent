from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional
from app.services.timetable_service import TimetableService
from app.services.attendance_service import AttendanceService, get_india_now
from app.services.planner_service import PlannerService
from app.services.timeline_service import TimelineService
from app.utils.loader import load_json

try:
    calendar_data = load_json("academics/academic_calendar/calendar.json")
except Exception:
    calendar_data = []

class AcademicDashboardService:
    def __init__(
        self,
        timetable_service: TimetableService,
        attendance_service: AttendanceService,
        planner_service: PlannerService,
        timeline_service: TimelineService
    ):
        self.timetable_service = timetable_service
        self.attendance_service = attendance_service
        self.planner_service = planner_service
        self.timeline_service = timeline_service

    async def get_dashboard_data(self, student_id: str, student_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Orchestrates calls to individual academic services and aggregates the results
        into a single response payload for the frontend landing page.
        """
        today_date_str = get_india_now().strftime("%Y-%m-%d")

        # 1. Today's classes
        today_classes = await self.timetable_service.get_today_classes_list(student_id)

        # 2. Attendance summary
        attendance_summary = await self.attendance_service.get_dashboard_summary(student_id, student_profile)

        # 3. Planner tasks & statistics
        planner_tasks = await self.planner_service.get_tasks(student_id)
        
        total_tasks = len(planner_tasks)
        completed_tasks = [t for t in planner_tasks if t.get("completed", False)]
        pending_tasks = [t for t in planner_tasks if not t.get("completed", False)]
        
        high_priority_pending = [t for t in pending_tasks if t.get("priority") == "High"]
        today_tasks = [t for t in pending_tasks if t.get("due_date") == today_date_str]

        planner_summary = {
            "totalTasksCount": total_tasks,
            "completedTasksCount": len(completed_tasks),
            "pendingTasksCount": len(pending_tasks),
            "highPriorityCount": len(high_priority_pending),
            "todayTasksCount": len(today_tasks),
            "recentPending": pending_tasks[:3]  # return top 3 pending
        }

        # 4. Upcoming Exam (from Planner)
        exams = [t for t in pending_tasks if t.get("category") == "Exam" and t.get("due_date") >= today_date_str]
        exams.sort(key=lambda x: x["due_date"])
        upcoming_exam = exams[0] if exams else None

        # 5. Upcoming Quiz (from Planner)
        quizzes = [t for t in pending_tasks if t.get("category") == "Quiz" and t.get("due_date") >= today_date_str]
        quizzes.sort(key=lambda x: x["due_date"])
        upcoming_quiz = quizzes[0] if quizzes else None

        # 6. Calendar Highlights (from calendar.json)
        future_calendar = [c for c in calendar_data if c.get("start_date") >= today_date_str]
        future_calendar.sort(key=lambda x: x["start_date"])
        calendar_highlights = future_calendar[:4]  # Return next 4 highlights

        # 7. Quick Actions Shortcuts
        quick_actions = [
            {"label": "Open Timetable", "icon": "Calendar", "path": "/academics/timetable"},
            {"label": "Track Attendance", "icon": "CheckSquare", "path": "/academics/attendance"},
            {"label": "Add Study Task", "icon": "Plus", "path": "/academics/planner", "action": "create_task"},
            {"label": "Open Planner", "icon": "ClipboardList", "path": "/academics/planner"},
            {"label": "Ask AI", "icon": "Sparkles", "path": "/chat"}
        ]

        # 8. Deterministic Academic Insights
        academic_insights = await self.get_academic_insights(
            student_id,
            today_classes,
            attendance_summary,
            pending_tasks,
            calendar_highlights
        )

        return {
            "todayClasses": today_classes,
            "attendanceSummary": attendance_summary,
            "upcomingExam": upcoming_exam,
            "upcomingQuiz": upcoming_quiz,
            "plannerSummary": planner_summary,
            "calendarHighlights": calendar_highlights,
            "quickActions": quick_actions,
            "academicInsights": academic_insights
        }

    async def get_academic_insights(
        self,
        student_id: str,
        today_classes: List[Dict[str, Any]],
        attendance_summary: Dict[str, Any],
        pending_tasks: List[Dict[str, Any]],
        calendar_highlights: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Evaluates current student stats and generates rule-based insights
        and notifications to help guide study plans.
        """
        insights = []
        today_date_str = get_india_now().strftime("%Y-%m-%d")

        # Insight 1: Low Cumulative Attendance Warning
        overall_pct = attendance_summary.get("overall_attendance", 100.0)
        below_count = attendance_summary.get("below_threshold_count", 0)
        
        if overall_pct < 75.0:
            insights.append({
                "type": "critical",
                "message": f"Critical: Overall attendance ({overall_pct}%) is below 75%. Missed lectures need to be recovered immediately."
            })
        elif below_count > 0:
            insights.append({
                "type": "warning",
                "message": f"Warning: You have {below_count} course(s) below the mandatory 75% threshold. Check safe leaves."
            })

        # Insight 2: High Priority Tasks
        high_pri_tasks = [t for t in pending_tasks if t.get("priority") == "High"]
        if high_pri_tasks:
            insights.append({
                "type": "warning",
                "message": f"Attention: You have {len(high_pri_tasks)} high-priority tasks pending in your planner checklist."
            })

        # Insight 3: Tomorrow's Schedule Warning (Busy Day)
        # Fetch tomorrow's day of week
        tomorrow_day = (get_india_now() + timedelta(days=1)).strftime("%A")
        # Query tomorrow's schedule list
        timetable = await self.timetable_service.repo.get_by_student_id(student_id)
        if timetable and timetable.get("classes"):
            tomorrow_classes = [c for c in timetable["classes"] if c.get("day", "").strip().lower() == tomorrow_day.lower()]
            if len(tomorrow_classes) >= 4:
                insights.append({
                    "type": "info",
                    "message": f"Busy schedule tomorrow: You have {len(tomorrow_classes)} classes scheduled. Stay prepared!"
                })

        # Insight 4: Upcoming Exam/Quiz Alerts (within next 5 days)
        five_days_later = (get_india_now() + timedelta(days=5)).strftime("%Y-%m-%d")
        urgent_exams = [t for t in pending_tasks if t.get("category") == "Exam" and today_date_str <= t.get("due_date") <= five_days_later]
        if urgent_exams:
            insights.append({
                "type": "critical",
                "message": f"Urgent: Exam '{urgent_exams[0]['title']}' is due on {urgent_exams[0]['due_date']}."
            })

        # Insight 5: Empty Schedule Today
        if len(today_classes) == 0:
            insights.append({
                "type": "success",
                "message": "Timeline clear: No lectures scheduled for today. Good time to revise or clear pending tasks!"
            })

        # Fallback/Default Insight if list is empty
        if not insights:
            insights.append({
                "type": "success",
                "message": "All systems clear. Check your planner checklist to schedule study sessions."
            })

        return insights

    # --- AI Context Engine Extension Point ---
    async def getDashboard(self, student_id: str, student_profile: Dict[str, Any]) -> Dict[str, Any]:
        """AI Extension: Unified dashboard summary getter."""
        return await self.get_dashboard_data(student_id, student_profile)

    async def getTodaySummary(self, student_id: str) -> Dict[str, Any]:
        """AI Extension: Retrieve today's timetable and tasks summary."""
        today_classes = await self.timetable_service.get_today_classes_list(student_id)
        today_date_str = get_india_now().strftime("%Y-%m-%d")
        
        # Get today's planner tasks
        tasks = await self.planner_service.get_tasks(student_id)
        today_tasks = [t for t in tasks if not t.get("completed", False) and t.get("due_date") == today_date_str]

        return {
            "today_classes_count": len(today_classes),
            "today_tasks_count": len(today_tasks),
            "classes": today_classes,
            "tasks": today_tasks
        }
