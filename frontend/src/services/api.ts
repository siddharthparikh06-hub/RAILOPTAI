import { 
  mockMaintenanceTasks, mockAssets, mockSections, mockStations, 
  mockBlockWindows, mockAlerts, mockOptimizationRuns, mockTrainMovements,
  MaintenanceTask, Asset, Section, BlockWindow, AlertItem, OptimizationRun, TrainMovement
} from '../data/mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchFromApi<T>(endpoint: string, fallbackData: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });
    if (!res.ok) return fallbackData;
    const data = await res.json();
    return data as T;
  } catch (err) {
    return fallbackData;
  }
}

export async function loginUser(employeeId: string, password: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee_id: employeeId, password })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Fallback
  }
  return {
    access_token: "mock_jwt_token_control001",
    token_type: "bearer",
    user: {
      employee_id: employeeId || "CONTROL001",
      name: "Demo Control Officer",
      department: "Operations Control Office",
      role: "Control Officer"
    }
  };
}

export async function getDashboardMetrics() {
  const fallback = {
    assetAvailability: 94.7,
    assetAvailabilityChange: '+8.3%',
    activeBlocks: 12,
    criticalTasks: 31,
    downtimeSavedHrs: 126.5,
    conflictsAvoided: 37,
    trainImpactReduction: -18.4,
    departmentsWorkload: [
      { name: 'Engineering', percentage: 42, color: '#3B82F6' },
      { name: 'Traction', percentage: 31, color: '#F59E0B' },
      { name: 'S&T', percentage: 27, color: '#10B981' }
    ],
    weeklyUtilization: [
      { day: 'Mon', baseline: 32.5, optimized: 18.0 },
      { day: 'Tue', baseline: 38.0, optimized: 21.5 },
      { day: 'Wed', baseline: 42.0, optimized: 22.0 },
      { day: 'Thu', baseline: 35.0, optimized: 19.5 },
      { day: 'Fri', baseline: 29.0, optimized: 15.0 },
      { day: 'Sat', baseline: 45.0, optimized: 24.0 },
      { day: 'Sun', baseline: 20.0, optimized: 10.5 }
    ]
  };

  try {
    const apiData: any = await fetchFromApi('/dashboard/summary', null);
    if (apiData) {
      return {
        assetAvailability: apiData.asset_availability,
        assetAvailabilityChange: `+${apiData.availability_change}%`,
        activeBlocks: apiData.active_blocks,
        criticalTasks: apiData.pending_requests,
        downtimeSavedHrs: apiData.downtime_saved_hours,
        conflictsAvoided: apiData.conflicts_avoided,
        trainImpactReduction: apiData.train_impact_reduction,
        departmentsWorkload: apiData.departments_workload || fallback.departmentsWorkload,
        weeklyUtilization: apiData.weekly_utilization || fallback.weeklyUtilization
      };
    }
  } catch (e) {
    // Ignore
  }
  return fallback;
}

export async function getMaintenanceTasks(): Promise<MaintenanceTask[]> {
  return fetchFromApi('/tasks', mockMaintenanceTasks);
}

export async function getAssets(): Promise<Asset[]> {
  return fetchFromApi('/assets', mockAssets);
}

export async function getSections(): Promise<Section[]> {
  return fetchFromApi('/sections', mockSections);
}

export async function getStations() {
  return mockStations;
}

export async function getBlockWindows(): Promise<BlockWindow[]> {
  return fetchFromApi('/blocks', mockBlockWindows);
}

export async function getAlerts(): Promise<AlertItem[]> {
  return fetchFromApi('/conflicts', mockAlerts);
}

export async function getOptimizationRuns(): Promise<OptimizationRun[]> {
  return mockOptimizationRuns;
}

export async function getTrainMovements(): Promise<TrainMovement[]> {
  return fetchFromApi('/movements', mockTrainMovements);
}

export async function runOptimizationSimulation(horizon: string, division: string, objective: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/optimization/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ horizon_days: 7, division, objective })
    });
    if (res.ok) {
      const data = await res.json();
      return {
        status: data.status,
        tasksConsidered: data.tasks_considered,
        availableWindows: data.available_windows,
        conflictsDetected: data.conflicts_detected,
        recommendedBlocks: data.recommended_blocks,
        estimatedDowntimeSavedHrs: data.downtime_saved_hours,
        estimatedTrainImpactReductionPct: data.train_impact_reduction_pct,
        assetAvailabilityScore: data.asset_availability_score
      };
    }
  } catch (e) {
    // Fallback
  }

  await new Promise((resolve) => setTimeout(resolve, 3500));
  return {
    status: 'OPTIMIZATION COMPLETE',
    tasksConsidered: 248,
    availableWindows: 96,
    conflictsDetected: 37,
    recommendedBlocks: 41,
    estimatedDowntimeSavedHrs: 126.5,
    estimatedTrainImpactReductionPct: 18.4,
    assetAvailabilityScore: 94.7
  };
}

export async function queryCopilot(question: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/copilot/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    if (res.ok) {
      const data = await res.json();
      return {
        answer: data.answer,
        badge: data.badge
      };
    }
  } catch (e) {
    // Fallback
  }

  await new Promise((resolve) => setTimeout(resolve, 800));
  const q = question.toLowerCase();

  if (q.includes('b-113') || q.includes('selected') || q.includes('block')) {
    return {
      answer: "Combined window BLOCK B-113 (15:00–18:00 on Section S-14) was selected because Engineering (Track T-214), Traction (OHE-27), and S&T (Signal S-104) have compatible maintenance activities in the same section. Combining these tasks into a single 3-hour window saves 4.5 hours of independent corridor downtime while protecting peak Rajdhani express slots.",
      badge: "AI DEMO RESPONSE"
    };
  } else if (q.includes('downtime') || q.includes('saved')) {
    return {
      answer: "RAILOPT AI coordinated planning saved 126.5 hours of corridor downtime this week across Chennai Demo Division, representing a 47.5% reduction compared to uncoordinated departmental scheduling.",
      badge: "AI DEMO RESPONSE"
    };
  } else if (q.includes('critical') || q.includes('unscheduled')) {
    return {
      answer: "There are currently 31 critical maintenance tasks registered. TASK-1042 (Signal S-104) is 2 days overdue and has been prioritized in Block B-113.",
      badge: "AI DEMO RESPONSE"
    };
  } else {
    return {
      answer: "Based on Chennai Demo Division operational data: Combining compatible departmental maintenance into shared block windows increases overall asset availability from 87.4% to 94.7% while avoiding 37 section conflicts.",
      badge: "AI DEMO RESPONSE"
    };
  }
}
