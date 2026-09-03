from fastapi import APIRouter

router = APIRouter(prefix="/movements", tags=["Train Movements"])

@router.get("")
def get_train_movements():
    return [
        {
            "id": "tm-1",
            "trainId": "t-12002",
            "trainNo": "20608",
            "trainName": "Vande Bharat Express",
            "sectionId": "S-14",
            "scheduledTime": "15:15",
            "expectedDelayMin": 0,
            "rerouted": False,
            "passengerImpact": "Low",
            "goodsImpact": "Low"
        },
        {
            "id": "tm-2",
            "trainId": "t-12302",
            "trainNo": "12622",
            "trainName": "Tamil Nadu Express",
            "sectionId": "S-14",
            "scheduledTime": "16:00",
            "expectedDelayMin": 8,
            "rerouted": True,
            "reroutePath": "Via Loop Line L-02",
            "passengerImpact": "Low",
            "goodsImpact": "Medium"
        },
        {
            "id": "tm-3",
            "trainId": "t-freight",
            "trainNo": "G-9021",
            "trainName": "Coal Freight Rake",
            "sectionId": "S-14",
            "scheduledTime": "16:45",
            "expectedDelayMin": 25,
            "rerouted": True,
            "reroutePath": "Siding Track S-01",
            "passengerImpact": "Low",
            "goodsImpact": "Medium"
        }
    ]
