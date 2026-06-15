import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { FiCheckCircle, FiInfo, FiAlertTriangle, FiXCircle, FiX } from 'react-icons/fi';
import { supabase } from './supabaseClient';

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
    const initializeAuth = async () => {
      try {
        const hash = window.location.hash;
        if (hash.includes('access_token=') && hash.includes('type=recovery')) {
          const tokenStartIndex = hash.indexOf('access_token=');
          const tokenString = hash.substring(tokenStartIndex);
          const params = new URLSearchParams(tokenString);
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          if (accessToken && refreshToken) {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            if (error) throw error;
            // Clean hash to avoid loop/multiple evaluation
            window.location.hash = '#/reset-password';
          }
        }
      } catch (err) {
        console.error('Error setting recovery session:', err.message);
      } finally {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

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

    return () => subscription.unsubscribe();
  }, []);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    if (!user) {
      setTasksState([]);
      return;
    }
    try {
      const { data, error } = await supabase.from('tasks').select('*').eq('user_id', user.id);
      if (error) throw error;
      setTasksState(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
      showToast('Failed to load tasks from server', 'error');
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasksState([]);
    }
  }, [user]);

  // --- ACTIONS ---
  
  // Set tasks with LocalStorage sync
  const setTasks = (newTasks) => {
    setTasksState(newTasks);
  };

  const addTask = async (task) => {
    try {
      const { title, status, description, dueDate, priority, assignedUser, category, submissionUrl } = task;
      const { error } = await supabase.from('tasks').insert([{ 
        title, 
        status: status || 'Pending', 
        user_id: user.id,
        description,
        dueDate,
        priority,
        assignedUser,
        category,
        submissionUrl
      }]);
      if (error) throw error;
      await fetchTasks();
      showToast('Task created successfully!', 'success');
    } catch (error) {
      console.error('Error creating task:', error.message);
      showToast('Failed to create task', 'error');
    }
  };

  const updateTask = async (updatedTask) => {
    try {
      const { title, status, description, dueDate, priority, assignedUser, category, submissionUrl } = updatedTask;
      const { error } = await supabase.from('tasks').update({ 
        title, 
        status,
        description,
        dueDate,
        priority,
        assignedUser,
        category,
        submissionUrl
      }).eq('id', updatedTask.id);
      if (error) throw error;
      await fetchTasks();
      showToast('Task updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating task:', error.message);
      showToast('Failed to update task', 'error');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) throw error;
      await fetchTasks();
      showToast('Task deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting task:', error.message);
      showToast('Failed to delete task', 'error');
    }
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

  // Supabase Login
  const login = async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      showToast(`Welcome back!`, 'success');
    } catch (error) {
      showToast(error.message || 'Login failed', 'error');
    }
  };

  // Supabase Register
  const register = async (email, password, fullName) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: fullName } }
      });
      if (error) throw error;
      showToast('Registration successful!', 'success');
    } catch (error) {
      showToast(error.message || 'Registration failed', 'error');
      throw error; // Re-throw so the form can catch it
    }
  };

  // Supabase Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      showToast('Logged out successfully.', 'info');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  // Supabase Forgot Password
  const forgotPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#/reset-password`,
      });
      if (error) throw error;
      showToast('Password reset link sent to your email!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to send reset link', 'error');
      throw error;
    }
  };

  // Supabase Reset Password
  const resetPassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      showToast('Password reset successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to reset password', 'error');
      throw error;
    }
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
        register,
        logout,
        forgotPassword,
        resetPassword,
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
