import React, { useState, useEffect } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';
import { useAppContext } from '../App';

export default function TaskForm({ isOpen, onClose, task }) {
  const { addTask, updateTask } = useAppContext();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');
  const [assignedUser, setAssignedUser] = useState('');
  const [category, setCategory] = useState('Work');
  
  // Validation errors
  const [errors, setErrors] = useState({});

  // Reset form / Load task for editing
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setDueDate(task.dueDate || '');
        setPriority(task.priority || 'Medium');
        setStatus(task.status || 'Pending');
        setAssignedUser(task.assignedUser || '');
        setCategory(task.category || 'Work');
      } else {
        // Clear forms for new tasks
        setTitle('');
        setDescription('');
        // Set default due date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setDueDate(tomorrow.toISOString().split('T')[0]);
        setPriority('Medium');
        setStatus('Pending');
        setAssignedUser('');
        setCategory('Work');
      }
      setErrors({});
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, task]);

  if (!isOpen) return null;

  // Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Client-side validations
    const formErrors = {};
    if (!title.trim()) {
      formErrors.title = 'Task title is required.';
    }
    if (!dueDate) {
      formErrors.dueDate = 'Due date is required.';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const taskPayload = {
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priority,
      status,
      assignedUser: assignedUser.trim(),
      category
    };

    if (task) {
      // Editing Mode
      updateTask({ ...task, ...taskPayload });
    } else {
      // Adding Mode
      addTask(taskPayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Form Container */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 overflow-hidden animate-scale-in z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            {task ? 'Edit Task' : 'Add New Task'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            type="button"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) {
                  setErrors((prev) => ({ ...prev, title: null }));
                }
              }}
              className={`w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                errors.title
                  ? 'border-rose-300 dark:border-rose-800 focus:border-rose-500'
                  : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500'
              }`}
              placeholder="e.g. Finalize quarterly presentation"
              autoFocus
            />
            {errors.title && (
              <p className="text-xs text-rose-500 font-semibold">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[100px] resize-none"
              placeholder="e.g. Include metrics on user acquisition and current churn rate estimates..."
            />
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Due Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                if (e.target.value) {
                  setErrors((prev) => ({ ...prev, dueDate: null }));
                }
              }}
              className={`w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                errors.dueDate
                  ? 'border-rose-300 dark:border-rose-800 focus:border-rose-500'
                  : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500'
              }`}
            />
            {errors.dueDate && (
              <p className="text-xs text-rose-500 font-semibold">{errors.dueDate}</p>
            )}
          </div>

          {/* Assigned User */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Assigned User
            </label>
            <input
              type="text"
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="e.g. Jane Doe"
            />
          </div>

          {/* Dropdowns Row: Priority, Status & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 dark:text-slate-200"
              >
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 dark:text-slate-200"
              >
                <option value="Pending">⏳ Pending</option>
                <option value="Completed">✅ Completed</option>
              </select>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 dark:text-slate-200"
              >
                <option value="Work">💼 Work</option>
                <option value="Personal">👤 Personal</option>
                <option value="Marketing">📢 Marketing</option>
                <option value="Learning">📚 Learning</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-6">
            <button
              onClick={onClose}
              type="button"
              className="flex-1 py-2.5 px-4 text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-xl transition-colors focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-700/30 transition-all focus:outline-none flex items-center justify-center space-x-1"
            >
              <FiCheck className="w-4 h-4" />
              <span>Save Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
