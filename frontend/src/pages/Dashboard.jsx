import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { triggerConfetti } from '../services/confetti';
import { useLanguage } from '../context/LanguageContext';
import { getWasteRecommendation, calculateWasteRiskScore } from '../utils/statusEngine';
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
  DollarSign,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Layers,
  ShoppingCart,
  BookOpen,
  Bell,
  ArrowRight,
  Zap,
  Globe,
  HeartPulse,
  ClipboardCheck,
  Recycle,
  Tag,
  Trophy,
  Home,
  Users,
  BarChart3,
  Settings,
  Bot,
  CalendarDays,
  FileText,
  Activity,
  ShieldCheck,
  Flame,
  Archive,
  Trash2
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
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [consumedItemName, setConsumedItemName] = useState(null);
  const [guideExpanded, setGuideExpanded] = useState(false);
  const [modulesTab, setModulesTab] = useState('ALL');
  const { t, tf, tc, tl, language } = useLanguage();
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
      setStats(storage.getDashboardStats());
      setActivityLogs(storage.getActivityLogs());
    } catch (e) {
      console.error(e);
      const local = storage.getProducts();
      setProducts(local);
      setStats(storage.getDashboardStats());
      setActivityLogs(storage.getActivityLogs());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleConsume = async (id, name) => {
    try {
      storage.markAsConsumed(id);
      sound.playSuccess();
      triggerConfetti(2500);
      setConsumedItemName(name);
      setTimeout(() => setConsumedItemName(null), 3500);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const urgentItems = products.filter(p => p.status === 'CRITICAL' || p.status === 'EXPIRING SOON' || p.status === 'URGENT');
  const highRiskItems = products
    .filter(p => calculateWasteRiskScore(p) > 50)
    .sort((a, b) => calculateWasteRiskScore(b) - calculateWasteRiskScore(a))
    .slice(0, 3);

  // Chart 1: Expiry Timeline Data
  const timelineData = [
    { name: t('statusSafe'), count: stats.safe_products, fill: '#10b981' },
    { name: t('statusSoon'), count: stats.expiring_soon, fill: '#f59e0b' },
    { name: t('statusUrgent'), count: stats.critical_products || 0, fill: '#f97316' },
    { name: t('statusExpired'), count: stats.expired_products, fill: '#ef4444' }
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
              ? `🎉 சிறப்பு! "${consumedItemName}" சாப்பிட்டதாக குறிக்கப்பட்டது & சேமிப்பில் சேர்க்கப்பட்டது!`
              : `🎉 Great! Logged "${consumedItemName}" as eaten & recorded in waste prevention!`}
          </span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <Sparkles size={13} />
            <span>{t('assistantActive')}</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('dashboardTitle')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'ta' 
              ? 'உங்கள் ஸ்மார்ட் சமையலறை மற்றும் உணவுக் கழிவு தடுப்பு டாஷ்போர்டு.'
              : 'Real-time kitchen inventory, shelf-life monitoring, and zero-waste analytics.'}
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

      {/* QUICK ACTIONS DOCK */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex items-center justify-between overflow-x-auto gap-3 custom-scrollbar">
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 pl-2 flex-shrink-0 flex items-center gap-1.5">
          <Zap size={14} className="text-amber-500" />
          {language === 'ta' ? 'விரைவு செயல்கள்' : 'Quick Actions'}:
        </span>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Link to="/products/add" className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold transition-all flex items-center gap-1.5">
            <Plus size={14} /> <span>{language === 'ta' ? 'உணவு சேர்' : 'Add Food'}</span>
          </Link>
          <Link to="/scan" className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 hover:bg-teal-100 text-xs font-bold transition-all flex items-center gap-1.5">
            <ScanLine size={14} /> <span>{language === 'ta' ? 'ஸ்கேன் செய்' : 'Scan Food'}</span>
          </Link>
          <Link to="/calendar" className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-bold transition-all flex items-center gap-1.5">
            <CalendarDays size={14} /> <span>{language === 'ta' ? 'நாட்காட்டி' : 'Expiry Calendar'}</span>
          </Link>
          <Link to="/recipes" className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 text-xs font-bold transition-all flex items-center gap-1.5">
            <ChefHat size={14} /> <span>{language === 'ta' ? 'AI செய்முறை' : 'AI Recipes'}</span>
          </Link>
          <Link to="/analytics" className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 text-xs font-bold transition-all flex items-center gap-1.5">
            <BarChart3 size={14} /> <span>{language === 'ta' ? 'பகுப்பாய்வு' : 'Analytics'}</span>
          </Link>
          <Link to="/reports" className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-xs font-bold transition-all flex items-center gap-1.5">
            <FileText size={14} /> <span>{language === 'ta' ? 'அறிக்கை' : 'Generate Report'}</span>
          </Link>
        </div>
      </div>

      {/* 8 COMPREHENSIVE SAAS KPI CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* KPI 1: Total Products */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('totalProducts')}</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Package size={18} />
            </div>
          </div>
          <p className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
            {stats.total_products}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {stats.total_quantity} {language === 'ta' ? 'மொத்த அலகுகள்' : 'total items in stock'}
          </span>
        </div>

        {/* KPI 2: Safe Products */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{t('freshSafe')}</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={18} />
            </div>
          </div>
          <p className="text-2xl font-heading font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats.safe_products}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {language === 'ta' ? '> 30 நாட்கள் பாதுகாப்பு' : '> 30 days remaining'}
          </span>
        </div>

        {/* KPI 3: Expiring Soon */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">{t('expiringSoon')}</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
              <Clock size={18} />
            </div>
          </div>
          <p className="text-2xl font-heading font-extrabold text-amber-500">
            {stats.expiring_soon}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {language === 'ta' ? '7 முதல் 30 நாட்கள்' : '7 to 30 days left'}
          </span>
        </div>

        {/* KPI 4: Critical Products */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-orange-500 uppercase tracking-wider">
              {language === 'ta' ? 'அவசரம் (1-6 நாட்கள்)' : 'Critical (1-6d)'}
            </span>
            <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-500">
              <AlertTriangle size={18} />
            </div>
          </div>
          <p className="text-2xl font-heading font-extrabold text-orange-500">
            {stats.critical_products || 0}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {language === 'ta' ? 'உடனடி பயன்பாடு தேவை' : 'Needs priority cooking'}
          </span>
        </div>

        {/* KPI 5: Expired Products */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">
              {language === 'ta' ? 'காலாவதியானது' : 'Expired'}
            </span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500">
              <Trash2 size={18} />
            </div>
          </div>
          <p className="text-2xl font-heading font-extrabold text-rose-500">
            {stats.expired_products}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            ${stats.potential_waste_loss} {language === 'ta' ? 'இழப்பு மதிப்பு' : 'potential loss'}
          </span>
        </div>

        {/* KPI 6: Food Saved Value */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              {language === 'ta' ? 'சேமிக்கப்பட்ட மதிப்பு' : 'Waste Saved Value'}
            </span>
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="text-2xl font-heading font-extrabold text-teal-600 dark:text-teal-400">
            ${stats.moneySaved}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {stats.foodItemsSaved} {language === 'ta' ? 'உணவுகள் காப்பாற்றப்பட்டன' : 'meals preserved'}
          </span>
        </div>

        {/* KPI 7: Waste Free Score */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {language === 'ta' ? 'கழிவு தடுப்பு விகிதம்' : 'Waste-Free Efficiency'}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Leaf size={18} />
            </div>
          </div>
          <p className="text-2xl font-heading font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats.wasteScore}%
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {stats.co2PreventedKg} kg CO₂ {language === 'ta' ? 'தடுக்கப்பட்டது' : 'offset'}
          </span>
        </div>

        {/* KPI 8: Items Added This Month */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              {language === 'ta' ? 'இம்மாதம் சேர்க்கப்பட்டது' : 'Added This Month'}
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="text-2xl font-heading font-extrabold text-blue-600 dark:text-blue-400">
            {stats.addedThisMonth}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {language === 'ta' ? 'நடப்பு மாத பதிவுகள்' : 'active batch additions'}
          </span>
        </div>
      </div>

      {/* SMART WASTE PREVENTION RECOMMENDATIONS (USE FIRST / HIGH RISK) */}
      {highRiskItems.length > 0 && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-50 dark:from-slate-900 dark:via-amber-950/20 dark:to-slate-900 border border-amber-500/30 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Flame size={20} className="text-amber-500 animate-pulse" />
              <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white">
                {language === 'ta' ? '💡 முதலில் பயன்படுத்த வேண்டிய உணவுகள் (Use First)' : '💡 Smart Waste Risk: Consume First Recommendations'}
              </h3>
            </div>
            <Link to="/recipes" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
              <span>{language === 'ta' ? 'செய்முறைகளைக் காண்க' : 'Cook AI Recipes'} →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {highRiskItems.map(item => {
              const risk = calculateWasteRiskScore(item);
              const rec = getWasteRecommendation(item, language);
              return (
                <div key={item.id} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900/60 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{tf(item.product_name)}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        {risk}/100 Risk
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-300">{rec}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                    <span className="text-slate-400">EXP: {item.expiry_date}</span>
                    <button
                      onClick={() => handleConsume(item.id, item.product_name)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors"
                    >
                      {t('iAteThis')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* REAL RECENT ACTIVITY & URGENT ITEMS DUAL PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Left: Urgent Items (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white">
                  {t('urgentHeading')} ({urgentItems.length})
                </h3>
              </div>
              <Link to="/products" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                {language === 'ta' ? 'அனைத்தையும் பார் →' : 'View All Products →'}
              </Link>
            </div>

            {urgentItems.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                <ShieldCheck size={32} className="text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {language === 'ta' ? 'அவசர காலாவதியாகும் உணவுகள் ஏதுமில்லை!' : 'No urgent food items right now!'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'ta' ? 'உங்கள் சமையலறை பொருட்கள் உகந்த அடுக்கு வாழ்க்கையைக் கொண்டுள்ளன.' : 'All inventory items have healthy remaining shelf life.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                {urgentItems.slice(0, 5).map(item => (
                  <div key={item.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-emerald-400 transition-colors">
                    <div className="flex-1 min-w-0 pr-3">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">{tf(item.product_name)}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Qty: {item.quantity} {item.unit || ''} • {tl(item.location || 'Fridge')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        {item.days_left <= 0 ? t('expiresToday') : t('daysLeft', { days: item.days_left })}
                      </span>
                      <button
                        onClick={() => handleConsume(item.id, item.product_name)}
                        className="p-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                        title={t('iAteThis')}
                      >
                        <CheckCircle2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>{language === 'ta' ? 'அடுக்கு வாழ்க்கை நிலையை தினமும் சரிபார்க்கவும்' : 'Check daily to prevent spoilage'}</span>
            <Link to="/calendar" className="text-emerald-600 font-bold hover:underline">
              {language === 'ta' ? 'காலெண்டரில் காண்க' : 'Open Calendar'}
            </Link>
          </div>
        </div>

        {/* Right: Real Activity Logs (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Activity size={18} className="text-emerald-500" />
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white">
                  {language === 'ta' ? 'சமீபத்திய செயல்பாடுகள்' : 'Recent Activity Feed'}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{language === 'ta' ? 'நேரலை' : 'Live'}</span>
            </div>

            {activityLogs.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                <p className="text-xs text-slate-400">
                  {language === 'ta' ? 'செயல்பாடுகள் பதிவு செய்யப்படவில்லை.' : 'No activity logged yet. Add or scan food to start!'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                {activityLogs.slice(0, 6).map(act => (
                  <div key={act.id} className="flex items-start space-x-3 text-xs">
                    <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      act.type === 'ADDED' ? 'bg-emerald-500' :
                      act.type === 'CONSUMED' ? 'bg-teal-500' :
                      act.type === 'DISCARDED' ? 'bg-rose-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 dark:text-slate-200 font-semibold truncate">
                        {act.type}: {act.details?.name || 'Item'}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(act.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">{language === 'ta' ? 'அனைத்து மாற்றங்களும் சேமிக்கப்படுகின்றன' : 'All actions tracked locally'}</span>
            <Link to="/reports" className="text-emerald-600 font-bold hover:underline">
              {language === 'ta' ? 'அறிக்கைகள்' : 'Reports'}
            </Link>
          </div>
        </div>
      </div>

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
                  <span>{tc(c.name)} ({c.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
