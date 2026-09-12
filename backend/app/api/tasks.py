from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.db.models import MaintenanceTask
from app.db.schemas import TaskResponse, TaskBase, UserProfile
from app.core.dependencies import get_current_user, verify_department_ownership
from app.services.priority_engine import priority_engine

router = APIRouter(prefix="/tasks", tags=["Maintenance Tasks"])

@router.get("")
def get_tasks(
    department: Optional[str] = None, 
    criticality: Optional[str] = None, 
    db: Session = Depends(get_db)
):
    tasks = [
        {
            "id": "1",
            "taskCode": "TASK-1042",
            "asset": "Signal S-104",
            "assetId": "ast-1",
            "department": "Signal & Telecom",
            "sectionId": "S-14",
            "issue": "Signal aspect lumen degradation & interlock delay",
            "priorityScore": 94,
            "criticality": "Critical",
            "dueDate": "26 Aug 2026",
            "durationHrs": 3,
            "crewRequired": 4,
            "status": "Critical",
            "aiReasons": [
                "Overdue by 2 days",
                "Located on High traffic corridor S-14",
                "Safety critical signaling asset",
                "Failure probability increasing (+34%)"
            ],
            "aiRecommendation": "Schedule within next available joint block B-113 at 15:00–18:00."
        },
        {
            "id": "2",
            "taskCode": "TASK-1088",
            "asset": "OHE-27",
            "assetId": "ast-2",
            "department": "Traction",
            "sectionId": "S-12",
            "issue": "Overhead contact wire insulator carbon buildup",
            "priorityScore": 82,
            "criticality": "High",
            "dueDate": "27 Aug 2026",
            "durationHrs": 2,
            "crewRequired": 5,
            "status": "Pending",
            "aiReasons": [
                "Insulator dielectric breakdown risk",
                "Corridor S-12 high speed section",
                "Compatible with Track T-214 window"
            ],
            "aiRecommendation": "Combine with Engineering track tamping window to save 2 hours downtime."
        },
        {
            "id": "3",
            "taskCode": "TASK-1112",
            "asset": "Track T-214",
            "assetId": "ast-3",
            "department": "Engineering",
            "sectionId": "S-18",
            "issue": "Rail-head wear & ballast compaction realignment",
            "priorityScore": 76,
            "criticality": "Medium",
            "dueDate": "29 Aug 2026",
            "durationHrs": 4,
            "crewRequired": 8,
            "status": "Scheduled",
            "aiReasons": [
                "Routine 30-day preventive maintenance",
                "Low safety impact index",
                "Off-peak afternoon availability"
            ],
            "aiRecommendation": "Schedule during low train density window on Thursday."
        },
        {
            "id": "4",
            "taskCode": "TASK-1145",
            "asset": "Point PM-08",
            "assetId": "ast-4",
            "department": "Signal & Telecom",
            "sectionId": "S-14",
            "issue": "Point machine switch tongue clearance adjustment",
            "priorityScore": 91,
            "criticality": "Critical",
            "dueDate": "26 Aug 2026",
            "durationHrs": 2,
            "crewRequired": 3,
            "status": "Critical",
            "aiReasons": [
                "Overdue by 4 days",
                "High risk of turnout failure during peak Rajdhani window"
            ],
            "aiRecommendation": "Merge into Block B-113 with Engineering & Traction crews."
        },
        {
            "id": "5",
            "taskCode": "TASK-1190",
            "asset": "Transformer TR-03",
            "assetId": "ast-5",
            "department": "Traction",
            "sectionId": "S-10",
            "issue": "Substation cooling fan silica gel renewal",
            "priorityScore": 54,
            "criticality": "Low",
            "dueDate": "02 Sep 2026",
            "durationHrs": 3,
            "crewRequired": 4,
            "status": "Pending",
            "aiReasons": [
                "Healthy asset condition (85%)",
                "Routine scheduled task"
            ],
            "aiRecommendation": "Defer to weekly night maintenance window."
        }
    ]
    
    if department and department.upper() != "ALL":
        tasks = [t for t in tasks if t["department"] == department]
    if criticality and criticality.upper() != "ALL":
        tasks = [t for t in tasks if t["criticality"] == criticality]
        
    return tasks

@router.post("", status_code=status.HTTP_201_CREATED)
def create_task(task: TaskBase, current_user: UserProfile = Depends(get_current_user)):
    # Server-Side Departmental Authorization Check
    verify_department_ownership(task.department, current_user)
    return {"message": "Maintenance task created successfully", "task": task}

@router.put("/{task_id}")
def update_task(task_id: str, task: TaskBase, current_user: UserProfile = Depends(get_current_user)):
    # Server-Side Departmental Authorization Check
    verify_department_ownership(task.department, current_user)
    return {"message": f"Maintenance task {task_id} updated successfully", "task": task}

@router.delete("/{task_id}")
def delete_task(task_id: str, department: str, current_user: UserProfile = Depends(get_current_user)):
    # Server-Side Departmental Authorization Check
    verify_department_ownership(department, current_user)
    return {"message": f"Maintenance task {task_id} deleted successfully"}
