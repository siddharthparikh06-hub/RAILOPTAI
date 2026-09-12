'use client';

import React, { ChangeEvent, FormEvent, useState } from 'react';
import { CheckCircle2, ClipboardPlus, Database, FileSpreadsheet, Info, Upload, Trash2 } from 'lucide-react';
import { useInputData, type ImportType } from '@/context/InputDataContext';
import type { MaintenanceTask } from '@/data/mockData';

import * as XLSX from 'xlsx';

const importCards: Array<{ type: ImportType; title: string; description: string; fields: string }> = [
  { type: 'timetable', title: 'Train timetable', description: 'Planned train paths and section occupancy used to protect train movements.', fields: 'train_number, train_name, section_id, planned_entry, planned_exit, priority, direction' },
  { type: 'maintenance', title: 'Maintenance tasks', description: 'Departmental work requests that the planner will schedule into joint blocks.', fields: 'task_code, department, asset, section_id, duration_hours, deadline, criticality, crew_required' },
  { type: 'sections', title: 'Section master', description: 'Corridor topology and operating restrictions for every section.', fields: 'section_id, start_station, end_station, line_type, capacity, permitted_block_start, permitted_block_end' },
  { type: 'crews', title: 'Crew availability', description: 'Available shifts, machines, and teams required for feasible block plans.', fields: 'crew_id, department, shift_start, shift_end, section_id, equipment' },
];

const defaultForm = {
  department: 'Engineering' as MaintenanceTask['department'], asset: '', assetId: '', sectionId: '', issue: '', criticality: 'Medium' as MaintenanceTask['criticality'], dueDate: '', durationHrs: '2', crewRequired: '4',
};

const COLUMN_ALIASES: Record<string, string[]> = {
  train_number: ['train_number', 'train_no', 'train_num', 'train', 'trainnumber', 'trainno', 'tr_no', 'train_id'],
  section_id: ['section_id', 'section', 'section_code', 'sectionid', 'sectioncode', 'corridor', 'block_section', 'sec_id'],
  planned_entry: ['planned_entry', 'entry_time', 'planned_start', 'entry', 'start_time', 'start', 'arrival', 'entry_dt'],
  planned_exit: ['planned_exit', 'exit_time', 'planned_end', 'exit', 'end_time', 'end', 'departure', 'exit_dt'],
  task_code: ['task_code', 'task_id', 'taskcode', 'taskid', 'code', 'task', 'job_code', 'work_code'],
  department: ['department', 'dept', 'department_name', 'dept_name'],
  asset: ['asset', 'asset_name', 'equipment', 'location', 'work_location', 'asset_id'],
  duration_hours: ['duration_hours', 'duration', 'duration_hrs', 'hours', 'duration_hr', 'est_duration', 'est_duration_hrs'],
  criticality: ['criticality', 'priority', 'risk', 'criticality_level', 'urgency', 'priority_score'],
  permitted_block_start: ['permitted_block_start', 'permitted_start', 'block_start', 'window_start', 'start_time', 'permitted_start_time'],
  permitted_block_end: ['permitted_block_end', 'permitted_end', 'block_end', 'window_end', 'end_time', 'permitted_end_time'],
  crew_id: ['crew_id', 'crew', 'team_id', 'crewid', 'team'],
  shift_start: ['shift_start', 'start_time', 'shift_begin', 'start'],
  shift_end: ['shift_end', 'end_time', 'shift_finish', 'end'],
};

function normalizeHeader(raw: string): string {
  return String(raw || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}

function mapRowHeaders(row: Record<string, any>): Record<string, string> {
  const normalizedRow: Record<string, string> = {};
  const rawKeys = Object.keys(row);
  const normalizedKeyMap = new Map<string, string>();

  rawKeys.forEach((key) => {
    normalizedKeyMap.set(normalizeHeader(key), key);
  });

  Object.entries(COLUMN_ALIASES).forEach(([stdKey, aliases]) => {
    for (const alias of aliases) {
      const normAlias = normalizeHeader(alias);
      if (normalizedKeyMap.has(normAlias)) {
        const originalKey = normalizedKeyMap.get(normAlias)!;
        const val = row[originalKey];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          normalizedRow[stdKey] = String(val).trim();
          break;
        }
      }
    }
  });

  rawKeys.forEach((key) => {
    const norm = normalizeHeader(key);
    if (!normalizedRow[norm] && row[key] !== undefined && row[key] !== null) {
      normalizedRow[norm] = String(row[key]).trim();
    }
  });

  return normalizedRow;
}

