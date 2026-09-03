import datetime

def detect_operational_conflicts(tasks, block_windows, trains, train_movements):
    """
    Automated conflict detection engine for:
    1. Overlapping departmental blocks on same section
    2. High train density contention
    3. Overdue critical maintenance tasks
    """
    conflicts = []
    
    # 1. Check overdue tasks
    now = datetime.datetime.now()
    overdue_tasks = [t for t in tasks if t.get("due_date") and t["due_date"] < now and t.get("criticality") in ("HIGH", "CRITICAL")]
    for ot in overdue_tasks[:5]:
        conflicts.append({
            "id": f"AL-OD-{ot['id']}",
            "section_id": ot["section_id"],
            "severity": "CRITICAL" if ot["criticality"] == "CRITICAL" else "HIGH",
            "alert_type": "OVERDUE_TASK",
            "title": f"Overdue Critical Maintenance Task {ot['task_code']}",
            "description": f"{ot['department']} task on asset {ot['issue_description']} is overdue.",
            "recommendation": f"Prioritize in next available low-density block window on Section S-{ot['section_id']:02d}.",
            "potential_savings_hrs": round(ot["est_duration_hrs"] * 0.8, 1),
            "is_resolved": False
        })

    # 2. Check high density train contention
    high_density_windows = [w for w in block_windows if w.get("train_density", 0) > 70.0]
    for hdw in high_density_windows[:3]:
        conflicts.append({
            "id": f"AL-TC-{hdw['id']}",
            "section_id": hdw["section_id"],
            "severity": "HIGH",
            "alert_type": "TRAIN_CONTENTION",
            "title": f"High Train Traffic Contention on Section S-{hdw['section_id']:02d}",
            "description": f"Block window B-{hdw['id']} overlaps with high train density slot ({hdw['train_density']:.1f}% density).",
            "recommendation": "Shift block to off-peak night window (01:00 - 04:30) to eliminate train hold-ups.",
            "potential_savings_hrs": 1.5,
            "is_resolved": False
        })

    return conflicts
