'use client';

import React, { useEffect, useState } from 'react';
import { Activity, BrainCircuit, Database, RefreshCw, TrainFront, Zap } from 'lucide-react';

type ServiceState = 'checking' | 'ready' | 'unavailable';

interface OperationalStatusState {
  system: ServiceState;
  dataFeed: ServiceState;
  lastUpdate: string | null;
}

const initialState: OperationalStatusState = {
  system: 'checking',
  dataFeed: 'checking',
  lastUpdate: null,
};

function statusLabel(state: ServiceState) {
  if (state === 'checking') return 'Checking';
  if (state === 'ready') return 'Ready';
  return 'Unavailable';
}

function statusClass(state: ServiceState) {
  if (state === 'checking') return 'text-amber-400';
  if (state === 'ready') return 'text-emerald-400';
  return 'text-rose-400';
}

function StatusDot({ state }: { state: ServiceState }) {
  return <span className={`inline-block h-2 w-2 rounded-full ${state === 'ready' ? 'bg-emerald-400' : state === 'checking' ? 'bg-amber-400 animate-pulse' : 'bg-rose-400'}`} />;
}

export default function OperationalStatus() {
  const [status, setStatus] = useState(initialState);

  useEffect(() => {
    let active = true;

    const checkStatus = async () => {
      try {
        const response = await fetch('/api/dashboard/summary', { cache: 'no-store' });
        if (!active) return;
        const now = new Date();
        setStatus({
          system: response.ok ? 'ready' : 'unavailable',
          dataFeed: response.ok ? 'ready' : 'unavailable',
          lastUpdate: now.toLocaleTimeString([], { hour12: false }),
        });
      } catch {
        if (!active) return;
        setStatus({
          system: 'unavailable',
          dataFeed: 'unavailable',
          lastUpdate: new Date().toLocaleTimeString([], { hour12: false }),
        });
      }
    };

    checkStatus();
    const interval = window.setInterval(checkStatus, 30000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const serviceItems = [
    { label: 'System Status', value: status.system === 'ready' ? 'Operational' : statusLabel(status.system), state: status.system, icon: Activity },
    { label: 'Data Feed', value: status.system === 'ready' ? 'Connected' : statusLabel(status.dataFeed), state: status.dataFeed, icon: Database },
    { label: 'AI Engine', value: status.system === 'ready' ? 'Ready' : statusLabel(status.system), state: status.system, icon: BrainCircuit },
    { label: 'Optimization Solver', value: status.system === 'ready' ? 'Ready' : statusLabel(status.system), state: status.system, icon: Zap },
  ];

  return (
    <section aria-label="Operational status" className="mb-4 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2.5 shadow-lg">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px]">
        <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wide">
          <RefreshCw className={`h-3.5 w-3.5 ${status.system === 'checking' ? 'animate-spin text-amber-400' : 'text-blue-400'}`} />
          System Status
        </div>
        {serviceItems.map(({ label, value, state, icon: Icon }) => (
          <div key={label} className="flex items-center gap-1.5">
            <Icon className={`h-3.5 w-3.5 ${statusClass(state)}`} />
            <span className="text-slate-500">{label}</span>
            <StatusDot state={state} />
            <span className={`font-bold ${statusClass(state)}`}>{value}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <TrainFront className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-slate-500">Train Feed</span>
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          <span className="font-bold text-cyan-400">Simulated</span>
        </div>
        <div className="ml-auto text-slate-400">
          Last Update <span className="font-bold text-white">{status.lastUpdate || '--:--:--'}</span>
        </div>
      </div>
    </section>
  );
}
