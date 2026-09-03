from fastapi import APIRouter
from app.db.schemas import CopilotQueryRequest, CopilotQueryResponse
from app.services.copilot_service import process_copilot_query

router = APIRouter(prefix="/copilot", tags=["RailOpt Copilot"])

@router.post("/query", response_model=CopilotQueryResponse)
def query_copilot(request: CopilotQueryRequest):
    res = process_copilot_query(request.question)
    return CopilotQueryResponse(
        answer=res["answer"],
        badge=res["badge"],
        data=res.get("data")
    )
