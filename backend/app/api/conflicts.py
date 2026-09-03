from fastapi import APIRouter
from app.services.conflict_detector import conflict_detector

router = APIRouter(prefix="/conflicts", tags=["Conflicts"])

@router.get("")
def get_conflicts():
    return [
        {
            "id": "alt-101",
            "severity": "Critical",
            "title": "Overlapping maintenance request detected in S-14",
            "description": "Engineering requested 4h track tamping while S&T requested 2h Point Machine overhaul on uncoordinated schedules.",
            "sectionId": "S-14",
            "timestamp": "10 mins ago",
            "status": "Active"
        },
        {
            "id": "alt-102",
            "severity": "High",
            "title": "Critical signal maintenance approaching deadline",
            "description": "Signal asset S-104 requires maintenance within 18 hours to prevent signal aspect failure.",
            "sectionId": "S-14",
            "timestamp": "25 mins ago",
            "status": "Active"
        },
        {
            "id": "alt-103",
            "severity": "Medium",
            "title": "Crew availability reduced for Engineering Team E-04",
            "description": "Engineering crew E-04 has 2 active shifts remaining today.",
            "sectionId": "S-18",
            "timestamp": "1 hour ago",
            "status": "Active"
        },
        {
            "id": "alt-104",
            "severity": "Information",
            "title": "OHE section OHE-27 approaching maintenance threshold",
            "description": "Traction insulator inspection recommended during next available block window.",
            "sectionId": "S-12",
            "timestamp": "2 hours ago",
            "status": "Resolved"
        }
    ]
