from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    department = Column(String, nullable=False)
    role = Column(String, nullable=False)
    password_hash = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Section(Base):
    __tablename__ = "sections"
    
    id = Column(Integer, primary_key=True, index=True)
    section_code = Column(String, unique=True, index=True, nullable=False)
    section_name = Column(String, nullable=False)
    division = Column(String, default="Chennai Demo Division")
    start_km = Column(Float, default=0.0)
    end_km = Column(Float, default=50.0)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    status = Column(String, default="Operational")
    traffic_density = Column(String, default="High")
    active_tasks = Column(Integer, default=0)
    next_window = Column(String, default="14:00–17:00")
    created_at = Column(DateTime, default=datetime.utcnow)

class Asset(Base):
    __tablename__ = "assets"
    
    id = Column(Integer, primary_key=True, index=True)
    asset_code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    asset_type = Column(String, nullable=False) # Track, OHE, Signal, Point Machine, Transformer, Bridge
    department = Column(String, nullable=False) # Engineering, Traction, Signal & Telecom
    section_id = Column(String, nullable=False)
    location = Column(String, nullable=True)
    condition_score = Column(Float, default=80.0)
    health_score = Column(Float, default=80.0)
    failure_probability = Column(Float, default=0.15)
    risk_level = Column(String, default="Medium")
    last_maintenance = Column(String, nullable=True)
    next_maintenance = Column(String, nullable=True)
    recommendation = Column(String, nullable=True)
    status = Column(String, default="Healthy")
    created_at = Column(DateTime, default=datetime.utcnow)

class MaintenanceTask(Base):
    __tablename__ = "maintenance_tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    task_code = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    department = Column(String, nullable=False)
    task_type = Column(String, nullable=True)
    section_id = Column(String, nullable=False)
    asset_id = Column(String, nullable=True)
    asset_name = Column(String, nullable=True)
    priority = Column(String, default="Medium")
    priority_score = Column(Float, default=70.0)
    risk_score = Column(Float, default=0.2)
    estimated_duration = Column(Float, default=2.0)
    crew_required = Column(Integer, default=4)
    requested_start = Column(String, nullable=True)
    deadline = Column(String, nullable=True)
    required_resources = Column(String, nullable=True)
    status = Column(String, default="Pending")
    ai_reasons = Column(JSON, nullable=True)
    ai_recommendation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class BlockRequest(Base):
    __tablename__ = "block_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    block_code = Column(String, unique=True, index=True, nullable=False)
    task_id = Column(String, nullable=True)
    department = Column(String, nullable=False)
    section_id = Column(String, nullable=False)
    section_name = Column(String, nullable=True)
    requested_start = Column(String, nullable=False)
    requested_end = Column(String, nullable=False)
    duration_minutes = Column(Integer, default=180)
    priority = Column(String, default="Routine")
    status = Column(String, default="Pending")
    train_impact = Column(String, default="Low")
    tasks_count = Column(Integer, default=1)
    departments_involved = Column(JSON, nullable=True)
    ai_recommendation = Column(Text, nullable=True)
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class TrainMovement(Base):
    __tablename__ = "train_movements"
    
    id = Column(Integer, primary_key=True, index=True)
    train_number = Column(String, index=True, nullable=False)
    train_name = Column(String, nullable=False)
    section_id = Column(String, nullable=False)
    scheduled_arrival = Column(String, nullable=False)
    scheduled_departure = Column(String, nullable=False)
    direction = Column(String, default="UP")
    train_type = Column(String, default="Express") # Vande Bharat, Rajdhani, Express, Goods
    priority = Column(Integer, default=1)
    expected_delay_min = Column(Integer, default=0)
    rerouted = Column(Boolean, default=False)
    reroute_path = Column(String, nullable=True)
    passenger_impact = Column(String, default="Low")
    goods_impact = Column(String, default="Low")
    status = Column(String, default="Scheduled")

class OptimizedBlock(Base):
    __tablename__ = "optimized_blocks"
    
    id = Column(Integer, primary_key=True, index=True)
    optimization_run_id = Column(String, index=True, nullable=False)
    block_code = Column(String, nullable=False)
    section_id = Column(String, nullable=False)
    department = Column(String, nullable=False)
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    duration_minutes = Column(Integer, default=180)
    status = Column(String, default="Scheduled")
    impact_score = Column(Float, default=10.0)

class Conflict(Base):
    __tablename__ = "conflicts"
    
    id = Column(Integer, primary_key=True, index=True)
    block_id = Column(String, nullable=True)
    train_movement_id = Column(String, nullable=True)
    section_id = Column(String, nullable=False)
    conflict_type = Column(String, nullable=False) # Block-vs-Block, Block-vs-Train, Resource
    severity = Column(String, default="High")
    description = Column(Text, nullable=True)
    delay_minutes = Column(Integer, default=0)
    resolved = Column(Boolean, default=False)
    timestamp = Column(String, default="Recently")
    created_at = Column(DateTime, default=datetime.utcnow)

class OptimizationRun(Base):
    __tablename__ = "optimization_runs"
    
    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(String, unique=True, index=True, nullable=False)
    objective = Column(String, default="Maximize Asset Availability")
    horizon_start = Column(String, nullable=True)
    horizon_end = Column(String, nullable=True)
    status = Column(String, default="Completed")
    tasks_count = Column(Integer, default=248)
    blocks_count = Column(Integer, default=41)
    baseline_block_hours = Column(Float, default=184.0)
    optimized_block_hours = Column(Float, default=121.0)
    baseline_downtime = Column(Float, default=241.0)
    optimized_downtime = Column(Float, default=126.0)
    baseline_conflicts = Column(Integer, default=29)
    optimized_conflicts = Column(Integer, default=3)
    improvement_pct = Column(Float, default=18.4)
    downtime_saved_hours = Column(Float, default=126.5)
    assets_availability_before = Column(Float, default=87.4)
    assets_availability_after = Column(Float, default=94.7)
    created_at = Column(DateTime, default=datetime.utcnow)
