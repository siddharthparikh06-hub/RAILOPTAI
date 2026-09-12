'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Activity, Wrench, BrainCircuit, CalendarCheck, BarChart3, 
  Clock, TrainTrack, CalendarDays, CalendarRange, Map, AlertTriangle, 
  Bot, FileText, Settings, Sparkles, ChevronLeft, ChevronRight, UserCheck, KeyRound, Menu, X, ChevronDown, HeartPulse, PlayCircle, Database
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const NAV_GROUPS = [
  {
    label: 'OPERATIONS',
    items: [
      { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Operations Center', path: '/operations', icon: Activity, badge: 'LIVE' },
      { label: 'Railway Map', path: '/gis-map', icon: Map },
      { label: 'Train Impact', path: '/train-impact', icon: TrainTrack },
    ],
  },
  {
    label: 'MAINTENANCE',
    items: [
      { label: 'Maintenance', path: '/maintenance', icon: Wrench },
      { label: 'Asset Health', path: '/maintenance', icon: HeartPulse },
      { label: 'AI Priority Engine', path: '/ai-priority', icon: BrainCircuit },
    ],
  },
  {
    label: 'OPTIMIZATION',
    items: [
      { label: 'Automatic Block Planner', path: '/block-planner', icon: CalendarCheck, highlight: true },
      { label: 'Gantt Timeline', path: '/gantt', icon: Clock },
      { label: 'Optimization Impact', path: '/optimization-impact', icon: BarChart3, badge: 'IMPACT' },
      { label: 'Scenario Simulator', path: '/digital-twin', icon: PlayCircle },
    ],
  },
  {
    label: 'PLANNING',
    items: [
      { label: 'Data Intake', path: '/data-input', icon: Database, badge: 'INPUT' },
      { label: 'Weekly Planning', path: '/weekly-planner', icon: CalendarDays },
      { label: 'Monthly Planning', path: '/monthly-planner', icon: CalendarRange },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { label: 'Alerts', path: '/alerts', icon: AlertTriangle },
      { label: 'Reports', path: '/reports', icon: FileText },
      { label: 'RailOpt Copilot', path: '/copilot', icon: Bot },
      { label: 'User Profile', path: '/profile', icon: UserCheck },
      { label: 'Login / RBAC Auth', path: '/login', icon: KeyRound },
      { label: 'Settings', path: '/settings', icon: Settings },
    ],
  },
];

type NavItem = (typeof NAV_GROUPS)[number]['items'][number];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    OPERATIONS: true,
    MAINTENANCE: true,
    OPTIMIZATION: true,
    PLANNING: true,
    SYSTEM: true,
  });
  const { user } = useAuth();

  const isActive = (item: NavItem) => pathname === item.path || (pathname === '/' && item.path === '/dashboard');

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
        className="fixed left-3 top-[4.65rem] z-40 rounded-lg border border-slate-700 bg-slate-900/95 p-2 text-slate-300 shadow-lg backdrop-blur-md md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-[2px] md:hidden"
        />
      )}
      <aside className={`${collapsed ? 'w-16' : 'w-64'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} fixed inset-y-0 left-0 md:sticky md:top-0 md:translate-x-0 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between shrink-0 h-screen transition-all duration-300 z-50 select-none shadow-2xl`}>
      {/* Brand & Logo */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        {!collapsed && (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white tracking-wider shadow-lg shadow-blue-500/20 text-sm">
                RO
              </div>
              <span className="font-black text-lg tracking-tight text-white flex items-center gap-1.5 font-mono">
                RAILOPT <span className="text-blue-400">AI</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">AI-Powered Railway Maintenance &amp; Block Optimization</p>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-mono font-bold">
              <Sparkles className="w-2.5 h-2.5" />
              <span>SIH 2026 • RBAC ENFORCED</span>
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
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="py-2 px-2 overflow-y-auto flex-1 space-y-0.5">
        {NAV_GROUPS.map((group) => {
          const groupOpen = openGroups[group.label] || group.items.some(isActive);
          return (
            <div key={group.label} className="mb-2">
              {!collapsed && (
                <button
                  onClick={() => setOpenGroups((previous) => ({ ...previous, [group.label]: !groupOpen }))}
                  aria-expanded={groupOpen}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-slate-500 hover:text-slate-300 font-mono"
                >
                  <span>{group.label}</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${groupOpen ? '' : '-rotate-90'}`} />
                </button>
              )}
              {(collapsed || groupOpen) && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = isActive(item);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={`${group.label}-${item.label}`}
                        href={item.path}
                        onClick={() => setMobileOpen(false)}
                        title={collapsed ? `${group.label}: ${item.label}` : undefined}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          active
                            ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold shadow-sm'
                            : 'hover:bg-slate-800/80 hover:text-slate-100 text-slate-400'
                        } ${item.highlight ? 'ring-1 ring-blue-500/30 bg-blue-950/20' : ''}`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-blue-400' : 'text-slate-400'}`} />
                          {!collapsed && <span className="truncate font-mono">{item.label}</span>}
                        </div>
                        {!collapsed && item.badge && (
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${item.badge === 'LIVE' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Department Role Badge */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[11px] text-slate-300 space-y-1 font-mono">
          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Active Department Role</div>
          <div className="font-bold text-white text-xs truncate">
            {user ? user.name : 'Demo Engineering Officer'}
          </div>
          <div className="text-amber-400 font-bold text-[10px] truncate">
            {user ? user.department : 'Engineering / P-Way'}
          </div>
        </div>
      )}
        <button
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
          className="absolute right-3 top-4 rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </aside>
    </>
  );
}
