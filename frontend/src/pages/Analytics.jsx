import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';
import { 
  BarChart3, 
  TrendingUp, 
  Leaf, 
  DollarSign, 
  Droplet, 
  Sparkles, 
  ArrowUpRight, 
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from 'recharts';

export default function Analytics() {
  const [savingsStats, setSavingsStats] = useState(storage.getSavingsStats());
  const [products, setProducts] = useState([]);
  const { t, tf, tc, tl, language } = useLanguage();

  useEffect(() => {
    setSavingsStats(storage.getSavingsStats());
    setProducts(storage.getProducts());
  }, []);

  const totalEstimatedValue = products.reduce((sum, p) => sum + (p.estimated_price || 3.5) * (p.quantity || 1), 0);
  const urgentValue = products.filter(p => p.status === 'URGENT').reduce((sum, p) => sum + (p.estimated_price || 3.5) * (p.quantity || 1), 0);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <Sparkles size={13} />
            <span>{t('analyticsTitle')}</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <BarChart3 className="text-emerald-600" size={32} />
            {t('analyticsTitle')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('analyticsSub')}
          </p>
        </div>

        {/* 4 Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('moneySaved')}</span>
              <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <DollarSign size={18} />
              </div>
            </div>
            <p className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              ${savingsStats.moneySaved}
            </p>
            <span className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp size={13} /> +18.4% {language === 'ta' ? 'கடந்த மாதம்' : 'vs last month'}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{language === 'ta' ? 'தடுக்கப்பட்ட CO₂' : 'CO₂ Offset'}</span>
              <div className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                <Leaf size={18} />
              </div>
            </div>
            <p className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              {savingsStats.co2PreventedKg} kg
            </p>
            <span className="text-xs text-slate-400 mt-1 block">{language === 'ta' ? 'பசுமை இல்ல வாயுக்கள் குறைக்கப்பட்டது' : 'Greenhouse gases avoided'}</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{language === 'ta' ? 'சேமிக்கப்பட்ட நீர்' : 'Virtual Water Saved'}</span>
              <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Droplet size={18} />
              </div>
            </div>
            <p className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              {(savingsStats.foodItemsSaved * 180).toLocaleString()} L
            </p>
            <span className="text-xs text-slate-400 mt-1 block">{language === 'ta' ? 'விவசாய நீர் சேமிக்கப்பட்டது' : 'Agricultural water saved'}</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">{language === 'ta' ? 'அபாயத்தில் உள்ள மதிப்பு' : 'Value at Risk'}</span>
              <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500">
                <AlertTriangle size={18} />
              </div>
            </div>
            <p className="text-3xl font-heading font-extrabold text-rose-500">
              ${urgentValue.toFixed(2)}
            </p>
            <span className="text-xs text-slate-400 mt-1 block">{products.filter(p => p.status === 'URGENT').length} {language === 'ta' ? 'அவசர உணவுகள்' : 'urgent items'}</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Monthly Savings Trend Chart (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-1">
              {t('monthlySavingsTrend')}
            </h3>
            <p className="text-xs text-slate-400 mb-6">{language === 'ta' ? 'உணவு சேமிப்பு மற்றும் கழிவு ஒப்பீடு' : 'Comparing prevented waste vs lost value over past 5 months'}</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={savingsStats.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="savedColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="wastedColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} />
                  <Area type="monotone" dataKey="saved" name={t('moneySavedArea')} stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#savedColor)" />
                  <Area type="monotone" dataKey="wasted" name={t('wastedArea')} stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#wastedColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Predictive Decay Risk Matrix (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-1">
                {t('decayRiskMatrix')}
              </h3>
              <p className="text-xs text-slate-400 mb-4">{language === 'ta' ? 'அடுக்கு வாழ்க்கை பாதுகாப்பு வழிமுறைகள்' : 'Category decay modeling & preservation safety rules'}</p>

              <div className="space-y-3">
                {[
                  { cat: 'Produce', risk: 'High Decay Risk', rate: '3-5 Days', advice: 'Store in humidity crisper drawer.' },
                  { cat: 'Dairy & Eggs', risk: 'Medium Risk', rate: '7-14 Days', advice: 'Keep on middle shelf, avoid door fluctuation.' },
                  { cat: 'Meat & Poultry', risk: 'Critical Risk', rate: '1-3 Days', advice: 'Freeze immediately if not cooking today.' },
                  { cat: 'Pantry Grains', risk: 'Low Risk', rate: '180+ Days', advice: 'Airtight container in cool cupboard.' }
                ].map(r => (
                  <div key={r.cat} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-heading font-bold text-slate-900 dark:text-white">{tc(r.cat)}</span>
                      <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">{r.rate}</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{r.advice}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
