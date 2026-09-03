export interface Task {
  id: number;
  task_code: string;
  department: string;
  asset_id: number;
  section_id: number;
  issue_description: string;
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  urgency: 'ROUTINE' | 'NORMAL' | 'URGENT' | 'EMERGENCY';
  est_duration_hrs: number;
  crew_required: number;
  due_date: string;
  status: string;
  ai_priority_score: number;
  ai_risk_level: string;
  safety_impact: number;
  failure_prob: number;
}

export interface Section {
  id: number;
  code: string;
  name: string;
  start_station: string;
  end_station: string;
  length_km: number;
  track_count: number;
  train_density_score: number;
  critical_rating: string;
}

export interface Asset {
  id: number;
  asset_tag: string;
  name: string;
  type: string;
  department: string;
  section_id: number;
  station_code?: string;
  status: string;
  health_score: number;
  risk_score: number;
}

export interface ConflictAlert {
  id: string | number;
  section_id: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  alert_type: string;
  title: string;
  description: string;
  recommendation: string;
  potential_savings_hrs: number;
  is_resolved: boolean;
}

export const DEMO_SECTIONS: Section[] = [
  { id: 1, code: 'S-01', name: 'Ghaziabad Jn - Aligarh Jn Double Line', start_station: 'GZB', end_station: 'ALJN', length_km: 106.5, track_count: 2, train_density_score: 88.5, critical_rating: 'CRITICAL' },
  { id: 2, code: 'S-02', name: 'Aligarh Jn - Kanpur Central Trunk', start_station: 'ALJN', end_station: 'CNB', length_km: 240.0, track_count: 3, train_density_score: 92.0, critical_rating: 'CRITICAL' },
  { id: 3, code: 'S-03', name: 'Kanpur Central - Prayagraj Jn Mainline', start_station: 'CNB', end_station: 'PRYJ', length_km: 194.2, track_count: 2, train_density_score: 85.0, critical_rating: 'HIGH' },
  { id: 4, code: 'S-04', name: 'Prayagraj Jn - Pt. DD Upadhyaya Corridor', start_station: 'PRYJ', end_station: 'DDU', length_km: 153.0, track_count: 4, train_density_score: 96.0, critical_rating: 'CRITICAL' },
  { id: 5, code: 'S-05', name: 'Lucknow Charbagh - Moradabad Line', start_station: 'LKO', end_station: 'MB', length_km: 325.0, track_count: 2, train_density_score: 64.0, critical_rating: 'MEDIUM' },
  { id: 6, code: 'S-06', name: 'Kota Jn - Ratlam Jn Western Trunk', start_station: 'KOTA', end_station: 'RTM', length_km: 266.0, track_count: 2, train_density_score: 78.0, critical_rating: 'HIGH' },
  { id: 7, code: 'S-07', name: 'Vadodara Jn - Surat High-Speed Section', start_station: 'BRC', end_station: 'ST', length_km: 129.5, track_count: 4, train_density_score: 91.0, critical_rating: 'CRITICAL' },
];

