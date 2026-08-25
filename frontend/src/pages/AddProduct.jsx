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
  Barcode, 
  ArrowLeft,
  CheckCircle2
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

  const [formData, setFormData] = useState({
    product_name: scannedData.product_name || '',
    category: scannedData.category || 'Produce',
    expiry_date: scannedData.expiry_date || getFutureDate(5),
    quantity: scannedData.quantity || 1,
    unit: scannedData.unit || 'pcs',
    barcode: scannedData.barcode || '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.product_name || !formData.expiry_date) {
      alert(language === 'ta' ? 'தயவுசெய்து உணவின் பெயர் மற்றும் காலாவதி தேதியை உள்ளிடவும்.' : 'Please provide food name and expiry date');
      return;
    }

    setLoading(true);
    try {
      await api.addProduct(formData);
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

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Top Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>{language === 'ta' ? '← உணவுகளின் பட்டியலுக்கு திரும்பு' : '← Back to Inventory'}</span>
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

          {/* Row 2: Expiry Date & Quantity */}
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
                {t('estimatedPriceLabel')}
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
