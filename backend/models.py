import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    emp_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    password_hash = Column(String(255), nullable=False)
    department = Column(String(50), nullable=False)  # Engineering, Traction, S&T, Operations, Admin
    role = Column(String(50), nullable=False)        # Control Officer, Manager, Admin
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Section(Base):
    __tablename__ = "sections"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    start_station = Column(String(50), nullable=False)
    end_station = Column(String(50), nullable=False)
    length_km = Column(Float, nullable=False)
    track_count = Column(Integer, default=2)
    max_speed_kmh = Column(Integer, default=110)
    train_density_score = Column(Float, default=50.0) # 0 to 100
    critical_rating = Column(String(20), default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL

    assets = relationship("Asset", back_populates="section")
    tasks = relationship("MaintenanceTask", back_populates="section")
    block_windows = relationship("BlockWindow", back_populates="section")

class Station(Base):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(10), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    division = Column(String(50), default="Northern Division")
    tracks_count = Column(Integer, default=4)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    asset_tag = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False) # Track, Bridge, Point Machine, Signal, OHE, Transformer, Cable, Axle Counter
    department = Column(String(50), nullable=False) # Engineering, Traction, Signal & Telecom
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=False)
    station_code = Column(String(10), nullable=True)
    status = Column(String(30), default="HEALTHY") # HEALTHY, DEGRADED, CRITICAL, UNDER_MAINTENANCE
    health_score = Column(Float, default=95.0) # 0 to 100
    last_maintained = Column(DateTime, nullable=True)
    next_due = Column(DateTime, nullable=True)
    risk_score = Column(Float, default=10.0)

    section = relationship("Section", back_populates="assets")
    tasks = relationship("MaintenanceTask", back_populates="asset")

class MaintenanceTask(Base):
    __tablename__ = "maintenance_tasks"

    id = Column(Integer, primary_key=True, index=True)
    task_code = Column(String(30), unique=True, index=True, nullable=False)
    department = Column(String(50), nullable=False) # Engineering, Traction, Signal & Telecom
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=False)
    issue_description = Column(Text, nullable=False)
    criticality = Column(String(20), default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    urgency = Column(String(20), default="NORMAL")     # ROUTINE, NORMAL, URGENT, EMERGENCY
    est_duration_hrs = Column(Float, default=2.0)
    crew_required = Column(Integer, default=4)
    due_date = Column(DateTime, nullable=False)
    status = Column(String(30), default="PENDING")     # PENDING, SCHEDULED, IN_PROGRESS, COMPLETED
    ai_priority_score = Column(Float, default=50.0)
    ai_risk_level = Column(String(20), default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    safety_impact = Column(Float, default=5.0)           # 1-10
    failure_prob = Column(Float, default=0.2)           # 0.0 - 1.0

    asset = relationship("Asset", back_populates="tasks")
    section = relationship("Section", back_populates="tasks")

class Train(Base):
    __tablename__ = "trains"

    id = Column(Integer, primary_key=True, index=True)
    train_no = Column(String(20), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    type = Column(String(30), nullable=False) # VANDE_BHARAT, RAJDHANI, EXPRESS, PASSENGER, FREIGHT
    priority_level = Column(Integer, default=1) # 1 highest (Vande Bharat), 5 lowest (Freight)
    origin = Column(String(50), nullable=False)
    destination = Column(String(50), nullable=False)

class TrainMovement(Base):
    __tablename__ = "train_movements"

    id = Column(Integer, primary_key=True, index=True)
    train_id = Column(Integer, ForeignKey("trains.id"), nullable=False)
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=False)
    scheduled_entry = Column(DateTime, nullable=False)
    scheduled_exit = Column(DateTime, nullable=False)

class BlockWindow(Base):
    __tablename__ = "block_windows"

    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    allowed_duration_hrs = Column(Float, nullable=False)
    train_density = Column(Float, default=30.0) # Density during window

    section = relationship("Section", back_populates="block_windows")

class BlockPlan(Base):
    __tablename__ = "block_plans"

    id = Column(Integer, primary_key=True, index=True)
    plan_code = Column(String(50), unique=True, index=True, nullable=False)
    planning_horizon = Column(String(20), default="7_DAYS") # TODAY, 7_DAYS, 30_DAYS
    total_tasks = Column(Integer, default=0)
    scheduled_tasks = Column(Integer, default=0)
    baseline_downtime_hrs = Column(Float, default=0.0)
    optimized_downtime_hrs = Column(Float, default=0.0)
    downtime_saved_hrs = Column(Float, default=0.0)
    conflicts_avoided = Column(Integer, default=0)
    train_impact_reduction_pct = Column(Float, default=0.0)
    optimization_score = Column(Float, default=90.0)
    solver_status = Column(String(30), default="OPTIMAL")
    execution_time_sec = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    assignments = relationship("BlockAssignment", back_populates="block_plan")

class BlockAssignment(Base):
    __tablename__ = "block_assignments"

    id = Column(Integer, primary_key=True, index=True)
    block_plan_id = Column(Integer, ForeignKey("block_plans.id"), nullable=False)
    task_id = Column(Integer, ForeignKey("maintenance_tasks.id"), nullable=False)
    block_window_id = Column(Integer, ForeignKey("block_windows.id"), nullable=True)
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=False)
    scheduled_start = Column(DateTime, nullable=False)
    scheduled_end = Column(DateTime, nullable=False)
    department = Column(String(50), nullable=False)
    combined_departments = Column(String(200), nullable=True) # e.g. "Engineering, S&T"
    crew_assigned = Column(Integer, default=4)
    reasoning = Column(Text, nullable=True)

    block_plan = relationship("BlockPlan", back_populates="assignments")

class OptimizationRun(Base):
    __tablename__ = "optimization_runs"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(String(30), default="OPTIMAL")
    solver_name = Column(String(50), default="Google OR-Tools CP-SAT")
    execution_time_sec = Column(Float, default=0.0)
    variables_count = Column(Integer, default=0)
    constraints_count = Column(Integer, default=0)
    objective_val = Column(Float, default=0.0)
    baseline_val = Column(Float, default=0.0)
    improvement_pct = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ConflictAlert(Base):
    __tablename__ = "conflict_alerts"

    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=False)
    severity = Column(String(20), default="HIGH") # LOW, MEDIUM, HIGH, CRITICAL
    alert_type = Column(String(50), nullable=False) # OVERLAPPING_BLOCK, TRAIN_CONTENTION, CREW_SHORTAGE, OVERDUE_TASK
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    recommendation = Column(Text, nullable=False)
    potential_savings_hrs = Column(Float, default=2.0)
    is_resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(50), default="SYSTEM")
    action = Column(String(100), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    details = Column(Text, nullable=True)
