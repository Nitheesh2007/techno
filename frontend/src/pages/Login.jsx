import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Sparkles, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('demo@foodguardian.ai');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      // Fallback
      loginAsGuest();
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestDemo = () => {
    loginAsGuest();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 relative z-10">
        {/* Brand Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-primary-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/25">
            <Leaf size={28} />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
            Food Guardian AI
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Smart Expiry Tracking & Zero-Waste Culinary AI
          </p>
        </div>

        {/* 1-Click Demo Login Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-center">
          <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center justify-center gap-1.5 mb-2">
            <Sparkles size={14} className="text-emerald-500" />
            Instant Browser Demo Mode
          </p>
          <button
            type="button"
            onClick={handleGuestDemo}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <span>Explore Dashboard as Demo Guest</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            or sign in
          </span>
        </div>

        {error && <div className="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 p-3 rounded-xl mb-4 text-xs font-semibold">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Email Address
            </label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Password
            </label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold py-3 rounded-xl transition-all disabled:opacity-50 text-xs sm:text-sm shadow-md"
          >
            {isLoading ? 'Signing In...' : 'Sign In with Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account? <Link to="/register" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
