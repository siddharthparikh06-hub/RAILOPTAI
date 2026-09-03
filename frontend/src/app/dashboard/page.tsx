'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, Activity, Clock, ShieldAlert, Cpu, Wrench, AlertTriangle, 
  CheckCircle2, ArrowUpRight, ArrowDownRight, Layers 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell 
} from 'recharts';
import KPICard from '@/components/KPICard';
import StatusBadge from '@/components/StatusBadge';
import { getDashboardMetrics, getAlerts, getOptimizationRuns } from '@/services/api';

export default function ExecutiveDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [runs, setRuns] = useState<any[]>([]);

  useEffect(() => {
    getDashboardMetrics().then(setMetrics);
    getAlerts().then(setAlerts);
    getOptimizationRuns().then(setRuns);
  }, []);

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Railway Operations Overview
          </h1>
          <p className="text-xs text-slate-400 font-medium">AI-assisted maintenance planning and corridor availability</p>
        </div>

        <Link
          href="/block-planner"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-blue-600/20 transition-all"
        >
          <Cpu className="w-4 h-4" />
          <span>⚡ GENERATE OPTIMIZED BLOCK PLAN</span>
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <KPICard
          title="Asset Availability"
          value="94.7%"
          change="↑ 8.3%"
          isPositive={true}
          icon={TrendingUp}
          color="emerald"
        />

        <KPICard
          title="Active Blocks"
          value="12"
          subtext="Corridor windows"
          icon={Clock}
          color="blue"
        />

        <KPICard
          title="Critical Tasks"
          value="31"
          subtext="Requires action"
          icon={Wrench}
          color="rose"
        />

        <KPICard
          title="Downtime Saved"
          value="126.5 hrs"
          subtext="Shared joint blocks"
          icon={Activity}
          color="amber"
        />

        <KPICard
          title="Conflicts Avoided"
          value="37"
          subtext="Zero overlaps"
          icon={ShieldAlert}
          color="indigo"
        />

        <KPICard
          title="Train Impact"
          value="-18.4%"
          change="Delay reduced"
          isPositive={true}
          icon={Cpu}
          color="cyan"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Block Utilization Area Chart (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Weekly Block Utilization (Hours)</h3>
              <p className="text-[11px] text-slate-400">Baseline Uncoordinated vs RAILOPT AI Coordinated Blocks</p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Baseline
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Optimized
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.weeklyUtilization} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="baseline" stroke="#EF4444" fillOpacity={1} fill="url(#colorBaseline)" name="Baseline Hours" />
                <Area type="monotone" dataKey="optimized" stroke="#10B981" fillOpacity={1} fill="url(#colorOptimized)" name="Optimized Hours" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Workload Distribution (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
          <div>
            <h3 className="text-sm font-bold text-white">Department Maintenance Workload</h3>
            <p className="text-[11px] text-slate-400">Engineering, Traction, and S&amp;T Share</p>
          </div>

          <div className="space-y-4 pt-2 font-mono text-xs">
            {metrics.departmentsWorkload.map((dept: any) => (
              <div key={dept.name} className="space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-200">{dept.name}</span>
                  <span className="font-bold text-white">{dept.percentage}%</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${dept.percentage}%`, backgroundColor: dept.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Alerts & Recent Optimization Runs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Critical Maintenance Alerts (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Critical Maintenance Alerts
            </h3>
            <Link href="/alerts" className="text-xs font-mono text-blue-400 hover:underline">
              View All &rarr;
            </Link>
          </div>

          <div className="space-y-2">
            {alerts.slice(0, 3).map((al: any) => (
              <div key={al.id} className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <StatusBadge status={al.severity} />
                  <span className="text-slate-500">{al.timestamp}</span>
                </div>
                <div className="font-semibold text-slate-200 text-xs">{al.title}</div>
                <p className="text-[11px] text-slate-400 leading-snug">{al.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Optimization Runs (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              Recent Optimization Runs
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold">SOLVER READY</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[10px]">
                <tr>
                  <th className="p-2.5">Run ID</th>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Tasks</th>
                  <th className="p-2.5">Blocks</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Improvement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {runs.map((r: any) => (
                  <tr key={r.runId} className="hover:bg-slate-800/40">
                    <td className="p-2.5 font-bold text-blue-400">{r.runId}</td>
                    <td className="p-2.5 text-slate-300">{r.date}</td>
                    <td className="p-2.5 text-slate-300">{r.tasks}</td>
                    <td className="p-2.5 text-slate-300">{r.blocks}</td>
                    <td className="p-2.5"><StatusBadge status={r.status} /></td>
                    <td className="p-2.5 text-right font-bold text-emerald-400">+{r.improvementPct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
