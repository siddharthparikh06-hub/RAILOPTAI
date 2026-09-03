from fastapi import APIRouter
from typing import List

router = APIRouter(prefix="/sections", tags=["Sections"])

@router.get("")
def get_sections():
    return [
        {
            "id": "S-10",
            "code": "S-10",
            "name": "Section MAS-AJJ Mainline",
            "startStation": "MAS",
            "endStation": "AJJ",
            "lengthKm": 68.5,
            "status": "Operational",
            "trafficDensity": "High",
            "activeTasks": 3,
            "nextWindow": "01:30–04:30"
        },
        {
            "id": "S-12",
            "code": "S-12",
            "name": "Section AJJ-KPD Trunk Corridor",
            "startStation": "AJJ",
            "endStation": "KPD",
            "lengthKm": 61.0,
            "status": "Operational",
            "trafficDensity": "High",
            "activeTasks": 5,
            "nextWindow": "12:00–14:00"
        },
        {
            "id": "S-14",
            "code": "S-14",
            "name": "Section KPD-JTJ High Density Line",
            "startStation": "KPD",
            "endStation": "JTJ",
            "lengthKm": 84.2,
            "status": "Maintenance Window",
            "trafficDensity": "Medium",
            "activeTasks": 6,
            "nextWindow": "15:00–18:00"
        },
        {
            "id": "S-18",
            "code": "S-18",
            "name": "Section JTJ-SA Express Line",
            "startStation": "JTJ",
            "endStation": "SA",
            "lengthKm": 120.4,
            "status": "Operational",
            "trafficDensity": "Low",
            "activeTasks": 4,
            "nextWindow": "14:00–17:00"
        }
    ]
