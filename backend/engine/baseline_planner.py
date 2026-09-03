import datetime

def run_baseline_planning(tasks, block_windows, sections):
    """
    Simulates Independent Departmental Planning.
    Engineering, Traction, and Signal & Telecom schedule their tasks independently
    without coordinating shared block windows.
    """
    scheduled_assignments = []
    total_downtime_hrs = 0.0
    conflicts_count = 0
    section_window_map = {}

    # Sort tasks by due date
    sorted_tasks = sorted(tasks, key=lambda t: t.get("due_date", datetime.datetime.now()))

    for task in sorted_tasks:
        sec_id = task["section_id"]
        dept = task["department"]
        duration = task["est_duration_hrs"]

        # Find first available block window for this section
        sec_windows = [bw for bw in block_windows if bw["section_id"] == sec_id]
        if not sec_windows:
            continue

        target_bw = sec_windows[task["id"] % len(sec_windows)]
        start_time = target_bw["start_time"]
        end_time = start_time + datetime.timedelta(hours=duration)

        # In baseline, each task claims a full independent downtime duration
        total_downtime_hrs += duration

        # Detect conflicts: if another department already scheduled a block on this section at overlapping time
        key = f"{sec_id}_{start_time.strftime('%Y%m%d_%H')}"
        if key in section_window_map and section_window_map[key] != dept:
            conflicts_count += 1
        else:
            section_window_map[key] = dept

        scheduled_assignments.append({
            "task_id": task["id"],
            "task_code": task["task_code"],
            "department": dept,
            "section_id": sec_id,
            "scheduled_start": start_time,
            "scheduled_end": end_time,
            "combined_departments": dept, # No combination in baseline
            "downtime_hrs": duration,
            "reasoning": f"Independent {dept} block scheduled uncoordinatedly."
        })

    # Baseline train delay impact factor
    train_impact_pct = round(min(35.0, 12.0 + (conflicts_count * 0.45) + (total_downtime_hrs * 0.04)), 1)

    return {
        "assignments": scheduled_assignments,
        "total_tasks": len(tasks),
        "scheduled_tasks": len(scheduled_assignments),
        "total_downtime_hrs": round(total_downtime_hrs, 1),
        "conflicts_count": conflicts_count,
        "train_impact_pct": train_impact_pct
    }
