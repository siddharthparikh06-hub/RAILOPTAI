from fastapi import APIRouter
from app.db.schemas import OptimizationGenerateRequest, OptimizationResultResponse
from app.services.optimization_engine import optimizer

router = APIRouter(prefix="/optimization", tags=["Optimization Engine"])

@router.post("/generate", response_model=OptimizationResultResponse)
def generate_optimization(request: OptimizationGenerateRequest):
    res = optimizer.solve_block_schedule(
        tasks=[], 
        horizon_days=request.horizon_days, 
        objective=request.objective
    )
    return OptimizationResultResponse(
        status=res["status"],
        tasks_considered=res["tasks_considered"],
        available_windows=res["available_windows"],
        conflicts_detected=res["conflicts_detected"],
        recommended_blocks=res["recommended_blocks"],
        downtime_saved_hours=res["downtime_saved_hours"],
        train_impact_reduction_pct=res["train_impact_reduction_pct"],
        asset_availability_score=res["asset_availability_score"],
        baseline=res["baseline"],
        optimized=res["optimized"],
        improvement=res["improvement"]
    )
