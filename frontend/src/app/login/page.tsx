'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, ShieldCheck, Sparkles, RefreshCw, KeyRound, Building2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();

  const handleLogin = async (empId?: string, pass?: string) => {
    const targetEmp = empId || employeeId;
    const targetPass = pass || password;

    if (!targetEmp.trim() || !targetPass.trim()) {
      setError('Please enter Employee ID and Password');
      return;
    }

    setLoading(true);
    setError(null);

    const success = await login(targetEmp, targetPass);
    if (!success) {
      setError('Invalid Employee ID or Password. Please try again.');
    }
    setLoading(false);
  };

  const handleDemoLogin = (empId: string, deptName: string) => {
    setEmployeeId(empId);
    setPassword('demo123');
    handleLogin(empId, 'demo123');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl max-w-md w-full p-8 space-y-6 shadow-[0_0_50px_rgba(15,23,42,0.8)] relative overflow-hidden"
      >
        {/* Top Header Logo */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-white tracking-wider shadow-lg shadow-blue-500/30 text-lg mx-auto">
            RO
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-1.5 font-mono">
            RAILOPT <span className="text-blue-400">AI</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">AI-Powered Railway Maintenance &amp; Block Optimization</p>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-mono font-bold">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>SIH 2026 • RBAC CONTROL ROOM</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-3 rounded-xl font-mono text-center">
            {error}
          </motion.div>
        )}

        {/* Form Inputs */}
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4 font-mono text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-bold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" />
              Employee ID
            </label>
            <input
              type="text"
              placeholder="e.g. ENG001, TRD001, SNT001"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 text-xs font-mono"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            <span>{loading ? 'Authenticating...' : 'LOGIN TO CONTROL ROOM'}</span>
          </button>
        </form>

        {/* Quick SIH Demo Accounts Section */}
        <div className="space-y-3 pt-3 border-t border-slate-800 font-mono">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1">
            <KeyRound className="w-3 h-3 text-amber-400" />
            <span>Quick SIH Demo Accounts</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <button
              type="button"
              onClick={() => handleDemoLogin('ENG001', 'Engineering')}
              className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 hover:bg-blue-900/50 text-blue-300 text-center font-bold transition-all shadow-sm"
            >
              <div className="text-white font-mono font-black">ENG001</div>
              <div className="text-[9px] text-slate-400 mt-0.5">Engineering</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('TRD001', 'Traction')}
              className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 hover:bg-amber-900/50 text-amber-300 text-center font-bold transition-all shadow-sm"
            >
              <div className="text-white font-mono font-black">TRD001</div>
              <div className="text-[9px] text-slate-400 mt-0.5">Traction OHE</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('SNT001', 'Signal & Telecom')}
              className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/50 text-emerald-300 text-center font-bold transition-all shadow-sm"
            >
              <div className="text-white font-mono font-black">SNT001</div>
              <div className="text-[9px] text-slate-400 mt-0.5">Signal S&amp;T</div>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
