from typing import Dict, Any

def simulate_train_impact(block_id: str = "blk-3") -> Dict[str, Any]:
    return {
        "trains_analyzed": 42,
        "potentially_affected": 6,
        "expected_delay_min": 8,
        "rerouted_trains": 2,
        "passenger_impact": "Low",
        "goods_impact": "Medium",
        "movements": [
            {
                "id": 1,
                "train_number": "20608",
                "train_name": "Vande Bharat Express",
                "section_id": "S-14",
                "scheduled_arrival": "15:15",
                "scheduled_departure": "15:17",
                "direction": "UP",
                "train_type": "Vande Bharat",
                "priority": 1,
                "expected_delay_min": 0,
                "rerouted": False,
                "reroute_path": None,
                "passenger_impact": "Low",
                "goods_impact": "Low",
                "status": "Scheduled"
            },
            {
                "id": 2,
                "train_number": "12622",
                "train_name": "Tamil Nadu Express",
                "section_id": "S-14",
                "scheduled_arrival": "16:00",
                "scheduled_departure": "16:02",
                "direction": "UP",
                "train_type": "Superfast Express",
                "priority": 2,
                "expected_delay_min": 8,
                "rerouted": True,
                "reroute_path": "Via Loop Line L-02",
                "passenger_impact": "Low",
                "goods_impact": "Medium",
                "status": "Rerouted"
            },
            {
                "id": 3,
                "train_number": "G-9021",
                "train_name": "Coal Freight Rake",
                "section_id": "S-14",
                "scheduled_arrival": "16:45",
                "scheduled_departure": "17:10",
                "direction": "DOWN",
                "train_type": "Freight",
                "priority": 4,
                "expected_delay_min": 25,
                "rerouted": True,
                "reroute_path": "Siding Track S-01",
                "passenger_impact": "Low",
                "goods_impact": "Medium",
                "status": "Delayed"
            }
        ]
    }
