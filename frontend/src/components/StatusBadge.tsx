'use client';

import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const s = status.toUpperCase();

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';

  if (['CRITICAL', 'EMERGENCY', 'HIGH_RISK'].includes(s)) {
    colorClasses = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
  } else if (['HIGH', 'WARNING', 'URGENT'].includes(s)) {
    colorClasses = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  } else if (['COMPLETED', 'OPTIMAL', 'HEALTHY', 'OPERATIONAL'].includes(s)) {
    colorClasses = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  } else if (['PENDING', 'SCHEDULED', 'IN PROGRESS'].includes(s)) {
    colorClasses = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  }

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${colorClasses}`}>
      {status}
    </span>
  );
}
