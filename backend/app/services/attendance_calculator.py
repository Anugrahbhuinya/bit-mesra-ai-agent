import math
from typing import Dict, Any

def calculate_stats(total_attended: int, total_conducted: int, threshold: float = 0.75) -> Dict[str, Any]:
    """
    Calculates attendance percentage, safe leaves (bunks), and required classes
    to reach the minimum threshold (default 75%).
    
    threshold: float between 0.0 and 1.0 (e.g. 0.75 for 75%)
    """
    # Guard against threshold outside normal bounds or invalid inputs
    if threshold < 0.0:
        threshold = 0.0
    elif threshold > 1.0:
        threshold = threshold / 100.0 if threshold > 1.0 else threshold

    # Default if no classes conducted yet
    if total_conducted <= 0:
        return {
            "attendancePercentage": 100.0,
            "safeLeaves": 0,
            "requiredClasses": 0
        }

    # Safeguard inputs
    total_conducted = max(0, total_conducted)
    total_attended = max(0, min(total_attended, total_conducted))

    percentage = (total_attended / total_conducted) * 100.0

    # Safe leaves remaining: max number of upcoming classes we can miss without falling below threshold
    # A / (C + x) >= T => x <= A / T - C
    safe_leaves = 0
    if percentage >= (threshold * 100.0) and threshold > 0:
        safe_leaves = max(0, math.floor(total_attended / threshold - total_conducted))

    # Required classes to reach threshold: min number of consecutive classes we must attend to reach threshold
    # (A + y) / (C + y) >= T => y >= (T * C - A) / (1 - T)
    required_classes = 0
    if percentage < (threshold * 100.0):
        if threshold >= 1.0:
            # If 100% threshold and we missed even one class, we can never reach it.
            required_classes = 9999  # Large integer representation
        else:
            required_classes = max(0, math.ceil((threshold * total_conducted - total_attended) / (1.0 - threshold)))

    return {
        "attendancePercentage": round(percentage, 2),
        "safeLeaves": safe_leaves,
        "requiredClasses": required_classes
    }
