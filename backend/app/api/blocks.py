from fastapi import APIRouter
from typing import List

router = APIRouter(prefix="/blocks", tags=["Block Windows"])

@router.get("")
def get_blocks():
    return [
        {
            "id": "blk-1",
            "blockCode": "BLOCK B-104",
            "sectionId": "S-10",
            "sectionName": "Section S-10 (MAS-AJJ)",
            "timeSlot": "08:00–11:00",
            "startTime": "08:00",
            "endTime": "11:00",
            "durationHrs": 3,
            "departments": ["Engineering", "Signal & Telecom"],
            "taskCount": 3,
            "trainImpact": "Low",
            "priority": "Routine",
            "aiRecommendation": "Joint block scheduled during morning low freight traffic slot."
        },
        {
            "id": "blk-2",
            "blockCode": "BLOCK B-108",
            "sectionId": "S-12",
            "sectionName": "Section S-12 (AJJ-KPD)",
            "timeSlot": "12:00–14:00",
            "startTime": "12:00",
            "endTime": "14:00",
            "durationHrs": 2,
            "departments": ["Traction"],
            "taskCount": 2,
            "trainImpact": "Low",
            "priority": "High",
            "aiRecommendation": "Shifted OHE inspection to off-peak afternoon window to protect Vande Bharat Express slot."
        },
        {
            "id": "blk-3",
            "blockCode": "BLOCK B-113",
            "sectionId": "S-14",
            "sectionName": "Section S-14 (KPD-JTJ)",
            "timeSlot": "15:00–18:00",
            "startTime": "15:00",
            "endTime": "18:00",
            "durationHrs": 3,
            "departments": ["Engineering", "Traction", "Signal & Telecom"],
            "taskCount": 6,
            "trainImpact": "Low",
            "priority": "Critical",
            "aiRecommendation": "Combined window recommended because three departments have compatible maintenance activities in the same section."
        }
    ]
