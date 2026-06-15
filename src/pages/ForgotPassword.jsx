import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../App';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

export default function ForgotPassword() {
  const { forgotPassword } = useAppContext();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden transition-theme">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Forgot Password Card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-8 space-y-8 relative z-10">
        
        {/* Title */}
        <div className="flex flex-col items-center space-y-2.5 text-center">
          <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20">
            <FiCheckCircle className="w-7 h-7" />
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Forgot Password
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium px-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/50 rounded-2xl text-rose-500 text-sm font-medium text-center">
                {error}
              </div>
            )}

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
                    if (error) setError('');
                  }}
                  className={`w-full pl-11 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                    error
                      ? 'border-rose-300 dark:border-rose-800/80 focus:border-rose-500'
                      : 'border-slate-200 dark:border-slate-800/80 focus:border-indigo-500'
                  }`}
                  placeholder="you@example.com"
                  id="forgot-email"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:opacity-95 transform active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 flex justify-center items-center"
              id="btn-forgot-submit"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6 text-center animate-scale-in">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-600 dark:text-emerald-400 text-sm font-medium">
              We've sent a password reset link to <strong className="font-semibold">{email}</strong>. Please check your inbox.
            </div>

            {/* Premium helper for Local Dev / Test Bypass */}
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-slate-600 dark:text-slate-300 text-xs text-left space-y-2">
              <span className="font-bold text-indigo-500 uppercase tracking-wider block text-[10px]">
                Testing Locally / Demo Mode
              </span>
              <p>
                Since email delivery requires live SMTP configuration, you can bypass the email step and proceed directly to the password reset form:
              </p>
              <Link 
                to="/reset-password" 
                className="inline-block mt-1 font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
              >
                Go to Reset Password Page &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Footer Back Link */}
        <div className="flex justify-center pt-2">
          <Link
            to="/login"
            className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-indigo-500 dark:text-slate-500 dark:hover:text-indigo-400 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
