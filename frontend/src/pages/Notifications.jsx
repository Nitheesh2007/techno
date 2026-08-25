import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';
import { 
  Bell, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  CheckCheck, 
  Trash2,
  Utensils
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
    loadNotifications();
  };

  const handleNotificationClick = (notif) => {
    storage.markNotificationRead(notif.id);
    navigate('/products');
  };

  const filtered = notifications.filter(n => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'URGENT') return n.type === 'urgent';
    if (activeFilter === 'WARNING') return n.type === 'warning';
    if (activeFilter === 'EXPIRED') return n.type === 'expired';
    return true;
  });

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
              <Sparkles size={13} />
              <span>{t('notificationsTitle')}</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Bell className="text-emerald-600" size={32} />
              {t('notificationsTitle')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t('notificationsSub')}
            </p>
          </div>

          {notifications.some(n => !n.read) && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center space-x-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all shadow-sm"
            >
              <CheckCheck size={16} className="text-emerald-500" />
              <span>{t('markAllRead')}</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 max-w-md">
          {[
            { id: 'ALL', label: t('allAlertsTab') },
            { id: 'URGENT', label: t('urgentAlertsTab') },
            { id: 'WARNING', label: t('warningAlertsTab') },
            { id: 'EXPIRED', label: t('expiredAlertsTab') }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
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
            <div className="text-center py-12">
              <Bell className="mx-auto text-slate-300 dark:text-slate-700 mb-3" size={44} />
              <p className="text-xs text-slate-400 max-w-sm mx-auto">{t('noAlerts')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3.5 ${
                    !n.read
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 shadow-sm'
                      : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className={`mt-0.5 p-2 rounded-xl ${
                    n.type === 'expired' ? 'bg-rose-100 text-rose-600 dark:bg-rose-950' :
                    n.type === 'urgent' ? 'bg-amber-100 text-amber-600 dark:bg-amber-950' :
                    'bg-blue-100 text-blue-600 dark:bg-blue-950'
                  }`}>
                    {n.type === 'expired' ? <AlertTriangle size={18} /> : <Clock size={18} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white truncate">
                        {tf(n.title)}
                      </h4>
                      <span className="text-[10px] text-slate-400">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {tf(n.message)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
