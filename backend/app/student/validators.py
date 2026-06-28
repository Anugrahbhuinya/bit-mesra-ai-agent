import os
import uuid
import time
from fastapi import HTTPException, status, UploadFile

ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg"}
ALLOWED_CONTENT_TYPES = {"image/png", "image/jpeg", "image/jpg"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

def validate_profile_picture(file: UploadFile) -> str:
    """
    Validates that the uploaded file is a PNG or JPEG/JPG image and is under 5MB.
    Returns the file extension if valid.
    """
    # 1. Validate by extension
    filename = file.filename or ""
    _, ext = os.path.splitext(filename.lower())
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file extension {ext}. Only JPG, JPEG, and PNG are allowed."
        )

    # 2. Validate by Content-Type header
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported content type {file.content_type}. Only JPG, JPEG, and PNG images are allowed."
        )

    return ext

def generate_profile_picture_filename(student_id: str, extension: str) -> str:
    """
    Generates a unique filename for the student's profile picture using timestamp.
    """
    timestamp = int(time.time())
    # Keep it clean and readable: <student_id>_<timestamp>.<ext>
    return f"{student_id}_{timestamp}{extension}"
