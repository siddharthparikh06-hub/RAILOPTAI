import os
import sys
import random
import datetime
import numpy as np

# Set fixed seeds for reproducibility
SEED = 42
random.seed(SEED)
np.random.seed(SEED)

def generate_synthetic_data(num_sections=50, num_assets=120, num_tasks=520, num_trains=40, num_movements=1050):
    print(f"Generating synthetic dataset with seed {SEED}...")
    now = datetime.datetime.now()

    # 1. Indian Railway Stations & Sections (Synthetic Northern/Western/Central Corridor Division)
    station_names = [
        ("NDLS", "New Delhi", 28.643, 77.219),
        ("GZB", "Ghaziabad Jn", 28.669, 77.438),
        ("ALJN", "Aligarh Jn", 27.897, 78.083),
        ("CNB", "Kanpur Central", 26.454, 80.350),
        ("PRYJ", "Prayagraj Jn", 25.447, 81.831),
        ("DDU", "Pt. DD Upadhyaya Jn", 25.281, 83.123),
        ("BSB", "Varanasi Jn", 25.326, 82.991),
        ("LKO", "Lucknow Charbagh", 26.831, 80.923),
        ("MB", "Moradabad Jn", 28.835, 78.774),
        ("BE", "Bareilly Jn", 28.344, 79.426),
        ("JP", "Jaipur Jn", 26.920, 75.787),
        ("KOTA", "Kota Jn", 25.213, 75.864),
        ("RTM", "Ratlam Jn", 23.334, 75.037),
        ("ADI", "Ahmedabad Jn", 23.022, 72.601),
        ("BRC", "Vadodara Jn", 22.307, 73.181),
        ("ST", "Surat", 21.204, 72.840),
        ("MMCT", "Mumbai Central", 18.969, 72.819),
        ("PNVL", "Panvel Jn", 18.989, 73.117),
        ("NGP", "Nagpur Jn", 21.152, 79.088),
        ("BPQ", "Balharshah Jn", 19.842, 79.351),
    ]

    stations = []
    for idx, (code, name, lat, lon) in enumerate(station_names, 1):
        stations.append({
            "id": idx,
            "code": code,
            "name": name,
            "division": "Demo Railway Division",
            "tracks_count": random.choice([4, 6, 8]),
            "latitude": lat,
            "longitude": lon,
        })

    sections = []
    section_code_list = []
    for i in range(1, num_sections + 1):
        st1 = stations[(i - 1) % len(stations)]
        st2 = stations[i % len(stations)]
        code = f"S-{i:02d}"
        section_code_list.append(code)
        
        # High traffic corridor bias
        is_high_traffic = (i % 3 == 0)
        density = round(np.random.normal(78, 10) if is_high_traffic else np.random.normal(45, 15), 1)
        density = max(10.0, min(98.0, density))
        
        crit_rating = "CRITICAL" if density > 75 else ("HIGH" if density > 55 else ("MEDIUM" if density > 30 else "LOW"))

        sections.append({
            "id": i,
            "code": code,
            "name": f"{st1['code']} - {st2['code']} Double Line",
            "start_station": st1["code"],
            "end_station": st2["code"],
            "length_km": round(random.uniform(15.0, 65.0), 1),
            "track_count": random.choice([2, 2, 3, 4]),
            "max_speed_kmh": random.choice([110, 130, 160]),
            "train_density_score": density,
            "critical_rating": crit_rating,
        })

    # 2. Railway Assets across 3 Departments
    departments = ["Engineering", "Traction", "Signal & Telecom"]
    asset_types = {
        "Engineering": ["Track Segment", "Turnout Switch", "Bridge Structure", "Level Crossing Gate"],
        "Traction": ["OHE Overhead Line", "Traction Substation", "Transformer Unit", "Section Insulator"],
        "Signal & Telecom": ["Point Machine", "Color Light Signal", "Axle Counter", "Track Circuit", "OF Cable"]
    }

    assets = []
    for i in range(1, num_assets + 1):
        dept = random.choice(departments)
        atype = random.choice(asset_types[dept])
        sec = random.choice(sections)
        
        # Realistic distribution: Critical assets minority (15%), Degraded (25%), Healthy (60%)
        rand_val = random.random()
        if rand_val < 0.15:
            status = "CRITICAL"
            health = round(random.uniform(40.0, 65.0), 1)
            risk = round(random.uniform(75.0, 95.0), 1)
        elif rand_val < 0.40:
            status = "DEGRADED"
            health = round(random.uniform(66.0, 84.0), 1)
            risk = round(random.uniform(45.0, 74.0), 1)
        else:
            status = "HEALTHY"
            health = round(random.uniform(85.0, 99.0), 1)
            risk = round(random.uniform(5.0, 44.0), 1)

        last_maint_days = random.randint(15, 120)
        next_due_days = last_maint_days - random.randint(30, 90)

        assets.append({
            "id": i,
            "asset_tag": f"{dept[:3].upper()}-{atype[:3].upper()}-{sec['code']}-{i:03d}",
            "name": f"{atype} ({sec['name']})",
            "type": atype,
            "department": dept,
            "section_id": sec["id"],
            "station_code": sec["start_station"],
            "status": status,
            "health_score": health,
            "last_maintained": now - datetime.timedelta(days=last_maint_days),
            "next_due": now + datetime.timedelta(days=next_due_days),
            "risk_score": risk
        })

    # 3. Maintenance Tasks (500+ tasks)
    issue_templates = {
        "Engineering": [
            "Rail rail-head wear exceeds threshold",
            "Ballast compaction required on curved track",
            "Switch point tongue rail clearance realignment",
            "Bridge bearing lubrication and joint inspection",
            "Level crossing interlocking check"
        ],
        "Traction": [
            "OHE contact wire height adjustment",
            "Traction transformer oil filtration & insulator wash",
            "Section insulator carbon buildup cleaning",
            "Cathedral insulator replacement",
            "Pantograph interaction stress testing"
        ],
        "Signal & Telecom": [
            "Point machine stroke adjustment & motor testing",
            "LED signal aspect lumen output recalibration",
            "Axle counter reset coil tuning",
            "Track circuit shunt voltage fluctuation repair",
            "Fiber optic cable splice attenuation repair"
        ]
    }

    tasks = []
    for i in range(1, num_tasks + 1):
        ast = random.choice(assets)
        dept = ast["department"]
        desc = random.choice(issue_templates[dept])
        
        # Overdue task minority (~20%)
        is_overdue = (random.random() < 0.22)
        if is_overdue:
            due = now - datetime.timedelta(days=random.randint(1, 30))
            crit = random.choice(["HIGH", "CRITICAL"])
            urgency = random.choice(["URGENT", "EMERGENCY"])
        else:
            due = now + datetime.timedelta(days=random.randint(1, 14))
            crit = random.choice(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
            urgency = random.choice(["ROUTINE", "NORMAL", "URGENT"])

        duration = round(random.choice([1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0]), 1)
        crew = random.choice([3, 4, 5, 6, 8])

        # Priority calculation matching AI Priority engine logic
        crit_weight = {"LOW": 10, "MEDIUM": 30, "HIGH": 65, "CRITICAL": 90}[crit]
        overdue_days = max(0, (now - due).days) if is_overdue else 0
        overdue_weight = min(40, overdue_days * 2)
        safety = round(random.uniform(3.0, 9.5), 1)
        fail_prob = round(random.uniform(0.1, 0.85), 2)
        
        pri_score = round(min(100.0, crit_weight * 0.4 + overdue_weight + safety * 4 + fail_prob * 25), 1)
        risk_lvl = "CRITICAL" if pri_score > 80 else ("HIGH" if pri_score > 60 else ("MEDIUM" if pri_score > 40 else "LOW"))

        tasks.append({
            "id": i,
            "task_code": f"TASK-{1000 + i}",
            "department": dept,
            "asset_id": ast["id"],
            "section_id": ast["section_id"],
            "issue_description": f"{desc} (Asset: {ast['asset_tag']})",
            "criticality": crit,
            "urgency": urgency,
            "est_duration_hrs": duration,
            "crew_required": crew,
            "due_date": due,
            "status": "PENDING",
            "ai_priority_score": pri_score,
            "ai_risk_level": risk_lvl,
            "safety_impact": safety,
            "failure_prob": fail_prob
        })

    # 4. Trains & Movements (1000+ movements)
    train_types = ["VANDE_BHARAT", "RAJDHANI", "EXPRESS", "PASSENGER", "FREIGHT"]
    trains = []
    for t_idx in range(1, num_trains + 1):
        ttype = random.choice(train_types)
        prio = {"VANDE_BHARAT": 1, "RAJDHANI": 1, "EXPRESS": 2, "PASSENGER": 3, "FREIGHT": 4}[ttype]
        trains.append({
            "id": t_idx,
            "train_no": f"{12000 + t_idx}",
            "name": f"IR {ttype.replace('_', ' ').title()} Express {t_idx}",
            "type": ttype,
            "priority_level": prio,
            "origin": random.choice(stations)["code"],
            "destination": random.choice(stations)["code"]
        })

    train_movements = []
    m_id = 1
    for tr in trains:
        for day_offset in range(7):
            start_hour = random.randint(4, 22)
            sec = random.choice(sections)
            entry = now.replace(hour=start_hour, minute=0, second=0) + datetime.timedelta(days=day_offset)
            exit_time = entry + datetime.timedelta(minutes=random.randint(25, 75))
            train_movements.append({
                "id": m_id,
                "train_id": tr["id"],
                "section_id": sec["id"],
                "scheduled_entry": entry,
                "scheduled_exit": exit_time
            })
            m_id += 1
            if m_id > num_movements:
                break
        if m_id > num_movements:
            break

    # 5. Block Windows across 7 days
    block_windows = []
    bw_id = 1
    for sec in sections:
        for day in range(7):
            # High traffic corridors have fewer maintenance windows (e.g. late night 01:00 - 05:00)
            base_date = (now + datetime.timedelta(days=day)).replace(hour=1, minute=0, second=0)
            duration = 4.0 if sec["train_density_score"] > 70 else 6.0
            block_windows.append({
                "id": bw_id,
                "section_id": sec["id"],
                "start_time": base_date,
                "end_time": base_date + datetime.timedelta(hours=duration),
                "allowed_duration_hrs": duration,
                "train_density": sec["train_density_score"] * 0.4
            })
            bw_id += 1
            
            # Afternoon off-peak window for lower traffic sections
            if sec["train_density_score"] <= 70:
                aft_date = base_date.replace(hour=13, minute=0)
                block_windows.append({
                    "id": bw_id,
                    "section_id": sec["id"],
                    "start_time": aft_date,
                    "end_time": aft_date + datetime.timedelta(hours=3.5),
                    "allowed_duration_hrs": 3.5,
                    "train_density": sec["train_density_score"] * 0.6
                })
                bw_id += 1

    return {
        "stations": stations,
        "sections": sections,
        "assets": assets,
        "tasks": tasks,
        "trains": trains,
        "train_movements": train_movements,
        "block_windows": block_windows
    }

if __name__ == "__main__":
    data = generate_synthetic_data()
    print("Generated:")
    print(f"- {len(data['sections'])} Sections")
    print(f"- {len(data['assets'])} Assets")
    print(f"- {len(data['tasks'])} Maintenance Tasks")
    print(f"- {len(data['trains'])} Trains")
    print(f"- {len(data['train_movements'])} Train Movements")
    print(f"- {len(data['block_windows'])} Block Windows")
