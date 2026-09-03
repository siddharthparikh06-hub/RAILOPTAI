'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Activity, Wrench, BrainCircuit, CalendarCheck, BarChart3, 
  Clock, TrainTrack, CalendarDays, CalendarRange, Map, Layers, AlertTriangle, 
  Bot, FileText, Settings, Sparkles, ChevronLeft, ChevronRight 
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Operations Center', path: '/operations', icon: Activity, badge: 'LIVE' },
  { label: 'Maintenance', path: '/maintenance', icon: Wrench },
  { label: 'AI Priority Engine', path: '/ai-priority', icon: BrainCircuit },
  { label: 'Automatic Block Planner', path: '/block-planner', icon: CalendarCheck, highlight: true },
  { label: 'Gantt Timeline', path: '/gantt', icon: Clock },
  { label: 'Optimization Impact', path: '/optimization-impact', icon: BarChart3, badge: 'IMPACT' },
  { label: 'Weekly Planning', path: '/weekly-planner', icon: CalendarDays },
  { label: 'Monthly Planning', path: '/monthly-planner', icon: CalendarRange },
  { label: 'Railway Map', path: '/gis-map', icon: Map },
  { label: 'Train Impact', path: '/train-impact', icon: TrainTrack },
  { label: 'Alerts', path: '/alerts', icon: AlertTriangle },
  { label: 'Reports', path: '/reports', icon: FileText },
  { label: 'RailOpt Copilot', path: '/copilot', icon: Bot },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 transition-all duration-300 z-40 select-none shadow-2xl`}>
      {/* Brand & Logo */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        {!collapsed && (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white tracking-wider shadow-lg shadow-blue-500/20 text-sm">
                RO
              </div>
              <span className="font-black text-lg tracking-tight text-white flex items-center gap-1.5">
                RAILOPT <span className="text-blue-400">AI</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">AI-Powered Railway Maintenance &amp; Block Optimization</p>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-mono font-bold">
              <Sparkles className="w-2.5 h-2.5" />
              <span>SIH 2026 • DEMO ENVIRONMENT</span>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm mx-auto shadow-lg">
            RO
          </div>
        )}

        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="py-2 px-2 overflow-y-auto flex-1 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path || (pathname === '/' && item.path === '/dashboard');
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              title={collapsed ? item.label : undefined}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold shadow-sm'
                  : 'hover:bg-slate-800/80 hover:text-slate-100 text-slate-400'
              } ${item.highlight ? 'ring-1 ring-blue-500/30 bg-blue-950/20' : ''}`}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!collapsed && item.badge && (
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  item.badge === 'LIVE' 
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer System Status */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 space-y-1.5 font-mono">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">System Status</div>
          <div className="flex items-center gap-1.5 text-emerald-400 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>● Demo Environment</span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-400 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>● Optimization Engine — UI Preview</span>
          </div>
        </div>
      )}
    </aside>
  );
}
