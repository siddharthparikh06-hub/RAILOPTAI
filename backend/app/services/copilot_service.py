from typing import Dict, Any

def process_copilot_query(question: str) -> Dict[str, Any]:
    q = question.lower()
    
    if "b-113" in q or "selected" in q or "block" in q:
        answer = "Combined window BLOCK B-113 (15:00–18:00 on Section S-14) was selected because Engineering (Track T-214), Traction (OHE-27), and S&T (Signal S-104) have compatible maintenance activities in the same section. Combining these tasks into a single 3-hour window saves 4.5 hours of independent corridor downtime while protecting peak Rajdhani express slots."
    elif "downtime" in q or "saved" in q:
        answer = "RAILOPT AI coordinated planning saved 126.5 hours of corridor downtime this week across Chennai Demo Division, representing a 47.5% reduction compared to uncoordinated departmental scheduling."
    elif "critical" in q or "unscheduled" in q:
        answer = "There are currently 31 critical maintenance tasks registered. TASK-1042 (Signal S-104) is 2 days overdue and has been prioritized in Block B-113."
    elif "department" in q or "share" in q:
        answer = "Engineering (P-Way), Traction Distribution (TRD), and Signal & Telecom (S&T) can share joint maintenance blocks whenever their required section closures overlap."
    else:
        answer = "Based on Chennai Demo Division operational data: Combining compatible departmental maintenance into shared block windows increases overall asset availability from 87.4% to 94.7% while avoiding 37 section conflicts."

    return {
        "answer": answer,
        "badge": "AI DEMO RESPONSE",
        "data": {
            "downtime_saved_hours": 126.5,
            "asset_availability": 94.7
        }
    }
