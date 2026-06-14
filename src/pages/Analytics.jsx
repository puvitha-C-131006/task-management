import React, { useMemo } from 'react';
import { FiTrendingUp, FiCheckCircle, FiActivity, FiZap } from 'react-icons/fi';
import { useAppContext } from '../App';

export default function Analytics() {
  const { tasks } = useAppContext();

  // Dynamic statistics calculations
  const analyticsStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const pending = tasks.filter((t) => t.status === 'Pending').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Calculate overdue counts
    const overdueCount = tasks.filter((t) => 
      t.status !== 'Completed' && new Date(t.dueDate) < new Date().setHours(0, 0, 0, 0)
    ).length;

    const deadlinesMetRate = total > 0 ? Math.round(((total - overdueCount) / total) * 100) : 100;
    const backlogOverdueRate = total > 0 ? Math.round((overdueCount / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      completionRate,
      deadlinesMetRate,
      backlogOverdueRate
    };
  }, [tasks]);

  // Calculate dynamic weekly heights based on real task due dates (Mon-Sun)
  const dailyHeights = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun
    tasks.forEach((t) => {
      if (!t.dueDate) return;
      const day = new Date(t.dueDate).getDay(); // 0 = Sun, 1 = Mon...
      const index = day === 0 ? 6 : day - 1; // Mon=0, Tue=1, ..., Sun=6
      counts[index] += 1;
    });
    const max = Math.max(...counts, 1);
    return counts.map((c) => (c / max) * 100);
  }, [tasks]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          Performance Analytics
        </h1>
        <p className="text-xs md:text-sm text-slate-400 dark:text-slate-500 font-semibold">
          Gain critical insights into productivity output and check-in speeds
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel-elevated rounded-3xl p-6 flex items-center space-x-4">
          <div className="p-3.5 bg-indigo-500/10 text-indigo-500 rounded-2xl">
            <FiActivity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Productivity Score</p>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">
              {analyticsStats.completionRate}%
            </p>
          </div>
        </div>

        <div className="glass-panel-elevated rounded-3xl p-6 flex items-center space-x-4">
          <div className="p-3.5 bg-emerald-500/10 text-emerald-500 rounded-2xl">
            <FiCheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Completion Rate</p>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">{analyticsStats.completionRate}%</p>
          </div>
        </div>

        <div className="glass-panel-elevated rounded-3xl p-6 flex items-center space-x-4">
          <div className="p-3.5 bg-purple-500/10 text-purple-500 rounded-2xl">
            <FiZap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Completed Output</p>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">{analyticsStats.completed} Items</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-panel-elevated rounded-3xl p-6 lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">Activity Overview</h3>
                <p className="text-xs text-slate-400 font-medium">Daily productivity performance timeline</p>
              </div>
              {analyticsStats.completionRate > 0 && (
                <span className="flex items-center text-xs font-bold text-emerald-500">
                  <FiTrendingUp className="w-3.5 h-3.5 mr-1" />
                  Active Progress
                </span>
              )}
            </div>

            {/* Simple Visual Chart Layout */}
            <div className="h-64 flex items-end justify-between pt-8 px-2">
              {dailyHeights.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group">
                  <div
                    style={{ height: `${h}%` }}
                    className="w-8/12 bg-gradient-to-t from-indigo-500 via-purple-500 to-indigo-600 rounded-t-lg group-hover:opacity-85 transition-all duration-300"
                  />
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel-elevated rounded-3xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Productivity Goals</h3>
              <p className="text-xs text-slate-400 font-medium">Milestone performance targets</p>
            </div>

            <div className="space-y-4 pt-4">
              {[
                { label: 'Sprint Tasks Completed', progress: analyticsStats.completionRate, color: 'bg-indigo-500' },
                { label: 'Project Deadlines Met', progress: analyticsStats.deadlinesMetRate, color: 'bg-emerald-500' },
                { label: 'Review Overdue Backlog', progress: analyticsStats.backlogOverdueRate, color: 'bg-rose-500' },
              ].map((goal, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>{goal.label}</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${goal.progress}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${goal.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}
