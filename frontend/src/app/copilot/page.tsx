'use client';

import React from 'react';
import Copilot from '@/components/Copilot';
import { Bot } from 'lucide-react';

export default function CopilotPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-400" />
          RailOpt Copilot
        </h1>
        <p className="text-xs text-slate-400">Ask questions about maintenance activities, block planning, and corridor availability</p>
      </div>

      {/* Interactive Copilot Chat Component */}
      <Copilot />
    </div>
  );
}
