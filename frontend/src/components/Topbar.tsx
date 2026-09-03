'use client';

import React, { useState } from 'react';
import { 
  Search, Bell, User, Sun, Moon, Calendar, MapPin, ShieldAlert, Sparkles 
} from 'lucide-react';

export default function Topbar() {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark');
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white px-4 py-2.5 flex flex-wrap items-center justify-between shadow-md z-30 sticky top-0">
      {/* Left: Division & Date */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400">Division:</span>
          <span className="font-bold text-white">Chennai Demo Division</span>
        </div>

        <div className="hidden sm:flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">Date:</span>
          <span className="font-bold text-white">26 August 2026</span>
        </div>

        {/* Demo Disclaimer Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Synthetic Operational Data</span>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex items-center relative w-64">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search task, asset or block..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
        />
      </div>

      {/* Right: Actions, Theme Toggle & User */}
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
        </button>

        <div className="relative">
          <button className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-rose-500" />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-800">
          <div className="w-7 h-7 rounded-full bg-blue-600 border border-blue-400/40 flex items-center justify-center text-white font-bold text-xs shadow-md">
            CO
          </div>
          <div className="hidden sm:block text-left text-xs">
            <div className="font-bold text-slate-200">Control Officer</div>
            <div className="text-[10px] text-slate-400 font-mono">Southern Railway</div>
          </div>
        </div>
      </div>
    </header>
  );
}
