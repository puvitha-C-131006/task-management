import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../App';
import { FiUser, FiMail, FiLock, FiCheckCircle } from 'react-icons/fi';

export default function Register() {
  const { login, showToast } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Visual Validation
    const validationErrors = {};
    if (!name.trim()) {
      validationErrors.name = 'Full name is required';
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

    if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    if (!termsAccepted) {
      validationErrors.termsAccepted = 'You must accept the terms and conditions';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      const username = email.split('@')[0];

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            firstName,
            lastName,
            username,
            email,
            password,
            confirmPassword,
            termsAccepted,
          }
        }),
      });

      if (!response.ok) {
        let errorMsg = 'Registration failed';
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch {
          if (errorText) errorMsg = errorText;
        }
        throw new Error(errorMsg);
      }

      // Sign up successful - automatically log user in
      showToast('Registration successful! Creating account...', 'success');
      login(email, name);
    } catch (err) {
      setErrors({ form: err.message });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden transition-theme">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Register Card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-8 space-y-6 relative z-10">
        
        {/* Logo/Icon */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20">
            <FiCheckCircle className="w-7 h-7" />
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Create Account
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            Get started with TaskFlow dashboard today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          
          {errors.form && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/50 rounded-2xl text-rose-500 text-sm font-medium text-center">
              {errors.form}
            </div>
          )}
          
          {/* Name field */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 pointer-events-none">
                <FiUser className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                }}
                className={`w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                  errors.name
                    ? 'border-rose-300 dark:border-rose-800/80 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-800/80 focus:border-indigo-500'
                }`}
                placeholder="John Doe"
                id="register-name"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-rose-500 font-semibold">{errors.name}</p>
            )}
          </div>

          {/* Email field */}
          <div className="space-y-1">
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
                className={`w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                  errors.email
                    ? 'border-rose-300 dark:border-rose-800/80 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-800/80 focus:border-indigo-500'
                }`}
                placeholder="you@example.com"
                id="register-email"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-500 font-semibold">{errors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Password
            </label>
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
                className={`w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                  errors.password
                    ? 'border-rose-300 dark:border-rose-800/80 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-800/80 focus:border-indigo-500'
                }`}
                placeholder="••••••••"
                id="register-password"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-rose-500 font-semibold">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password field */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 pointer-events-none">
                <FiLock className="w-5 h-5" />
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
                }}
                className={`w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                  errors.confirmPassword
                    ? 'border-rose-300 dark:border-rose-800/80 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-800/80 focus:border-indigo-500'
                }`}
                placeholder="••••••••"
                id="register-confirm-password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-rose-500 font-semibold">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-start space-x-2">
            <div className="flex items-center h-5 mt-0.5">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);
                  if (errors.termsAccepted) setErrors((prev) => ({ ...prev, termsAccepted: null }));
                }}
                className={`w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-900 ${
                  errors.termsAccepted ? 'border-rose-500' : ''
                }`}
              />
            </div>
            <div className="text-sm">
              <label htmlFor="terms" className="font-medium text-slate-600 dark:text-slate-400">
                I accept the <a href="#" className="text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold">Terms and Conditions</a>
              </label>
              {errors.termsAccepted && (
                <p className="text-xs text-rose-500 font-semibold mt-1">{errors.termsAccepted}</p>
              )}
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:opacity-95 transform active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 mt-2"
            id="btn-register-submit"
          >
            Create Account
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            id="link-to-login"
          >
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}
