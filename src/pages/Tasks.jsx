import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../App';
import TaskCard from '../components/TaskCard';
import SearchBar from '../components/SearchBar';
import TaskForm from '../components/TaskForm';
import DeleteModal from '../components/DeleteModal';
import { FiPlus, FiGrid, FiList, FiAlertCircle, FiFolderMinus, FiCheck } from 'react-icons/fi';

export default function Tasks() {
  const { tasks, deleteTask, searchQuery, setSearchQuery } = useAppContext();

  // --- STATE ---
  const [filterType, setFilterType] = useState('All'); // All | Pending | Completed | High
  const [layoutMode, setLayoutMode] = useState('grid'); // grid | list
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // null if adding new task
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState(null);

  // Simulate dashboard API latency
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // --- FILTERING LOGIC ---
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Search Query Match
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Filter Status Match
      let matchesFilter = true;
      if (filterType === 'Pending') {
        matchesFilter = task.status === 'Pending';
      } else if (filterType === 'Completed') {
        matchesFilter = task.status === 'Completed';
      } else if (filterType === 'High') {
        matchesFilter = task.priority === 'High';
      }

      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchQuery, filterType]);

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

  // Pre-configured statistics counts for filters
  const filterCounts = useMemo(() => {
    return {
      All: tasks.length,
      Pending: tasks.filter((t) => t.status === 'Pending').length,
      Completed: tasks.filter((t) => t.status === 'Completed').length,
      High: tasks.filter((t) => t.priority === 'High').length,
    };
  }, [tasks]);

  return (
    <div className="space-y-6">
      
      {/* Header and Add Task */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Task Manager
          </h1>
          <p className="text-xs md:text-sm text-slate-400 dark:text-slate-500 font-semibold">
            Organize, search, and edit your active task list
          </p>
        </div>

        <button
          onClick={handleOpenAddForm}
          className="py-3 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-700/30 transform active:scale-[0.98] transition-all flex items-center justify-center space-x-1.5 focus:outline-none"
          id="btn-add-task-trigger"
        >
          <FiPlus className="w-4.5 h-4.5 stroke-[3]" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Control Panel: Filters, Search, Layout Toggles */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm">
        
        {/* Search Input */}
        <div className="w-full lg:max-w-md">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Filter Categories list */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'All', label: 'All Tasks', count: filterCounts.All },
            { id: 'Pending', label: '⏳ Pending', count: filterCounts.Pending },
            { id: 'Completed', label: '✅ Completed', count: filterCounts.Completed },
            { id: 'High', label: '🔴 High Priority', count: filterCounts.High },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150 flex items-center space-x-1.5 focus:outline-none ${
                filterType === item.id
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10'
                  : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/80 dark:text-slate-400'
              }`}
            >
              <span>{item.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                filterType === item.id 
                  ? 'bg-white/20 text-white' 
                  : 'bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {item.count}
              </span>
            </button>
          ))}
        </div>

        {/* Divider */}
        <span className="hidden lg:inline w-px h-6 bg-slate-200 dark:bg-slate-800" />

        {/* Grid/List View Switch */}
        <div className="flex items-center space-x-2.5 bg-slate-50 dark:bg-slate-950/60 p-1 border border-slate-200 dark:border-slate-800 rounded-xl self-start lg:self-auto">
          <button
            onClick={() => setLayoutMode('grid')}
            className={`p-1.5 rounded-lg transition-all ${
              layoutMode === 'grid'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title="Grid view"
          >
            <FiGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLayoutMode('list')}
            className={`p-1.5 rounded-lg transition-all ${
              layoutMode === 'list'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title="List view"
          >
            <FiList className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task Listing View (Handling Skeletons, Empty States, layouts) */}
      {isPageLoading ? (
        // Loading Skeleton State
        <div className={layoutMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {[1, 2, 3].map((n) => (
            <div 
              key={n} 
              className={`p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm animate-pulse ${
                layoutMode === 'list' ? 'flex items-center space-x-4 space-y-0' : ''
              }`}
            >
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
              </div>
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-12 self-end"></div>
            </div>
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        // Empty State Handler
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-sm flex flex-col items-center max-w-md mx-auto space-y-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500">
            <FiFolderMinus className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              No tasks found
            </h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 leading-relaxed font-medium">
              {searchQuery 
                ? `We couldn't find any tasks matching "${searchQuery}". Try editing your search query.` 
                : `You don't have any tasks in the "${filterType}" category.`}
            </p>
          </div>
          <div className="pt-2 flex items-center space-x-3">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="py-2.5 px-4 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none"
              >
                Clear Search
              </button>
            )}
            <button
              onClick={handleOpenAddForm}
              className="py-2.5 px-4 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-700/25 transition-all focus:outline-none flex items-center space-x-1"
            >
              <FiPlus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Create Task</span>
            </button>
          </div>
        </div>
      ) : (
        // Actual Task Lists Grid/List Wrapper
        <div className={layoutMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "flex flex-col space-y-4"
        }>
          {filteredTasks.map((task) => (
            <div 
              key={task.id} 
              className={layoutMode === 'list' ? "w-full md:max-w-4xl" : ""}
            >
              <TaskCard
                task={task}
                onEdit={() => handleOpenEditForm(task)}
                onDelete={() => handleOpenDelete(task)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Task Creation & Editing Modal Form */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        task={editingTask}
      />

      {/* Delete Confirmation Modal Dialog */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        taskTitle={deletingTask?.title || ''}
      />

    </div>
  );
}
