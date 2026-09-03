import sys
import os

# Add parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.database import engine, SessionLocal, Base
from app.db.models import User, Section, Asset, MaintenanceTask, TrainMovement
from data.generate_demo_data import generate_synthetic_data

def seed_db():
    print("Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if default user CONTROL001 exists
        user = db.query(User).filter(User.employee_id == "CONTROL001").first()
        if not user:
            print("Creating default demo user CONTROL001...")
            demo_user = User(
                employee_id="CONTROL001",
                name="Demo Control Officer",
                department="Operations Control Office",
                role="Control Officer",
                password_hash="demo123"
            )
            db.add(demo_user)
            db.commit()
            
        print("Generating synthetic demo dataset (50 sections, 120 assets, 520 tasks, 1000 train movements)...")
        synthetic_data = generate_synthetic_data()
        
        # Seed Sections if empty
        if db.query(Section).count() == 0:
            print("Seeding sections...")
            for s in synthetic_data["sections"]:
                db.add(Section(**s))
            db.commit()
            
        # Seed Assets if empty
        if db.query(Asset).count() == 0:
            print("Seeding assets...")
            for a in synthetic_data["assets"]:
                db.add(Asset(**a))
            db.commit()
            
        # Seed Tasks if empty
        if db.query(MaintenanceTask).count() == 0:
            print("Seeding tasks...")
            for t in synthetic_data["tasks"]:
                db.add(MaintenanceTask(**t))
            db.commit()
            
        # Seed Train Movements if empty
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
