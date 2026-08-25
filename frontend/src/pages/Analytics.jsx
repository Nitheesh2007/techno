import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Leaf, 
  Droplet, 
  Sparkles, 
  ShieldCheck,
  AlertTriangle,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  CartesianGrid 
} from 'recharts';

export default function Analytics() {
  const stats = storage.getDashboardStats();
  const savings = storage.getSavingsStats();
  const products = storage.getProducts();

  const monthlyData = savings.history || [
    { month: 'Apr', saved: 95, wasted: 18 },
    { month: 'May', saved: 120, wasted: 12 },
    { month: 'Jun', saved: 135, wasted: 10 },
    { month: 'Jul', saved: 142, wasted: 8 },
    { month: 'Aug', saved: 148.75, wasted: 6 }
  ];

  // Category Risk Analysis
  const categoryRisk = [
    { category: 'Produce', risk: 'High', avgShelfLife: '3-5 days', advice: 'Store in crisper with humidity control' },
    { category: 'Dairy & Eggs', risk: 'Medium', avgShelfLife: '7-14 days', advice: 'Keep on middle shelf, avoid fridge door' },
    { category: 'Bakery', risk: 'High', avgShelfLife: '3-4 days', advice: 'Freeze slices or use bread box' },
    { category: 'Meat & Poultry', risk: 'Critical', avgShelfLife: '1-2 days', advice: 'Cook immediately or deep freeze' },
    { category: 'Pantry', risk: 'Low', avgShelfLife: '6-12 months', advice: 'Keep dry, airtight, and away from sunlight' }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <Sparkles size={13} />
            <span>AI Waste Prediction & Impact Intelligence</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <BarChart3 className="text-emerald-600" size={32} />
            Sustainability & Waste Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your financial savings, carbon emission offsets, and predictive food risk metrics.
          </p>
        </div>

        {/* Impact Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <DollarSign size={22} />
            </div>
            <p className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">${stats.moneySaved}</p>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">Total Grocery Money Saved</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">+18% vs last month</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
              <Leaf size={22} />
            </div>
            <p className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">{stats.co2PreventedKg} kg</p>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">CO₂ Emissions Prevented</p>
            <p className="text-[11px] text-teal-600 font-semibold mt-0.5">Equivalent to planting 3 trees 🌲</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <Droplet size={22} />
            </div>
            <p className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">{stats.foodItemsSaved * 420} L</p>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">Virtual Water Saved</p>
            <p className="text-[11px] text-blue-600 font-semibold mt-0.5">From agriculture footprint</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <Award size={22} />
            </div>
            <p className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">{stats.wasteScore}%</p>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">Zero-Waste Score</p>
            <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Top 5% Eco Guardian</p>
          </div>
        </div>

        {/* Savings Trend Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                Monthly Savings & Waste Reduction Trend ($)
              </h3>
              <p className="text-xs text-slate-400">Comparing food saved vs food discarded</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full">
              Steady Improvement 📈
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
                <Area type="monotone" dataKey="saved" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Money Saved ($)" />
                <Area type="monotone" dataKey="wasted" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} name="Wasted Items ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Predictive Category Risk Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-2">
            Predictive Food Waste Risk Matrix
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            AI-modeled decay rates and actionable storage advice by category
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Waste Risk Level</th>
                  <th className="py-3 px-4">Avg. Shelf Life</th>
                  <th className="py-3 px-4">AI Storage Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {categoryRisk.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{item.category}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        item.risk === 'Critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                        item.risk === 'High' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                        item.risk === 'Medium' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {item.risk}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">{item.avgShelfLife}</td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{item.advice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
