import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ScanLine, 
  ChefHat, 
  CalendarDays, 
  ShoppingCart, 
  Layers, 
  BookOpen, 
  Users, 
  BarChart3, 
  Bell, 
  Settings, 
  HeartPulse, 
  ClipboardCheck, 
  Recycle, 
  Tag, 
  Trophy, 
  Home, 
  Sparkles, 
  Leaf 
} from 'lucide-react';
import { storage } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';

export default function Sidebar() {
  const stats = storage.getDashboardStats();
  const shoppingList = storage.getShoppingList();
  const unboughtCount = shoppingList.filter(i => !i.checked).length;
  const challenges = storage.getChallenges();
  const { t, language } = useLanguage();

  const navItems = [
    { name: t('navDashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('navProducts'), path: '/products', icon: Package, badge: stats.total_products > 0 ? stats.total_products : null },
    { name: t('navAddProduct'), path: '/products/add', icon: PlusCircle },
    { name: t('navScan'), path: '/scan', icon: ScanLine, highlight: true },
    { name: t('navRecipes'), path: '/recipes', icon: ChefHat },
    { name: t('navMealPlan'), path: '/meal-plan', icon: CalendarDays },
    { name: t('navShoppingList'), path: '/shopping-list', icon: ShoppingCart, badge: unboughtCount > 0 ? unboughtCount : null },
    { name: t('navFridgeMap'), path: '/fridge-map', icon: Layers },
    { name: t('navNutrition'), path: '/nutrition', icon: HeartPulse },
    { name: t('navAudit'), path: '/audit', icon: ClipboardCheck },
    { name: t('navPreservation'), path: '/preservation-guide', icon: BookOpen },
    { name: t('navCompost'), path: '/compost', icon: Recycle },
    { name: t('navDeals'), path: '/deals-radar', icon: Tag },
    { name: t('navChallenges'), path: '/challenges', icon: Trophy, badge: `Lvl ${challenges.level}` },
    { name: t('navHousehold'), path: '/household', icon: Home },
    { name: t('navCommunity'), path: '/community', icon: Users },
    { name: t('navAnalytics'), path: '/analytics', icon: BarChart3 },
    { name: t('navAlerts'), path: '/notifications', icon: Bell, badge: stats.urgent_products > 0 ? `${stats.urgent_products} urgent` : null, badgeColor: 'bg-rose-500' },
    { name: t('navSettings'), path: '/settings', icon: Settings }
  ];

  return (
    <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 flex flex-col justify-between shadow-sm z-20">
      {/* Brand Header */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/60 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-primary-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Leaf size={22} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                {t('brandName')}
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">AI</span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">{t('brandTagline')}</p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all group ${
                    isActive 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm border border-emerald-500/20' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`
                }
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="p-1 rounded-lg transition-colors group-hover:scale-105 flex-shrink-0">
                    <Icon size={17} />
                  </div>
                  <span className="truncate">{item.name}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    item.badgeColor 
                      ? `${item.badgeColor} text-white animate-bounce` 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.highlight && !item.badge && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex-shrink-0">
                    <Sparkles size={10} /> OCR
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sustainability Quick Card */}
      <div className="p-3.5 m-3 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800/80 dark:to-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 shadow-inner flex-shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            {language === 'ta' ? 'கழிவு பாதுகாப்பு' : 'Waste Guard'}
          </span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{stats.wasteScore}% {language === 'ta' ? 'மதிப்பெண்' : 'Score'}</span>
        </div>
        <div className="w-full bg-emerald-200 dark:bg-emerald-950 rounded-full h-1.5 overflow-hidden mb-1.5">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000"
            style={{ width: `${stats.wasteScore}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400">
          🌱 <strong className="text-slate-700 dark:text-slate-200">${stats.moneySaved}</strong> {language === 'ta' ? 'சேமிக்கப்பட்டது' : 'saved this month'}
        </p>
      </div>
    </aside>
  );
}
