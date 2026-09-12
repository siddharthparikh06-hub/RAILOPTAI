'use client';

import React, { useState } from 'react';
import { Layers, Activity, Cpu, Play, CheckCircle2, RefreshCw, Zap, Train, ShieldCheck, Gauge, Info } from 'lucide-react';
import { useInputData } from '@/context/InputDataContext';
import { mockTrainMovements, mockMaintenanceTasks } from '@/data/mockData';

export default function DigitalTwinPage() {
  const { latestResult, datasets, maintenanceTasks: localTasks } = useInputData();
  const [selectedSection, setSelectedSection] = useState('S-14');
  const [animating, setAnimating] = useState(false);

  const availableSections = Array.from(
    new Set([
      'S-14', 'S-12', 'S-10',
      ...(datasets.sections || []).map((s) => s.section_id),
      ...(datasets.timetable || []).map((t) => t.section_id),
      ...(datasets.maintenance || []).map((m) => m.section_id),
    ])
  ).filter(Boolean);

  const sectionTasks = [
    ...localTasks,
    ...(datasets.maintenance || []).map((row, idx) => ({
      taskCode: row.task_code || `TASK-${idx + 100}`,
      sectionId: row.section_id || 'S-14',
      department: row.department || 'Engineering',
      asset: row.asset || 'Corridor Asset',
      criticality: row.criticality || 'Medium',
      durationHrs: Number(row.duration_hours || 2)
    })),
    ...mockMaintenanceTasks
  ].filter((t) => t.sectionId === selectedSection);

  const sectionTrains = [
    ...(datasets.timetable || []).map((t, idx) => ({
      trainNo: t.train_number || `TR-${idx + 100}`,
      name: t.train_name || `Express ${t.train_number}`,
      sectionId: t.section_id || 'S-14',
      arrivalTime: t.planned_entry || '06:00',
      departureTime: t.planned_exit || '07:15'
    })),
    ...mockTrainMovements
  ].filter((t) => t.sectionId === selectedSection);

  const handleTriggerTwinSim = () => {
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
    }, 2400);
  };

  const scheduledAssignments = (latestResult?.assignments || []).filter(
    (a: any) => a.section_id === selectedSection
  );

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            Digital Twin Corridor Simulation Mode
          </h1>
          <p className="text-xs text-slate-400">Live Virtual Representation of Track Geometry, OHE Sub-lines, and Maintenance Crews</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
          >
            {availableSections.map((sec) => (
              <option key={sec} value={sec}>
                Section {sec} Telemetry
              </option>
            ))}
          </select>

          <button
            onClick={handleTriggerTwinSim}
            disabled={animating}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 font-mono"
          >
            {animating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{animating ? 'SIMULATING BLOCK PACKING...' : 'SIMULATE BLOCK PACKING'}</span>
          </button>
        </div>
      </div>

      {/* KPI Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <div className="text-[10px] text-slate-400">CORRIDOR SECTION</div>
          <div className="text-lg font-black text-white mt-0.5">{selectedSection}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <div className="text-[10px] text-slate-400">TRAIN MOVEMENTS</div>
          <div className="text-lg font-black text-cyan-400 mt-0.5">{sectionTrains.length} Protected</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <div className="text-[10px] text-slate-400">MAINTENANCE TASKS</div>
          <div className="text-lg font-black text-blue-400 mt-0.5">{sectionTasks.length} Pending</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <div className="text-[10px] text-slate-400">DIGITAL TWIN STATUS</div>
          <div className="text-lg font-black text-emerald-400 mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>{animating ? 'PACKING BLOCKS' : 'SYNCHRONIZED'}</span>
          </div>
        </div>
      </div>

      {/* Digital Twin 3D/Schematic Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-6">
        <div className="flex justify-between items-center z-10 font-mono text-xs">
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-blue-400" />
            <span>REAL-TIME CORRIDOR TWIN: SECTION {selectedSection}</span>
          </div>
          <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg font-bold">
            DIGITAL TWIN STATE: {animating ? 'PACKING & VALIDATING' : 'SYNCHRONIZED'}
          </div>
        </div>

        {/* Digital Twin Schematic Layers */}
        <div className="relative z-10 space-y-8 my-auto font-mono">
          {/* Layer 1: Overhead Electrification (OHE) */}
          <div className="space-y-2 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-amber-400 font-bold flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                OVERHEAD ELECTRIFICATION (OHE 25kV AC TELEMETRY)
              </span>
              <span className="text-[11px] font-mono text-amber-300">INSULATOR VOLTAGE: 25.4 kV · ISOLATION SWITCH: READY</span>
            </div>
            <div className="h-3 bg-amber-500/20 rounded-full border border-amber-500/40 relative overflow-hidden">
              <div
                className={`absolute top-0 bottom-0 bg-amber-400 rounded-full transition-all duration-700 ${
                  animating ? 'w-full left-0 animate-pulse' : 'w-2/5 left-1/4'
                }`}
              />
            </div>
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>TRD Substation Feed: 100% Operational</span>
              <span>OHE Maintenance Crew: {sectionTasks.filter((t) => t.department === 'Traction').length} Task(s) Allocated</span>
            </div>
          </div>

          {/* Layer 2: Mainline Track & Signals */}
          <div className="space-y-2 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-blue-400 font-bold flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Train className="w-4 h-4" />
                MAINLINE TRACK SEGMENT (P-WAY 60kg RAIL GEOMETRY)
              </span>
              <span className="text-[11px] font-mono text-cyan-300">SIGNAL ASPECT: PROCEED / DOUBLE YELLOW</span>
            </div>
            <div className="h-4 bg-blue-900/30 rounded-full border border-blue-500/40 relative overflow-hidden flex items-center">
              {sectionTrains.map((train, idx) => (
                <div
                  key={idx}
                  className={`absolute h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold px-3 transition-all duration-1000 ${
                    animating ? 'animate-pulse scale-105' : ''
                  }`}
                  style={{ left: `${(idx * 35 + 15) % 80}%`, width: '120px' }}
                >
                  TRAIN {train.trainNo}
                </div>
              ))}
              {sectionTrains.length === 0 && (
                <div className="w-full text-center text-[10px] text-slate-500">Track Corridor Clear — No Active Movements</div>
              )}
            </div>
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>Track Quality Index (TQI): 98.4 (Good)</span>
              <span>P-Way Maintenance: {sectionTasks.filter((t) => t.department === 'Engineering').length} Task(s) Active</span>
            </div>
          </div>

          {/* Layer 3: S&T Signaling Cables & Track Circuits */}
          <div className="space-y-2 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-emerald-400 font-bold flex justify-between items-center">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                S&amp;T DIGITAL AXLE COUNTERS &amp; FIBER OPTIC BUS
              </span>
              <span className="text-[11px] font-mono text-emerald-300">TELECOM BUS: 10 Gbps ONLINE · INTERLOCKING: ACTIVE</span>
            </div>
            <div className="h-3 bg-emerald-500/20 rounded-full border border-emerald-500/40 relative overflow-hidden">
              <div
                className={`absolute h-full bg-emerald-500 rounded-full text-[9px] text-slate-950 font-bold flex items-center justify-center px-4 transition-all duration-700 ${
                  animating ? 'w-full left-0' : 'w-1/2 left-1/4'
                }`}
              >
                {animating ? 'VALIDATING JOINT MULTI-DEPARTMENT BLOCK' : 'DIGITAL BLOCK INTERLOCKING ENFORCED'}
              </div>
            </div>
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>Axle Counter Count: 48 Units Synchronized</span>
              <span>S&amp;T Maintenance: {sectionTasks.filter((t) => t.department === 'Signal & Telecom').length} Task(s) Registered</span>
            </div>
          </div>
        </div>

        {/* Live Simulation Info Footer */}
        <div className="z-10 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between text-slate-200 font-bold">
            <span>CORRIDOR DIGITAL TWIN STATUS:</span>
            <span className="text-cyan-400">
              {scheduledAssignments.length > 0
                ? `${scheduledAssignments.length} Joint Block Window(s) Calculated`
                : `${sectionTasks.length} Maintenance Tasks Ready for Block Packing`}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            RailOpt AI Digital Twin continuously models physical track geometry, traction OHE power feeds, and S&amp;T signaling interlocking to verify that multi-department maintenance windows do not disrupt scheduled train paths.
          </p>
        </div>
      </div>
    </div>
  );
}
