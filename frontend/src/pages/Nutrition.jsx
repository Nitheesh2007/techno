import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
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
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Link } from 'react-router-dom';

export default function Nutrition() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(storage.getProducts());
  }, []);

  // Compute aggregate macros
  const totalCalories = products.reduce((sum, p) => sum + (p.calories || 250) * (p.quantity || 1), 0);
  const totalProtein = products.reduce((sum, p) => sum + (p.protein || 10) * (p.quantity || 1), 0);
  const totalCarbs = products.reduce((sum, p) => sum + (p.carbs || 20) * (p.quantity || 1), 0);
  const totalFat = products.reduce((sum, p) => sum + (p.fat || 5) * (p.quantity || 1), 0);
  const totalFiber = products.reduce((sum, p) => sum + (p.fiber || 2) * (p.quantity || 1), 0);

  const macroChartData = [
    { name: 'Protein (g)', value: totalProtein, fill: '#10b981' },
    { name: 'Carbs (g)', value: totalCarbs, fill: '#3b82f6' },
    { name: 'Healthy Fats (g)', value: totalFat, fill: '#f59e0b' },
    { name: 'Fiber (g)', value: totalFiber, fill: '#8b5cf6' }
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
              <span>Nutrient & Caloric Intelligence</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <HeartPulse className="text-emerald-600" size={32} />
              Nutritional & Macro Horizon
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Live macro breakdown of your stocked food items and AI dietary balance advisor.
            </p>
          </div>

          <Link
            to="/recipes"
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <Apple size={16} />
            <span>Generate Balanced Recipe</span>
          </Link>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
              <Flame size={18} />
            </div>
            <p className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">{totalCalories.toLocaleString()}</p>
            <p className="text-xs font-bold text-slate-400">Total Stocked kcal</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Approx. {Math.round(totalCalories / 2000)} days of energy</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
              <Dumbbell size={18} />
            </div>
            <p className="text-2xl font-heading font-extrabold text-emerald-600 dark:text-emerald-400">{totalProtein}g</p>
            <p className="text-xs font-bold text-slate-400">Total Protein</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">High Quality Lean Sources</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
              <Wheat size={18} />
            </div>
            <p className="text-2xl font-heading font-extrabold text-blue-600 dark:text-blue-400">{totalCarbs}g</p>
            <p className="text-xs font-bold text-slate-400">Complex Carbs</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Grains, fruit & bakery</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-yellow-100 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400 flex items-center justify-center mb-2">
              <Droplets size={18} />
            </div>
            <p className="text-2xl font-heading font-extrabold text-yellow-600 dark:text-yellow-400">{totalFat}g</p>
            <p className="text-xs font-bold text-slate-400">Healthy Fats</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Dairy & natural oils</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
              <Apple size={18} />
            </div>
            <p className="text-2xl font-heading font-extrabold text-purple-600 dark:text-purple-400">{totalFiber}g</p>
            <p className="text-xs font-bold text-slate-400">Dietary Fiber</p>
            <p className="text-[10px] text-purple-600 font-semibold mt-0.5">Gut health promoter</p>
          </div>
        </div>

        {/* AI Dietitian Advisor Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-6 mb-8 shadow-xl shadow-emerald-700/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-white/20 text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
                AI Nutritional Assessment
              </span>
              <span className="text-emerald-200 text-xs font-semibold">✨ Balanced Kitchen</span>
            </div>
            <h2 className="text-xl font-heading font-bold">
              Your kitchen has excellent protein density ({totalProtein}g) and balanced healthy carbohydrates.
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm">
              💡 <em>Dietitian Recommendation:</em> Consider adding more high-fiber leafy greens or cruciferous vegetables (Broccoli, Kale) to boost daily fiber intake past 25g/day.
            </p>
          </div>

          <Link
            to="/shopping-list"
            className="bg-white text-slate-900 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md whitespace-nowrap hover:bg-slate-100 transition-colors"
          >
            Add Greens to Shopping List
          </Link>
        </div>

        {/* Charts & Top Protein Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Macro Distribution Donut (6 cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-1">
              Macro Proportion Distribution
            </h3>
            <p className="text-xs text-slate-400 mb-4">Ratio of protein, carbs, fats, and fiber</p>

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
              Top Nutrient-Dense Food in Stock
            </h3>
            <p className="text-xs text-slate-400 mb-4">Highest protein and micronutrient items</p>

            <div className="space-y-3">
              {highProteinItems.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                      {item.product_name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.category} • Qty: {item.quantity} {item.unit || ''}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                      {item.protein || 10}g Protein
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">{item.calories || 200} kcal</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
