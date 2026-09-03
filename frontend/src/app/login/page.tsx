'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, Building, LogIn, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [empId, setEmpId] = useState('CONTROL001');
  const [password, setPassword] = useState('demo123');
  const [department, setDepartment] = useState('Operations');
  const [role, setRole] = useState('Control Officer');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 600);
  };

  const setQuickCreds = (id: string, dept: string, r: string) => {
    setEmpId(id);
    setPassword('demo123');
    setDepartment(dept);
    setRole(r);
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-xl mx-auto shadow-lg shadow-blue-500/20">
            RO
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">RAILOPT AI</h2>
          <p className="text-xs text-slate-400">Indian Railways Operations Control Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>Employee ID</span>
            </label>
            <input
              type="text"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-400" />
              <span>Department</span>
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Operations">Operations Control Office</option>
              <option value="Engineering">Engineering (Permanent Way)</option>
              <option value="Traction">Traction Distribution (TRD / OHE)</option>
              <option value="Signal & Telecom">Signal & Telecommunication (S&T)</option>
              <option value="Admin">Administrator</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>User Role</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Control Officer">Control Officer</option>
              <option value="Engineering Manager">Engineering Manager</option>
              <option value="Traction Manager">Traction Manager</option>
              <option value="S&T Manager">S&T Manager</option>
              <option value="Divisional Operations Manager">Divisional Operations Manager</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all text-xs flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In to Operations Control'}</span>
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>SIH Judge Demo Credentials (1-Click):</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <button
              onClick={() => setQuickCreds('CONTROL001', 'Operations', 'Control Officer')}
              className="p-2 rounded bg-slate-950 border border-slate-800 hover:border-blue-500 text-left text-slate-300"
            >
              <div className="font-bold text-blue-400">CONTROL001</div>
              <div className="text-slate-500">Control Officer</div>
            </button>
            <button
              onClick={() => setQuickCreds('ENG001', 'Engineering', 'Engineering Manager')}
              className="p-2 rounded bg-slate-950 border border-slate-800 hover:border-blue-500 text-left text-slate-300"
            >
              <div className="font-bold text-amber-400">ENG001</div>
              <div className="text-slate-500">Eng Manager</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
