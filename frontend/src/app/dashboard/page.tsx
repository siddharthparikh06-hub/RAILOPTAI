'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Activity, Clock, ShieldAlert, Cpu, Wrench, AlertTriangle 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Label
} from 'recharts';
import KPICard from '@/components/KPICard';
import StatusBadge from '@/components/StatusBadge';
import { getDashboardMetrics, getAlerts, getOptimizationRuns } from '@/services/api';
import { useDemo } from '@/context/DemoContext';

const fullDayNames: Record<string, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
};

function WeeklyUtilizationTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;

  const dataPoint = payload[0].payload;
  const baselineHours = Number(dataPoint.baseline) || 0;
  const optimizedHours = Number(dataPoint.optimized) || 0;
  const hoursSaved = baselineHours - optimizedHours;
  const reduction = baselineHours > 0 ? (hoursSaved / baselineHours) * 100 : 0;

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/95 p-3 shadow-2xl font-mono text-xs">
      <div className="mb-2 border-b border-slate-800 pb-2 font-bold text-white">
        Day: {fullDayNames[dataPoint.day] || dataPoint.day}
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between gap-6 text-rose-300">
          <span>Baseline Block Hours:</span>
          <strong>{baselineHours.toFixed(1)} hrs</strong>
        </div>
        <div className="flex justify-between gap-6 text-emerald-300">
          <span>RAILOPT AI Block Hours:</span>
          <strong>{optimizedHours.toFixed(1)} hrs</strong>
        </div>
        <div className="flex justify-between gap-6 border-t border-slate-800 pt-1.5 text-cyan-300">
          <span>Hours Saved:</span>
          <strong>{hoursSaved.toFixed(1)} hrs</strong>
        </div>
        <div className="flex justify-between gap-6 text-emerald-400">
          <span>Reduction:</span>
          <strong>{reduction.toFixed(1)}%</strong>
        </div>
      </div>
    </div>
  );
}

export default function ExecutiveDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [runs, setRuns] = useState<any[]>([]);
  const { active: demoActive, completed: demoComplete } = useDemo();

  useEffect(() => {
    getDashboardMetrics().then(setMetrics);
    getAlerts().then(setAlerts);
    getOptimizationRuns().then(setRuns);
  }, []);

  if (!metrics) return null;

  const displayMetrics = demoComplete ? {
    ...metrics,
    assetAvailability: 94.7,
    activeBlocks: 12,
    criticalTasks: 31,
    downtimeSavedHrs: 126.5,
    conflictsAvoided: 37,
    trainImpactReduction: -18.4,
  } : demoActive ? {
    ...metrics,
    assetAvailability: 87.4,
    activeBlocks: 29,
    criticalTasks: 31,
    downtimeSavedHrs: 0,
    conflictsAvoided: 0,
    trainImpactReduction: 0,
  } : metrics;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400 animate-pulse" />
            Railway Operations Overview
          </h1>
          <p className="text-xs text-slate-400 font-medium">AI-assisted maintenance planning and corridor availability</p>
        </div>

        <Link
          href="/block-planner"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 font-mono"
        >
          <Cpu className="w-4 h-4" />
          <span>⚡ GENERATE OPTIMIZED BLOCK PLAN</span>
        </Link>
      </motion.div>

      {/* KPI Cards Grid */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-300 font-mono">Key Operational Indicators</h2>
            <p className="text-[11px] text-slate-500">Select an indicator to open its operational workspace</p>
          </div>
          <span className="hidden sm:inline text-[10px] font-mono text-slate-500">LIVE SNAPSHOT</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <KPICard
          title="Asset Availability"
          value={`${displayMetrics.assetAvailability}%`}
          change={`↑ ${displayMetrics.assetAvailabilityChange}`}
          isPositive={true}
          icon={TrendingUp}
          color="emerald"
          href="/gis-map"
        />

        <KPICard
          title="Active Maintenance Blocks"
          value={displayMetrics.activeBlocks}
          subtext="Corridor windows"
          icon={Clock}
          color="blue"
          href="/block-planner"
        />

        <KPICard
          title="Critical Tasks"
          value={displayMetrics.criticalTasks}
          subtext="Requires action"
          icon={Wrench}
          color="rose"
          href="/maintenance"
        />

        <KPICard
          title="Possession Hours Saved"
          value={`${displayMetrics.downtimeSavedHrs} hrs`}
          subtext="Shared joint blocks"
          icon={Activity}
          color="amber"
          href="/optimization-impact"
        />

        <KPICard
          title="Train Conflicts Prevented"
          value={displayMetrics.conflictsAvoided}
          subtext="Protected movements"
          icon={ShieldAlert}
          color="indigo"
          href="/alerts"
        />

        <KPICard
          title="Predicted Delay Reduction"
          value={`${Math.abs(displayMetrics.trainImpactReduction)}%`}
          change="Delay reduced"
          isPositive={true}
          icon={Cpu}
          color="cyan"
          href="/train-impact"
        />
        </div>
      </motion.div>

      {/* Charts Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Block Utilization Area Chart (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Weekly Block Utilization (Hours)</h3>
              <p className="text-[11px] text-slate-400">Baseline Uncoordinated vs RAILOPT AI Coordinated Blocks</p>
              <p className="text-[11px] text-slate-300 mt-1">Compares daily railway maintenance block hours before and after RAILOPT AI coordination.</p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Baseline — Uncoordinated Plan
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                RAILOPT AI Optimized
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
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} height={48}>
                  <Label value="Day of Week" position="insideBottom" offset={-8} fill="#94A3B8" fontSize={11} />
                </XAxis>
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(value) => `${value} hrs`} width={58}>
                  <Label value="Maintenance Block Hours" angle={-90} position="insideLeft" offset={8} fill="#94A3B8" fontSize={11} />
                </YAxis>
                <Tooltip content={<WeeklyUtilizationTooltip />} />
                <Area type="monotone" dataKey="baseline" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorBaseline)" name="Baseline — Uncoordinated Plan" />
                <Area type="monotone" dataKey="optimized" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorOptimized)" name="RAILOPT AI Optimized" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Workload Distribution (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
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
                <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dept.percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: dept.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Critical Alerts & Recent Optimization Runs Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Critical Maintenance Alerts (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
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
              <motion.div 
                key={al.id} 
                whileHover={{ scale: 1.01, x: 2 }}
                className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5 transition-colors"
              >
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <StatusBadge status={al.severity} />
                  <span className="text-slate-500">{al.timestamp}</span>
                </div>
                <div className="font-semibold text-slate-200 text-xs">{al.title}</div>
                <p className="text-[11px] text-slate-400 leading-snug">{al.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Optimization Runs (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              Recent Optimization Runs
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold">SOLVER READY</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-[10px]">
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
                  <motion.tr 
                    key={r.runId} 
                    whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.5)' }}
                    className="transition-colors cursor-pointer"
                  >
                    <td className="p-2.5 font-bold text-blue-400">{r.runId}</td>
                    <td className="p-2.5 text-slate-300">{r.date}</td>
                    <td className="p-2.5 text-slate-300">{r.tasks}</td>
                    <td className="p-2.5 text-slate-300">{r.blocks}</td>
                    <td className="p-2.5"><StatusBadge status={r.status} /></td>
                    <td className="p-2.5 text-right font-bold text-emerald-400">+{r.improvementPct}%</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
