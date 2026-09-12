from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.db.models import Asset
from app.db.schemas import AssetResponse, AssetBase

router = APIRouter(prefix="/assets", tags=["Assets"])

@router.get("", response_model=List[AssetResponse])
def get_assets(
    department: Optional[str] = None, 
    section_id: Optional[str] = None, 
    asset_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Asset)
    if department and department.upper() != "ALL":
        query = query.filter(Asset.department == department)
    if section_id:
        query = query.filter(Asset.section_id == section_id)
    if asset_type:
        query = query.filter(Asset.asset_type == asset_type)
    
    results = query.all()
    if not results:
        # Return synthetic default asset inventory
        return [
            AssetResponse(
                id=1, asset_code="Signal S-104", name="Color Light Signal S-104", 
                asset_type="Signal", department="Signal & Telecom", section_id="S-14", 
                location="KM 142.5", health_score=62.0, risk_level="Critical", 
                last_maintenance="12 Aug 2026", next_maintenance="26 Aug 2026", 
                recommendation="Schedule in next available block", status="Critical", 
                created_at="2026-08-26T10:00:00"
            ),
            AssetResponse(
                id=2, asset_code="OHE-27", name="Cathedral Overhead Line OHE-27", 
                asset_type="OHE", department="Traction", section_id="S-12", 
                location="KM 88.0", health_score=78.0, risk_level="High", 
                last_maintenance="05 Aug 2026", next_maintenance="27 Aug 2026", 
                recommendation="Insulator inspection and tensioning", status="Healthy", 
                created_at="2026-08-26T10:00:00"
            ),
            AssetResponse(
                id=3, asset_code="Track T-214", name="Curved Track Segment T-214", 
                asset_type="Track", department="Engineering", section_id="S-18", 
                location="KM 214.2", health_score=74.0, risk_level="Medium", 
                last_maintenance="01 Aug 2026", next_maintenance="29 Aug 2026", 
                recommendation="Ballast tamping and rail alignment", status="Healthy", 
                created_at="2026-08-26T10:00:00"
            ),
            AssetResponse(
                id=4, asset_code="Point PM-08", name="Motorized Point Machine PM-08", 
                asset_type="Point Machine", department="Signal & Telecom", section_id="S-14", 
                location="KM 143.1", health_score=58.0, risk_level="Critical", 
                last_maintenance="20 Jul 2026", next_maintenance="25 Aug 2026", 
                recommendation="Immediate motor contact cleaning", status="Critical", 
                created_at="2026-08-26T10:00:00"
            ),
            AssetResponse(
                id=5, asset_code="Transformer TR-03", name="Traction Substation Transformer TR-03", 
                asset_type="Transformer", department="Traction", section_id="S-10", 
                location="KM 35.0", health_score=85.0, risk_level="Low", 
                last_maintenance="15 Aug 2026", next_maintenance="15 Sep 2026", 
                recommendation="Routine oil filtration", status="Healthy", 
                created_at="2026-08-26T10:00:00"
            )
        ]
    return results

@router.get("/{asset_id}")
def get_asset_by_id(asset_id: int, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset
