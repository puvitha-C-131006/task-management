import React, { useMemo } from 'react';
import { FiPlus, FiBriefcase, FiUser, FiZap, FiBookOpen } from 'react-icons/fi';
import { useAppContext } from '../App';

export default function Categories() {
  const { tasks } = useAppContext();

  // Dynamically calculate statistics from actual tasks list
  const categoryStats = useMemo(() => {
    const list = [
      { id: 'Work', name: 'Work Project', icon: FiBriefcase, color: 'indigo' },
      { id: 'Personal', name: 'Personal Growth', icon: FiUser, color: 'emerald' },
      { id: 'Marketing', name: 'Marketing Campaign', icon: FiZap, color: 'purple' },
      { id: 'Learning', name: 'Documentation & Learn', icon: FiBookOpen, color: 'amber' },
    ];

    return list.map((cat) => {
      const catTasks = tasks.filter((t) => (t.category || 'Work') === cat.id);
      const count = catTasks.length;
      const completedCount = catTasks.filter((t) => t.status === 'Completed').length;
      const progress = count > 0 ? Math.round((completedCount / count) * 100) : 0;
      
      return {
        ...cat,
        count,
        progress
      };
    });
  }, [tasks]);

  const colorMap = {
    indigo: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  };

  const progressColors = {
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Categories & Projects
          </h1>
          <p className="text-xs md:text-sm text-slate-400 dark:text-slate-500 font-semibold">
            Group your workflow into workspaces and category groups
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categoryStats.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div key={idx} className="glass-panel-elevated rounded-3xl p-6 hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl border ${colorMap[cat.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors">
                  {cat.count} Tasks
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-800 dark:text-white mt-6 leading-tight">
                {cat.name}
              </h3>
              
              <div className="mt-8 space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500">
                  <span>Progress</span>
                  <span>{cat.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${cat.progress}%` }}
                    className={`h-full rounded-full ${progressColors[cat.color]}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
