import { DEMO_SECTIONS, DEMO_TASKS, DEMO_ALERTS } from './demoData';

const API_BASE = '/api';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API unavailable, operating in standalone demo mode.");
  }
  return { status: 'ONLINE', mode: 'Demo Environment — Standalone Client Mode' };
}

export async function fetchDashboardData() {
  try {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (res.ok) return await res.json();
  } catch (e) {}

  return {
    kpis: {
      asset_availability: 94.7,
      asset_availability_change: '+8.3% after optimization',
      downtime_saved_hrs: 126.5,
      conflicts_avoided: 37,
      total_tasks: 248,
      critical_tasks: 31,
      overdue_tasks: 14,
      planned_blocks: 42,
      unresolved_conflicts: 3,
      train_impact_reduction_pct: -18.4
    },
    department_workload: [
      { department: 'Engineering', tasks: 112, color: '#3B82F6' },
      { department: 'Traction', tasks: 74, color: '#F59E0B' },
      { department: 'Signal & Telecom', tasks: 62, color: '#10B981' }
    ],
    weekly_utilization: [
      { day: 'Mon', baseline_hours: 32.5, optimized_hours: 18.0 },
      { day: 'Tue', baseline_hours: 38.0, optimized_hours: 21.5 },
      { day: 'Wed', baseline_hours: 42.0, optimized_hours: 22.0 },
      { day: 'Thu', baseline_hours: 35.0, optimized_hours: 19.5 },
      { day: 'Fri', baseline_hours: 29.0, optimized_hours: 15.0 },
      { day: 'Sat', baseline_hours: 45.0, optimized_hours: 24.0 },
      { day: 'Sun', baseline_hours: 20.0, optimized_hours: 10.5 }
    ],
    recent_alerts: DEMO_ALERTS
  };
}

export async function fetchMaintenanceTasks(dept = 'ALL', crit = 'ALL') {
  try {
    const res = await fetch(`${API_BASE}/maintenance?department=${dept}&criticality=${crit}`);
    if (res.ok) return await res.json();
  } catch (e) {}
  return DEMO_TASKS;
}

export async function fetchBeforeAfterComparison() {
  try {
    const res = await fetch(`${API_BASE}/before-after`);
    if (res.ok) return await res.json();
  } catch (e) {}

  return {
    plan_code: 'SIH-DEMO-PLAN-001',
    before: { block_hours: 184.0, asset_downtime_hrs: 241.2, conflicts: 29, train_impact_pct: 17.2 },
    after: { block_hours: 121.0, asset_downtime_hrs: 126.7, conflicts: 3, train_impact_pct: 6.8 },
    metrics: { downtime_saved_hrs: 114.5, improvement_pct: 47.5, conflicts_avoided: 26, asset_availability_score: 94.7 }
  };
}

export async function runOptimization(horizon = '7_DAYS', mode = 'MAX_AVAILABILITY') {
  try {
    const res = await fetch(`${API_BASE}/optimization/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planning_horizon: horizon, objective_mode: mode })
    });
    if (res.ok) return await res.json();
  } catch (e) {}

  return {
    plan_code: 'SIH-DEMO-PLAN-NEW',
    optimization_result: {
      status: 'OPTIMAL',
      solver_name: 'Google OR-Tools CP-SAT',
      execution_time_sec: 2.84,
      total_tasks: 248,
      scheduled_tasks: 233,
      baseline: { downtime_hrs: 241.2, conflicts_count: 29, train_impact_pct: 17.2 },
      optimized: { downtime_hrs: 126.7, downtime_saved_hrs: 114.5, improvement_pct: 47.5, conflicts_avoided: 26, train_impact_pct: 6.8, asset_availability_score: 94.7 }
    }
  };
}

export async function queryCopilot(question: string) {
  try {
    const res = await fetch(`${API_BASE}/copilot/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    if (res.ok) return await res.json();
  } catch (e) {}

  return {
    question,
    answer: "RAILOPT AI CP-SAT engine has optimized maintenance schedules across 50 sections. Independent blocks were combined into 3.5h joint windows, saving 114.5 hours downtime.",
    context_data: { solver: 'Google OR-Tools CP-SAT', downtime_saved_hrs: 114.5 }
  };
}

export async function triggerSIHDemoScenario() {
  try {
    const res = await fetch(`${API_BASE}/demo/load-sih-scenario`, { method: 'POST' });
    if (res.ok) return await res.json();
  } catch (e) {}
  return { status: 'SUCCESS', message: 'SIH Demo Scenario Loaded Successfully!' };
}
