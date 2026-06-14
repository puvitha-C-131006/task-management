import React from 'react';
import { FiCalendar, FiEdit3, FiTrash2, FiClock, FiCheck } from 'react-icons/fi';
import { useAppContext } from '../App';

export default function TaskCard({ task, onEdit, onDelete }) {
  const { updateTask } = useAppContext();

  // Toggle status directly on check icon click
  const toggleStatus = () => {
    updateTask({
      ...task,
      status: task.status === 'Completed' ? 'Pending' : 'Completed'
    });
  };

  // Priority Styles mapping
  const priorityStyles = {
    High: {
      badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-100 dark:border-rose-900/30',
      dot: 'bg-rose-500',
      border: 'border-l-4 border-l-rose-500'
    },
    Medium: {
      badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-100 dark:border-amber-900/30',
      dot: 'bg-amber-500',
      border: 'border-l-4 border-l-amber-500'
    },
    Low: {
      badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30',
      dot: 'bg-emerald-500',
      border: 'border-l-4 border-l-emerald-500'
    }
  };

  const activeStyles = priorityStyles[task.priority] || priorityStyles.Low;
  const isCompleted = task.status === 'Completed';

  // Format date display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Check if due date is overdue (only if status is pending)
  const isOverdue = !isCompleted && new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md transition-theme ${activeStyles.border} overflow-hidden duration-200 group`}>
      <div className="p-5 flex-1 flex flex-col space-y-4">
        
        {/* Card Header: Priority & Status Action */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${activeStyles.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${activeStyles.dot}`} />
            {task.priority} Priority
          </span>

          {/* Inline Complete Switch */}
          <button
            onClick={toggleStatus}
            className={`flex items-center justify-center w-6 h-6 rounded-full border transition-all duration-200 ${
              isCompleted
                ? 'bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600'
                : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-transparent hover:text-indigo-500'
            }`}
            title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
          >
            <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>

        {/* Task Title & Description */}
        <div className="space-y-1.5 flex-1">
          <h3 className={`text-base font-bold text-slate-800 dark:text-slate-100 transition-colors leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500 group-hover:text-slate-400 dark:group-hover:text-slate-500' : ''}`}>
            {task.title}
          </h3>
          <p className={`text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 ${isCompleted ? 'text-slate-400/80 dark:text-slate-500/80' : ''}`}>
            {task.description || 'No description provided.'}
          </p>
          {task.assignedUser && (
            <div className="flex items-center space-x-1.5 pt-1.5">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Assignee:</span>
              <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-lg">
                @{task.assignedUser}
              </span>
            </div>
          )}
        </div>

        {/* Card Footer: Due Date & Overdue labels */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <div className="flex items-center space-x-1.5">
            <FiCalendar className="w-4 h-4 flex-shrink-0 text-slate-400" />
            <span className={`${isOverdue ? 'text-rose-500 font-semibold' : ''}`}>
              {formatDate(task.dueDate)}
            </span>
          </div>

          {isOverdue && (
            <span className="flex items-center space-x-1 text-rose-500 font-semibold bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded">
              <FiClock className="w-3 h-3" />
              <span>Overdue</span>
            </span>
          )}
          {isCompleted && (
            <span className="text-emerald-500 font-semibold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">
              Done
            </span>
          )}
        </div>
      </div>

      {/* Hover Action Drawer */}
      <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-end space-x-2.5">
        <button
          onClick={onEdit}
          className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          title="Edit Task"
        >
          <FiEdit3 className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          title="Delete Task"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
