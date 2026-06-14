import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiActivity } from 'react-icons/fi';

export default function DashboardCard({ title, value, icon: Icon, color = 'indigo', trendText, trendType = 'up' }) {
  // Map color schemes to Tailwind CSS classes
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      glow: 'shadow-[0_8px_30px_rgba(99,102,241,0.08)] dark:shadow-[0_8px_40px_rgba(99,102,241,0.15)]',
      border: 'hover:border-indigo-400/40 dark:hover:border-indigo-500/30',
    },
    emerald: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      glow: 'shadow-[0_8px_30px_rgba(16,185,129,0.08)] dark:shadow-[0_8px_40px_rgba(16,185,129,0.15)]',
      border: 'hover:border-emerald-400/40 dark:hover:border-emerald-500/30',
    },
    amber: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20',
      glow: 'shadow-[0_8px_30px_rgba(245,158,11,0.08)] dark:shadow-[0_8px_40px_rgba(245,158,11,0.15)]',
      border: 'hover:border-amber-400/40 dark:hover:border-amber-500/30',
    },
    rose: {
      bg: 'bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20',
      glow: 'shadow-[0_8px_30px_rgba(244,63,94,0.08)] dark:shadow-[0_8px_40px_rgba(244,63,94,0.15)]',
      border: 'hover:border-rose-400/40 dark:hover:border-rose-500/30',
    }
  };

  const currentColors = colorMap[color] || colorMap.indigo;

  return (
    <div className={`p-5 glass-panel rounded-2xl ${currentColors.glow} border border-slate-200/50 dark:border-slate-800/40 transition-all duration-300 ${currentColors.border} hover:-translate-y-1.5 hover:shadow-xl group`}>
      <div className="flex items-center justify-between">
        
        {/* Left Content Area */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            {title}
          </p>
          
          <div className="flex items-baseline space-x-2.5">
            <span className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight font-sans">
              {value}
            </span>
          </div>

          {/* Trend Indicator */}
          {trendText && (
            <div className="flex items-center space-x-1.5 pt-1">
              <span className={`flex items-center text-[10px] font-bold rounded-lg px-2 py-0.5 ${
                trendType === 'up' 
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' 
                  : trendType === 'down'
                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                  : 'bg-slate-500/15 text-slate-500 dark:text-slate-400'
              }`}>
                {trendType === 'up' && <FiTrendingUp className="w-3 h-3 mr-0.5" />}
                {trendType === 'down' && <FiTrendingDown className="w-3 h-3 mr-0.5" />}
                {trendType === 'neutral' && <FiActivity className="w-3 h-3 mr-0.5" />}
                {trendText}
              </span>
              <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-600">
                vs yesterday
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Icon */}
        <div className={`p-3.5 rounded-2xl border ${currentColors.bg} transition-all duration-300 group-hover:scale-105`}>
          <Icon className="w-5.5 h-5.5" />
        </div>
      </div>
    </div>
  );
}
