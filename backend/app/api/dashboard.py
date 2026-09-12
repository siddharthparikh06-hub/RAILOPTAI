from fastapi import APIRouter
from app.db.schemas import DashboardSummaryResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary():
    return DashboardSummaryResponse(
        asset_availability=94.7,
        availability_change=8.3,
        downtime_saved_hours=126.5,
        conflicts_avoided=37,
        active_blocks=12,
        pending_requests=31,
        high_risk_assets=7,
        train_impact_reduction=-18.4,
        departments_workload=[
            {"name": "Engineering", "percentage": 42, "color": "#3B82F6"},
            {"name": "Traction", "percentage": 31, "color": "#F59E0B"},
            {"name": "S&T", "percentage": 27, "color": "#10B981"}
        ],
        weekly_utilization=[
            {"day": "Mon", "baseline": 32.5, "optimized": 18.0},
            {"day": "Tue", "baseline": 38.0, "optimized": 21.5},
            {"day": "Wed", "baseline": 42.0, "optimized": 22.0},
            {"day": "Thu", "baseline": 35.0, "optimized": 19.5},
            {"day": "Fri", "baseline": 29.0, "optimized": 15.0},
            {"day": "Sat", "baseline": 45.0, "optimized": 24.0},
            {"day": "Sun", "baseline": 20.0, "optimized": 10.5}
        ]
    )
