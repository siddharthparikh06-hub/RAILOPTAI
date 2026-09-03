// Centralized Mock Data Source for RAILOPT AI Frontend Demo

export interface Department {
  id: string;
  name: string;
  code: string;
  color: string;
  workloadPct: number;
}

export interface Section {
  id: string;
  code: string;
  name: string;
  startStation: string;
  endStation: string;
  lengthKm: number;
  status: 'Operational' | 'Maintenance Window' | 'Congested' | 'Critical';
  trafficDensity: 'Low' | 'Medium' | 'High';
  activeTasks: number;
  nextWindow: string;
}

export interface Station {
  id: string;
  code: string;
  name: string;
  x: number; // for SVG schematic placement
  y: number;
  tracks: number;
}

export interface Asset {
  id: string;
  tag: string;
  name: string;
  type: 'Signal' | 'OHE' | 'Track' | 'Point Machine' | 'Transformer' | 'Bridge';
  department: string;
  sectionId: string;
  health: number; // 0 - 100
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
  lastMaintenance: string;
  nextDue: string;
  recommendation: string;
}

export interface MaintenanceTask {
  id: string;
  taskCode: string;
  asset: string;
  assetId: string;
  department: 'Engineering' | 'Traction' | 'Signal & Telecom';
  sectionId: string;
  issue: string;
  priorityScore: number;
  criticality: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate: string;
  durationHrs: number;
  crewRequired: number;
  status: 'Pending' | 'Scheduled' | 'In Progress' | 'Completed' | 'Critical';
  aiReasons: string[];
  aiRecommendation: string;
}

export interface Train {
  id: string;
  trainNo: string;
  name: string;
  type: 'Vande Bharat' | 'Rajdhani' | 'Superfast Express' | 'Passenger' | 'Freight';
  priority: number;
  origin: string;
  destination: string;
}

export interface TrainMovement {
  id: string;
  trainId: string;
  trainNo: string;
  trainName: string;
  sectionId: string;
  scheduledTime: string;
  expectedDelayMin: number;
  rerouted: boolean;
  reroutePath?: string;
  passengerImpact: 'Low' | 'Medium' | 'High';
  goodsImpact: 'Low' | 'Medium' | 'High';
}

export interface BlockWindow {
  id: string;
  blockCode: string;
  sectionId: string;
  sectionName: string;
  timeSlot: string;
  startTime: string;
  endTime: string;
  durationHrs: number;
  departments: string[];
  taskCount: number;
  trainImpact: 'Low' | 'Medium' | 'High';
  priority: 'Routine' | 'High' | 'Critical';
  aiRecommendation: string;
}

export interface AlertItem {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Information';
  title: string;
  description: string;
  sectionId: string;
  timestamp: string;
  status: 'Active' | 'Resolved';
}

export interface OptimizationRun {
  runId: string;
  date: string;
  tasks: number;
  blocks: number;
  status: 'Completed' | 'Optimal' | 'Feasible';
  improvementPct: number;
  downtimeSavedHrs: number;
}

// ---------------- MOCK DATA COLLECTIONS ----------------

export const mockDepartments: Department[] = [
  { id: 'eng', name: 'Engineering (P-Way)', code: 'ENG', color: '#3B82F6', workloadPct: 42 },
  { id: 'trd', name: 'Traction Distribution (OHE)', code: 'TRD', color: '#F59E0B', workloadPct: 31 },
  { id: 'st', name: 'Signal & Telecom (S&T)', code: 'ST', color: '#10B981', workloadPct: 27 },
];

export const mockStations: Station[] = [
  { id: 'st-a', code: 'MAS', name: 'Station A (Chennai Central)', x: 100, y: 150, tracks: 8 },
  { id: 'st-b', code: 'AJJ', name: 'Station B (Arakkonam Jn)', x: 300, y: 150, tracks: 6 },
  { id: 'st-c', code: 'KPD', name: 'Station C (Katpadi Jn)', x: 500, y: 150, tracks: 6 },
  { id: 'st-d', code: 'JTJ', name: 'Station D (Jolarpettai Jn)', x: 700, y: 150, tracks: 5 },
  { id: 'st-e', code: 'SA', name: 'Station E (Salem Jn)', x: 900, y: 150, tracks: 6 },
];

export const mockSections: Section[] = [
  { id: 'S-10', code: 'S-10', name: 'Section MAS-AJJ Mainline', startStation: 'MAS', endStation: 'AJJ', lengthKm: 68.5, status: 'Operational', trafficDensity: 'High', activeTasks: 3, nextWindow: '01:30–04:30' },
  { id: 'S-12', code: 'S-12', name: 'Section AJJ-KPD Trunk Corridor', startStation: 'AJJ', endStation: 'KPD', lengthKm: 61.0, status: 'Operational', trafficDensity: 'High', activeTasks: 5, nextWindow: '12:00–14:00' },
  { id: 'S-14', code: 'S-14', name: 'Section KPD-JTJ High Density Line', startStation: 'KPD', endStation: 'JTJ', lengthKm: 84.2, status: 'Maintenance Window', trafficDensity: 'Medium', activeTasks: 6, nextWindow: '15:00–18:00' },
  { id: 'S-18', code: 'S-18', name: 'Section JTJ-SA Express Line', startStation: 'JTJ', endStation: 'SA', lengthKm: 120.4, status: 'Operational', trafficDensity: 'Low', activeTasks: 4, nextWindow: '14:00–17:00' },
];

