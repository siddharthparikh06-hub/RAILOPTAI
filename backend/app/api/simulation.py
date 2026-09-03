from fastapi import APIRouter
from app.db.schemas import SimulationRequest, SimulationResponse
from app.services.train_impact_simulator import simulate_train_impact

router = APIRouter(prefix="/simulation", tags=["Simulation"])

@router.post("/train-impact", response_model=SimulationResponse)
def run_train_simulation(request: SimulationRequest):
    res = simulate_train_impact(request.block_id)
    return SimulationResponse(**res)
