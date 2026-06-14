import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

export default function SearchBar({ value, onChange, placeholder = 'Search tasks by title or description...' }) {
  return (
    <div className="relative flex-1">
      {/* Search Icon */}
      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
        <FiSearch className="w-5 h-5" />
      </span>

      {/* Input Field */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-11 pr-10 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder-slate-400 dark:placeholder-slate-500"
        placeholder={placeholder}
      />

      {/* Clear/Reset Button */}
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          title="Clear search"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
