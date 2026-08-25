import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { sound } from '../services/sound';
import { triggerConfetti } from '../services/confetti';
import { useLanguage } from '../context/LanguageContext';
import { 
  PackagePlus, 
  Sparkles, 
  Calendar, 
  Tag, 
  DollarSign, 
  MapPin, 
  FileText, 
  ArrowLeft,
  CheckCircle2,
  Bell,
  Clock,
  ScanLine
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  'Produce',
  'Dairy & Eggs',
  'Meat & Poultry',
  'Bakery',
  'Pantry',
  'Frozen',
  'Beverages',
  'Snacks',
  'General'
];

const LOCATIONS = [
  'Fridge Top Shelf',
  'Fridge Middle Shelf',
  'Fridge Bottom Shelf',
  'Fridge Crisper Drawer',
  'Fridge Door',
  'Freezer Basket',
  'Deep Freezer',
  'Bread Box',
  'Pantry Shelf 1',
  'Pantry Shelf 2'
];

export default function AddProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const scannedData = location.state?.scannedData || {};
  const { t, tf, tc, tl, language } = useLanguage();

  const getFutureDate = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const calculateAlertDate = (expiryStr, daysBefore) => {
    try {
      const exp = new Date(expiryStr);
      exp.setDate(exp.getDate() - Number(daysBefore));
      return exp.toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return '';
    }
  };

  const [formData, setFormData] = useState({
    product_name: scannedData.product_name || '',
    category: scannedData.category || 'Produce',
    expiry_date: scannedData.expiry_date || getFutureDate(5),
    reminder_days_before: 2,
    quantity: scannedData.quantity || 1,
    unit: scannedData.unit || 'pcs',
    estimated_price: scannedData.estimated_price || 3.99,
    location: scannedData.location || 'Fridge Crisper Drawer',
    notes: scannedData.notes || '',
    ocr_confidence: scannedData.ocr_confidence || 1.0,
    ownership: 'Shared'
  });

  const [loading, setLoading] = useState(false);

  const setPresetDays = (days) => {
    setFormData(prev => ({ ...prev, expiry_date: getFutureDate(days) }));
    sound.playBeep(850, 0.03);
  };

  const handleReminderSelect = (days) => {
    setFormData(prev => ({ ...prev, reminder_days_before: days }));
    sound.playBeep(920, 0.03);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.product_name || !formData.expiry_date) {
      alert(language === 'ta' ? 'தயவுசெய்து உணவின் பெயர் மற்றும் காலாவதி தேதியை உள்ளிடவும்.' : 'Please provide food name and expiry date');
      return;
    }

    setLoading(true);
    try {
      // Calculate target reminder alert date
      const expDate = new Date(formData.expiry_date);
      expDate.setDate(expDate.getDate() - Number(formData.reminder_days_before || 2));
      const reminderIso = expDate.toISOString().split('T')[0];

      await api.addProduct({
        ...formData,
        reminder_date: reminderIso
      });
      sound.playSuccess();
      triggerConfetti(2500);
      navigate('/products');
    } catch (err) {
      console.error(err);
      alert(language === 'ta' ? 'உணவைச் சேமிப்பதில் பிழை ஏற்பட்டது.' : 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const alertDateDisplay = calculateAlertDate(formData.expiry_date, formData.reminder_days_before);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>{language === 'ta' ? '← உணவுகளின் பட்டியலுக்கு திரும்பு' : '← Back to Inventory'}</span>
          </Link>

          <Link
            to="/scan"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 hover:scale-105 transition-all"
          >
            <ScanLine size={14} />
            <span>{language === 'ta' ? '📷 ஸ்மார்ட் OCR ஸ்கேனர்' : '📷 Smart OCR Scanner'}</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <Sparkles size={13} />
            <span>{t('addProductTitle')}</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <PackagePlus className="text-emerald-600" size={32} />
            {t('addProductTitle')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('addProductSub')}
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          {/* Row 1: Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                {t('productNameLabel')} *
              </label>
              <input
                type="text"
                required
                placeholder={t('productNamePlaceholder')}
                value={formData.product_name}
                onChange={e => setFormData({ ...formData, product_name: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                {t('categoryLabel')}
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{tc(cat)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Date Presets */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
              ⚡ {t('quickPresetsTitle')}
            </span>
            <div className="flex flex-wrap gap-2">
              {[2, 4, 7, 14, 30].map(days => (
                <button
                  type="button"
                  key={days}
                  onClick={() => setPresetDays(days)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 text-xs font-bold hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-all"
                >
                  {t('addDaysBtn', { days })}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Expiry Date, Quantity, Unit */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                {t('expiryDateLabel')} *
              </label>
              <input
                type="date"
                required
                value={formData.expiry_date}
                onChange={e => setFormData({ ...formData, expiry_date: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                {t('quantityLabel')}
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                {t('unitLabel')}
              </label>
              <input
                type="text"
                placeholder={t('unitPlaceholder')}
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* DEDICATED EXPIRY REMINDER ALERT PREFERENCE SECTION */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 dark:from-slate-850 dark:to-emerald-950/20 border-2 border-emerald-500/40 shadow-sm space-y-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                <Bell size={18} className="animate-bounce" />
              </div>
              <div>
                <h4 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">
                  {t('reminderHeading')}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('reminderQuestion')}
                </p>
              </div>
            </div>

            {/* Selectable Days Before Alert Options */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              {[
                { days: 1, label: t('reminder1Day') },
                { days: 2, label: t('reminder2Days'), popular: true },
                { days: 3, label: t('reminder3Days') },
                { days: 5, label: t('reminder5Days') },
                { days: 7, label: t('reminder7Days') }
              ].map((opt) => {
                const isSelected = formData.reminder_days_before === opt.days;
                return (
                  <button
                    key={opt.days}
                    type="button"
                    onClick={() => handleReminderSelect(opt.days)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-[1.03]'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-400'
                    }`}
                  >
                    <span className="text-lg font-heading font-extrabold">{opt.days} {language === 'ta' ? 'நாள்' : 'Day'}{opt.days > 1 && language !== 'ta' ? 's' : ''}</span>
                    <span className={`text-[10px] mt-0.5 font-semibold ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {opt.days === 2 ? '★ ' + (language === 'ta' ? 'பரிந்துரை' : 'Best') : (language === 'ta' ? 'முன்பு' : 'Before')}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Live Calculated Alert Date Notice */}
            <div className="mt-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {t('reminderWillAlertOn')}:
              </span>
              <span className="font-heading font-extrabold text-emerald-600 dark:text-emerald-400">
                🔔 {alertDateDisplay} ({formData.reminder_days_before} {language === 'ta' ? 'நாட்களுக்கு முன்' : 'days before expiry'})
              </span>
            </div>
          </div>

          {/* Row 3: Location & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                {t('locationLabel')}
              </label>
              <select
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{tl(loc)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                {t('estimatedPriceLabel')} ($)
              </label>
              <input
                type="number"
                step="0.10"
                value={formData.estimated_price}
                onChange={e => setFormData({ ...formData, estimated_price: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              {t('notesLabel')}
            </label>
            <input
              type="text"
              placeholder={t('notesPlaceholder')}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 flex items-center space-x-2"
            >
              <CheckCircle2 size={18} />
              <span>{loading ? (language === 'ta' ? 'சேமிக்கிறது...' : 'Saving...') : t('saveProductBtn')}</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
