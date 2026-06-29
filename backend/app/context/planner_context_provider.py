from typing import Dict, Any, List
from app.repositories.planner_repository import PlannerRepository
from app.services.timetable_service import get_india_now

class PlannerContextProvider:
    def __init__(self, repo: PlannerRepository):
        self.repo = repo

    async def get_context(self, student_id: str) -> Dict[str, Any]:
        """Gathers list of pending, completed, exam, and revision tasks from the planner."""
        tasks = await self.repo.get_by_student(student_id)
        if not tasks:
            return {
                "has_planner_data": False,
                "pending_tasks_count": 0,
                "completed_tasks_count": 0,
                "pending_tasks": [],
                "completed_tasks": [],
                "upcoming_exams": [],
                "upcoming_quizzes": [],
                "study_revision_tasks": []
            }

        today_str = get_india_now().strftime("%Y-%m-%d")

        pending = []
        completed = []
        exams = []
        quizzes = []
        study_revision = []

        for t in tasks:
            task_info = {
                "id": t.get("_id"),
                "title": t.get("title"),
                "description": t.get("description", ""),
                "category": t.get("category"),
                "priority": t.get("priority"),
                "due_date": t.get("due_date"),
                "due_time": t.get("due_time"),
                "completed": t.get("completed", False)
            }

            if t.get("completed", False):
                completed.append(task_info)
            else:
                pending.append(task_info)
                due = t.get("due_date", "")
                cat = t.get("category")
                if due >= today_str:
                    if cat == "Exam":
                        exams.append(task_info)
                    elif cat == "Quiz":
                        quizzes.append(task_info)
                
                if cat in {"Study", "Revision"}:
                    study_revision.append(task_info)

        # Sort tasks chronologically by due date
        pending.sort(key=lambda x: x.get("due_date", ""))
        completed.sort(key=lambda x: x.get("due_date", ""))
        exams.sort(key=lambda x: x.get("due_date", ""))
        quizzes.sort(key=lambda x: x.get("due_date", ""))
        study_revision.sort(key=lambda x: x.get("due_date", ""))

        return {
            "has_planner_data": True,
            "pending_tasks_count": len(pending),
            "completed_tasks_count": len(completed),
            "pending_tasks": pending,
            "completed_tasks": completed,
            "upcoming_exams": exams,
            "upcoming_quizzes": quizzes,
            "study_revision_tasks": study_revision
        }
