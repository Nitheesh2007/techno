import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';
import { 
  HeartPulse, 
  Flame, 
  Dumbbell, 
  Wheat, 
  Droplets, 
  Sparkles, 
  Apple, 
  CheckCircle2, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';

export default function Nutrition() {
  const [products, setProducts] = useState([]);
  const { t, tf, tc, language } = useLanguage();

  useEffect(() => {
    setProducts(storage.getProducts());
  }, []);

  const totalCalories = products.reduce((sum, p) => sum + (p.calories || 250) * (p.quantity || 1), 0);
  const totalProtein = products.reduce((sum, p) => sum + (p.protein || 10) * (p.quantity || 1), 0);
  const totalCarbs = products.reduce((sum, p) => sum + (p.carbs || 20) * (p.quantity || 1), 0);
  const totalFat = products.reduce((sum, p) => sum + (p.fat || 5) * (p.quantity || 1), 0);
  const totalFiber = products.reduce((sum, p) => sum + (p.fiber || 2) * (p.quantity || 1), 0);

  const macroChartData = [
    { name: language === 'ta' ? 'புரதம் (Protein)' : 'Protein (g)', value: totalProtein, fill: '#10b981' },
    { name: language === 'ta' ? 'கார்போஹைட்ரேட் (Carbs)' : 'Carbs (g)', value: totalCarbs, fill: '#3b82f6' },
    { name: language === 'ta' ? 'கொழுப்பு (Fats)' : 'Healthy Fats (g)', value: totalFat, fill: '#f59e0b' },
    { name: language === 'ta' ? 'நார்ச்சத்து (Fiber)' : 'Fiber (g)', value: totalFiber, fill: '#8b5cf6' }
  ];

  const highProteinItems = [...products].sort((a, b) => (b.protein || 0) - (a.protein || 0)).slice(0, 4);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
              <Sparkles size={13} />
              <span>{t('nutritionTitle')}</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <HeartPulse className="text-emerald-600" size={32} />
              {t('nutritionTitle')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t('nutritionSub')}
            </p>
          </div>

          <Link
            to="/recipes"
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <Apple size={16} />
            <span>{language === 'ta' ? 'சமச்சீர் செய்முறை உருவாக்கு' : 'Generate Balanced Recipe'}</span>
          </Link>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
              <Flame size={18} />
            </div>
            <p className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">{totalCalories.toLocaleString()}</p>
            <p className="text-xs font-bold text-slate-400">{t('totalKcal')}</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
              <Dumbbell size={18} />
            </div>
            <p className="text-2xl font-heading font-extrabold text-emerald-600 dark:text-emerald-400">{totalProtein}g</p>
            <p className="text-xs font-bold text-slate-400">{t('totalProtein')}</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
              <Wheat size={18} />
            </div>
            <p className="text-2xl font-heading font-extrabold text-blue-600 dark:text-blue-400">{totalCarbs}g</p>
            <p className="text-xs font-bold text-slate-400">{t('totalCarbs')}</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-yellow-100 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400 flex items-center justify-center mb-2">
              <Droplets size={18} />
            </div>
            <p className="text-2xl font-heading font-extrabold text-yellow-600 dark:text-yellow-400">{totalFat}g</p>
            <p className="text-xs font-bold text-slate-400">{t('totalFats')}</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
              <Apple size={18} />
            </div>
            <p className="text-2xl font-heading font-extrabold text-purple-600 dark:text-purple-400">{totalFiber}g</p>
            <p className="text-xs font-bold text-slate-400">{t('totalFiber')}</p>
          </div>
        </div>

        {/* Charts & Top Protein Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Macro Distribution Donut (6 cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-1">
              {t('macroDistribution')}
            </h3>

            <div className="h-60 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {macroChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {macroChartData.map(m => (
                <div key={m.name} className="flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.fill }} />
                  <span className="font-bold">{m.name}:</span>
                  <span>{m.value}g</span>
                </div>
              ))}
            </div>
          </div>

          {/* High Protein Powerhouses (6 cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-1">
              {t('topNutrientDense')}
            </h3>

            {products.length === 0 ? (
              <p className="text-xs text-slate-400 p-8 text-center">{t('noItemsInInventory')}</p>
            ) : (
              <div className="space-y-3">
                {highProteinItems.map(item => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                        {tf(item.product_name)}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {tc(item.category)} • Qty: {item.quantity} {item.unit || ''}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                        {item.protein || 10}g {language === 'ta' ? 'புரதம்' : 'Protein'}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1">{item.calories || 200} kcal</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