export const DEMO_TASKS: Task[] = [
  {
    id: 101,
    task_code: 'TASK-1042',
    department: 'Engineering',
    asset_id: 12,
    section_id: 1,
    issue_description: 'Rail rail-head wear exceeds threshold on Section S-01 curved track',
    criticality: 'CRITICAL',
    urgency: 'EMERGENCY',
    est_duration_hrs: 3.5,
    crew_required: 6,
    due_date: new Date(Date.now() - 18 * 86400000).toISOString(),
    status: 'PENDING',
    ai_priority_score: 94.7,
    ai_risk_level: 'CRITICAL',
    safety_impact: 9.2,
    failure_prob: 0.78
  },
  {
    id: 102,
    task_code: 'TASK-1043',
    department: 'Traction',
    asset_id: 28,
    section_id: 1,
    issue_description: 'OHE contact wire height decalibration & insulator carbon buildup',
    criticality: 'HIGH',
    urgency: 'URGENT',
    est_duration_hrs: 2.5,
    crew_required: 4,
    due_date: new Date(Date.now() - 4 * 86400000).toISOString(),
    status: 'PENDING',
    ai_priority_score: 82.3,
    ai_risk_level: 'CRITICAL',
    safety_impact: 8.5,
    failure_prob: 0.62
  },
  {
    id: 103,
    task_code: 'TASK-1044',
    department: 'Signal & Telecom',
    asset_id: 45,
    section_id: 1,
    issue_description: 'Point machine stroke realignment & motor contact inspection',
    criticality: 'HIGH',
    urgency: 'NORMAL',
    est_duration_hrs: 2.0,
    crew_required: 4,
    due_date: new Date(Date.now() + 2 * 86400000).toISOString(),
    status: 'PENDING',
    ai_priority_score: 76.1,
    ai_risk_level: 'HIGH',
    safety_impact: 7.8,
    failure_prob: 0.45
  },
  {
    id: 104,
    task_code: 'TASK-1045',
    department: 'Engineering',
    asset_id: 14,
    section_id: 3,
    issue_description: 'Bridge bearing lubrication and Expansion Joint bolt tightening',
    criticality: 'CRITICAL',
    urgency: 'URGENT',
    est_duration_hrs: 4.0,
    crew_required: 8,
    due_date: new Date(Date.now() - 7 * 86400000).toISOString(),
    status: 'PENDING',
    ai_priority_score: 91.2,
    ai_risk_level: 'CRITICAL',
    safety_impact: 9.0,
    failure_prob: 0.72
  },
  {
    id: 105,
    task_code: 'TASK-1046',
    department: 'Signal & Telecom',
    asset_id: 48,
    section_id: 3,
    issue_description: 'Axle counter reset coil tuning & digital track circuit calibration',
    criticality: 'MEDIUM',
    urgency: 'ROUTINE',
    est_duration_hrs: 1.5,
    crew_required: 3,
    due_date: new Date(Date.now() + 5 * 86400000).toISOString(),
    status: 'PENDING',
    ai_priority_score: 54.8,
    ai_risk_level: 'MEDIUM',
    safety_impact: 5.2,
    failure_prob: 0.25
  },
  {
    id: 106,
    task_code: 'TASK-1047',
    department: 'Traction',
    asset_id: 32,
    section_id: 4,
    issue_description: 'Traction substation transformer oil filtration & silica gel renewal',
    criticality: 'CRITICAL',
    urgency: 'EMERGENCY',
    est_duration_hrs: 4.5,
    crew_required: 6,
    due_date: new Date(Date.now() - 12 * 86400000).toISOString(),
    status: 'PENDING',
    ai_priority_score: 88.9,
    ai_risk_level: 'CRITICAL',
    safety_impact: 8.8,
    failure_prob: 0.69
  }
];

export const DEMO_ALERTS: ConflictAlert[] = [
  {
    id: 'AL-01',
    section_id: 1,
    severity: 'CRITICAL',
    alert_type: 'OVERLAPPING_BLOCK',
    title: 'Uncoordinated Overlapping Maintenance on Ghaziabad-Aligarh Section S-01',
    description: 'Engineering requested 3.5h track tamping while S&T requested 2.0h Point Machine overhaul on uncoordinated schedules.',
    recommendation: 'Combine Engineering and S&T activities into a single joint 3.5h block window B-104. Saves 2.0 hours corridor downtime.',
    potential_savings_hrs: 2.0,
    is_resolved: false
  },
  {
    id: 'AL-02',
    section_id: 3,
    severity: 'HIGH',
    alert_type: 'TRAIN_CONTENTION',
    title: 'Vande Bharat Express Slot Contention on Section S-03',
    description: 'Traction OHE inspection block overlaps with peak Vande Bharat Express timetable slot (14:30 - 15:45).',
    recommendation: 'Shift Traction OHE block to low-density night window (01:30 - 05:00). Eliminates 45-minute train delay.',
    potential_savings_hrs: 1.5,
    is_resolved: false
  },
  {
    id: 'AL-03',
    section_id: 4,
    severity: 'HIGH',
    alert_type: 'OVERDUE_TASK',
    title: 'Overdue Critical Traction Substation Task TASK-1047',
    description: 'Transformer unit is 12 days overdue with failure probability increasing to 0.69.',
    recommendation: 'Prioritize in next available 4.5h joint block window B-108.',
    potential_savings_hrs: 4.5,
    is_resolved: false
  }
];
