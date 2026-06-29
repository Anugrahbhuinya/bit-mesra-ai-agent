from datetime import datetime, timezone
from fastapi import HTTPException, status
from typing import Dict, Any, List, Optional
from app.repositories.planner_repository import PlannerRepository
from app.models.planner import (
    PlannerTaskModel,
    PlannerTaskCreateRequest,
    PlannerTaskUpdateRequest
)

class PlannerService:
    def __init__(self, repo: PlannerRepository):
        self.repo = repo

    async def get_tasks(self, student_id: str) -> List[Dict[str, Any]]:
        """Retrieves all planner tasks for a student, sorted by due date."""
        return await self.repo.get_by_student(student_id)

    async def create_task(self, student_id: str, payload: PlannerTaskCreateRequest) -> Dict[str, Any]:
        """Creates a new task in the student's planner."""
        # Validate category
        allowed_categories = {"Study", "Assignment", "Revision", "Exam", "Meeting", "Personal"}
        if payload.category not in allowed_categories:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid category: {payload.category}. Must be one of: {', '.join(allowed_categories)}"
            )

        # Validate priority
        allowed_priorities = {"High", "Medium", "Low"}
        if payload.priority not in allowed_priorities:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid priority: {payload.priority}. Must be one of: {', '.join(allowed_priorities)}"
            )

        model = PlannerTaskModel(
            student_id=student_id,
            title=payload.title,
            description=payload.description,
            category=payload.category,
            priority=payload.priority,
            due_date=payload.due_date,
            due_time=payload.due_time,
            reminder_enabled=payload.reminder_enabled,
            reminder_time=payload.reminder_time,
            completed=False,
            tags=payload.tags
        )

        return await self.repo.create(model.to_dict())

    async def update_task(self, student_id: str, task_id: str, payload: PlannerTaskUpdateRequest) -> Dict[str, Any]:
        """Updates fields on an existing planner task."""
        task = await self.repo.get_by_id(task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Planner task not found"
            )

        # Verify ownership
        if task["student_id"] != student_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. You do not own this task."
            )

        update_data = {}
        
        if payload.title is not None:
            update_data["title"] = payload.title
            
        if payload.description is not None:
            update_data["description"] = payload.description
            
        if payload.category is not None:
            allowed_categories = {"Study", "Assignment", "Revision", "Exam", "Meeting", "Personal"}
            if payload.category not in allowed_categories:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid category: {payload.category}"
                )
            update_data["category"] = payload.category
            
        if payload.priority is not None:
            allowed_priorities = {"High", "Medium", "Low"}
            if payload.priority not in allowed_priorities:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid priority: {payload.priority}"
                )
            update_data["priority"] = payload.priority
            
        if payload.due_date is not None:
            update_data["due_date"] = payload.due_date
            
        if payload.due_time is not None:
            update_data["due_time"] = payload.due_time
            
        if payload.reminder_enabled is not None:
            update_data["reminder_enabled"] = payload.reminder_enabled
            
        if payload.reminder_time is not None:
            update_data["reminder_time"] = payload.reminder_time
            
        if payload.completed is not None:
            update_data["completed"] = payload.completed
            
        if payload.tags is not None:
            update_data["tags"] = payload.tags

        if update_data:
            update_data["updated_at"] = datetime.now(timezone.utc)
            return await self.repo.update(task_id, update_data)
            
        return task

    async def delete_task(self, student_id: str, task_id: str) -> Dict[str, Any]:
        """Deletes a planner task."""
        task = await self.repo.get_by_id(task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Planner task not found"
            )

        # Verify ownership
        if task["student_id"] != student_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. You do not own this task."
            )

        deleted = await self.repo.delete(task_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete planner task"
            )
            
        return {"status": "success", "message": "Task deleted successfully"}

    async def toggle_task_completion(self, student_id: str, task_id: str) -> Dict[str, Any]:
        """Toggles the completion status of a planner task."""
        task = await self.repo.get_by_id(task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Planner task not found"
            )

        # Verify ownership
        if task["student_id"] != student_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. You do not own this task."
            )

        update_data = {
            "completed": not task.get("completed", False),
            "updated_at": datetime.now(timezone.utc)
        }

        return await self.repo.update(task_id, update_data)

    # --- AI Context Engine Extension Points ---

    async def getUpcomingEvents(self, student_id: str) -> List[Dict[str, Any]]:
        """AI Extension: Retrieve future planner tasks sorted by date."""
        today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        return await self.repo.get_upcoming_by_student(student_id, today_str)

    async def getUpcomingExams(self, student_id: str) -> List[Dict[str, Any]]:
        """AI Extension: Retrieve future exam planner tasks."""
        today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        tasks = await self.repo.get_upcoming_by_student(student_id, today_str)
        return [t for t in tasks if t.get("category") == "Exam"]

    async def getPendingTasks(self, student_id: str) -> List[Dict[str, Any]]:
        """AI Extension: Retrieve all uncompleted tasks."""
        tasks = await self.repo.get_by_student(student_id)
        return [t for t in tasks if not t.get("completed", False)]

    async def getCompletedTasks(self, student_id: str) -> List[Dict[str, Any]]:
        """AI Extension: Retrieve all completed tasks."""
        tasks = await self.repo.get_by_student(student_id)
        return [t for t in tasks if t.get("completed", False)]

    async def getStudyPlan(self, student_id: str) -> List[Dict[str, Any]]:
        """AI Extension: Retrieve all Study/Revision planning tasks."""
        tasks = await self.repo.get_by_student(student_id)
        return [t for t in tasks if t.get("category") in {"Study", "Revision"}]
