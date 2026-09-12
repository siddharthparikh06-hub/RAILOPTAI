'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface DemoStep {
  id: number;
  title: string;
  detail: string;
  route: string;
}

export const DEMO_STEPS: DemoStep[] = [
  { id: 1, title: 'Critical asset detected', detail: 'Signal S-104 is flagged as critical on corridor S-14.', route: '/maintenance' },
  { id: 2, title: 'AI prioritizes maintenance', detail: 'AI priority score 94 moves TASK-1042 to the top of the queue.', route: '/ai-priority' },
  { id: 3, title: 'Maintenance task generated', detail: 'TASK-1042 is prepared for the engineering control team.', route: '/maintenance' },
  { id: 4, title: 'Block requested', detail: 'A protected maintenance window is requested for S-14.', route: '/block-planner' },
  { id: 5, title: 'Train conflict detected', detail: 'Train 12622 overlaps the requested B-113 window.', route: '/alerts' },
  { id: 6, title: 'AI reschedules block', detail: 'AI proposes 18:15–21:15 to protect the train path.', route: '/block-planner' },
  { id: 7, title: 'Optimization runs', detail: 'CP-SAT evaluates the coordinated corridor plan.', route: '/block-planner' },
  { id: 8, title: 'Train impact recalculated', detail: 'The revised plan reduces predicted delay impact by 18.4%.', route: '/train-impact' },
  { id: 9, title: 'Engineer accepts recommendation', detail: 'The recommended block is accepted for operational planning.', route: '/alerts' },
  { id: 10, title: 'Dashboard KPIs updated', detail: 'The optimized plan is reflected in the executive KPIs.', route: '/dashboard' },
];

interface DemoContextValue {
  active: boolean;
  currentStep: number;
  completed: boolean;
  startDemo: () => void;
  advanceDemo: () => void;
  resetDemo: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const navigateToStep = (stepIndex: number) => {
    const step = DEMO_STEPS[stepIndex];
    if (step) router.push(step.route);
  };

  const startDemo = () => {
    setActive(true);
    setCurrentStep(0);
    navigateToStep(0);
  };

  const advanceDemo = () => {
    if (!active) return;
    const nextStep = Math.min(currentStep + 1, DEMO_STEPS.length - 1);
    setCurrentStep(nextStep);
    navigateToStep(nextStep);
  };

  const resetDemo = () => {
    setActive(false);
    setCurrentStep(0);
  };

  return <DemoContext.Provider value={{ active, currentStep, completed: active && currentStep === DEMO_STEPS.length - 1, startDemo, advanceDemo, resetDemo }}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used inside DemoProvider');
  return context;
}
