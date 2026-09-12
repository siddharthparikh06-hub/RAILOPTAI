from typing import Dict, Any, Optional

def process_copilot_query(question: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    q = question.lower()
    ctx = context or {}
    res = ctx.get("latestResult") or {}
    datasets = ctx.get("datasets") or {}
    maint_tasks = datasets.get("maintenance") or []

    downtime_saved = res.get("estimatedDowntimeSavedHrs") or res.get("downtime_saved_hours") or 0.0
    tasks_count = res.get("tasksConsidered") or len(maint_tasks)
    rec_blocks = res.get("recommendedBlocks") or len(res.get("assignments", []))
    asset_score = res.get("assetAvailabilityScore") or res.get("asset_availability_score") or 0.0

    if "downtime" in q or "saved" in q:
        if downtime_saved > 0:
            answer = f"Based on active calculations, joint block coordination saved **{downtime_saved} hours** of corridor downtime across evaluated maintenance tasks."
        else:
            answer = "No downtime savings calculated yet for current file data. Load your maintenance file and run the Block Planner calculation."
    elif "block" in q or "selected" in q or "schedule" in q or "b-113" in q:
        assignments = res.get("assignments") or []
        if assignments:
            first = assignments[0]
            answer = f"The CP-SAT optimizer scheduled **{rec_blocks} joint block window(s)**. For instance, task **{first.get('task_code')}** on section **{first.get('section_id')}** is scheduled at **{first.get('start')}**."
        else:
            answer = "No block schedules computed yet. Trigger the Automatic Block Planner to generate joint departmental schedules."
    elif "critical" in q or "unscheduled" in q:
        crit_count = sum(1 for t in maint_tasks if str(t.get("criticality", "")).lower() == "critical")
        answer = f"There are currently **{crit_count} critical maintenance request(s)** registered in your uploaded data out of **{tasks_count} total tasks**."
    elif "department" in q or "share" in q:
        answer = "Engineering (P-Way), Traction Distribution (TRD), and Signal & Telecom (S&T) share joint maintenance blocks whenever their required section closures overlap."
    else:
        if res:
            answer = f"Operational Summary: **{tasks_count} tasks** evaluated. Asset availability score reached **{asset_score}%** with **{rec_blocks} recommended block windows**."
        else:
            answer = f"Data Intake Status: **{tasks_count} tasks** and **{len(datasets.get('timetable', []))} train movements** loaded. Run optimization to calculate exact metrics."

    return {
        "answer": answer,
        "badge": "DATA-BACKED AI RESPONSE",
        "data": {
            "downtime_saved_hours": downtime_saved,
            "asset_availability": asset_score
        }
    }
