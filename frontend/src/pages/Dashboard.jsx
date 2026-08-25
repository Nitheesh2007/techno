import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { triggerConfetti } from '../services/confetti';
import { useLanguage } from '../context/LanguageContext';
import { 
  Package, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Plus, 
  ScanLine, 
  CheckCircle2, 
  Utensils, 
  ChefHat, 
  TrendingUp,
  Leaf,
  DollarSign
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState(storage.getDashboardStats());
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [consumedItemName, setConsumedItemName] = useState(null);
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
      setStats(storage.getDashboardStats());
    } catch (e) {
      console.error(e);
      const local = storage.getProducts();
      setProducts(local);
      setStats(storage.getDashboardStats());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleConsume = async (id, name) => {
    try {
      await api.consumeProduct(id);
      sound.playSuccess();
      triggerConfetti(2500);
      setConsumedItemName(name);
      setTimeout(() => setConsumedItemName(null), 3500);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const urgentItems = products.filter(p => p.status === 'URGENT' || p.status === 'EXPIRING SOON');

  // Chart 1: Expiry Timeline Data
  const timelineData = [
    { name: t('statusSafe'), count: stats.safe_products, fill: '#10b981' },
    { name: t('statusSoon'), count: stats.expiring_soon, fill: '#f59e0b' },
    { name: t('statusUrgent'), count: stats.urgent_products, fill: '#f43f5e' },
    { name: t('statusExpired'), count: stats.expired_products, fill: '#64748b' }
  ];

  // Chart 2: Category Breakdown Data
  const categoryCounts = {};
  products.forEach(p => {
    const cat = p.category || (language === 'ta' ? 'பொதுவானது' : 'General');
    categoryCounts[cat] = (categoryCounts[cat] || 0) + (p.quantity || 1);
  });

  const categoryColors = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#14b8a6', '#6366f1'];
  const categoryData = Object.keys(categoryCounts).map((cat, idx) => ({
    name: cat,
    value: categoryCounts[cat],
    fill: categoryColors[idx % categoryColors.length]
  }));

  return (
    <DashboardLayout>
      {/* Consumed Toast Notification */}
      {consumedItemName && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 size={20} className="text-emerald-200" />
          <span className="text-sm font-semibold">
            {language === 'ta' 
              ? `🎉 சிறப்பு! "${consumedItemName}" சாப்பிட்டதாக குறிக்கப்பட்டது & தானாக ஷாப்பிங் பட்டியலில் சேர்க்கப்பட்டது!`
              : `🎉 Great! Logged "${consumedItemName}" as eaten & added to auto-restock!`}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <Sparkles size={13} />
            <span>{t('assistantActive')}</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('dashboardTitle')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('dashboardSub', { name: 'Alex' })}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Link
            to="/scan"
            className="flex items-center space-x-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-4 py-2.5 rounded-xl font-bold text-xs transition-all hover:scale-105 shadow-sm"
          >
            <ScanLine size={16} />
            <span>{t('quickScan')}</span>
          </Link>

          <Link
            to="/products/add"
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <Plus size={16} />
            <span>{t('addItem')}</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Card 1: Total Products */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('totalProducts')}</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Package size={20} />
            </div>
          </div>
          <p className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
            {stats.total_products}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">{t('trackedInInv')}</span>
        </div>

        {/* Card 2: Fresh & Safe */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{t('freshSafe')}</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="text-3xl font-heading font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats.safe_products}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">{t('goodShelfLife')}</span>
        </div>

        {/* Card 3: Expiring Soon */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">{t('expiringSoon')}</span>
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-3xl font-heading font-extrabold text-amber-500">
            {stats.expiring_soon}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">{t('next3Days')}</span>
        </div>

        {/* Card 4: Urgent & Expired */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">{t('urgentExpired')}</span>
            <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500">
              <AlertTriangle size={20} />
            </div>
          </div>
          <p className="text-3xl font-heading font-extrabold text-rose-500">
            {stats.urgent_products + stats.expired_products}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">{t('needsImmediate')}</span>
        </div>
      </div>

      {/* Empty Fresh State Banner if 0 products */}
      {products.length === 0 && (
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 dark:from-slate-900 dark:via-emerald-950/40 dark:to-slate-900 rounded-3xl p-8 sm:p-12 border border-emerald-200/80 dark:border-emerald-800/40 text-center mb-8 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            ✨
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
            {t('noItemsInInventory')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            {language === 'ta' 
              ? 'உங்கள் உணவுப் பாக்கெட்டுகளை ஸ்கேன் செய்யவும் அல்லது கைமுறையாகச் சேர்த்து அடுக்கு வாழ்க்கையைக் கண்காணிக்கவும்.'
              : 'Scan your food packages with OCR or manually add groceries to start smart tracking.'}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link
              to="/scan"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2"
            >
              <ScanLine size={16} />
              <span>{t('scanLabelBtn')}</span>
            </Link>

            <Link
              to="/products/add"
              className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold px-6 py-3 rounded-2xl text-xs shadow-sm hover:bg-slate-50 flex items-center gap-2"
            >
              <Plus size={16} />
              <span>{t('addNewProductBtn')}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Sustainability Impact Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl shadow-emerald-700/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="bg-white/20 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {t('ecoImpact')}
            </span>
            <span className="text-emerald-200 text-xs font-semibold">{t('sustainabilityMilestone')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold">
            {t('preventedBanner', { count: stats.foodItemsSaved })}
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm">
            {t('savedDetails', { saved: stats.moneySaved, co2: stats.co2PreventedKg })}
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
          <div className="text-center px-2">
            <p className="text-2xl font-heading font-extrabold">${stats.moneySaved}</p>
            <span className="text-[10px] uppercase font-bold text-emerald-100">{t('moneySaved')}</span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center px-2">
            <p className="text-2xl font-heading font-extrabold">{stats.wasteScore}%</p>
            <span className="text-[10px] uppercase font-bold text-emerald-100">{t('wasteFreeScore')}</span>
          </div>
        </div>
      </div>

      {/* Urgent Action List */}
      {urgentItems.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                {t('urgentHeading')} ({urgentItems.length})
              </h3>
            </div>
            <Link 
              to="/recipes"
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
            >
              <ChefHat size={14} />
              <span>{t('cookRecipeWithThese')} →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {urgentItems.map((item) => (
              <div 
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      {item.days_left <= 0 ? t('expiresToday') : item.days_left === 1 ? t('expiresTomorrow') : t('daysLeft', { days: item.days_left })}
                    </span>
                    <span className="text-xs text-slate-400">{item.location || 'Fridge'}</span>
                  </div>
                  <h4 className="font-heading font-bold text-slate-900 dark:text-white text-sm">
                    {item.product_name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Qty: {item.quantity} {item.unit || ''} • {item.category}
                  </p>
                </div>

                <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                  <button
                    onClick={() => handleConsume(item.id, item.product_name)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1"
                  >
                    <Utensils size={12} />
                    <span>{t('iAteThis')}</span>
                  </button>
                  <Link
                    to="/recipes"
                    className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold py-1.5 px-3 rounded-xl text-xs transition-colors"
                  >
                    {t('findRecipe')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Charts Grid */}
      {products.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Timeline Horizon Bar Chart (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-1">
              {t('expiryTimelineStatus')}
            </h3>
            <p className="text-xs text-slate-400 mb-6">{t('itemsByShelf')}</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} 
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown Donut (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-1">
                {t('categoryBreakdown')}
              </h3>
              <p className="text-xs text-slate-400 mb-4">{t('spreadAcrossDepts')}</p>

              <div className="h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {categoryData.slice(0, 4).map(c => (
                <div key={c.name} className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.fill }} />
                  <span>{c.name} ({c.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
