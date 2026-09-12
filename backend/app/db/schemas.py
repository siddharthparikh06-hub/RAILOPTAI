from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ENGINEERING = "ENGINEERING"
    TRACTION = "TRACTION"
    SIGNAL_TELECOM = "SIGNAL_TELECOM"

# --- Auth Schemas ---
class LoginRequest(BaseModel):
    employee_id: str
    password: str

class UserProfile(BaseModel):
    id: Optional[str] = None
    employee_id: str
    name: str
    department: str
    role: UserRole
    is_active: bool = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile

# --- Dashboard Schemas ---
class DashboardSummaryResponse(BaseModel):
    asset_availability: float = 94.7
    availability_change: float = 8.3
    downtime_saved_hours: float = 126.5
    conflicts_avoided: int = 37
    active_blocks: int = 12
    pending_requests: int = 31
    high_risk_assets: int = 7
    train_impact_reduction: float = -18.4
    departments_workload: List[Any] = []
    weekly_utilization: List[Any] = []

# --- Asset Schemas ---
class AssetBase(BaseModel):
    asset_code: str
    name: str
    asset_type: str
    department: str
    section_id: str
    location: Optional[str] = None
    health_score: float = 80.0
    risk_level: str = "Medium"
    last_maintenance: Optional[str] = None
    next_maintenance: Optional[str] = None
    recommendation: Optional[str] = None
    status: str = "Healthy"

class AssetResponse(AssetBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# --- Maintenance Task Schemas ---
class TaskBase(BaseModel):
    task_code: str
    title: str
    description: str
    department: str
    section_id: str
    asset_id: Optional[str] = None
    asset_name: Optional[str] = None
    priority: str = "Medium"
    priority_score: float = 70.0
    risk_score: float = 0.2
    estimated_duration: float = 2.0
    crew_required: int = 4
    requested_start: Optional[str] = None
    deadline: Optional[str] = None
    status: str = "Pending"
    ai_reasons: Optional[List[str]] = None
    ai_recommendation: Optional[str] = None

class TaskResponse(TaskBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# --- Block Request Schemas ---
class BlockRequestBase(BaseModel):
    block_code: str
    task_id: Optional[str] = None
    department: str
    section_id: str
    section_name: Optional[str] = None
    requested_start: str
    requested_end: str
    duration_minutes: int = 180
    priority: str = "Routine"
    status: str = "Pending"
    train_impact: str = "Low"
    tasks_count: int = 1
    departments_involved: Optional[List[str]] = None
    ai_recommendation: Optional[str] = None

class BlockRequestResponse(BlockRequestBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# --- Train Movement Schemas ---
class TrainMovementBase(BaseModel):
    train_number: str
    train_name: str
    section_id: str
    scheduled_arrival: str
    scheduled_departure: str
    direction: str = "UP"
    train_type: str = "Express"
    priority: int = 1
    expected_delay_min: int = 0
    rerouted: bool = False
    reroute_path: Optional[str] = None
    passenger_impact: str = "Low"
    goods_impact: str = "Low"
    status: str = "Scheduled"

class TrainMovementResponse(TrainMovementBase):
    id: int
    class Config:
        from_attributes = True

# --- Conflict Schemas ---
class ConflictBase(BaseModel):
    block_id: Optional[str] = None
    train_movement_id: Optional[str] = None
    section_id: str
    conflict_type: str
    severity: str = "High"
    description: Optional[str] = None
    delay_minutes: int = 0
    resolved: bool = False
    timestamp: str = "Recently"

class ConflictResponse(ConflictBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# --- Optimization Schemas ---
class OptimizationGenerateRequest(BaseModel):
    horizon_days: int = 7
    division: str = "Chennai Demo Division"
    objective: str = "Maximize Asset Availability"
    tasks: List[dict] = []
    train_movements: List[dict] = []
    sections: List[dict] = []
    crews: List[dict] = []

class OptimizationResultResponse(BaseModel):
    status: str = "OPTIMIZATION COMPLETE"
    tasks_considered: int = 248
    available_windows: int = 96
    conflicts_detected: int = 37
    recommended_blocks: int = 41
    downtime_saved_hours: float = 126.5
    train_impact_reduction_pct: float = 18.4
    asset_availability_score: float = 94.7
    baseline: dict = {}
    optimized: dict = {}
    improvement: dict = {}
    assignments: List[dict] = []
    input_validation: dict = {}

# --- Simulation Schemas ---
class SimulationRequest(BaseModel):
    block_id: str = "blk-3"

class SimulationResponse(BaseModel):
    trains_analyzed: int = 42
    potentially_affected: int = 6
    expected_delay_min: int = 8
    rerouted_trains: int = 2
    passenger_impact: str = "Low"
    goods_impact: str = "Medium"
    movements: List[TrainMovementResponse] = []

# --- Copilot Schemas ---
class CopilotQueryRequest(BaseModel):
    question: str
    context: Optional[dict] = None

class CopilotQueryResponse(BaseModel):
    answer: str
    badge: str = "AI DEMO RESPONSE"
    data: Optional[dict] = None
