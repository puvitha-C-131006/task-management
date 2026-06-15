import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../App';
import { FiMail, FiLock, FiCheckCircle, FiUser } from 'react-icons/fi';

export default function Login() {
  const { login } = useAppContext();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    // Visual Validation
    const validationErrors = {};
    if (!fullName.trim()) {
      validationErrors.fullName = 'Full name is required';
    }
    
    if (!email) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = 'Email is invalid';
    }

    if (!password) {
      validationErrors.password = 'Password is required';
    } else if (password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    login(email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden transition-theme">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-8 space-y-8 relative z-10">
        
        {/* Logo/Icon */}
        <div className="flex flex-col items-center space-y-2.5 text-center">
          <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20">
            <FiCheckCircle className="w-7 h-7" />
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            Sign in to access your task dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-6">
          
          {/* Full Name field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 pointer-events-none">
                <FiUser className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: null }));
                }}
                className={`w-full pl-11 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                  errors.fullName
                    ? 'border-rose-300 dark:border-rose-800/80 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-800/80 focus:border-indigo-500'
                }`}
                placeholder="John Doe"
                id="login-fullname"
              />
            </div>
            {errors.fullName && (
              <p className="text-xs text-rose-500 font-semibold">{errors.fullName}</p>
            )}
          </div>

          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 pointer-events-none">
                <FiMail className="w-5 h-5" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                }}
                className={`w-full pl-11 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                  errors.email
                    ? 'border-rose-300 dark:border-rose-800/80 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-800/80 focus:border-indigo-500'
                }`}
                placeholder="you@example.com"
                id="login-email"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-500 font-semibold">{errors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 pointer-events-none">
                <FiLock className="w-5 h-5" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                }}
                className={`w-full pl-11 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                  errors.password
                    ? 'border-rose-300 dark:border-rose-800/80 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-800/80 focus:border-indigo-500'
                }`}
                placeholder="••••••••"
                id="login-password"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-rose-500 font-semibold">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:opacity-95 transform active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
            id="btn-login-submit"
          >
            Sign In
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            id="link-to-register"
          >
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}
