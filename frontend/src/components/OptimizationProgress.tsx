'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  }, [onComplete, steps.length]);

  const progressPct = Math.min(100, Math.round(((currentStep + 1) / steps.length) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-slate-900/95 backdrop-blur-2xl border border-blue-500/40 rounded-2xl max-w-lg w-full p-8 space-y-6 shadow-[0_0_50px_rgba(59,130,246,0.3)]"
      >
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Cpu className="w-7 h-7 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              OR-Tools CP-SAT Solver Progress
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            </h3>
            <p className="text-xs text-slate-400">Evaluating multi-departmental constraints and corridor availability...</p>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="space-y-1.5 font-mono">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Solver Execution</span>
            <span className="text-blue-400 font-bold">{progressPct}%</span>
          </div>
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ ease: 'easeOut', duration: 0.3 }}
            />
          </div>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: idx <= currentStep ? 1 : 0.3, x: 0 }}
              className={`flex items-center space-x-3 transition-all ${
                idx <= currentStep ? 'text-slate-100' : 'text-slate-600'
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
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
