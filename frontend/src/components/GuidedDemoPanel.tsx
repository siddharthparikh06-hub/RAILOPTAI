'use client';

import React from 'react';
import { CheckCircle2, ChevronRight, Play, RotateCcw, X } from 'lucide-react';
import { DEMO_STEPS, useDemo } from '@/context/DemoContext';

export default function GuidedDemoPanel() {
  const { active, currentStep, completed, startDemo, advanceDemo, resetDemo } = useDemo();
  const [open, setOpen] = React.useState(false);

  if (!active) {
    return <button onClick={() => { startDemo(); setOpen(true); }} className="flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-600/15 px-3 py-2 text-[11px] font-bold text-blue-300 hover:bg-blue-600/25 font-mono" title="Start guided demo"><Play className="h-3.5 w-3.5 fill-current" /> RUN GUIDED DEMO</button>;
  }

  const step = DEMO_STEPS[currentStep];
  return <div className="relative">
    <button onClick={() => setOpen((value) => !value)} className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[11px] font-bold text-emerald-300 font-mono" title="Open guided demo progress">
      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> DEMO {currentStep + 1}/{DEMO_STEPS.length}
    </button>
    {open && <>
      <div aria-hidden="true" className="fixed inset-0 z-[90] bg-slate-950/75" />
      <div className="fixed right-4 top-20 z-[100] w-[min(24rem,calc(100vw-2rem))] max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-slate-700 bg-[#0B1220] p-4 shadow-2xl font-mono">
      <div className="mb-3 flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
        <div><div className="text-[10px] font-bold tracking-widest text-blue-400">CONTROLLED DEMO MODE</div><div className="mt-1 text-sm font-bold text-white">{completed ? 'Demo complete' : step.title}</div></div>
        <button onClick={() => setOpen(false)} aria-label="Close demo panel" className="p-1 text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-slate-300">{step.detail}</p>
      <div className="mb-4 grid grid-cols-5 gap-1">{DEMO_STEPS.map((demoStep, index) => <span key={demoStep.id} className={`h-1.5 rounded-full ${index <= currentStep ? 'bg-emerald-400' : 'bg-slate-700'}`} />)}</div>
      <div className="flex gap-2">
        {!completed ? <button onClick={advanceDemo} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-500"><span>{currentStep === 0 ? 'Continue' : 'Next step'}</span><ChevronRight className="h-3.5 w-3.5" /></button> : <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-300"><CheckCircle2 className="h-4 w-4" /> KPIs updated</div>}
        <button onClick={() => { resetDemo(); setOpen(false); }} className="rounded-xl border border-slate-700 px-3 py-2 text-slate-400 hover:text-white" title="Reset demo"><RotateCcw className="h-3.5 w-3.5" /></button>
      </div>
      </div>
    </>}
  </div>;
}
