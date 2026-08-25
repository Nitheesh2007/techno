import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { triggerConfetti } from '../services/confetti';
import { useLanguage } from '../context/LanguageContext';
import { 
  Package, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Utensils, 
  Filter, 
  RotateCcw,
  Sparkles,
  ScanLine,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('expiry_asc');
  const [toastMsg, setToastMsg] = useState(null);
  const { t, language } = useLanguage();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (e) {
      console.error(e);
      setProducts(storage.getProducts());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm(language === 'ta' ? 'இந்த உணவை அகற்ற விரும்புகிறீர்களா?' : 'Remove this food item from inventory?')) {
      await api.deleteProduct(id);
      sound.playBeep(400, 0.05);
      fetchProducts();
    }
  };

  const handleConsume = async (id, name) => {
    await api.consumeProduct(id);
    sound.playSuccess();
    triggerConfetti(2500);
    setToastMsg(language === 'ta' ? `🎉 "${name}" சாப்பிட்டதாக குறிக்கப்பட்டது!` : `🎉 Logged "${name}" as eaten!`);
    setTimeout(() => setToastMsg(null), 3000);
    fetchProducts();
  };

  const handleClearAll = () => {
    if (window.confirm(language === 'ta' ? 'அனைத்து உணவுகளையும் நீக்கி புத்தம் புதியதாகத் தொடங்க விரும்புகிறீர்களா?' : 'Clear all products and start 100% fresh?')) {
      storage.clearAllProducts();
      sound.playSuccess();
      setToastMsg(language === 'ta' ? '✨ சமையலறை புத்தம் புதியதாக மீட்டமைக்கப்பட்டது!' : '✨ Inventory cleared fresh!');
      setTimeout(() => setToastMsg(null), 3000);
      fetchProducts();
    }
  };

  const handleLoadSamples = () => {
    storage.loadSamplePresetData();
    sound.playSuccess();
    setToastMsg(language === 'ta' ? '📦 மாதிரி உணவுகள் ஏற்றப்பட்டன!' : '📦 Sample groceries loaded!');
    setTimeout(() => setToastMsg(null), 3000);
    fetchProducts();
  };

  // Filter & Search Logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.location && p.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'expiry_asc') return new Date(a.expiry_date) - new Date(b.expiry_date);
    if (sortBy === 'expiry_desc') return new Date(b.expiry_date) - new Date(a.expiry_date);
    if (sortBy === 'name_asc') return a.product_name.localeCompare(b.product_name);
    return 0;
  });

  return (
    <DashboardLayout>
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 size={20} className="text-emerald-200" />
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <Sparkles size={13} />
            <span>{t('inventoryTitle')}</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('inventoryTitle')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('inventorySub')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {products.length > 0 && (
            <button
              onClick={handleClearAll}
              className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 font-bold px-3.5 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={14} />
              <span>{language === 'ta' ? 'அனைத்தையும் அழி' : 'Clear All'}</span>
            </button>
          )}

          {products.length === 0 && (
            <button
              onClick={handleLoadSamples}
              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-bold px-3.5 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5"
            >
              <RotateCcw size={14} />
              <span>{t('resetSamples')}</span>
            </button>
          )}

          <Link
            to="/scan"
            className="flex items-center space-x-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm hover:scale-105"
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

      {/* Filter and Search Bar Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder={t('searchProductsPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: t('allTab') },
            { id: 'URGENT', label: t('urgentTab'), color: 'text-rose-500' },
            { id: 'EXPIRING SOON', label: t('soonTab'), color: 'text-amber-500' },
            { id: 'SAFE', label: t('safeTab'), color: 'text-emerald-500' },
            { id: 'EXPIRED', label: t('expiredTab'), color: 'text-slate-400' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 w-full md:w-auto justify-end">
          <span className="font-semibold">{t('sortBy')}</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none"
          >
            <option value="expiry_asc">{t('sortExpiryAsc')}</option>
            <option value="expiry_desc">{t('sortExpiryDesc')}</option>
            <option value="name_asc">{t('sortNameAsc')}</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">{language === 'ta' ? 'ஏற்றுகிறது...' : 'Loading food inventory...'}</div>
        ) : sortedProducts.length === 0 ? (
          <div className="p-16 text-center">
            <Package className="mx-auto text-slate-300 dark:text-slate-700 mb-3" size={48} />
            <h3 className="font-heading font-bold text-base text-slate-800 dark:text-white">
              {t('noProductsFound')}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {t('noProductsSub')}
            </p>
            <div className="flex justify-center gap-3 mt-5">
              <Link
                to="/scan"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-sm flex items-center gap-1.5"
              >
                <ScanLine size={14} />
                <span>{t('scanLabelBtn')}</span>
              </Link>
              <Link
                to="/products/add"
                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>{t('addNewProductBtn')}</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">{t('productDetailsTh')}</th>
                  <th className="px-6 py-4">{t('categoryTh')}</th>
                  <th className="px-6 py-4">{t('expiryDateTh')}</th>
                  <th className="px-6 py-4">{t('statusTh')}</th>
                  <th className="px-6 py-4 text-right">{t('actionsTh')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sortedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                          {p.product_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                            {p.product_name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Qty: {p.quantity} {p.unit || ''} • {p.location || 'Fridge'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[11px]">
                        {p.category || 'General'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{p.expiry_date}</p>
                      <p className="text-[11px] text-slate-400">
                        {p.days_left < 0 ? `${Math.abs(p.days_left)}d ago` : p.days_left === 0 ? 'Today' : `${p.days_left}d left`}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] uppercase tracking-wider ${
                        p.status === 'SAFE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                        p.status === 'EXPIRING SOON' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                        p.status === 'URGENT' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                        'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {p.status === 'SAFE' ? t('statusSafe') :
                         p.status === 'EXPIRING SOON' ? t('statusSoon') :
                         p.status === 'URGENT' ? t('statusUrgent') : t('statusExpired')}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleConsume(p.id, p.product_name)}
                          title={t('iAteThis')}
                          className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-600 dark:text-emerald-400 transition-colors"
                        >
                          <Utensils size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          title="Delete"
                          className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
