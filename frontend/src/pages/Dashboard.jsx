import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { storage } from '../services/storage';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Plus, 
  ScanLine, 
  ChefHat, 
  CalendarDays, 
  DollarSign, 
  CheckCircle2, 
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(storage.getDashboardStats());
  const [products, setProducts] = useState(storage.getProducts());
  const [celebrateItem, setCelebrateItem] = useState(null);

  const reloadData = () => {
    setStats(storage.getDashboardStats());
    setProducts(storage.getProducts());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const urgentItems = products.filter(p => p.status === 'URGENT' || p.status === 'EXPIRED');

  const handleConsume = (id, name) => {
    api.consumeProduct(id);
    setCelebrateItem(name);
    setTimeout(() => setCelebrateItem(null), 3000);
    reloadData();
  };

  // Chart Data: Category Distribution
  const categoryCounts = {};
  products.forEach(p => {
    categoryCounts[p.category || 'Other'] = (categoryCounts[p.category || 'Other'] || 0) + 1;
  });
  const categoryChartData = Object.keys(categoryCounts).map(cat => ({
    name: cat,
    value: categoryCounts[cat]
  }));

  // Chart Data: Expiry Distribution
  const expiryDistData = [
    { label: 'Expired', count: stats.expired_products, fill: '#ef4444' },
    { label: 'Urgent (1-2d)', count: stats.urgent_products, fill: '#f97316' },
    { label: 'Soon (3-5d)', count: stats.expiring_soon, fill: '#f59e0b' },
    { label: 'Safe (6d+)', count: stats.safe_products, fill: '#10b981' },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#6366f1'];

  const savingsStats = storage.getSavingsStats();

  return (
    <DashboardLayout>
      {/* Toast Notification on Consume */}
      {celebrateItem && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 size={20} className="text-emerald-200" />
          <span className="text-sm font-semibold">🎉 Great job! Consumed "{celebrateItem}" and prevented waste!</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
            Kitchen Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, <strong className="text-slate-700 dark:text-slate-200">{user?.name || 'Guardian'}</strong>. Here is your real-time freshness summary.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/scan"
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <ScanLine size={18} />
            <span>Smart Scan Label</span>
          </Link>
          <Link
            to="/recipes"
            className="flex items-center space-x-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl font-semibold transition-colors"
          >
            <ChefHat size={18} className="text-emerald-500" />
            <span>Cook with AI</span>
          </Link>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={Package}
          title="Total Products"
          value={stats.total_products}
          subtext="Tracked in inventory"
          color="bg-blue-500"
          bgColor="bg-blue-50 dark:bg-blue-950/40"
          textColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          icon={ShieldCheck}
          title="Fresh & Safe"
          value={stats.safe_products}
          subtext="Good shelf life"
          color="bg-emerald-500"
          bgColor="bg-emerald-50 dark:bg-emerald-950/40"
          textColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          icon={Clock}
          title="Expiring Soon"
          value={stats.expiring_soon}
          subtext="Next 3 days"
          color="bg-amber-500"
          bgColor="bg-amber-50 dark:bg-amber-950/40"
          textColor="text-amber-600 dark:text-amber-400"
        />
        <StatCard
          icon={AlertTriangle}
          title="Urgent / Expired"
          value={stats.urgent_products + stats.expired_products}
          subtext="Needs immediate use"
          color="bg-rose-500"
          bgColor="bg-rose-50 dark:bg-rose-950/40"
          textColor="text-rose-600 dark:text-rose-400"
          urgent={stats.urgent_products > 0}
        />
      </div>

      {/* Impact / Savings Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-6 mb-8 shadow-xl shadow-emerald-700/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="bg-white/20 text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
              Sustainability Milestone
            </span>
            <span className="text-emerald-200 text-xs font-semibold">🌱 Eco Impact</span>
          </div>
          <h2 className="text-2xl font-heading font-bold">
            You've prevented {stats.foodItemsSaved} food items from being wasted!
          </h2>
          <p className="text-emerald-100 text-sm">
            Saved approximately <strong className="text-white">${stats.moneySaved}</strong> and reduced <strong>{stats.co2PreventedKg} kg</strong> of greenhouse gas emissions.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <p className="text-3xl font-heading font-extrabold">${stats.moneySaved}</p>
            <p className="text-xs text-emerald-100 mt-0.5">Money Saved</p>
          </div>
          <div className="text-center px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <p className="text-3xl font-heading font-extrabold">{stats.wasteScore}%</p>
            <p className="text-xs text-emerald-100 mt-0.5">Waste-Free Score</p>
          </div>
        </div>
      </div>

      {/* Urgent Attention Items Section */}
      {urgentItems.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
              <AlertTriangle className="text-rose-500" size={20} />
              Urgent Items Needing Cooking / Attention
            </h3>
            <Link to="/recipes" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
              Cook Recipe with These <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {urgentItems.map(item => (
              <div 
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-rose-200 dark:border-rose-900/40 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      {item.days_left <= 0 ? 'Expires TODAY' : `Expires in ${item.days_left} day`}
                    </span>
                    <span className="text-xs text-slate-400">{item.category}</span>
                  </div>
                  <h4 className="font-heading font-bold text-slate-900 dark:text-white text-base">
                    {item.product_name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Qty: {item.quantity} {item.unit || ''} • Location: {item.location || 'Fridge'}
                  </p>
                </div>

                <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleConsume(item.id, item.product_name)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={14} />
                    <span>I Ate / Used This</span>
                  </button>
                  <button
                    onClick={() => navigate('/recipes')}
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1"
                    title="Find Recipe"
                  >
                    <ChefHat size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Expiry Risk Horizon */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-800 dark:text-white">Expiry Timeline Status</h3>
              <p className="text-xs text-slate-400">Items categorized by shelf life</p>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{stats.total_products} items</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expiryDistData}>
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} 
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {expiryDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-800 dark:text-white">Food Category Breakdown</h3>
              <p className="text-xs text-slate-400">Inventory spread across departments</p>
            </div>
            <Link to="/products" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
              View All →
            </Link>
          </div>
          <div className="h-64 flex items-center justify-center">
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400">No items available</p>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {categoryChartData.map((cat, idx) => (
              <div key={cat.name} className="flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span>{cat.name} ({cat.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon: Icon, title, value, subtext, color, bgColor, textColor, urgent }) {
  return (
    <div className={`p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden transition-all hover:shadow-md ${urgent ? 'ring-2 ring-rose-500/50' : ''}`}>
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-2xl ${bgColor} ${textColor}`}>
          <Icon size={22} />
        </div>
        {urgent && (
          <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 rounded-full animate-pulse">
            Action Needed
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">{value}</p>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">{title}</p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{subtext}</p>
      </div>
    </div>
  );
}
