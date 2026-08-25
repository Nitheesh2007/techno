import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { useLanguage } from '../context/LanguageContext';
import { 
  Bell, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  CheckCheck, 
  Trash2,
  Utensils,
  ChevronRight,
  Info,
  ShieldAlert,
  Flame,
  Check
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const { t, tf, tc, tl, language } = useLanguage();
  const navigate = useNavigate();

  const loadNotifications = () => {
    setNotifications(storage.getNotifications());
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = () => {
    storage.markAllNotificationsRead();
    sound.playSuccess();
    loadNotifications();
  };

  const handleToggleRead = (e, notif) => {
    e.stopPropagation();
    storage.markNotificationRead(notif.id);
    sound.playClick?.() || sound.playBeep(900, 0.03);
    loadNotifications();
  };

  const handleDeleteNotif = (e, id) => {
    e.stopPropagation();
    storage.deleteNotification(id);
    sound.playBeep(450, 0.04);
    loadNotifications();
  };

  const handleClearAll = () => {
    if (window.confirm(language === 'ta' ? 'அனைத்து அறிவிப்புகளையும் நீக்க விரும்புகிறீர்களா?' : 'Clear all notifications?')) {
      storage.clearAllNotifications();
      sound.playBeep(400, 0.05);
      loadNotifications();
    }
  };

  const handleNotificationClick = (notif) => {
    storage.markNotificationRead(notif.id);
    navigate('/products');
  };

  const filtered = notifications.filter(n => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'CRITICAL') return n.type === 'CRITICAL' || n.type === 'urgent';
    if (activeFilter === 'WARNING') return n.type === 'WARNING' || n.type === 'warning';
    if (activeFilter === 'EXPIRED') return n.type === 'EXPIRED' || n.type === 'expired';
    if (activeFilter === 'INFO') return n.type === 'INFO';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
              <Sparkles size={13} />
              <span>{t('notificationsTitle')}</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Bell className="text-emerald-600" size={32} />
              <span>{t('notificationsTitle')}</span>
              {unreadCount > 0 && (
                <span className="text-xs bg-rose-500 text-white font-extrabold px-2.5 py-0.5 rounded-full">
                  {unreadCount} {language === 'ta' ? 'புதியவை' : 'New'}
                </span>
              )}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'ta'
                ? '30, 14, 7, 3, 1 நாட்கள் மற்றும் காலாவதியாகும் உணவுகளின் நேரடி எச்சரிக்கை மையம்.'
                : 'Smart notifications tracking 30d, 14d, 7d, 3d, 1d, and expired food timeline intervals.'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center space-x-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all shadow-sm"
              >
                <CheckCheck size={15} className="text-emerald-500" />
                <span>{t('markAllRead')}</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center space-x-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 px-3.5 py-2 rounded-xl font-bold text-xs hover:bg-rose-100 transition-all"
              >
                <Trash2 size={15} />
                <span>{language === 'ta' ? 'அனைத்தையும் அழி' : 'Clear All'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 overflow-x-auto custom-scrollbar">
          {[
            { id: 'ALL', label: language === 'ta' ? 'அனைத்தும்' : 'All Alerts' },
            { id: 'CRITICAL', label: language === 'ta' ? '🚨 அவசரம் (1d/இன்று)' : '🚨 Critical (1d/Today)' },
            { id: 'WARNING', label: language === 'ta' ? '⏳ 3-7 நாட்கள்' : '⏳ 3-7 Days' },
            { id: 'INFO', label: language === 'ta' ? 'ℹ️ 14-30 நாட்கள்' : 'ℹ️ 14-30 Days' },
            { id: 'EXPIRED', label: language === 'ta' ? '⛔ காலாவதியானது' : '⛔ Expired' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="mx-auto text-slate-300 dark:text-slate-700 mb-3" size={48} />
              <h3 className="font-heading font-bold text-base text-slate-800 dark:text-white">
                {language === 'ta' ? 'எந்த எச்சரிக்கைகளும் இல்லை' : 'No Notifications'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                {language === 'ta' ? 'உங்கள் குளிர்சாதனப் பெட்டி உணவுகள் பாதுகாப்பாக உள்ளன!' : 'All food items in your inventory have healthy shelf life.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((n) => {
                const isCritical = n.type === 'CRITICAL' || n.type === 'urgent';
                const isExpired = n.type === 'EXPIRED' || n.type === 'expired';
                const isWarning = n.type === 'WARNING' || n.type === 'warning';

                return (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3.5 group ${
                      !n.read
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 shadow-sm'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                    }`}
                  >
                    <div className={`mt-0.5 p-2 rounded-xl flex-shrink-0 ${
                      isExpired ? 'bg-rose-100 text-rose-600 dark:bg-rose-950' :
                      isCritical ? 'bg-orange-100 text-orange-600 dark:bg-orange-950' :
                      isWarning ? 'bg-amber-100 text-amber-600 dark:bg-amber-950' :
                      'bg-blue-100 text-blue-600 dark:bg-blue-950'
                    }`}>
                      {isExpired ? <AlertTriangle size={18} /> :
                       isCritical ? <Flame size={18} /> :
                       isWarning ? <Clock size={18} /> : <Info size={18} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-emerald-600 transition-colors">
                          {tf(n.title)}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {tf(n.message)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-1 flex-shrink-0">
                      {!n.read && (
                        <button
                          onClick={(e) => handleToggleRead(e, n)}
                          className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-colors"
                          title="Mark as Read"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDeleteNotif(e, n.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
