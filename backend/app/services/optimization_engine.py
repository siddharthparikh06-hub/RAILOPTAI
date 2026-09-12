"""Input-driven, deterministic demo scheduler.

The figures returned by this module are derived only from the submitted records.
It remains a prototype until a railway division validates its block windows and
operating constraints.
"""

from collections import defaultdict
from typing import Any, Dict, List

from ortools.sat.python import cp_model

PRIORITY = {"LOW": 1, "MEDIUM": 3, "HIGH": 6, "CRITICAL": 10}


def _minutes(value: Any) -> int | None:
    try:
        hour, minute = (int(part) for part in str(value).strip().split(":")[:2])
        return hour * 60 + minute if 0 <= hour < 24 and 0 <= minute < 60 else None
    except (ValueError, TypeError):
        return None


def _clock(slot: int) -> str:
    return f"Day {slot // 48 + 1} {(slot % 48) // 2:02d}:{(slot % 2) * 30:02d}"


class BlockOptimizer:
    def solve_block_schedule(self, tasks: List[Dict[str, Any]], horizon_days: int = 7, objective: str = "Maximize Asset Availability", train_movements: List[Dict[str, Any]] | None = None, sections: List[Dict[str, Any]] | None = None, crews: List[Dict[str, Any]] | None = None) -> Dict[str, Any]:
        train_movements, sections, crews = train_movements or [], sections or [], crews or []
        errors: List[str] = []
        section_map = {str(row.get("section_id", "")).strip().upper(): row for row in sections if row.get("section_id")}
        if not tasks:
            return self._empty("No maintenance task records were supplied.")
        if not section_map:
            return self._empty("A section master with permitted_block_start and permitted_block_end is required.")

        normalized: List[Dict[str, Any]] = []
        for index, task in enumerate(tasks, start=1):
            code, section_id = str(task.get("task_code", "")).strip(), str(task.get("section_id", "")).strip().upper()
            try:
                duration_slots = max(1, int(round(float(task.get("duration_hours")) * 2)))
            except (TypeError, ValueError):
                errors.append(f"Row {index}: duration_hours must be a positive number.")
                continue
            if not code or not section_id or section_id not in section_map:
                errors.append(f"Row {index}: task_code and a known section_id are required.")
                continue
            normalized.append({"code": code, "section": section_id, "department": str(task.get("department", "Unknown")), "duration_slots": duration_slots, "criticality": str(task.get("criticality", "Medium")).upper()})
        if not normalized:
            return self._empty("No valid task rows remain after validation.", errors)

        train_slots: Dict[str, set[int]] = defaultdict(set)
        for movement in train_movements:
            section_id = str(movement.get("section_id", "")).strip().upper()
            start, end = _minutes(movement.get("planned_entry")), _minutes(movement.get("planned_exit"))
            if section_id and start is not None and end is not None and end > start:
                train_slots[section_id].update(range(start // 30, (end + 29) // 30))

        model = cp_model.CpModel()
        variables, candidates = [], []
        excluded_by_train = 0
        days = max(1, min(horizon_days, 30))
        for task_index, task in enumerate(normalized):
            section = section_map[task["section"]]
            start, end = _minutes(section.get("permitted_block_start")), _minutes(section.get("permitted_block_end"))
            if start is None or end is None or end <= start:
                errors.append(f"{task['code']}: section {task['section']} has an invalid permitted block window.")
                continue
            for day in range(days):
                for time_slot in range(start // 30, end // 30 - task["duration_slots"] + 1):
                    if any(slot in train_slots[task["section"]] for slot in range(time_slot, time_slot + task["duration_slots"])):
                        excluded_by_train += 1
                        continue
                    variable = model.NewBoolVar(f"task_{task_index}_day_{day}_slot_{time_slot}")
                    variables.append(variable)
                    candidates.append((task_index, day * 48 + time_slot, task["duration_slots"], len(variables) - 1))

        for task_index in range(len(normalized)):
            choices = [variables[var] for task, _, _, var in candidates if task == task_index]
            if choices:
                model.Add(sum(choices) <= 1)
        for section_id in section_map:
            for slot in range(days * 48):
                covering = [variables[var] for task, start, duration, var in candidates if normalized[task]["section"] == section_id and start <= slot < start + duration]
                if covering:
                    model.Add(sum(covering) <= 3)  # one compatible activity per department in a joint block

        model.Maximize(sum(PRIORITY.get(normalized[task]["criticality"], 3) * variables[var] for task, _, _, var in candidates))
        solver = cp_model.CpSolver()
        solver.parameters.max_time_in_seconds = 5.0
        solver.parameters.num_search_workers = 1
        status = solver.Solve(model)

        assignments = []
        for task, start, duration, var in candidates:
            if status in (cp_model.OPTIMAL, cp_model.FEASIBLE) and solver.Value(variables[var]):
                item = normalized[task]
                assignments.append({"task_code": item["code"], "section_id": item["section"], "department": item["department"], "start": _clock(start), "end": _clock(start + duration), "duration_hours": duration / 2})

        baseline_hours = round(sum(task["duration_slots"] for task in normalized) / 2, 1)
        used_slots = {(item["section_id"], item["start"], unit) for item in assignments for unit in range(int(item["duration_hours"] * 2))}
        optimized_hours = round(len(used_slots) / 2, 1)
        chosen_codes = {item["task_code"] for item in assignments}
        total_weight = sum(PRIORITY.get(task["criticality"], 3) for task in normalized)
        chosen_weight = sum(PRIORITY.get(task["criticality"], 3) for task in normalized if task["code"] in chosen_codes)
        return {
            "status": "OPTIMAL INPUT-DRIVEN PLAN" if status == cp_model.OPTIMAL else "FEASIBLE INPUT-DRIVEN PLAN",
            "tasks_considered": len(normalized), "available_windows": len(candidates), "conflicts_detected": excluded_by_train,
            "recommended_blocks": len({(item["section_id"], item["start"]) for item in assignments}),
            "downtime_saved_hours": round(max(0, baseline_hours - optimized_hours), 1),
            "train_impact_reduction_pct": 100.0 if excluded_by_train else 0.0,
            "asset_availability_score": round(chosen_weight * 100 / total_weight, 1) if total_weight else 0.0,
            "baseline": {"block_hours": baseline_hours, "downtime_hours": baseline_hours, "conflicts": excluded_by_train},
            "optimized": {"block_hours": optimized_hours, "downtime_hours": optimized_hours, "conflicts": 0},
            "improvement": {"block_hours_saved": round(max(0, baseline_hours - optimized_hours), 1), "downtime_saved": round(max(0, baseline_hours - optimized_hours), 1), "conflicts_avoided": excluded_by_train},
            "assignments": assignments,
            "input_validation": {"valid_tasks": len(normalized), "rejected_rows": len(errors), "errors": errors, "train_movements": len(train_movements), "sections": len(section_map), "crews": len(crews)},
        }

    @staticmethod
    def _empty(message: str, errors: List[str] | None = None) -> Dict[str, Any]:
        return {"status": "INPUT VALIDATION REQUIRED", "tasks_considered": 0, "available_windows": 0, "conflicts_detected": 0, "recommended_blocks": 0, "downtime_saved_hours": 0.0, "train_impact_reduction_pct": 0.0, "asset_availability_score": 0.0, "baseline": {}, "optimized": {}, "improvement": {}, "assignments": [], "input_validation": {"valid_tasks": 0, "rejected_rows": len(errors or []), "errors": [message, *(errors or [])]}}


optimizer = BlockOptimizer()