export const mockAssets: Asset[] = [
  { id: 'ast-1', tag: 'Signal S-104', name: 'Color Light Signal S-104', type: 'Signal', department: 'Signal & Telecom', sectionId: 'S-14', health: 62, risk: 'Critical', lastMaintenance: '12 Aug 2026', nextDue: '26 Aug 2026', recommendation: 'Schedule in next available block' },
  { id: 'ast-2', tag: 'OHE-27', name: 'Cathedral Overhead Line OHE-27', type: 'OHE', department: 'Traction', sectionId: 'S-12', health: 78, risk: 'High', lastMaintenance: '05 Aug 2026', nextDue: '27 Aug 2026', recommendation: 'Insulator inspection and tensioning' },
  { id: 'ast-3', tag: 'Track T-214', name: 'Curved Track Segment T-214', type: 'Track', department: 'Engineering', sectionId: 'S-18', health: 74, risk: 'Medium', lastMaintenance: '01 Aug 2026', nextDue: '29 Aug 2026', recommendation: 'Ballast tamping and rail alignment' },
  { id: 'ast-4', tag: 'Point PM-08', name: 'Motorized Point Machine PM-08', type: 'Point Machine', department: 'Signal & Telecom', sectionId: 'S-14', health: 58, risk: 'Critical', lastMaintenance: '20 Jul 2026', nextDue: '25 Aug 2026', recommendation: 'Immediate motor contact cleaning' },
  { id: 'ast-5', tag: 'Transformer TR-03', name: 'Traction Substation Transformer TR-03', type: 'Transformer', department: 'Traction', sectionId: 'S-10', health: 85, risk: 'Low', lastMaintenance: '15 Aug 2026', nextDue: '15 Sep 2026', recommendation: 'Routine oil filtration' },
];

export const mockMaintenanceTasks: MaintenanceTask[] = [
  {
    id: '1',
    taskCode: 'TASK-1042',
    asset: 'Signal S-104',
    assetId: 'ast-1',
    department: 'Signal & Telecom',
    sectionId: 'S-14',
    issue: 'Signal aspect lumen degradation & interlock delay',
    priorityScore: 94,
    criticality: 'Critical',
    dueDate: '26 Aug 2026',
    durationHrs: 3,
    crewRequired: 4,
    status: 'Critical',
    aiReasons: ['Overdue by 2 days', 'Located on High traffic corridor S-14', 'Safety critical signaling asset', 'Failure probability increasing (+34%)'],
    aiRecommendation: 'Schedule within next available joint block B-113 at 15:00–18:00.'
  },
  {
    id: '2',
    taskCode: 'TASK-1088',
    asset: 'OHE-27',
    assetId: 'ast-2',
    department: 'Traction',
    sectionId: 'S-12',
    issue: 'Overhead contact wire insulator carbon buildup',
    priorityScore: 82,
    criticality: 'High',
    dueDate: '27 Aug 2026',
    durationHrs: 2,
    crewRequired: 5,
    status: 'Pending',
    aiReasons: ['Insulator dielectric breakdown risk', 'Corridor S-12 high speed section', 'Compatible with Track T-214 window'],
    aiRecommendation: 'Combine with Engineering track tamping window to save 2 hours downtime.'
  },
  {
    id: '3',
    taskCode: 'TASK-1112',
    asset: 'Track T-214',
    assetId: 'ast-3',
    department: 'Engineering',
    sectionId: 'S-18',
    issue: 'Rail-head wear & ballast compaction realignment',
    priorityScore: 76,
    criticality: 'Medium',
    dueDate: '29 Aug 2026',
    durationHrs: 4,
    crewRequired: 8,
    status: 'Scheduled',
    aiReasons: ['Routine 30-day preventive maintenance', 'Low safety impact index', 'Off-peak afternoon availability'],
    aiRecommendation: 'Schedule during low train density window on Thursday.'
  },
  {
    id: '4',
    taskCode: 'TASK-1145',
    asset: 'Point PM-08',
    assetId: 'ast-4',
    department: 'Signal & Telecom',
    sectionId: 'S-14',
    issue: 'Point machine switch tongue clearance adjustment',
    priorityScore: 91,
    criticality: 'Critical',
    dueDate: '26 Aug 2026',
    durationHrs: 2,
    crewRequired: 3,
    status: 'Critical',
    aiReasons: ['Overdue by 4 days', 'High risk of turnout failure during peak Rajdhani window'],
    aiRecommendation: 'Merge into Block B-113 with Engineering & Traction crews.'
  },
  {
    id: '5',
    taskCode: 'TASK-1190',
    asset: 'Transformer TR-03',
    assetId: 'ast-5',
    department: 'Traction',
    sectionId: 'S-10',
    issue: 'Substation cooling fan silica gel renewal',
    priorityScore: 54,
    criticality: 'Low',
    dueDate: '02 Sep 2026',
    durationHrs: 3,
    crewRequired: 4,
    status: 'Pending',
    aiReasons: ['Healthy asset condition (85%)', 'Routine scheduled task'],
    aiRecommendation: 'Defer to weekly night maintenance window.'
  }
];

