import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../App';
import DashboardCard from '../components/DashboardCard';
import TaskForm from '../components/TaskForm';
import DeleteModal from '../components/DeleteModal';
import { 
  FiList, 
  FiCheckCircle, 
  FiClock, 
  FiAlertTriangle, 
  FiPlus, 
  FiArrowRight, 
  FiEdit3, 
  FiTrash2, 
  FiCalendar,
  FiCheck
} from 'react-icons/fi';

export default function Dashboard() {
  const { tasks, user, updateTask, deleteTask } = useAppContext();
  const navigate = useNavigate();

  // --- MODALS STATE ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // null if adding
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState(null);

  // --- STATISTICS CALCULATIONS ---
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const pending = tasks.filter((t) => t.status === 'Pending').length;
    const highPriority = tasks.filter((t) => t.priority === 'High').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Counts by priority
    const priorityCounts = {
      Low: tasks.filter((t) => t.priority === 'Low').length,
      Medium: tasks.filter((t) => t.priority === 'Medium').length,
      High: tasks.filter((t) => t.priority === 'High').length,
    };

    const today = new Date().setHours(0, 0, 0, 0);
    const dueToday = tasks.filter(t => t.dueDate && new Date(t.dueDate).setHours(0, 0, 0, 0) === today && t.status !== 'Completed').length;

    return {
      total,
      completed,
      pending,
      highPriority,
      completionRate,
      priorityCounts,
      dueToday,
    };
  }, [tasks]);

  // Recent Tasks (limit to 5 for a professional table layout)
  const recentTasks = useMemo(() => {
    return [...tasks].slice(0, 5);
  }, [tasks]);

  // Donut chart calculations
  const donutData = useMemo(() => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const completedOffset = stats.total > 0 
      ? circumference - (stats.completed / stats.total) * circumference 
      : circumference;
    
    return {
      radius,
      circumference,
      completedOffset
    };
  }, [stats]);

  // Current Date Greeting
  const dateGreeting = useMemo(() => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  }, []);

  // --- HANDLERS ---
  const handleOpenAddForm = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (task) => {
    setDeletingTask(task);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingTask) {
      deleteTask(deletingTask.id);
    }
  };

  const toggleTaskStatus = (task) => {
    updateTask({
      ...task,
      status: task.status === 'Completed' ? 'Pending' : 'Completed'
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Compact Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 animate-scale-in">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            <span>{dateGreeting}</span>
            <span>•</span>
            <span>Welcome, {user?.name || 'User'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Manage your tasks and productivity.
          </p>
          <div className="flex items-center space-x-3 pt-2 text-xs font-bold text-slate-600 dark:text-slate-300">
            <span className="bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-500 px-2 py-1 rounded-md">Pending Tasks: {stats.pending}</span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-500 px-2 py-1 rounded-md">Completed: {stats.completed}</span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 px-2 py-1 rounded-md">Due Today: {stats.dueToday}</span>
          </div>
        </div>

        <button
          onClick={handleOpenAddForm}
          className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transform active:scale-[0.98] transition-all flex items-center space-x-1.5 focus:outline-none"
        >
          <FiPlus className="w-4 h-4 stroke-[3]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Tasks"
          value={stats.total}
          icon={FiList}
          color="indigo"
        />
        <DashboardCard
          title="Completed"
          value={stats.completed}
          icon={FiCheckCircle}
          color="emerald"
        />
        <DashboardCard
          title="Pending"
          value={stats.pending}
          icon={FiClock}
          color="amber"
        />
        <DashboardCard
          title="High Priority"
          value={stats.highPriority}
          icon={FiAlertTriangle}
          color="rose"
        />
      </div>

      {/* Task Overview and Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Analytics Card */}
          <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-sm flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Task Analytics
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                Visual breakdown of task statuses and priority levels
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-4">
              {/* SVG Donut Chart */}
              <div className="flex flex-col items-center space-y-5">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    {/* Track Circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r={donutData.radius}
                      className="stroke-slate-100 dark:stroke-slate-900 fill-transparent"
                      strokeWidth="8"
                    />
                    {/* Completed Segment */}
                    {stats.total > 0 && (
                      <circle
                        cx="60"
                        cy="60"
                        r={donutData.radius}
                        className="stroke-emerald-500 fill-transparent transition-all duration-1000 ease-out"
                        strokeWidth="8"
                        strokeDasharray={donutData.circumference}
                        strokeDashoffset={donutData.completedOffset}
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                  {/* Donut Center text */}
                  <div className="absolute text-center">
                    <p className="text-3xl font-extrabold text-slate-800 dark:text-white leading-none">
                      {stats.completionRate}%
                    </p>
                    <p className="text-[9px] uppercase font-extrabold text-slate-400 dark:text-slate-500 tracking-wider mt-1.5">
                      Completed
                    </p>
                  </div>
                </div>

                {/* Legends */}
                <div className="flex items-center space-x-6 text-[11px] font-bold">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-500 dark:text-slate-400">
                      Completed ({stats.completed})
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <span className="text-slate-500 dark:text-slate-400">
                      Pending ({stats.pending})
                    </span>
                  </div>
                </div>
              </div>

              {/* Custom Bar Charts for Priority Counts */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Tasks by Priority
                </h4>
                
                {/* Bars container */}
                <div className="space-y-4">
                  {['Low', 'Medium', 'High'].map((priority) => {
                    const count = stats.priorityCounts[priority];
                    const maxCount = Math.max(...Object.values(stats.priorityCounts), 1);
                    const widthPercent = Math.max((count / maxCount) * 100, 5); 

                    const barColors = {
                      Low: 'bg-emerald-500',
                      Medium: 'bg-amber-500',
                      High: 'bg-rose-500',
                    };

                    return (
                      <div key={priority} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-500 dark:text-slate-400">{priority} Priority</span>
                          <span className="text-slate-700 dark:text-slate-300">{count} {count === 1 ? 'task' : 'tasks'}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${widthPercent}%` }}
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${barColors[priority]}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Completion Progress Target */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-sm flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  Completion Progress
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                  Overall check-in performance goals
                </p>
              </div>

              {/* Progress status card */}
              <div className="p-5 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 text-center space-y-3.5">
                <span className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  {stats.completed}/{stats.total}
                </span>
                <p className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Tasks Completed
                </p>
                
                {/* Progress bar */}
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${stats.completionRate}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Recent Tasks Section */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              Recent Tasks
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
              Your latest task records and updates
            </p>
          </div>
          <Link
            to="/tasks"
            className="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center space-x-1"
          >
            <span>View All</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Tasks Table */}
        {recentTasks.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
              No tasks available
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-900">
                  <th className="pb-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Task Title</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Priority</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Due Date</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50 dark:divide-slate-900/50">
                {recentTasks.map((task) => {
                  const isCompleted = task.status === 'Completed';
                  const priorityColors = {
                    High: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
                    Medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
                    Low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
                  };

                  return (
                    <tr key={task.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors group">
                      
                      {/* Title */}
                      <td className="py-4 pl-1">
                        <div className="flex items-center space-x-3.5">
                          <button
                            onClick={() => toggleTaskStatus(task)}
                            className={`flex items-center justify-center w-5 h-5 rounded-full border transition-all duration-200 ${
                              isCompleted
                                ? 'bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600'
                                : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-transparent hover:text-indigo-500'
                            }`}
                            title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
                          >
                            <FiCheck className="w-3 h-3 stroke-[3]" />
                          </button>
                          
                          <div className="space-y-0.5 max-w-sm">
                            <p className={`text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${
                               isCompleted ? 'line-through text-slate-400 dark:text-slate-500 group-hover:text-slate-400 dark:group-hover:text-slate-500' : ''
                            }`}>
                              {task.title}
                            </p>
                            <div className="flex items-center space-x-2">
                              <p className={`text-xs text-slate-400 dark:text-slate-500 truncate ${isCompleted ? 'text-slate-400/60 dark:text-slate-500/50' : ''}`}>
                                {task.description || 'No description provided.'}
                              </p>
                              {task.assignedUser && (
                                <>
                                  <span className="text-slate-300 dark:text-slate-700 text-[9px]">•</span>
                                  <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.25 rounded-md">
                                    @{task.assignedUser}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isCompleted 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {task.status}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${priorityColors[task.priority]}`}>
                          <span className={`w-1 h-1 rounded-full mr-1.5 ${
                            task.priority === 'High' ? 'bg-rose-500' : task.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                          {task.priority}
                        </span>
                      </td>

                      {/* Due Date */}
                      <td className="py-4">
                        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
                          <FiCalendar className="w-3.5 h-3.5" />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 text-right pr-2">
                        <div className="flex items-center justify-end space-x-2.5">
                          <button
                            onClick={() => handleOpenEditForm(task)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                            title="Edit Task"
                          >
                            <FiEdit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(task)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                            title="Delete Task"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-slate-400 dark:text-slate-600 font-semibold">
        © 2026 TaskFlow Inc. Built for maximum personal productivity.
      </footer>

      {/* Modals for dashboard CRUD actions */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        task={editingTask}
      />

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        taskTitle={deletingTask?.title || ''}
      />

    </div>
  );
}
