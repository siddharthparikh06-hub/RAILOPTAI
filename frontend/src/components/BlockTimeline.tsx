'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2 } from 'lucide-react';
import BlockDetailsDrawer from './BlockDetailsDrawer';
import { BlockWindow, CorridorConflict, MaintenanceTask, Section, TrainMovement, mockBlockWindows, mockConflicts, mockMaintenanceTasks, mockSections, mockTrainMovements } from '../data/mockData';

interface BlockTimelineProps {
  section: Section;
  blocks: BlockWindow[];
  tasks: MaintenanceTask[];
  trains: TrainMovement[];
  conflicts: CorridorConflict[];
}

export default function BlockTimeline({
  section = mockSections[2],
  blocks = mockBlockWindows.filter((block) => block.sectionId === mockSections[2].id),
  tasks = mockMaintenanceTasks.filter((task) => task.sectionId === mockSections[2].id),
  trains = mockTrainMovements.filter((train) => train.sectionId === mockSections[2].id),
  conflicts = mockConflicts.filter((conflict) => conflict.sectionId === mockSections[2].id),
}: Partial<BlockTimelineProps>) {
  const [selectedBlock, setSelectedBlock] = useState<any>(null);
  useEffect(() => setSelectedBlock(null), [section.id]);

  const departments = [
    { name: 'Engineering (P-Way)', match: 'Engineering', labelClass: 'text-blue-400', dotClass: 'bg-blue-500', blockClass: 'bg-blue-600 hover:bg-blue-500 border-blue-400/40' },
    { name: 'Traction (TRD/OHE)', match: 'Traction', labelClass: 'text-amber-400', dotClass: 'bg-amber-500', blockClass: 'bg-amber-600 hover:bg-amber-500 border-amber-400/40' },
    { name: 'Signal & Telecom', match: 'Signal & Telecom', labelClass: 'text-emerald-400', dotClass: 'bg-emerald-500', blockClass: 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400/40' },
  ];

  const timePosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return Math.max(0, Math.min(100, ((hours + minutes / 60 - 6) / 14) * 100));
  };

  const blockStyle = (block: BlockWindow) => ({
    left: `${timePosition(block.startTime)}%`,
    width: `${Math.max(8, ((block.durationHrs / 14) * 100))}%`,
  });

  const blockDetails = (block: BlockWindow) => ({
    ...block,
    code: block.blockCode,
    section: block.sectionName,
    sectionCode: section.code,
    duration: `${block.durationHrs} hrs`,
    tasksCount: block.taskCount,
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl overflow-x-auto"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            Recommended Block Plan — Gantt Timeline
          </h3>
          <p className="text-[11px] text-slate-400">Coordinated Multi-Departmental Maintenance Windows</p>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]">
          {blocks.length} CORRIDOR BLOCKS
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] font-mono">
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2 text-slate-300"><span className="text-slate-500">TRAINS</span><strong className="block text-cyan-400 text-sm">{trains.length}</strong></div>
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2 text-slate-300"><span className="text-slate-500">TASKS</span><strong className="block text-blue-400 text-sm">{tasks.length}</strong></div>
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2 text-slate-300"><span className="text-slate-500">CONFLICTS</span><strong className="block text-amber-400 text-sm">{conflicts.length}</strong></div>
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2 text-slate-300"><span className="text-slate-500">CORRIDOR</span><strong className="block text-white text-sm">{section.code}</strong></div>
      </div>

      {/* Time Header X-Axis (06:00 to 20:00) */}
      <div className="flex items-center text-xs font-mono text-slate-400 border-b border-slate-800 pb-2 pl-44 min-w-[700px]">
        <span className="w-[14.2%] text-left">06:00</span>
        <span className="w-[14.2%] text-left">08:00</span>
        <span className="w-[14.2%] text-left">10:00</span>
        <span className="w-[14.2%] text-left">12:00</span>
        <span className="w-[14.2%] text-left">14:00</span>
        <span className="w-[14.2%] text-left">16:00</span>
        <span className="w-[14.2%] text-left">18:00</span>
        <span className="w-[14.2%] text-left">20:00</span>
      </div>

      {blocks.length === 0 ? (
        <div className="min-w-[700px] rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-8 text-center text-xs text-slate-400">No active maintenance blocks for {section.code}.</div>
      ) : departments.map((department) => {
        const departmentBlocks = blocks.filter((block) => block.departments.some((name) => name.includes(department.match)));
        return <div key={department.match} className="flex items-center space-x-4 min-w-[700px]">
          <div className={`w-40 shrink-0 font-mono text-xs font-bold ${department.labelClass} flex items-center gap-2`}>
            <span className={`w-2.5 h-2.5 rounded-full ${department.dotClass}`} />{department.name}
          </div>
          <div className="flex-1 h-12 bg-slate-950/80 rounded-xl border border-slate-800/80 relative">
            {departmentBlocks.map((block) => <motion.div key={`${department.match}-${block.id}`} whileHover={{ scale: 1.02, y: -1 }} onClick={() => setSelectedBlock(blockDetails(block))} className={`absolute top-1.5 bottom-1.5 rounded-lg border px-2 py-1 text-[10px] font-mono text-white cursor-pointer shadow-lg truncate transition-colors flex items-center justify-between ${department.blockClass}`} style={blockStyle(block)}>
              <span className="font-bold truncate">{block.blockCode.replace('BLOCK ', '')}</span><span className="opacity-80 font-bold">{block.durationHrs}h</span>
            </motion.div>)}
          </div>
        </div>;
      })}

      <div className="min-w-[700px] rounded-xl border border-cyan-500/20 bg-cyan-950/10 p-3 font-mono text-[10px] text-cyan-300">
        {trains.length === 0 ? 'No active train movements.' : `${trains.length} train movement${trains.length === 1 ? '' : 's'} protected on ${section.code}: ${trains.map((train) => train.trainNo).join(', ')}`}
      </div>
      {conflicts.length === 0 && <div className="min-w-[700px] rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-3 font-mono text-[10px] text-emerald-300">No active conflicts detected for this corridor.</div>}

      {/* Block Details Drawer */}
      <BlockDetailsDrawer 
        block={selectedBlock} 
        onClose={() => setSelectedBlock(null)} 
      />
    </motion.div>
  );
}
