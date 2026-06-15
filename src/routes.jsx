import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet, NavLink } from 'react-router-dom';
import { useAppContext } from './App';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Categories from './pages/Categories';
import Priorities from './pages/Priorities';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import { FiHome, FiCheckSquare, FiCalendar, FiSettings } from 'react-icons/fi';

// Layout wrapper for pages requiring authentication
function AppLayout() {
  const { user, loading } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If auth is loading, we can render a loading page/skeleton
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading Task Manager...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Sidebar with mobile drawer controls */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Main page content scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-6">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-950/85 border-t border-slate-200/50 dark:border-slate-900/60 backdrop-blur-md flex items-center justify-around px-4 z-40">
        {[
          { name: 'Dashboard', path: '/dashboard', icon: FiHome },
          { name: 'Tasks', path: '/tasks', icon: FiCheckSquare },
          { name: 'Calendar', path: '/calendar', icon: FiCalendar },
          { name: 'Settings', path: '/settings', icon: FiSettings },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-tight">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

// Router configuration
export default function AppRoutes() {
  const { user } = useAppContext();

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/dashboard" replace /> : <Register />} 
      />
      <Route 
        path="/reset-password" 
        element={<ResetPassword />} 
      />

      {/* Protected Routes (Require Authentication) */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/priorities" element={<Priorities />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Fallback Redirects */}
      <Route 
        path="*" 
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
      />
    </Routes>
  );
}

