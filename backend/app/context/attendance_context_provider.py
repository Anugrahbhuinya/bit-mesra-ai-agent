from typing import Dict, Any, List
from app.repositories.attendance_repository import AttendanceRepository

class AttendanceContextProvider:
    def __init__(self, repo: AttendanceRepository):
        self.repo = repo

    async def get_context(self, student_id: str) -> Dict[str, Any]:
        """Loads cumulative attendance metrics, threshold violations, and safe leave estimates."""
        records = await self.repo.get_records_by_student(student_id)
        if not records:
            return {
                "has_attendance_data": False,
                "overall_attendance_percentage": 100.0,
                "total_conducted": 0,
                "total_attended": 0,
                "subjects_below_75_threshold": [],
                "lowest_attendance_subject": None,
                "subject_details": []
            }

        total_conducted = 0
        total_attended = 0
        below_threshold = []
        detailed_records = []
        lowest_subject = None
        lowest_pct = 101.0

        for r in records:
            pct = r.get("attendance_percentage", 100.0)
            cond = r.get("total_conducted", 0)
            att = r.get("total_attended", 0)
            
            total_conducted += cond
            total_attended += att

            subj_name = r.get("subject_name")
            record_info = {
                "subject_id": r.get("subject_id"),
                "subject_name": subj_name,
                "attendance_percentage": pct,
                "total_conducted": cond,
                "total_attended": att,
                "safe_leaves": r.get("safe_leaves", 0),
                "required_classes": r.get("required_classes", 0),
                "faculty": r.get("faculty")
            }
            detailed_records.append(record_info)

            # Mark if below 75%
            if cond > 0 and pct < 75.0:
                below_threshold.append(record_info)

            # Identify lowest subject (exclude zero-conducted classes to avoid false warnings)
            if cond > 0 and pct < lowest_pct:
                lowest_pct = pct
                lowest_subject = record_info

        overall_pct = (total_attended / total_conducted * 100.0) if total_conducted > 0 else 100.0

        return {
            "has_attendance_data": True,
            "overall_attendance_percentage": overall_pct,
            "total_conducted": total_conducted,
            "total_attended": total_attended,
            "subjects_below_75_threshold": below_threshold,
            "lowest_attendance_subject": lowest_subject,
            "subject_details": detailed_records
        }
