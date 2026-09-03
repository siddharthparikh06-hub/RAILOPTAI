import { 
  mockMaintenanceTasks, mockAssets, mockSections, mockStations, 
  mockBlockWindows, mockAlerts, mockOptimizationRuns, mockTrainMovements,
  MaintenanceTask, Asset, Section, BlockWindow, AlertItem, OptimizationRun, TrainMovement
} from '../data/mockData';

// API Abstraction Layer for RAILOPT AI Frontend
// Provides async interface layer so FastAPI + OR-Tools backend can be plugged in seamlessly later.

export async function getDashboardMetrics() {
  return {
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
}

export async function getMaintenanceTasks(): Promise<MaintenanceTask[]> {
  return mockMaintenanceTasks;
}

export async function getAssets(): Promise<Asset[]> {
  return mockAssets;
}

export async function getSections(): Promise<Section[]> {
  return mockSections;
}

export async function getStations() {
  return mockStations;
}

export async function getBlockWindows(): Promise<BlockWindow[]> {
  return mockBlockWindows;
}

export async function getAlerts(): Promise<AlertItem[]> {
  return mockAlerts;
}

export async function getOptimizationRuns(): Promise<OptimizationRun[]> {
  return mockOptimizationRuns;
}

export async function getTrainMovements(): Promise<TrainMovement[]> {
  return mockTrainMovements;
}

export async function runOptimizationSimulation(horizon: string, division: string, objective: string) {
  // Simulated delay for optimization solver animation
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
