'use client';

import React, { useState } from 'react';
import { FileText, Printer, Download, Eye, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function ReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null);

  const reports = [
    { title: 'Weekly Block Report', desc: 'Summary of all scheduled maintenance block windows across Chennai Division', date: '26 Aug 2026' },
    { title: 'Monthly Optimization Report', desc: '30-day CP-SAT solver yield, downtime saved, and conflict avoidance metrics', date: '26 Aug 2026' },
    { title: 'Maintenance Summary', desc: 'Departmental breakdown for Engineering, Traction, and Signal & Telecom', date: '25 Aug 2026' },
    { title: 'Train Impact Report', desc: 'Passenger & freight train delay analysis and alternative window performance', date: '24 Aug 2026' },
    { title: 'Asset Availability Report', desc: 'Health index trends, failure risk probabilities, and critical asset statuses', date: '23 Aug 2026' }
  ];

  const handleSimulateReport = (title: string) => {
    setGenerating(title);
    setTimeout(() => {
      setGenerating(null);
      window.print();
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            SIH 2026 Report Generator Dashboard
          </h1>
          <p className="text-xs text-slate-400">Exportable Comprehensive Railway Operations &amp; Optimization Reports</p>
        </div>

        <span className="px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold">
          FRONTEND REPORT SIMULATOR
        </span>
      </div>

      {/* Report Cards List */}
      <div className="space-y-4">
        {reports.map((r, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="font-bold text-blue-400">{r.title}</span>
                <span className="text-slate-500">• {r.date}</span>
              </div>
              <p className="text-xs text-slate-300">{r.desc}</p>
            </div>

            <div className="flex items-center space-x-3 text-xs font-mono">
              <button 
                onClick={() => handleSimulateReport(r.title)}
                disabled={generating === r.title}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-blue-500 text-slate-300 hover:text-white transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Report</span>
              </button>

              <button
                onClick={() => handleSimulateReport(r.title)}
                disabled={generating === r.title}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md"
              >
                {generating === r.title ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>{generating === r.title ? 'Generating PDF...' : 'Generate PDF'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
