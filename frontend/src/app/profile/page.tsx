'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, ShieldCheck, Building2, BadgeCheck, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function UserProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            Authenticated User Profile
          </h1>
          <p className="text-xs text-slate-400">Departmental Credentials &amp; RBAC Authorization Profile</p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-mono font-bold transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl font-mono text-xs"
      >
        <div className="flex items-center space-x-4 border-b border-slate-800 pb-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 border border-blue-400/40 flex items-center justify-center text-white font-black text-xl shadow-lg">
            {user.employee_id.slice(0, 3)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-sans">{user.name}</h2>
            <div className="text-blue-400 font-bold text-xs mt-0.5">{user.department}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-slate-400 text-[10px]">EMPLOYEE ID</span>
            <div className="text-base font-bold text-white">{user.employee_id}</div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-slate-400 text-[10px]">ROLE ENUM</span>
            <div className="text-base font-bold text-amber-400">{user.role}</div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-slate-400 text-[10px]">ASSIGNED DEPARTMENT</span>
            <div className="text-base font-bold text-emerald-400">{user.department}</div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-slate-400 text-[10px]">ACCOUNT STATUS</span>
            <div className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
              <span>ACTIVE &amp; VERIFIED</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-4 space-y-1 text-slate-300 font-sans leading-relaxed text-xs">
          <div className="text-blue-400 font-bold font-mono text-xs uppercase flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>RBAC ACCESS POLICY</span>
          </div>
          <p>
            Department ownership restricts task &amp; block modifications exclusively to <strong>{user.department}</strong>.
            Shared operational command data, GIS map, timetable simulation, and CP-SAT optimization remain read-accessible across all departments.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
