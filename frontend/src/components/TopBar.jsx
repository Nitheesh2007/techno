import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  LogOut, 
  Moon, 
  Sun, 
  ScanLine, 
  Plus, 
  CheckCheck,
  AlertTriangle,
  Clock,
  Search,
  Languages
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import CommandPalette from './CommandPalette';

export default function TopBar() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark') || 
      localStorage.getItem('feg_theme') === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setNotifications(storage.getNotifications());

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('feg_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('feg_theme', 'light');
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'ta' : 'en';
    setLanguage(nextLang);
    sound.playClick?.() || sound.playBeep(900, 0.04);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    const updated = storage.markAllNotificationsRead();
    setNotifications(updated);
  };

  const handleNotifClick = (notif) => {
    storage.markNotificationRead(notif.id);
    setNotifications(storage.getNotifications());
    setNotifOpen(false);
    navigate('/products');
  };

  return (
    <>
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />

      <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-6 flex items-center justify-between">
        {/* Left: Quick Search Shortcut */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors"
          >
            <Search size={14} />
            <span className="hidden sm:inline">{t('searchPlaceholder')}</span>
            <kbd className="font-mono text-[10px] bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2.5">
          {/* Prominent Language Switcher */}
          <button
            onClick={toggleLanguage}
            title="Switch Language / மொழி மாற்றுக"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700 text-xs font-bold transition-all shadow-sm"
          >
            <Languages size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>{language === 'en' ? '🌐 English' : '🌐 தமிழ்'}</span>
          </button>

          {/* Quick Scan Action */}
          <Link
            to="/scan"
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-all hover:scale-105"
          >
            <ScanLine size={14} />
            <span>{t('quickScan')}</span>
          </Link>

          {/* Quick Add Action */}
          <Link
            to="/products/add"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all hover:scale-105"
          >
            <Plus size={14} />
            <span>{t('addItem')}</span>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>

          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 relative transition-colors"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-heading font-bold text-sm text-slate-800 dark:text-white">{t('alertsTitle')}</h4>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllRead} 
                      className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                    >
                      <CheckCheck size={13} /> {t('markAllRead')}
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-center text-xs text-slate-400">{t('noAlerts')}</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotifClick(n)}
                        className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                          !n.read ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`mt-0.5 p-1.5 rounded-lg ${
                            n.type === 'expired' ? 'bg-rose-100 text-rose-600 dark:bg-rose-950' :
                            n.type === 'urgent' ? 'bg-amber-100 text-amber-600 dark:bg-amber-950' :
                            'bg-blue-100 text-blue-600 dark:bg-blue-950'
                          }`}>
                            {n.type === 'expired' ? <AlertTriangle size={14} /> : <Clock size={14} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                              {n.title}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                              {n.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="px-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setNotifOpen(false)}
                    className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    {t('viewAllAlerts')}
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Badge & Logout */}
          <div className="flex items-center space-x-2 pl-3 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {user?.avatar || (user?.name ? user.name.charAt(0).toUpperCase() : 'A')}
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 hidden md:block">
              {user?.name || 'Alex Rivera'}
            </span>
            <button
              onClick={logout}
              title={t('signOut')}
              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
