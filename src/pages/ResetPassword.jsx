import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { FiLock, FiCheckCircle, FiEye, FiEyeOff, FiAlertTriangle } from 'react-icons/fi';
import axios from 'axios';

export default function ResetPassword() {
  const { user, loading: authLoading, resetPassword, logout, showToast } = useAppContext();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Extract token if present (for MERN backend flow)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('?')) {
      const search = hash.split('?')[1];
      const params = new URLSearchParams(search);
      const t = params.get('token');
      if (t) {
        setToken(t);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!password) {
      setError('Password is required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      if (token) {
        // --- 1. MERN MongoDB flow ---
        const response = await axios.put(`/api/auth/reset-password/${token}`, { password });
        showToast(response.data.message || 'Password reset successfully!', 'success');
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else if (user) {
        // --- 2. Supabase recovery flow ---
        await resetPassword(password);
        setIsSuccess(true);
        // Sign out user to clear the recovery session so they must log in with new credentials
        await logout();
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        // --- 3. Demo Mode Simulation ---
        showToast('Demo Mode: Password reset simulated successfully!', 'success');
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'An error occurred while resetting your password.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Validating recovery session...</p>
        </div>
      </div>
    );
  }

  // Determine recovery mode status
  const isSupabaseRecovery = !!user;
  const isMernRecovery = !!token;
  const isDemoSimulation = !isSupabaseRecovery && !isMernRecovery;

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden transition-theme">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Reset Password Card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-8 space-y-6 relative z-10">
        
        {/* Title/Icon */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20">
            <FiLock className="w-7 h-7" />
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Reset Password
          </h1>
          
          {/* Recovery Type Label */}
          {isSupabaseRecovery && (
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">
              Supabase Session Active
            </span>
          )}
          {isMernRecovery && (
            <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full border border-blue-500/20">
              MongoDB Token Detected
            </span>
          )}
          {isDemoSimulation && (
            <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full border border-amber-500/20 flex items-center space-x-1">
              <FiAlertTriangle className="w-3.5 h-3.5" />
              <span>Demo / Preview Mode</span>
            </span>
          )}
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/50 rounded-2xl text-rose-500 text-sm font-medium text-center animate-fade-in">
                {error}
              </div>
            )}

            {isDemoSimulation && (
              <div className="p-3.5 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-2xl text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                <strong className="text-amber-600 dark:text-amber-400 font-bold block uppercase tracking-wider text-[9px]">
                  How to trigger a real session:
                </strong>
                <p>
                  1. Real Supabase: Complete "Forgot Password" with your email, click the link sent to your inbox.
                </p>
                <p>
                  2. Real MongoDB: Request reset on backend, then append <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-[10px]">?token=your_token</code> to this hash URL.
                </p>
                <p className="text-indigo-500 font-semibold mt-1">
                  Submit below to test and simulate a successful password reset.
                </p>
              </div>
            )}

            {/* Password field */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 pointer-events-none">
                  <FiLock className="w-5 h-5" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  className={`w-full pl-11 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                    error
                      ? 'border-rose-300 dark:border-rose-800/80 focus:border-rose-500'
                      : 'border-slate-200 dark:border-slate-800/80 focus:border-indigo-500'
                  }`}
                  placeholder="Min 6 characters"
                  id="reset-password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password field */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Confirm New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 pointer-events-none">
                  <FiLock className="w-5 h-5" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError('');
                  }}
                  className={`w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                    error
                      ? 'border-rose-300 dark:border-rose-800/80 focus:border-rose-500'
                      : 'border-slate-200 dark:border-slate-800/80 focus:border-indigo-500'
                  }`}
                  placeholder="Re-type new password"
                  id="reset-confirm-password"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:opacity-95 transform active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 flex justify-center items-center mt-2"
              id="btn-reset-submit"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center animate-scale-in">
            <span className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto">
              <FiCheckCircle className="w-8 h-8" />
            </span>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
              Password has been reset successfully!
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Redirecting you to the login screen in a few seconds...
            </p>
          </div>
        )}

        {/* Footer Back Link */}
        <div className="flex justify-center pt-2">
          <Link
            to="/login"
            className="text-xs font-bold text-slate-400 hover:text-indigo-500 dark:text-slate-500 dark:hover:text-indigo-400 transition-colors"
          >
            Cancel & Go to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
