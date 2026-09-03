import numpy as np

def calculate_priority_score(task, section=None, asset=None):
    """
    Calculates transparent AI Priority Score and Failure Probability.
    Priority Score =
        0.35 * Criticality Weight +
        0.25 * Overdue Weight +
        0.15 * Safety Impact +
        0.15 * Failure Probability +
        0.10 * Section Train Density
    """
    crit_map = {"LOW": 15, "MEDIUM": 40, "HIGH": 70, "CRITICAL": 95}
    crit_weight = crit_map.get(task.get("criticality", "MEDIUM"), 40)

    overdue_days = task.get("overdue_days", 0)
    overdue_weight = min(100, overdue_days * 5.0)

    safety_impact = task.get("safety_impact", 5.0) * 10.0  # scale to 100
    fail_prob = task.get("failure_prob", 0.2) * 100.0       # scale to 100

    density = section.get("train_density_score", 50.0) if section else 50.0

    raw_score = (
        0.35 * crit_weight +
        0.25 * overdue_weight +
        0.15 * safety_impact +
        0.15 * fail_prob +
        0.10 * density
    )

    priority_score = round(min(100.0, max(5.0, raw_score)), 1)
    
    if priority_score >= 80.0:
        risk_level = "CRITICAL"
    elif priority_score >= 60.0:
        risk_level = "HIGH"
    elif priority_score >= 40.0:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    # Explainability Feature Breakdown (SHAP-style)
    reasons = []
    if overdue_days > 0:
        reasons.append(f"{overdue_days} days overdue (adds +{round(overdue_weight * 0.25, 1)} points)")
    if crit_weight >= 70:
        reasons.append(f"{task.get('criticality')} asset criticality rating")
    if safety_impact >= 70:
        reasons.append("High safety impact corridor rating")
    if fail_prob >= 50:
        reasons.append(f"Elevated failure probability ({task.get('failure_prob', 0.2):.2f})")
    if density >= 70:
        reasons.append("High-density trunk corridor section")

    if not reasons:
        reasons.append("Routine scheduled preventive maintenance")

    explanation = {
        "score": priority_score,
        "risk_level": risk_level,
        "reasons": reasons,
        "feature_contributions": {
            "Asset Criticality": round(0.35 * crit_weight, 1),
            "Overdue Penalty": round(0.25 * overdue_weight, 1),
            "Safety Impact": round(0.15 * safety_impact, 1),
            "Failure Probability": round(0.15 * fail_prob, 1),
            "Corridor Density": round(0.10 * density, 1)
        }
    }

    return explanation
