import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.database import engine, SessionLocal, Base
from app.db.models import User, Section, Asset, MaintenanceTask, TrainMovement
from data.generate_demo_data import generate_synthetic_data

def seed_db():
    print("Initializing database schema...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        demo_accounts = [
            {
                "employee_id": "ENG001",
                "name": "Demo Engineering Officer",
                "department": "Engineering / P-Way",
                "role": "ENGINEERING",
                "password_hash": "demo123"
            },
            {
                "employee_id": "TRD001",
                "name": "Demo Traction Officer",
                "department": "Traction Distribution / OHE",
                "role": "TRACTION",
                "password_hash": "demo123"
            },
            {
                "employee_id": "SNT001",
                "name": "Demo Signal & Telecom Officer",
                "department": "Signal & Telecommunication / S&T",
                "role": "SIGNAL_TELECOM",
                "password_hash": "demo123"
            },
            {
                "employee_id": "CONTROL001",
                "name": "Demo Control Officer",
                "department": "Operations Control Office",
                "role": "ENGINEERING",
                "password_hash": "demo123"
            }
        ]
        
        for acc in demo_accounts:
            existing = db.query(User).filter(User.employee_id == acc["employee_id"]).first()
            if not existing:
                print(f"Creating demo user {acc['employee_id']} ({acc['role']})...")
                db.add(User(**acc))
        db.commit()

        print("Generating synthetic demo dataset (50 sections, 120 assets, 520 tasks, 1000 train movements)...")
        synthetic_data = generate_synthetic_data()
        
        if db.query(Section).count() == 0:
            print("Seeding sections...")
            for s in synthetic_data["sections"]:
                db.add(Section(**s))
            db.commit()
            
        if db.query(Asset).count() == 0:
            print("Seeding assets...")
            for a in synthetic_data["assets"]:
                db.add(Asset(**a))
            db.commit()
            
        if db.query(MaintenanceTask).count() == 0:
            print("Seeding tasks...")
            for t in synthetic_data["tasks"]:
                db.add(MaintenanceTask(**t))
            db.commit()
            
        if db.query(TrainMovement).count() == 0:
            print("Seeding train movements...")
            for tm in synthetic_data["train_movements"]:
                db.add(TrainMovement(**tm))
            db.commit()
            
        print("[OK] Database seeding completed successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
