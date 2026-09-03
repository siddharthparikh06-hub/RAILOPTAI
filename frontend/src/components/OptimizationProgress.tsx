'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react';

interface OptimizationProgressProps {
  onComplete: () => void;
}

export default function OptimizationProgress({ onComplete }: OptimizationProgressProps) {
  const steps = [
    "Loading maintenance requests",
    "Analyzing train movements",
    "Checking corridor availability",
    "Detecting conflicts",
    "Coordinating departments",
    "Running optimization",
    "Generating recommended blocks"
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-blue-500/40 rounded-2xl max-w-lg w-full p-8 space-y-6 shadow-2xl animate-pulse">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Cpu className="w-7 h-7 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              OR-Tools CP-SAT Solver Progress
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </h3>
            <p className="text-xs text-slate-400">Evaluating multi-departmental constraints and corridor availability...</p>
          </div>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`flex items-center space-x-3 transition-all ${
                idx <= currentStep ? 'opacity-100 text-slate-100' : 'opacity-30 text-slate-600'
              }`}
            >
              {idx < currentStep ? (
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
              ) : idx === currentStep ? (
                <RefreshCw className="w-4.5 h-4.5 text-blue-400 animate-spin shrink-0" />
              ) : (
                <div className="w-4.5 h-4.5 rounded-full border border-slate-700 shrink-0" />
              )}
              <span className={idx === currentStep ? 'font-bold text-blue-400' : ''}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
