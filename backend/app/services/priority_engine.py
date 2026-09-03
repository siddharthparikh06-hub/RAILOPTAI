import numpy as np
from sklearn.ensemble import RandomForestRegressor
from typing import Dict, Any, List

class MaintenancePriorityEngine:
    def __init__(self):
        # Train a synthetic scikit-learn model for priority score prediction
        self.model = RandomForestRegressor(n_estimators=20, random_state=42)
        
        # Synthetic feature matrix: [health_score, failure_prob, overdue_days, traffic_density, safety_critical]
        X_dummy = np.array([
            [90, 0.05, 0, 1, 0],
            [50, 0.45, 2, 3, 1],
            [30, 0.85, 5, 3, 1],
            [80, 0.15, 0, 2, 0],
            [60, 0.35, 1, 3, 1],
            [40, 0.70, 4, 3, 1],
        ])
        y_dummy = np.array([35.0, 78.0, 96.0, 52.0, 75.0, 91.0])
        self.model.fit(X_dummy, y_dummy)

    def calculate_priority(
        self, 
        health_score: float, 
        failure_prob: float, 
        overdue_days: int = 0, 
        traffic_density_level: int = 3, 
        safety_critical: int = 1
    ) -> Dict[str, Any]:
        
        features = np.array([[health_score, failure_prob, overdue_days, traffic_density_level, safety_critical]])
        pred_score = float(self.model.predict(features)[0])
        pred_score = min(100.0, max(10.0, pred_score))
        
        reasons: List[str] = []
        if overdue_days > 0:
            reasons.append(f"Overdue by {overdue_days} day(s)")
        if failure_prob > 0.4:
            reasons.append(f"High failure risk probability (+{int(failure_prob*100)}%)")
        if traffic_density_level >= 3:
            reasons.append("Located on High traffic corridor")
        if safety_critical == 1:
            reasons.append("Safety critical signaling/OHE asset")

        if not reasons:
            reasons.append("Routine scheduled preventive maintenance")

        criticality = "Low"
        if pred_score >= 90:
            criticality = "Critical"
        elif pred_score >= 75:
            criticality = "High"
        elif pred_score >= 55:
            criticality = "Medium"

        return {
            "priority_score": round(pred_score, 1),
            "criticality": criticality,
            "reasons": reasons,
            "recommendation": f"Schedule within next available block window to prevent asset degradation."
        }

priority_engine = MaintenancePriorityEngine()
