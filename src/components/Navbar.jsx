import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../App';
import { FiMenu, FiSun, FiMoon, FiBell, FiLogOut, FiUser, FiSearch, FiX } from 'react-icons/fi';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout, theme, toggleTheme, searchQuery, setSearchQuery, tasks } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to tasks page if they start searching
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (val && location.pathname !== '/tasks') {
      navigate('/tasks');
    }
  };

  // Calculate pending tasks count
  const pendingTasksCount = tasks.filter((t) => t.status === 'Pending').length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 lg:px-8 bg-white/70 dark:bg-slate-950/75 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-900/60 transition-all duration-300">
      
      {/* Left side: Hamburger button + Title */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 focus:outline-none transition-colors"
          aria-label="Toggle Sidebar Menu"
          id="btn-sidebar-mobile-toggle"
        >
          <FiMenu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-2">
          <span className="text-base font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
            Task Manager
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-500/20">
            SaaS Pro
          </span>
        </div>
      </div>

      {/* Middle: Integrated Search Bar (resembling Slack/Notion/Linear search) */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-slate-500">
            <FiSearch className="w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-100/60 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/80 focus:bg-white dark:focus:bg-slate-950 transition-all duration-200 placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="Search tasks anywhere..."
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2.5">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title="Clear search"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[9px] font-semibold text-slate-400 dark:text-slate-600 bg-slate-200/50 dark:bg-slate-900 border border-slate-300/50 dark:border-slate-800 rounded">
                ⌘K
              </kbd>
            )}
          </div>
        </div>
      </div>

      {/* Right side: Dark mode toggle, Notification bell, User Profile dropdown */}
      <div className="flex items-center space-x-3.5">
        
        {/* Mobile Search Trigger Icon */}
        <div className="md:hidden">
          <button
            onClick={() => {
              navigate('/tasks');
            }}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all duration-200"
            title="Search tasks"
          >
            <FiSearch className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all duration-200 focus:outline-none"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          id="btn-theme-toggle"
        >
          {theme === 'light' ? (
            <FiMoon className="w-4.5 h-4.5" />
          ) : (
            <FiSun className="w-4.5 h-4.5 animate-spin-slow" />
          )}
        </button>

        {/* Notifications Icon with Glowing Pulse */}
        <div className="relative group/notif">
          <button
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all duration-200 focus:outline-none"
            id="btn-notifications-indicator"
          >
            <FiBell className="w-4.5 h-4.5" />
            {pendingTasksCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-950 animate-pulse-slow"></span>
            )}
          </button>
          
          {/* Notifications Dropdown (Hover reveal) */}
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 origin-top-right transform scale-0 group-hover/notif:scale-100 opacity-0 group-hover/notif:opacity-100 transition-all duration-200 pointer-events-none group-hover/notif:pointer-events-auto z-50">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-white">Notifications</span>
              <span className="px-2 py-0.5 text-[9px] font-bold bg-indigo-500/10 text-indigo-500 rounded-full">
                {pendingTasksCount} Pending
              </span>
            </div>
            <div className="py-2.5 space-y-2.5">
              {pendingTasksCount > 0 ? (
                <div className="flex items-start space-x-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></span>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-700 dark:text-slate-200">You have active pending tasks</p>
                    <p className="text-[10px] text-slate-400">Complete tasks to keep productivity levels high!</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center font-medium">No new notifications</p>
              )}
            </div>
          </div>
        </div>

        {/* Vertical Separator */}
        <span className="w-px h-5 bg-slate-200 dark:bg-slate-800"></span>

        {/* User Dropdown Trigger */}
        {user && (
          <div className="relative group/profile">
            <button
              className="flex items-center space-x-2.5 focus:outline-none rounded-xl p-1 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200"
              id="btn-user-menu"
            >
              <img
                className="w-8.5 h-8.5 rounded-xl object-cover border-2 border-indigo-500/10 bg-slate-200 dark:bg-slate-800 shadow-sm"
                src={user.avatarUrl}
                alt={user.name}
              />
              <div className="hidden lg:block text-left pr-1">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none mb-0.5">
                  {user.name}
                </p>
                <p className="text-[9px] font-medium text-slate-400 dark:text-slate-500 truncate max-w-[100px]">
                  {user.email}
                </p>
              </div>
            </button>
            
            {/* Profile Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/70 dark:border-slate-800 p-2 origin-top-right transform scale-0 group-hover/profile:scale-100 opacity-0 group-hover/profile:opacity-100 transition-all duration-200 pointer-events-none group-hover/profile:pointer-events-auto z-50">
              <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate leading-relaxed">{user.email}</p>
              </div>
              
              <div className="py-1">
                <button
                  onClick={() => navigate('/tasks')}
                  className="flex items-center w-full px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all duration-150 text-left font-medium"
                >
                  <FiUser className="w-3.5 h-3.5 mr-2 text-slate-400" />
                  My Tasks ({tasks.length})
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-slate-800 mt-1">
                <button
                  onClick={logout}
                  className="flex items-center w-full px-3 py-2 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors duration-150 text-left font-bold"
                >
                  <FiLogOut className="w-3.5 h-3.5 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
