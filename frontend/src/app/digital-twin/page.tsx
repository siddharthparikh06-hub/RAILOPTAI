'use client';

import React, { useState } from 'react';
import { Layers, Activity, Cpu, Play, CheckCircle2, RefreshCw } from 'lucide-react';

export default function DigitalTwinPage() {
  const [animating, setAnimating] = useState(false);

  const handleTriggerTwinSim = () => {
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            Digital Twin Corridor Simulation Mode
          </h1>
          <p className="text-xs text-slate-400">Live Virtual Representation of Track Geometry, OHE Sub-lines, and Maintenance Crews</p>
        </div>

        <button
          onClick={handleTriggerTwinSim}
          disabled={animating}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
        >
          {animating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{animating ? 'Simulating Digital Twin...' : 'Simulate Block Packing'}</span>
        </button>
      </div>

      {/* Digital Twin 3D/Schematic Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[500px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
        <div className="flex justify-between items-center z-10 font-mono text-xs">
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
            SECTION: S-01 (GHAZIABAD - ALIGARH TRUNK)
          </div>
          <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg font-bold">
            DIGITAL TWIN STATE: SYNCHRONIZED
          </div>
        </div>

        {/* Digital Twin Schematic Layers */}
        <div className="relative z-10 space-y-8 my-auto font-mono">
          {/* Layer 1: Overhead Electrification (OHE) */}
          <div className="space-y-1">
            <div className="text-[10px] text-amber-400 font-bold flex justify-between">
              <span>OVERHEAD ELECTRIFICATION (OHE 25kV AC)</span>
              <span>INSULATOR VOLTAGE: 25.4 kV</span>
            </div>
            <div className="h-2 bg-amber-500/20 rounded-full border border-amber-500/40 relative overflow-hidden">
              <div className={`absolute top-0 bottom-0 bg-amber-400 ${animating ? 'w-full transition-all duration-1000' : 'w-1/3 left-1/4'}`} />
            </div>
          </div>

          {/* Layer 2: Mainline Track & Signals */}
          <div className="space-y-1">
            <div className="text-[10px] text-blue-400 font-bold flex justify-between">
              <span>MAINLINE TRACK SEGMENT (P-WAY 60kg RAIL)</span>
              <span>SIGNAL ASPECT: DOUBLE YELLOW</span>
            </div>
            <div className="h-3 bg-blue-900/30 rounded-full border border-blue-500/40 relative overflow-hidden">
              <div className="absolute left-1/3 w-24 h-full bg-blue-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold animate-pulse">
                TRAIN 12002
              </div>
            </div>
          </div>

          {/* Layer 3: S&T Signaling Cables & Track Circuits */}
          <div className="space-y-1">
            <div className="text-[10px] text-emerald-400 font-bold flex justify-between">
              <span>S&amp;T DIGITAL AXLE COUNTERS &amp; FIBER OPTIC BUS</span>
              <span>TELECOM BUS: 10 Gbps ONLINE</span>
            </div>
            <div className="h-2 bg-emerald-500/20 rounded-full border border-emerald-500/40 relative overflow-hidden">
              <div className="absolute left-1/2 w-32 h-full bg-emerald-500 rounded-full text-[8px] text-slate-950 font-bold text-center">
                DIGITAL BLOCK IN EFFECT
              </div>
            </div>
          </div>
        </div>

        {/* Footer Caption */}
        <div className="z-10 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-center text-slate-300">
          AI is coordinating multi-department maintenance activities directly with train operations in real-time.
        </div>
      </div>
    </div>
  );
}
