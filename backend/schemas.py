import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

# Auth Schemas
class LoginRequest(BaseModel):
    emp_id: str
    password: str
    department: Optional[str] = "Operations"

class UserResponse(BaseModel):
    emp_id: str
    name: str
    department: str
    role: str
    token: Optional[str] = None

# Asset Schemas
class AssetResponse(BaseModel):
    id: int
    asset_tag: str
    name: str
    type: str
    department: str
    section_id: int
    station_code: Optional[str] = None
    status: str
    health_score: float
    risk_score: float

    class Config:
        from_attributes = True

# Task Schemas
class MaintenanceTaskResponse(BaseModel):
    id: int
    task_code: str
    department: str
    asset_id: int
    section_id: int
    issue_description: str
    criticality: str
    urgency: str
    est_duration_hrs: float
    crew_required: int
    due_date: datetime.datetime
    status: str
    ai_priority_score: float
    ai_risk_level: str
    safety_impact: float
    failure_prob: float

    class Config:
        from_attributes = True

class MaintenanceTaskCreate(BaseModel):
    department: str
    asset_id: int
    section_id: int
    issue_description: str
    criticality: str = "MEDIUM"
    urgency: str = "NORMAL"
    est_duration_hrs: float = 2.0
    crew_required: int = 4
    due_date: datetime.datetime

# Optimization Run Schemas
class OptimizationRequest(BaseModel):
    planning_horizon: str = "7_DAYS" # TODAY, 7_DAYS, 30_DAYS
    section_id: Optional[int] = None
    departments: Optional[List[str]] = None
    objective_mode: str = "MAX_AVAILABILITY" # MAX_AVAILABILITY, MIN_TRAIN_DISRUPTION, MAX_COMPLETION, BALANCED

class TrainImpactRequest(BaseModel):
    block_window_id: Optional[int] = None
    section_id: Optional[int] = 1
    duration_hrs: Optional[float] = 4.0

class CopilotQueryRequest(BaseModel):
    question: str

class CopilotQueryResponse(BaseModel):
    question: str
    answer: str
    context_data: Optional[Dict[str, Any]] = None
