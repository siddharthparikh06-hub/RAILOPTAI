'use client';

import React, { useState } from 'react';
import { Settings, ShieldCheck, User, Building, Bell, Moon, Database } from 'lucide-react';

export default function SettingsPage() {
  const [demoMode, setDemoMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          Control Center Settings &amp; Configuration
        </h1>
        <p className="text-xs text-slate-400">System Preferences, Division Settings, and Demo Environment Parameters</p>
      </div>

      {/* Settings Options */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-lg font-mono text-xs">
        {/* User Profile */}
        <div className="space-y-3 border-b border-slate-800 pb-5 font-sans">
          <h2 className="text-sm font-bold text-white font-mono uppercase">User Profile &amp; Role</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs">User Role</label>
              <input type="text" value="Control Officer (Sr. DOM)" disabled className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 font-mono text-xs mt-1" />
            </div>
            <div>
              <label className="text-slate-400 text-xs">Division Assignment</label>
              <input type="text" value="Chennai Demo Division (Southern Railway)" disabled className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 font-mono text-xs mt-1" />
            </div>
          </div>
        </div>

        {/* Demo Mode Toggle */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="space-y-0.5">
            <div className="font-bold text-white">Demo Mode Environment</div>
            <p className="text-[11px] text-slate-400 font-sans">Simulate frontend block optimization without live API backend connection</p>
          </div>
          <input
            type="checkbox"
            checked={demoMode}
            onChange={(e) => setDemoMode(e.target.checked)}
            className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0 cursor-pointer"
          />
        </div>

        {/* System Information Box */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="text-blue-400 font-bold text-xs uppercase">System Information</div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div>Application: <span className="text-white">RAILOPT AI v1.0 (Frontend Demo)</span></div>
            <div>SIH Problem Statement: <span className="text-white">SIH26027</span></div>
            <div>Ministry: <span className="text-white">Ministry of Railways</span></div>
            <div>Optimization Engine Status: <span className="text-emerald-400 font-bold">UI PREVIEW READY</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