export default function DataInputPage() {
  const { maintenanceTasks, imports, addMaintenanceTask, registerImport, removeImport, clearAllImports } = useInputData();
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

  const uploadFile = async (type: ImportType, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.csv') && !fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      setMessage('Please select a valid .csv, .xlsx, or .xls file.');
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(workbook.Sheets[sheetName], { defval: '' });

      if (!rawRows.length) {
        setMessage('The file must contain a header row and at least one data row.');
        return;
      }

      // Step 1: Map headers to normalized schema
      const mappedRows = rawRows.map(mapRowHeaders);

      // Step 2: Data Distillation Pipeline (clean blank rows, sanitize nulls/N/A, coerce defaults)
      const distilledRows: Record<string, string>[] = [];
      let nullRowsCleaned = 0;
      let imputedFieldsCount = 0;

      mappedRows.forEach((row, idx) => {
        // Check if row is completely empty
        const nonBlank = Object.values(row).filter((v) => v !== undefined && v !== null && String(v).trim() !== '' && String(v).toLowerCase() !== 'n/a' && String(v).toLowerCase() !== 'null');
        if (nonBlank.length === 0) {
          nullRowsCleaned++;
          return; // Skip blank/empty row
        }

        const cleanRow: Record<string, string> = { ...row };

        // Clean & sanitize critical fields
        if (type === 'maintenance') {
          if (!cleanRow.task_code) {
            cleanRow.task_code = `TASK-IMP-${idx + 1}`;
            imputedFieldsCount++;
          }
          if (!cleanRow.department) {
            cleanRow.department = 'Engineering';
            imputedFieldsCount++;
          }
          if (!cleanRow.criticality) {
            cleanRow.criticality = 'Medium';
            imputedFieldsCount++;
          }
          if (!cleanRow.duration_hours || isNaN(parseFloat(cleanRow.duration_hours)) || parseFloat(cleanRow.duration_hours) <= 0) {
            cleanRow.duration_hours = '2.0';
            imputedFieldsCount++;
          }
        } else if (type === 'timetable') {
          if (!cleanRow.train_number) {
            cleanRow.train_number = `TR-${1000 + idx}`;
            imputedFieldsCount++;
          }
          if (!cleanRow.planned_entry) {
            cleanRow.planned_entry = '06:00';
            imputedFieldsCount++;
          }
          if (!cleanRow.planned_exit) {
            cleanRow.planned_exit = '07:00';
            imputedFieldsCount++;
          }
        }

        distilledRows.push(cleanRow);
      });

      if (!distilledRows.length) {
        setMessage('Import rejected: All rows in the uploaded file were empty or unreadable.');
        return;
      }

      const required: Record<ImportType, string[]> = {
        timetable: ['train_number', 'section_id', 'planned_entry', 'planned_exit'],
        maintenance: ['task_code', 'department', 'asset', 'section_id', 'duration_hours', 'criticality'],
        sections: ['section_id', 'permitted_block_start', 'permitted_block_end'],
        crews: ['crew_id', 'department', 'shift_start', 'shift_end'],
      };

      const missing = required[type].filter((field) => !Object.prototype.hasOwnProperty.call(distilledRows[0], field));
      if (missing.length) {
        setMessage(`Import rejected: missing required column(s): ${missing.join(', ')}. Please check your column headers.`);
        return;
      }

      registerImport(type, file.name, distilledRows);
      event.target.value = '';
      
      const distillationNote = nullRowsCleaned > 0 || imputedFieldsCount > 0 
        ? ` (Distillation: cleaned ${nullRowsCleaned} blank row(s), imputed ${imputedFieldsCount} missing field(s))`
        : '';

      setMessage(`${file.name} imported successfully: ${distilledRows.length} distilled data row${distilledRows.length === 1 ? '' : 's'} ready for precise calculation.${distillationNote}`);
    } catch (err) {
      setMessage(`Failed to process file: ${err instanceof Error ? err.message : 'Invalid file format.'}`);
    }
  };

  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-white"><Database className="h-5 w-5 text-blue-400" /> Data Intake</h1>
        <p className="mt-1 text-xs text-slate-400">Enter requests or load CSV / Excel extracts before running the block planner.</p>
      </div>
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] font-mono font-bold text-amber-300">REAL DATA INTAKE READY</div>
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
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-cyan-500/15 p-2 text-cyan-300"><FileSpreadsheet className="h-5 w-5" /></span>
            <div><h2 className="text-sm font-bold text-white">Imported data register</h2><p className="text-[11px] text-slate-400">CSV or Excel files loaded into active memory.</p></div>
          </div>
          {(imports.length > 0 || maintenanceTasks.length > 0) && (
            <button
              onClick={() => {
                clearAllImports();
                setMessage('All imported files and local requests cleared.');
              }}
              className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[10px] font-mono font-bold text-rose-400 hover:bg-rose-500/20 transition-all"
            >
              <Trash2 className="h-3 w-3" /> CLEAR ALL
            </button>
          )}
        </div>
        <div className="mb-4 grid grid-cols-2 gap-3"><Metric label="Local requests" value={maintenanceTasks.length} /><Metric label="File imports" value={imports.length} /></div>
        <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
          {imports.length ? imports.map((item) => (
            <div key={item.id} className="group rounded-xl border border-slate-800 bg-slate-950/70 p-3 transition hover:border-slate-700">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-3">
                    <span className="truncate text-xs font-bold text-white">{item.name}</span>
                    <span className="shrink-0 text-[10px] font-mono text-cyan-300">{item.rows} rows</span>
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">{item.type} · {item.importedAt}</div>
                </div>
                <button
                  onClick={() => {
                    removeImport(item.id);
                    setMessage(`Removed ${item.name} from data register.`);
                  }}
                  className="rounded-lg p-1 text-slate-500 hover:bg-rose-500/20 hover:text-rose-400 transition-colors shrink-0"
                  title="Delete this imported file"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )) : <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-xs text-slate-500">No CSV or Excel data imported yet.</div>}
        </div>
      </section>
    </div>

    <section className="control-panel rounded-2xl p-5"><div className="mb-4 flex items-center gap-2"><Upload className="h-4 w-4 text-blue-400" /><h2 className="text-sm font-bold text-white">Data File Imports (.csv, .xlsx, .xls)</h2></div><div className="grid gap-4 md:grid-cols-2">{importCards.map((card) => <label key={card.type} className="cursor-pointer rounded-xl border border-slate-800 bg-slate-950/50 p-4 transition hover:border-blue-500/50 hover:bg-slate-800/50"><input className="sr-only" type="file" accept=".csv,text/csv,.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" onChange={(event) => uploadFile(card.type, event)} /><div className="flex items-start justify-between gap-3"><div><h3 className="text-xs font-bold text-white">{card.title}</h3><p className="mt-1 text-[11px] leading-relaxed text-slate-400">{card.description}</p></div><Upload className="h-4 w-4 shrink-0 text-blue-400" /></div><div className="mt-3 rounded-lg bg-slate-900 p-2 font-mono text-[10px] leading-relaxed text-slate-400">{card.fields}</div><div className="mt-3 text-[10px] font-bold text-blue-300">SELECT CSV / EXCEL FILE →</div></label>)}</div><div className="mt-4 flex gap-2 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-[11px] text-slate-300"><Info className="h-4 w-4 shrink-0 text-blue-400" />Columns are automatically normalized. Standard headers like Task Code, Train No, Duration, Section ID, Priority, etc., are matched automatically.</div></section>
  </div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-[11px] font-medium text-slate-300"><span className="mb-1.5 block">{label}</span>{children}</label>; }
function Metric({ label, value }: { label: string; value: number }) { return <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div><div className="mt-1 text-2xl font-black text-white">{value}</div></div>; }