export const mockBlockWindows: BlockWindow[] = [
  {
    id: 'blk-1',
    blockCode: 'BLOCK B-104',
    sectionId: 'S-10',
    sectionName: 'Section S-10 (MAS-AJJ)',
    timeSlot: '08:00–11:00',
    startTime: '08:00',
    endTime: '11:00',
    durationHrs: 3,
    departments: ['Engineering', 'Signal & Telecom'],
    taskCount: 3,
    trainImpact: 'Low',
    priority: 'Routine',
    aiRecommendation: 'Joint block scheduled during morning low freight traffic slot.'
  },
  {
    id: 'blk-2',
    blockCode: 'BLOCK B-108',
    sectionId: 'S-12',
    sectionName: 'Section S-12 (AJJ-KPD)',
    timeSlot: '12:00–14:00',
    startTime: '12:00',
    endTime: '14:00',
    durationHrs: 2,
    departments: ['Traction'],
    taskCount: 2,
    trainImpact: 'Low',
    priority: 'High',
    aiRecommendation: 'Shifted OHE inspection to off-peak afternoon window to protect Vande Bharat Express slot.'
  },
  {
    id: 'blk-3',
    blockCode: 'BLOCK B-113',
    sectionId: 'S-14',
    sectionName: 'Section S-14 (KPD-JTJ)',
    timeSlot: '15:00–18:00',
    startTime: '15:00',
    endTime: '18:00',
    durationHrs: 3,
    departments: ['Engineering', 'Traction', 'Signal & Telecom'],
    taskCount: 6,
    trainImpact: 'Low',
    priority: 'Critical',
    aiRecommendation: 'Combined window recommended because three departments have compatible maintenance activities in the same section.'
  }
];

export const mockAlerts: AlertItem[] = [
  {
    id: 'alt-101',
    severity: 'Critical',
    title: 'Overlapping maintenance request detected in S-14',
    description: 'Engineering requested 4h track tamping while S&T requested 2h Point Machine overhaul on uncoordinated schedules.',
    sectionId: 'S-14',
    timestamp: '10 mins ago',
    status: 'Active'
  },
  {
    id: 'alt-102',
    severity: 'High',
    title: 'Critical signal maintenance approaching deadline',
    description: 'Signal asset S-104 requires maintenance within 18 hours to prevent signal aspect failure.',
    sectionId: 'S-14',
    timestamp: '25 mins ago',
    status: 'Active'
  },
  {
    id: 'alt-103',
    severity: 'Medium',
    title: 'Crew availability reduced for Engineering Team E-04',
    description: 'Engineering crew E-04 has 2 active shifts remaining today.',
    sectionId: 'S-18',
    timestamp: '1 hour ago',
    status: 'Active'
  },
  {
    id: 'alt-104',
    severity: 'Information',
    title: 'OHE section OHE-27 approaching maintenance threshold',
    description: 'Traction insulator inspection recommended during next available block window.',
    sectionId: 'S-12',
    timestamp: '2 hours ago',
    status: 'Resolved'
  }
];

export const mockOptimizationRuns: OptimizationRun[] = [
  { runId: 'OPT-2048', date: '26 Aug 2026', tasks: 248, blocks: 41, status: 'Completed', improvementPct: 18.4, downtimeSavedHrs: 126.5 },
  { runId: 'OPT-2047', date: '25 Aug 2026', tasks: 210, blocks: 38, status: 'Completed', improvementPct: 16.2, downtimeSavedHrs: 110.0 },
  { runId: 'OPT-2046', date: '24 Aug 2026', tasks: 195, blocks: 35, status: 'Optimal', improvementPct: 15.8, downtimeSavedHrs: 98.4 },
];

export const mockTrainMovements: TrainMovement[] = [
  { id: 'tm-1', trainId: 't-12002', trainNo: '20608', trainName: 'Vande Bharat Express', sectionId: 'S-14', scheduledTime: '15:15', expectedDelayMin: 0, rerouted: false, passengerImpact: 'Low', goodsImpact: 'Low' },
  { id: 'tm-2', trainId: 't-12302', trainNo: '12622', trainName: 'Tamil Nadu Express', sectionId: 'S-14', scheduledTime: '16:00', expectedDelayMin: 8, rerouted: true, reroutePath: 'Via Loop Line L-02', passengerImpact: 'Low', goodsImpact: 'Medium' },
  { id: 'tm-3', trainId: 't- freight', trainNo: 'G-9021', trainName: 'Coal Freight Rake', sectionId: 'S-14', scheduledTime: '16:45', expectedDelayMin: 25, rerouted: true, reroutePath: 'Siding Track S-01', passengerImpact: 'Low', goodsImpact: 'Medium' },
];
