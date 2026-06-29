import json
import logging
from typing import Dict, Any, List
from fastapi import HTTPException, status
from google.genai import types

from app.services.llm.gemini_service import get_client
from app.core.config import GEMINI_MODEL

logger = logging.getLogger("timetable_import")

class TimetableImportService:
    @staticmethod
    async def extract_timetable(file_bytes: bytes, mime_type: str) -> List[Dict[str, Any]]:
        """
        Processes a timetable file (PDF/Image) using Gemini 2.5 Flash Vision,
        extracting and normalizing structured schedule JSON.
        """
        try:
            client = get_client()
            model_name = GEMINI_MODEL or "gemini-2.5-flash"
            logger.info(f"Extracting timetable using Gemini Vision model: {model_name}")

            prompt = """
            You are a precise data extractor. Your task is to analyze the provided timetable document or image
            and extract all scheduled classes/lectures.

            You MUST output a raw, valid JSON object containing a list of class entries under the key "classes".
            Do NOT include markdown formatting, code block wrappers (like ```json), or any conversational text.
            ONLY output valid JSON.

            Each class entry in the "classes" list MUST follow this exact schema:
            {
                "day": "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday",
                "subject": "Full Subject Name",
                "faculty": "Professor Name",
                "classroom": "Classroom or Lab (e.g. LH-1, CAD Lab, Seminar Hall)",
                "building": "Building Name or null if unknown",
                "start_time": "HH:MM", (24-hour time format, e.g. "09:00", "14:30")
                "end_time": "HH:MM", (24-hour time format, e.g. "10:00", "15:20")
                "remarks": "Any remarks, section notes or null"
            }

            Rules:
            1. Standarize the day name to match Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.
            2. Convert all class timings to 24-hour format (HH:MM). If time spans columns, make separate rows.
            3. Make a best guess for professor names and class locations if they are abbreviated.
            4. Make sure start_time is before end_time.
            """

            # Prepare contents with binary part
            part = types.Part.from_bytes(data=file_bytes, mime_type=mime_type)
            contents = [part, prompt]

            # Request structured output using generate_content config
            response = client.models.generate_content(
                model=model_name,
                contents=contents,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )

            text_output = response.text.strip()
            
            # Clean up response text if markdown code block markers are still present
            if text_output.startswith("```"):
                # strip out markdown code fences
                lines = text_output.split("\n")
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines[-1].startswith("```"):
                    lines = lines[:-1]
                text_output = "\n".join(lines).strip()

            logger.debug(f"Gemini raw output: {text_output}")

            try:
                extracted_data = json.loads(text_output)
            except json.JSONDecodeError as decode_err:
                logger.error(f"Failed to decode Gemini output as JSON: {text_output}")
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="AI failed to generate a valid JSON timetable. Please re-upload or input manually."
                )

            classes_list = extracted_data.get("classes", [])
            if not isinstance(classes_list, list):
                classes_list = []

            # Basic post-processing validation
            validated_classes = []
            standard_days = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"}
            
            for item in classes_list:
                subject = str(item.get("subject") or "").strip()
                day = str(item.get("day") or "").strip().capitalize()
                start_time = str(item.get("start_time") or "").strip()
                end_time = str(item.get("end_time") or "").strip()
                
                # Check for critical missing values
                if not subject or not day or not start_time or not end_time:
                    continue
                
                # Validate day standard
                if day not in standard_days:
                    continue

                # Validate time format (HH:MM)
                if len(start_time) == 4 and ":" in start_time:
                    start_time = "0" + start_time
                if len(end_time) == 4 and ":" in end_time:
                    end_time = "0" + end_time

                if not (len(start_time) == 5 and start_time[2] == ":") or not (len(end_time) == 5 and end_time[2] == ":"):
                    continue

                # Add to validated array
                validated_classes.append({
                    "day": day,
                    "subject": subject,
                    "faculty": str(item.get("faculty") or "Unknown Faculty").strip(),
                    "classroom": str(item.get("classroom") or "TBA").strip(),
                    "building": item.get("building") if item.get("building") else None,
                    "start_time": start_time,
                    "end_time": end_time,
                    "remarks": item.get("remarks") if item.get("remarks") else None
                })

            return validated_classes

        except HTTPException:
            raise
        except Exception as exc:
            logger.error(f"Error during AI timetable import extraction: {exc}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"AI timetable extraction failed: {str(exc)}"
            )
