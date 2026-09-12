'use client';

import React, { ChangeEvent, FormEvent, useState } from 'react';
import { CheckCircle2, ClipboardPlus, Database, FileSpreadsheet, Info, Upload } from 'lucide-react';
import { useInputData, type ImportType } from '@/context/InputDataContext';
import type { MaintenanceTask } from '@/data/mockData';

const importCards: Array<{ type: ImportType; title: string; description: string; fields: string }> = [
  { type: 'timetable', title: 'Train timetable', description: 'Planned train paths and section occupancy used to protect train movements.', fields: 'train_number, train_name, section_id, planned_entry, planned_exit, priority, direction' },
  { type: 'maintenance', title: 'Maintenance tasks', description: 'Departmental work requests that the planner will schedule into joint blocks.', fields: 'task_code, department, asset, section_id, duration_hours, deadline, criticality, crew_required' },
  { type: 'sections', title: 'Section master', description: 'Corridor topology and operating restrictions for every section.', fields: 'section_id, start_station, end_station, line_type, capacity, permitted_block_start, permitted_block_end' },
  { type: 'crews', title: 'Crew availability', description: 'Available shifts, machines, and teams required for feasible block plans.', fields: 'crew_id, department, shift_start, shift_end, section_id, equipment' },
];

const defaultForm = {
  department: 'Engineering' as MaintenanceTask['department'], asset: '', assetId: '', sectionId: '', issue: '', criticality: 'Medium' as MaintenanceTask['criticality'], dueDate: '', durationHrs: '2', crewRequired: '4',
};

function parseCsv(text: string) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  const parseLine = (line: string) => line.match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g)?.map((cell) => cell.replace(/^,/, '').replace(/^"|"$/g, '').replace(/""/g, '"').trim()) || [];
  const headers = parseLine(lines[0] || '').map((header) => header.toLowerCase());
  return lines.slice(1).map((line) => Object.fromEntries(headers.map((header, index) => [header, parseLine(line)[index] || ''])));
}

