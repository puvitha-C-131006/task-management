import React, { useMemo } from 'react';
import { FiAlertTriangle, FiClock, FiCheckSquare, FiInfo } from 'react-icons/fi';
import { useAppContext } from '../App';

export default function Priorities() {
  const { tasks } = useAppContext();

  const counts = useMemo(() => {
    return {
      High: tasks.filter((t) => t.priority === 'High').length,
      Medium: tasks.filter((t) => t.priority === 'Medium').length,
      Low: tasks.filter((t) => t.priority === 'Low').length,
    };
  }, [tasks]);

  const cards = [
    {
      level: 'High Priority',
      description: 'Critical deadlines or blockers requiring urgent action.',
      count: counts.High,
      color: 'rose',
      border: 'border-rose-500/20',
      icon: FiAlertTriangle,
      iconColor: 'text-rose-500 bg-rose-500/10'
    },
    {
      level: 'Medium Priority',
      description: 'Important tasks with standard schedule thresholds.',
      count: counts.Medium,
      color: 'amber',
      border: 'border-amber-500/20',
      icon: FiClock,
      iconColor: 'text-amber-500 bg-amber-500/10'
    },
    {
      level: 'Low Priority',
      description: 'Backlog ideas or non-blocking items for casual work.',
      count: counts.Low,
      color: 'emerald',
      border: 'border-emerald-500/20',
      icon: FiInfo,
      iconColor: 'text-emerald-500 bg-emerald-500/10'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          Priority Segments
        </h1>
        <p className="text-xs md:text-sm text-slate-400 dark:text-slate-500 font-semibold">
          Allocate resources and schedule items based on urgency level
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className={`glass-panel-elevated rounded-3xl p-6 border-t-4 border-t-${card.color}-500 flex flex-col justify-between min-h-[200px]`}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800 dark:text-white">{card.level}</span>
                  <div className={`p-2 rounded-xl ${card.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-3.5 leading-relaxed font-medium">
                  {card.description}
                </p>
              </div>

              <div className="flex items-baseline justify-between mt-8 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Tasks</span>
                <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{card.count}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
