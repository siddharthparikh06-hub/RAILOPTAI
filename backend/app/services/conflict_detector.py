from typing import List, Dict, Any

class OperationalConflictDetector:
    def detect_conflicts(self, blocks: List[Dict[str, Any]], trains: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        conflicts = [
            {
                "id": 101,
                "block_id": "blk-1",
                "train_movement_id": "tm-1",
                "section_id": "S-14",
                "conflict_type": "Block-vs-Block Overlap",
                "severity": "Critical",
                "description": "Engineering track tamping requested simultaneously with S&T Point Machine overhaul on uncoordinated schedules.",
                "delay_minutes": 15,
                "resolved": False,
                "timestamp": "10 mins ago"
            },
            {
                "id": 102,
                "block_id": "blk-3",
                "train_movement_id": "tm-2",
                "section_id": "S-14",
                "conflict_type": "Block-vs-Train Conflict",
                "severity": "High",
                "description": "Tamil Nadu Express slot overlaps with uncoordinated OHE maintenance window.",
                "delay_minutes": 8,
                "resolved": False,
                "timestamp": "25 mins ago"
            },
            {
                "id": 103,
                "block_id": "blk-2",
                "train_movement_id": None,
                "section_id": "S-18",
                "conflict_type": "Resource Bottleneck",
                "severity": "Medium",
                "description": "Engineering team E-04 shift hours exceed safe maximum duty threshold.",
                "delay_minutes": 0,
                "resolved": False,
                "timestamp": "1 hour ago"
            }
        ]
        return conflicts

conflict_detector = OperationalConflictDetector()