export default function DataInputPage() {
  const { maintenanceTasks, imports, addMaintenanceTask, registerImport } = useInputData();
  const [form, setForm] = useState(defaultForm);
  const [message, setMessage] = useState<string | null>(null);

  const submitTask = (event: FormEvent) => {
    event.preventDefault();
    addMaintenanceTask({
      ...form,
      asset: form.asset.trim(), assetId: form.assetId.trim() || `local-asset-${Date.now()}`, sectionId: form.sectionId.trim().toUpperCase(), issue: form.issue.trim(),
      dueDate: form.dueDate, durationHrs: Number(form.durationHrs), crewRequired: Number(form.crewRequired),
    });
    setForm(defaultForm);
    setMessage('Maintenance request saved locally and ready for the next demo optimization.');
  };

  const uploadCsv = async (type: ImportType, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setMessage('Please select a .csv file. Excel files can be exported as CSV before upload.');
      return;
    }
    const rows = parseCsv(await file.text());
    if (!rows.length) {
      setMessage('The CSV needs a header row and at least one data row.');
      return;
    }
    const required: Record<ImportType, string[]> = {
      timetable: ['train_number', 'section_id', 'planned_entry', 'planned_exit'],
      maintenance: ['task_code', 'department', 'asset', 'section_id', 'duration_hours', 'criticality'],
      sections: ['section_id', 'permitted_block_start', 'permitted_block_end'],
      crews: ['crew_id', 'department', 'shift_start', 'shift_end'],
    };
    const missing = required[type].filter((field) => !Object.prototype.hasOwnProperty.call(rows[0], field));
    if (missing.length) {
      setMessage(`Import rejected: missing required column(s): ${missing.join(', ')}.`);
      return;
    }
    registerImport(type, file.name, rows);
    event.target.value = '';
    setMessage(`${file.name} imported: ${rows.length} validated data row${rows.length === 1 ? '' : 's'} ready for calculation.`);
  };

  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-white"><Database className="h-5 w-5 text-blue-400" /> Data Intake</h1>
        <p className="mt-1 text-xs text-slate-400">Enter requests or load CSV extracts before running the block planner.</p>
      </div>
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] font-mono font-bold text-amber-300">LOCAL DEMO DATA — NOT CONNECTED TO RAILWAY SYSTEMS</div>
    </div>

    {message && <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200"><CheckCircle2 className="h-4 w-4 shrink-0" />{message}</div>}

    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <form onSubmit={submitTask} className="control-panel rounded-2xl p-5">
        <div className="mb-5 flex items-center gap-3"><span className="rounded-lg bg-blue-500/15 p-2 text-blue-300"><ClipboardPlus className="h-5 w-5" /></span><div><h2 className="text-sm font-bold text-white">Create maintenance request</h2><p className="text-[11px] text-slate-400">Use this for a single Engineering, TRD, or S&amp;T request.</p></div></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Department"><select required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value as MaintenanceTask['department'] })} className="input"><option>Engineering</option><option>Traction</option><option>Signal &amp; Telecom</option></select></Field>
          <Field label="Criticality"><select required value={form.criticality} onChange={(e) => setForm({ ...form, criticality: e.target.value as MaintenanceTask['criticality'] })} className="input"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></Field>
          <Field label="Asset / work location"><input required value={form.asset} onChange={(e) => setForm({ ...form, asset: e.target.value })} className="input" placeholder="e.g. Point Machine PM-08" /></Field>
          <Field label="Asset ID (optional)"><input value={form.assetId} onChange={(e) => setForm({ ...form, assetId: e.target.value })} className="input" placeholder="e.g. S&T-PM-08" /></Field>
          <Field label="Section ID"><input required value={form.sectionId} onChange={(e) => setForm({ ...form, sectionId: e.target.value })} className="input" placeholder="e.g. S-14" /></Field>
          <Field label="Completion deadline"><input required type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="input" /></Field>
          <Field label="Work duration (hours)"><input required min="0.5" step="0.5" type="number" value={form.durationHrs} onChange={(e) => setForm({ ...form, durationHrs: e.target.value })} className="input" /></Field>
          <Field label="Crew required"><input required min="1" type="number" value={form.crewRequired} onChange={(e) => setForm({ ...form, crewRequired: e.target.value })} className="input" /></Field>
          <div className="sm:col-span-2"><Field label="Work description / reason"><textarea required value={form.issue} onChange={(e) => setForm({ ...form, issue: e.target.value })} className="input min-h-24 resize-y" placeholder="Describe the maintenance work, defect, or inspection finding." /></Field></div>
        </div>
        <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"><ClipboardPlus className="h-4 w-4" /> SAVE MAINTENANCE REQUEST</button>
      </form>

      <section className="control-panel rounded-2xl p-5">
        <div className="mb-4 flex items-center gap-3"><span className="rounded-lg bg-cyan-500/15 p-2 text-cyan-300"><FileSpreadsheet className="h-5 w-5" /></span><div><h2 className="text-sm font-bold text-white">Imported data register</h2><p className="text-[11px] text-slate-400">Files stay in this browser only during demo mode.</p></div></div>
        <div className="mb-4 grid grid-cols-2 gap-3"><Metric label="Local requests" value={maintenanceTasks.length} /><Metric label="CSV imports" value={imports.length} /></div>
        <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1">{imports.length ? imports.map((item) => <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><div className="flex justify-between gap-3"><span className="truncate text-xs font-bold text-white">{item.name}</span><span className="shrink-0 text-[10px] font-mono text-cyan-300">{item.rows} rows</span></div><div className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">{item.type} · {item.importedAt}</div></div>) : <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-xs text-slate-500">No CSV data imported yet.</div>}</div>
      </section>
    </div>

    <section className="control-panel rounded-2xl p-5"><div className="mb-4 flex items-center gap-2"><Upload className="h-4 w-4 text-blue-400" /><h2 className="text-sm font-bold text-white">CSV imports</h2></div><div className="grid gap-4 md:grid-cols-2">{importCards.map((card) => <label key={card.type} className="cursor-pointer rounded-xl border border-slate-800 bg-slate-950/50 p-4 transition hover:border-blue-500/50 hover:bg-slate-800/50"><input className="sr-only" type="file" accept=".csv,text/csv" onChange={(event) => uploadCsv(card.type, event)} /><div className="flex items-start justify-between gap-3"><div><h3 className="text-xs font-bold text-white">{card.title}</h3><p className="mt-1 text-[11px] leading-relaxed text-slate-400">{card.description}</p></div><Upload className="h-4 w-4 shrink-0 text-blue-400" /></div><div className="mt-3 rounded-lg bg-slate-900 p-2 font-mono text-[10px] leading-relaxed text-slate-400">{card.fields}</div><div className="mt-3 text-[10px] font-bold text-blue-300">SELECT CSV FILE →</div></label>)}</div><div className="mt-4 flex gap-2 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-[11px] text-slate-300"><Info className="h-4 w-4 shrink-0 text-blue-400" />These are starter field templates. Update them after validating the real division workflow and approved data fields.</div></section>
  </div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-[11px] font-medium text-slate-300"><span className="mb-1.5 block">{label}</span>{children}</label>; }
function Metric({ label, value }: { label: string; value: number }) { return <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div><div className="mt-1 text-2xl font-black text-white">{value}</div></div>; }
