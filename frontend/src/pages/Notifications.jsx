import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { 
  Bell, 
  CheckCheck, 
  AlertTriangle, 
  Clock, 
  ChefHat, 
  ArrowRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Notifications() {
  const [notifications, setNotifications] = useState(storage.getNotifications());
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  const loadNotifs = () => {
    setNotifications(storage.getNotifications());
  };

  useEffect(() => {
    loadNotifs();
  }, []);

  const handleMarkAllRead = () => {
    storage.markAllNotificationsRead();
    loadNotifs();
  };

  const handleItemClick = (notif) => {
    storage.markNotificationRead(notif.id);
    loadNotifs();
    navigate('/products');
  };

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'ALL') return true;
    if (filter === 'UNREAD') return !n.read;
    return n.type === filter;
  });

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
              <Sparkles size={13} />
              <span>Smart Alert Intelligence</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Bell className="text-emerald-600" size={32} />
              Alerts & Notifications
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Real-time expiration alerts and zero-waste action reminders.
            </p>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="flex items-center space-x-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all"
          >
            <CheckCheck size={16} className="text-emerald-500" />
            <span>Mark All as Read</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'ALL', label: 'All Alerts' },
            { id: 'UNREAD', label: 'Unread Only' },
            { id: 'urgent', label: 'Urgent Expiries' },
            { id: 'warning', label: 'Expiring Soon' },
            { id: 'expired', label: 'Expired' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-200 dark:border-slate-800">
              <Bell className="mx-auto text-slate-300 dark:text-slate-600 mb-4" size={40} />
              <p className="text-base font-heading font-bold text-slate-800 dark:text-white">
                No notifications found
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Your kitchen inventory is well managed!
              </p>
            </div>
          ) : (
            filteredNotifs.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                className={`p-5 rounded-3xl border cursor-pointer transition-all hover:shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !notif.read
                    ? 'bg-emerald-50/40 dark:bg-slate-800/80 border-emerald-300/50 dark:border-emerald-800/50'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`p-2.5 rounded-2xl flex-shrink-0 ${
                    notif.type === 'expired' ? 'bg-rose-100 text-rose-600 dark:bg-rose-950' :
                    notif.type === 'urgent' ? 'bg-amber-100 text-amber-600 dark:bg-amber-950' :
                    'bg-blue-100 text-blue-600 dark:bg-blue-950'
                  }`}>
                    {notif.type === 'expired' ? <AlertTriangle size={18} /> : <Clock size={18} />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-heading font-bold text-slate-900 dark:text-white text-sm">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {notif.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <Link
                    to="/recipes"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <ChefHat size={14} />
                    <span>Cook</span>
                  </Link>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    View Item <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
