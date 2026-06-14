import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { FiCheckCircle, FiInfo, FiAlertTriangle, FiXCircle, FiX } from 'react-icons/fi';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export default function App() {
  // --- STATE ---
  const [tasks, setTasksState] = useState([]);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // --- LOCAL STORAGE HANDLING ---
  useEffect(() => {
    // 1. Load User Session
    const savedUser = localStorage.getItem('task_manager_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // 2. Load Tasks (Filter out any old mock tasks from local storage)
    const savedTasks = localStorage.getItem('task_manager_tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      const cleanedTasks = parsedTasks.filter(t => !['task-1', 'task-2', 'task-3', 'task-4', 'task-5', 'task-6'].includes(t.id));
      setTasksState(cleanedTasks);
      localStorage.setItem('task_manager_tasks', JSON.stringify(cleanedTasks));
    } else {
      setTasksState([]);
      localStorage.setItem('task_manager_tasks', JSON.stringify([]));
    }

    // 3. Load Theme
    const savedTheme = localStorage.getItem('task_manager_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setLoading(false);
  }, []);

  // --- ACTIONS ---
  
  // Set tasks with LocalStorage sync
  const setTasks = (newTasks) => {
    setTasksState(newTasks);
    localStorage.setItem('task_manager_tasks', JSON.stringify(newTasks));
  };

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: `task-${Date.now()}`,
    };
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    showToast('Task created successfully!', 'success');
  };

  const updateTask = (updatedTask) => {
    const updatedTasks = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    setTasks(updatedTasks);
    showToast('Task updated successfully!', 'success');
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((t) => t.id !== taskId);
    setTasks(updatedTasks);
    showToast('Task deleted successfully!', 'success');
  };

  // Toast Notification System
  const showToast = (message, type = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3.5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Theme Toggler
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('task_manager_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Simulated Login
  const login = (email, name) => {
    const sessionUser = { email, name: name || email.split('@')[0], avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name || email}` };
    setUser(sessionUser);
    localStorage.setItem('task_manager_user', JSON.stringify(sessionUser));
    showToast(`Welcome back, ${sessionUser.name}!`, 'success');
  };

  // Simulated Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('task_manager_user');
    showToast('Logged out successfully.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        setTasks,
        addTask,
        updateTask,
        deleteTask,
        user,
        login,
        logout,
        theme,
        toggleTheme,
        loading,
        showToast,
        searchQuery,
        setSearchQuery,
      }}
    >
      <HashRouter>
        <AppRoutes />
      </HashRouter>

      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center p-4 rounded-xl shadow-lg border pointer-events-auto animate-slide-in transition-all duration-300 ${
              toast.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                : toast.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                : toast.type === 'warning'
                ? 'bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
                : 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200'
            }`}
          >
            <span className="mr-3 text-xl flex-shrink-0">
              {toast.type === 'success' && <FiCheckCircle className="text-emerald-500" />}
              {toast.type === 'error' && <FiXCircle className="text-rose-500" />}
              {toast.type === 'warning' && <FiAlertTriangle className="text-amber-500" />}
              {toast.type === 'info' && <FiInfo className="text-indigo-500" />}
            </span>
            <p className="text-sm font-medium flex-1 mr-2">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}
