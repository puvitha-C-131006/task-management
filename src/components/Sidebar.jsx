import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../App';
import { 
  FiHome, 
  FiCheckSquare, 
  FiCalendar, 
  FiFolder, 
  FiAlertCircle, 
  FiBarChart2, 
  FiSettings, 
  FiLogOut, 
  FiX, 
  FiCheckCircle 
} from 'react-icons/fi';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { logout } = useAppContext();

  // Navigation Links
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiHome },
    { name: 'Tasks', path: '/tasks', icon: FiCheckSquare },
    { name: 'Calendar', path: '/calendar', icon: FiCalendar },
    { name: 'Categories', path: '/categories', icon: FiFolder },
    { name: 'Priorities', path: '/priorities', icon: FiAlertCircle },
    { name: 'Analytics', path: '/analytics', icon: FiBarChart2 },
    { name: 'Settings', path: '/settings', icon: FiSettings },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-slate-50/90 dark:bg-slate-950/80 border-r border-slate-200/50 dark:border-slate-900/60 backdrop-blur-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200/50 dark:border-slate-900/60">
          <div className="flex items-center space-x-3">
            <span className="flex items-center justify-center w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-600 text-white shadow-md shadow-indigo-500/25">
              <FiCheckCircle className="w-5 h-5" />
            </span>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Close Sidebar"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 text-[13px] font-semibold rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/15 dark:to-purple-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 dark:border-indigo-500/20 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-900/40 hover:text-slate-800 dark:hover:text-slate-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4.5 h-4.5 mr-3 transition-colors duration-200 ${
                        isActive
                          ? 'text-indigo-500'
                          : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                      }`}
                    />
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 glow-indigo" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Log Out Drawer Option (Bottom section) */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-900/60">
          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="flex items-center w-full px-4 py-2.5 text-[13px] font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all duration-150"
          >
            <FiLogOut className="w-4.5 h-4.5 mr-3" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

