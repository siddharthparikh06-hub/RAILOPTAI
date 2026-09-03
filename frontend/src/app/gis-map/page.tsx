'use client';

import React, { useState } from 'react';
import { Map, Search, Filter, ShieldAlert, X, Eye } from 'lucide-react';
import RailwayMap from '@/components/RailwayMap';
import { mockAssets, Asset } from '@/data/mockData';

export default function RailwayMapPage() {
  const [filterDept, setFilterDept] = useState('ALL');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(mockAssets[0]);

  const filteredAssets = mockAssets.filter((ast) => {
    if (filterDept === 'Engineering' && ast.department !== 'Engineering') return false;
    if (filterDept === 'Traction' && ast.department !== 'Traction') return false;
    if (filterDept === 'ST' && ast.department !== 'Signal & Telecom') return false;
    if (filterDept === 'Critical' && ast.risk !== 'Critical') return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Map className="w-5 h-5 text-blue-400" />
            Schematic Railway Network Map
          </h1>
          <p className="text-xs text-slate-400">Interactive Infrastructure Map, Signals, OHE, Tracks &amp; Active Blocks</p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-amber-400 font-bold">
            SCHEMATIC DEMO MAP — NOT REAL-TIME
          </span>
        </div>
      </div>

      {/* Layer Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center space-x-2 text-xs font-mono">
        <span className="text-slate-400 font-bold mr-2">Layer Filter:</span>
        <button
          onClick={() => setFilterDept('ALL')}
          className={`px-3 py-1 rounded ${filterDept === 'ALL' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
        >
          All Layers
        </button>
        <button
          onClick={() => setFilterDept('Engineering')}
          className={`px-3 py-1 rounded ${filterDept === 'Engineering' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
        >
          Engineering
        </button>
        <button
          onClick={() => setFilterDept('Traction')}
          className={`px-3 py-1 rounded ${filterDept === 'Traction' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
        >
          Traction (OHE)
        </button>
        <button
          onClick={() => setFilterDept('ST')}
          className={`px-3 py-1 rounded ${filterDept === 'ST' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
        >
          S&amp;T
        </button>
        <button
          onClick={() => setFilterDept('Critical')}
          className={`px-3 py-1 rounded ${filterDept === 'Critical' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
        >
          Critical Assets
        </button>
      </div>

      {/* SVG Railway Map & Asset Details Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Map View (8 cols) */}
        <div className="lg:col-span-8">
          <RailwayMap />
        </div>

        {/* Right Asset Details Drawer (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-bold text-blue-400 uppercase text-xs">ASSET DETAILS</span>
            <span className="text-[10px] text-slate-400">SELECT ASSET</span>
          </div>

          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {filteredAssets.map((ast) => (
              <div
                key={ast.id}
                onClick={() => setSelectedAsset(ast)}
                className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                  selectedAsset?.id === ast.id ? 'bg-blue-950/60 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between font-bold">
                  <span className="text-blue-400">{ast.tag}</span>
                  <span className={ast.risk === 'Critical' ? 'text-rose-400' : 'text-amber-400'}>{ast.risk} Risk</span>
                </div>
                <div className="font-medium text-slate-200 text-[11px] truncate mt-0.5">{ast.name}</div>
              </div>
            ))}
          </div>

          {selectedAsset && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 pt-4 border-t border-slate-800">
              <div className="space-y-0.5 font-sans">
                <span className="text-[10px] font-mono text-blue-400 font-bold">{selectedAsset.tag}</span>
                <h3 className="text-base font-bold text-white">{selectedAsset.name}</h3>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Health Index:</span>
                  <span className="text-amber-400 font-bold">{selectedAsset.health}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Assessment:</span>
                  <span className="text-rose-400 font-bold">{selectedAsset.risk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Maintenance:</span>
                  <span className="text-slate-200">{selectedAsset.lastMaintenance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Next Maintenance Due:</span>
                  <span className="text-slate-200">{selectedAsset.nextDue}</span>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">AI RECOMMENDED ACTION:</span>
                  <p className="text-emerald-400 font-bold font-sans text-xs">{selectedAsset.recommendation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
