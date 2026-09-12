'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Bell, User, Sun, Moon, Calendar, MapPin, Sparkles, ShieldCheck, X, Check, AlertTriangle, Info, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import GuidedDemoPanel from '@/components/GuidedDemoPanel';

export default function Topbar() {
  const [darkMode, setDarkMode] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const { user } = useAuth();

  useEffect(() => {
    // Sync dark mode preference with document element
    if (typeof document !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.remove('bg-slate-100', 'text-slate-900');
        document.body.classList.add('bg-slate-950', 'text-slate-100');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('bg-slate-950', 'text-slate-100');
        document.body.classList.add('bg-slate-100', 'text-slate-900');
      }
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const userAbbr = user?.employee_id ? user.employee_id.slice(0, 3) : 'ENG';

  const initialNotifications = [
    {
      id: 1,
      title: "Critical Signal Degradation",
      message: "Signal S-104 on Section S-14 lumen degradation risk (+34%). Overdue by 2 days.",
      time: "10 mins ago",
      type: "critical",
      read: false
    },
    {
      id: 2,
      title: "Block B-113 Optimization Complete",
      message: "CP-SAT solver combined Engineering, Traction, and S&T into a 3-hour window saving 4.5 hrs downtime.",
      time: "25 mins ago",
      type: "success",
      read: false
    },
    {
      id: 3,
      title: "Corridor Protection Alert",
      message: "Rajdhani Express 20608 slot protected during afternoon block planning.",
      time: "1 hour ago",
      type: "info",
      read: false
    }
  ];

  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white px-4 py-2.5 flex items-center justify-between gap-3 shadow-md z-[100] sticky top-0 min-h-[4rem]">
      {/* Left: Division & Date */}
      <div className="flex min-w-0 items-center space-x-2 sm:space-x-3">
        <div className="flex min-w-0 items-center space-x-2 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs font-mono sm:px-3">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden text-slate-400 sm:inline">Division:</span>
          <span className="truncate font-bold text-white max-w-[8rem] sm:max-w-none">Chennai Demo Division</span>
        </div>

        <div className="hidden sm:flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
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
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
        />
      </div>

      {/* Right: Actions, Theme Toggle & User */}
      <div className="relative flex shrink-0 items-center space-x-2 sm:space-x-3">
        <GuidedDemoPanel />
        {/* Light / Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-all shadow-sm active:scale-95"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
          ) : (
            <Moon className="w-4 h-4 text-blue-400" />
          )}
        </button>

        {/* Notification Bell Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-all relative active:scale-95 shadow-sm"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse" />
            )}
          </button>

          {/* Interactive Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="absolute right-0 top-12 w-80 md:w-96 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl z-50 p-4 space-y-3 font-mono"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-white text-xs">Operational Alerts</span>
                    {unreadCount > 0 && (
                      <span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                        {unreadCount} NEW
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                        item.read
                          ? 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                          : 'bg-slate-950/90 border-slate-800 text-slate-200 shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-[11px]">
                        <span className="flex items-center gap-1.5">
                          {item.type === 'critical' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          ) : item.type === 'success' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          )}
                          <span className={item.type === 'critical' ? 'text-rose-400' : 'text-white'}>
                            {item.title}
                          </span>
                        </span>
                        <span className="text-[9px] text-slate-500">{item.time}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-300 font-sans pl-5">
                        {item.message}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 text-center">
                  <Link
                    href="/alerts"
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] text-blue-400 hover:underline font-bold block"
                  >
                    View All Control Center Alerts &rarr;
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Authenticated User Profile */}
        <Link href="/profile" className="flex items-center space-x-2.5 pl-2.5 border-l border-slate-800 group cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-blue-600 border border-blue-400/40 flex items-center justify-center text-white font-black text-xs shadow-md group-hover:scale-105 transition-transform">
            {userAbbr}
          </div>
          <div className="hidden sm:block text-left text-xs">
            <div className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
              {user ? user.name : 'Demo Control Officer'}
            </div>
            <div className="text-[10px] text-amber-400 font-mono font-bold">
              {user ? user.department : 'Engineering / P-Way'}
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
