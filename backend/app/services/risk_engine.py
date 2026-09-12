import math

def calculate_asset_risk(health_score: float, days_since_maintenance: int, asset_type: str) -> dict:
    """
    Calculates asset failure probability and health degradation curve.
    """
    base_rate = 0.05
    if asset_type.lower() in ["signal", "point machine"]:
        base_rate = 0.12
    elif asset_type.lower() in ["ohe", "transformer"]:
        base_rate = 0.08
    elif asset_type.lower() in ["track", "bridge"]:
        base_rate = 0.06

    # Weibull/Exponential hazard formula
    failure_prob = min(0.95, base_rate + (1.0 - health_score / 100.0) * 0.7 + (days_since_maintenance / 90.0) * 0.2)
    
    risk_level = "Low"
    if failure_prob > 0.6:
        risk_level = "Critical"
    elif failure_prob > 0.35:
        risk_level = "High"
    elif failure_prob > 0.2:
        risk_level = "Medium"

    return {
        "failure_probability": round(failure_prob, 2),
        "risk_level": risk_level,
        "health_score": round(health_score, 1)
    }
