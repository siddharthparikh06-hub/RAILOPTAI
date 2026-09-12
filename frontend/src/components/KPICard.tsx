'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color?: string;
  subtext?: string;
  href?: string;
}

export default function KPICard({ title, value, change, isPositive = true, icon: Icon, color = 'blue', subtext, href }: KPICardProps) {
  const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', glow: 'group-hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', glow: 'group-hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]' },
    rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', glow: 'group-hover:shadow-[0_0_25px_rgba(244,63,94,0.25)]' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', glow: 'group-hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]' },
    indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', glow: 'group-hover:shadow-[0_0_25px_rgba(99,102,241,0.25)]' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', glow: 'group-hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]' },
  };

  const currentTheme = colorMap[color] || colorMap.blue;

  const card = (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`group relative h-full bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-xl hover:border-slate-700 transition-all duration-300 ${currentTheme.glow} ${href ? 'cursor-pointer focus-within:ring-2 focus-within:ring-blue-500/60' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-xl ${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border} transition-transform group-hover:scale-110`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="text-3xl font-black text-white font-mono tracking-tight">{value}</div>

      {(change || subtext) && (
        <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-slate-800/60">
          {change && (
            <span className={`flex items-center gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'} font-bold`}>
              {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {change}
            </span>
          )}
          {subtext && <span className="text-slate-500 truncate max-w-[120px]">{subtext}</span>}
        </div>
      )}
    </motion.div>
  );

  return href ? <Link href={href} className="block h-full" aria-label={`View ${title}`}>{card}</Link> : card;
}
