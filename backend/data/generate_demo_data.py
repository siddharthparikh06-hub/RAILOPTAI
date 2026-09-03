import random
from datetime import datetime, timedelta

def generate_synthetic_data():
    random.seed(42)
    
    sections = []
    station_names = ["MAS", "AJJ", "KPD", "JTJ", "SA", "ED", "CBE", "TPJ", "MDU", "TVC"]
    for i in range(1, 51):
        s_code = f"S-{i:02d}"
        st1 = station_names[(i - 1) % len(station_names)]
        st2 = station_names[i % len(station_names)]
        sections.append({
            "section_code": s_code,
            "section_name": f"Section {st1}-{st2} Corridor {i}",
            "division": "Chennai Demo Division",
            "start_km": float(i * 15.0),
            "end_km": float(i * 15.0 + 35.0),
            "status": "Operational" if i % 4 != 0 else "Maintenance Window",
            "traffic_density": random.choice(["Low", "Medium", "High"]),
            "active_tasks": random.randint(1, 6),
            "next_window": "14:00–17:00"
        })
        
    assets = []
    departments = ["Engineering", "Traction", "Signal & Telecom"]
    asset_types = ["Signal", "OHE", "Track", "Point Machine", "Transformer", "Bridge"]
    for i in range(1, 121):
        dept = departments[i % len(departments)]
        atype = asset_types[i % len(asset_types)]
        sec_code = f"S-{(i % 50) + 1:02d}"
        health = round(random.uniform(55.0, 98.0), 1)
        risk = "Critical" if health < 65 else ("High" if health < 80 else "Low")
        assets.append({
            "asset_code": f"{atype.upper()}-{i:03d}",
            "name": f"{atype} Unit {i:03d}",
            "asset_type": atype,
            "department": dept,
            "section_id": sec_code,
            "location": f"KM {i * 2.5:.1f}",
            "condition_score": health,
            "health_score": health,
            "failure_probability": round((100.0 - health) / 100.0 * 0.8, 2),
            "risk_level": risk,
            "last_maintenance": "10 Aug 2026",
            "next_maintenance": "28 Aug 2026",
            "recommendation": "Preventive maintenance recommended",
            "status": "Healthy" if health > 70 else "Critical"
        })
        
    tasks = []
    for i in range(1, 521):
        dept = departments[i % len(departments)]
        sec_code = f"S-{(i % 50) + 1:02d}"
        pri_score = round(random.uniform(40.0, 98.0), 1)
        crit = "Critical" if pri_score >= 85 else ("High" if pri_score >= 70 else "Medium")
        tasks.append({
            "task_code": f"TASK-{1000 + i}",
            "title": f"Maintenance activity #{i} for {dept}",
            "description": f"Scheduled preventive maintenance for asset in section {sec_code}",
            "department": dept,
            "task_type": "Preventive",
            "section_id": sec_code,
            "asset_id": f"AST-{i % 120 + 1}",
            "asset_name": f"Asset Segment {i % 120 + 1}",
            "priority": crit,
            "priority_score": pri_score,
            "risk_score": round(pri_score / 100.0, 2),
            "estimated_duration": float(random.choice([2, 3, 4])),
            "crew_required": random.randint(3, 8),
            "status": "Pending" if i % 3 != 0 else "Scheduled"
        })
        
    train_movements = []
    train_types = ["Vande Bharat", "Rajdhani", "Superfast Express", "Passenger", "Freight"]
    for i in range(1, 1001):
        t_type = train_types[i % len(train_types)]
        sec_code = f"S-{(i % 50) + 1:02d}"
        train_movements.append({
            "train_number": f"{12000 + i}",
            "train_name": f"{t_type} #{i}",
            "section_id": sec_code,
            "scheduled_arrival": f"{i % 24:02d}:15",
            "scheduled_departure": f"{i % 24:02d}:25",
            "direction": "UP" if i % 2 == 0 else "DOWN",
            "train_type": t_type,
            "priority": 1 if t_type in ["Vande Bharat", "Rajdhani"] else 3,
            "expected_delay_min": 0 if i % 5 != 0 else random.randint(5, 20),
            "status": "Scheduled"
        })
        
    return {
        "sections": sections,
        "assets": assets,
        "tasks": tasks,
        "train_movements": train_movements
    }

if __name__ == "__main__":
    data = generate_synthetic_data()
    print(f"Generated {len(data['sections'])} sections, {len(data['assets'])} assets, {len(data['tasks'])} tasks, {len(data['train_movements'])} train movements.")
