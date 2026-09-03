'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color?: string;
  subtext?: string;
}

export default function KPICard({ title, value, change, isPositive = true, icon: Icon, color = 'blue', subtext }: KPICardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 relative overflow-hidden shadow-lg hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        <span className={`p-1.5 rounded-lg bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>
          <Icon className="w-4 h-4" />
        </span>
      </div>

      <div className="text-3xl font-extrabold text-white font-mono">{value}</div>

      {(change || subtext) && (
        <div className="flex items-center justify-between text-[11px] font-mono">
          {change && (
            <span className={`flex items-center gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'} font-semibold`}>
              {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {change}
            </span>
          )}
          {subtext && <span className="text-slate-500">{subtext}</span>}
        </div>
      )}
    </div>
  );
}
