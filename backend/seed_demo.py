import os
import sys
import datetime
import hashlib

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from database import engine, Base, SessionLocal
from models import User, Section, Station, Asset, MaintenanceTask, Train, TrainMovement, BlockWindow, BlockPlan, BlockAssignment, ConflictAlert, OptimizationRun, AuditLog
from data.generate_demo_data import generate_synthetic_data

SALT = "railopt_sih_2026_salt"

def hash_password(password: str) -> str:
    return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), SALT.encode('utf-8'), 100000).hex()

def seed_database():
    print("Initializing Database Schema...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("Seeding Users & IR Credentials...")
        users = [
            User(emp_id="CONTROL001", name="Rajesh Sharma (Control Officer)", password_hash=hash_password("demo123"), department="Operations", role="Control Officer"),
            User(emp_id="ENG001", name="Anil Kumar (Sr. DEN)", password_hash=hash_password("demo123"), department="Engineering", role="Engineering Manager"),
            User(emp_id="TRD001", name="Sanjay Verma (Sr. DEE/TRD)", password_hash=hash_password("demo123"), department="Traction", role="Traction Manager"),
            User(emp_id="ST001", name="Priyanka Singh (Sr. DSTE)", password_hash=hash_password("demo123"), department="Signal & Telecom", role="S&T Manager"),
            User(emp_id="DOM001", name="Vikram Mehta (Sr. DOM)", password_hash=hash_password("demo123"), department="Operations", role="Divisional Operations Manager"),
            User(emp_id="ADMIN001", name="System Admin", password_hash=hash_password("demo123"), department="Admin", role="Administrator"),
        ]
        db.add_all(users)

        print("Generating Synthetic Railway Data...")
        data = generate_synthetic_data()

        # Seed Stations
        station_objs = [Station(**st) for st in data["stations"]]
        db.add_all(station_objs)

        # Seed Sections
        section_objs = [Section(**sec) for sec in data["sections"]]
        db.add_all(section_objs)

        # Seed Assets
        asset_objs = [Asset(**ast) for ast in data["assets"]]
        db.add_all(asset_objs)

        # Seed Tasks
        task_objs = [MaintenanceTask(**tsk) for tsk in data["tasks"]]
        db.add_all(task_objs)

        # Seed Trains
        train_objs = [Train(**tr) for tr in data["trains"]]
        db.add_all(train_objs)

        # Seed Movements
        mvmt_objs = [TrainMovement(**mv) for mv in data["train_movements"]]
        db.add_all(mvmt_objs)

        # Seed Block Windows
        bw_objs = [BlockWindow(**bw) for bw in data["block_windows"]]
        db.add_all(bw_objs)

        db.commit()

        print("Seeding SIH Pre-calculated Conflict Alerts & Initial Scenario...")
        alerts = [
            ConflictAlert(
                section_id=1,
                severity="CRITICAL",
                alert_type="OVERLAPPING_BLOCK",
                title="Uncoordinated Overlapping Maintenance on Ghaziabad-Aligarh Section",
                description="Engineering requested 3.5h track tamping block while S&T requested 2.0h Point Machine overhaul in Section S-01 on independent schedules.",
                recommendation="Combine Engineering and S&T activities into a single joint 3.5h block window B-104. Saves 2.0 hours corridor downtime and eliminates 1 train hold-up.",
                potential_savings_hrs=2.0,
                is_resolved=False
            ),
            ConflictAlert(
                section_id=3,
                severity="HIGH",
                alert_type="TRAIN_CONTENTION",
                title="Vande Bharat Express Corridor Conflict on Section S-03",
                description="Independent Traction OHE inspection block overlaps with peak Vande Bharat Express slot (14:30 - 15:45).",
                recommendation="Shift Traction OHE block to low-density night window (01:30 - 05:00). Eliminates 45-minute passenger train delay.",
                potential_savings_hrs=1.5,
                is_resolved=False
            ),
            ConflictAlert(
                section_id=5,
                severity="HIGH",
                alert_type="OVERDUE_TASK",
                title="Overdue Critical Point Machine Task TASK-1042",
                description="Point machine PM-S05-012 is 18 days overdue with failure probability increasing to 0.78.",
                recommendation="Prioritize in next available 2.5h joint block window B-108.",
                potential_savings_hrs=4.0,
                is_resolved=False
            )
        ]
        db.add_all(alerts)
        db.commit()

        # Seed Initial SIH Demo Scenario Optimization Run Plan
        now = datetime.datetime.now()
        initial_plan = BlockPlan(
            plan_code="SIH-DEMO-PLAN-001",
            planning_horizon="7_DAYS",
            total_tasks=len(data["tasks"]),
            scheduled_tasks=int(len(data["tasks"]) * 0.94),
            baseline_downtime_hrs=241.2,
            optimized_downtime_hrs=126.7,
            downtime_saved_hrs=114.5,
            conflicts_avoided=37,
            train_impact_reduction_pct=18.4,
            optimization_score=94.7,
            solver_status="OPTIMAL",
            execution_time_sec=2.84,
            created_at=now
        )
        db.add(initial_plan)
        db.commit()
        db.refresh(initial_plan)

        # Add initial sample block assignments for SIH presentation
        sample_assignments = []
        for i in range(1, 45):
            task = task_objs[i]
            bw = bw_objs[i % len(bw_objs)]
            comb = "Engineering, S&T" if i % 2 == 0 else ("Traction, Engineering" if i % 3 == 0 else "Signal & Telecom")
            sample_assignments.append(
                BlockAssignment(
                    block_plan_id=initial_plan.id,
                    task_id=task.id,
                    block_window_id=bw.id,
                    section_id=task.section_id,
                    scheduled_start=bw.start_time,
                    scheduled_end=bw.start_time + datetime.timedelta(hours=task.est_duration_hrs),
                    department=task.department,
                    combined_departments=comb,
                    crew_assigned=task.crew_required,
                    reasoning=f"Joint departmental block scheduled during low train density window ({bw.train_density:.1f}% density). Combined activities saved {round(task.est_duration_hrs * 0.4, 1)}h downtime."
                )
            )
        db.add_all(sample_assignments)
        db.commit()

        print("Database seeded successfully! Demo credentials ready (CONTROL001 / demo123).")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
