import React, { useState, useMemo } from 'react';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';
import { useAppContext } from '../App';
import TaskForm from '../components/TaskForm';

export default function Calendar() {
  const { tasks } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Switch month handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Header display string
  const currentMonthYear = useMemo(() => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [currentDate]);

  // Generate perfect grid days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of current month (0 = Sun, 1 = Mon...)
    const firstDay = new Date(year, month, 1);
    const startDayOfWeek = firstDay.getDay();

    // Total days in current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Total days in previous month
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // 1. Prev month trailing days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const prevDay = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, prevDay);
      days.push({
        day: prevDay,
        isCurrentMonth: false,
        dateString: prevDate.toISOString().split('T')[0],
      });
    }

    // 2. Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const currDate = new Date(year, month, i);
      days.push({
        day: i,
        isCurrentMonth: true,
        dateString: currDate.toISOString().split('T')[0],
      });
    }

    // 3. Next month leading days (Fill to 42 elements for 6-week layout)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({
        day: i,
        isCurrentMonth: false,
        dateString: nextDate.toISOString().split('T')[0],
      });
    }

    return days;
  }, [currentDate]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Calendar Schedule
          </h1>
          <p className="text-xs md:text-sm text-slate-400 dark:text-slate-500 font-semibold">
            Plan and track your milestones across the month view
          </p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-700/25 transition-all flex items-center justify-center space-x-1.5 focus:outline-none"
        >
          <FiPlus className="w-4 h-4" />
          <span>Schedule Task</span>
        </button>
      </div>

      <div className="glass-panel-elevated rounded-3xl p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200/50 dark:border-slate-800/60">
          <div className="flex items-center space-x-2.5">
            <FiCalendar className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">{currentMonthYear}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handlePrevMonth}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={handleNextMonth}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-2 text-center text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 py-4">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Grid Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((dayObj, index) => {
            // Find actual tasks assigned to this date
            const dayTasks = tasks.filter((t) => t.dueDate === dayObj.dateString);
            const isToday = new Date().toISOString().split('T')[0] === dayObj.dateString;

            return (
              <div
                key={index}
                className={`min-h-[100px] p-2.5 border rounded-2xl flex flex-col justify-between transition-all duration-200 ${
                  dayObj.isCurrentMonth
                    ? isToday
                      ? 'bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500 text-slate-850 dark:text-white'
                      : 'bg-white/40 dark:bg-slate-900/20 border-slate-100 dark:border-slate-800/40 text-slate-800 dark:text-slate-200'
                    : 'bg-slate-50/10 dark:bg-slate-950/5 border-slate-100/30 dark:border-slate-800/10 text-slate-300 dark:text-slate-700'
                } hover:border-indigo-500/30 hover:bg-indigo-50/5 dark:hover:bg-indigo-950/5`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold ${isToday ? 'text-indigo-500' : ''}`}>
                    {dayObj.day}
                  </span>
                  {isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 glow-indigo" />
                  )}
                </div>

                {/* Render list of tasks for the day */}
                {dayTasks.length > 0 && (
                  <div className="mt-2 space-y-1 max-h-[60px] overflow-y-auto pr-0.5">
                    {dayTasks.map((t) => {
                      const priorityColors = {
                        High: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/10',
                        Medium: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/10',
                        Low: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/10',
                      };
                      return (
                        <div
                          key={t.id}
                          className={`px-1.5 py-0.5 text-[9px] font-bold rounded-lg border truncate ${
                            priorityColors[t.priority] || 'bg-slate-100 text-slate-700'
                          } ${t.status === 'Completed' ? 'line-through opacity-50' : ''}`}
                          title={`${t.title} (${t.priority} Priority)`}
                        >
                          {t.title}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <TaskForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
}
