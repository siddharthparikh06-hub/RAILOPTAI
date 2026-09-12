'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { MaintenanceTask } from '@/data/mockData';

export type ImportType = 'maintenance' | 'timetable' | 'sections' | 'crews';

export interface ImportedRecord {
  id: string;
  type: ImportType;
  name: string;
  rows: number;
  importedAt: string;
}
export type ImportedRow = Record<string, string>;

interface InputDataContextValue {
  maintenanceTasks: MaintenanceTask[];
  imports: ImportedRecord[];
  datasets: Record<ImportType, ImportedRow[]>;
  addMaintenanceTask: (task: Omit<MaintenanceTask, 'id' | 'taskCode' | 'priorityScore' | 'status' | 'aiReasons' | 'aiRecommendation'> & { priorityScore?: number }) => void;
  registerImport: (type: ImportType, name: string, rows: ImportedRow[]) => void;
}

const InputDataContext = createContext<InputDataContextValue | null>(null);
const TASKS_KEY = 'railopt-local-maintenance-tasks';
const IMPORTS_KEY = 'railopt-local-imports';
const DATASETS_KEY = 'railopt-local-datasets';
const emptyDatasets: Record<ImportType, ImportedRow[]> = { maintenance: [], timetable: [], sections: [], crews: [] };

export function InputDataProvider({ children }: { children: React.ReactNode }) {
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([]);
  const [imports, setImports] = useState<ImportedRecord[]>([]);
  const [datasets, setDatasets] = useState<Record<ImportType, ImportedRow[]>>(emptyDatasets);

  useEffect(() => {
    try {
      setMaintenanceTasks(JSON.parse(window.localStorage.getItem(TASKS_KEY) || '[]'));
      setImports(JSON.parse(window.localStorage.getItem(IMPORTS_KEY) || '[]'));
      setDatasets({ ...emptyDatasets, ...JSON.parse(window.localStorage.getItem(DATASETS_KEY) || '{}') });
    } catch {
      // Invalid local demo data should not stop the control-room UI from loading.
    }
  }, []);

  const addMaintenanceTask = (task: Omit<MaintenanceTask, 'id' | 'taskCode' | 'priorityScore' | 'status' | 'aiReasons' | 'aiRecommendation'> & { priorityScore?: number }) => {
    const nextTask: MaintenanceTask = {
      ...task,
      id: `local-${Date.now()}`,
      taskCode: `LOCAL-${String(Date.now()).slice(-6)}`,
      priorityScore: task.priorityScore ?? ({ Critical: 90, High: 75, Medium: 60, Low: 40 }[task.criticality]),
      status: task.criticality === 'Critical' ? 'Critical' : 'Pending',
      aiReasons: ['Locally entered request', `Deadline: ${task.dueDate}`, `Section: ${task.sectionId}`],
      aiRecommendation: 'Awaiting optimization against imported timetable and corridor constraints.',
    };
    setMaintenanceTasks((current) => {
      const next = [nextTask, ...current];
      window.localStorage.setItem(TASKS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const registerImport = (type: ImportType, name: string, rows: ImportedRow[]) => {
    const record: ImportedRecord = { id: `import-${Date.now()}`, type, name, rows: rows.length, importedAt: new Date().toLocaleString() };
    setImports((current) => {
      const next = [record, ...current];
      window.localStorage.setItem(IMPORTS_KEY, JSON.stringify(next));
      return next;
    });
    setDatasets((current) => {
      const next = { ...current, [type]: rows };
      window.localStorage.setItem(DATASETS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo(() => ({ maintenanceTasks, imports, datasets, addMaintenanceTask, registerImport }), [maintenanceTasks, imports, datasets]);
  return <InputDataContext.Provider value={value}>{children}</InputDataContext.Provider>;
}

export function useInputData() {
  const context = useContext(InputDataContext);
  if (!context) throw new Error('useInputData must be used within InputDataProvider');
  return context;
}
