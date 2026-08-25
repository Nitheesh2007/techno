import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { triggerConfetti } from '../services/confetti';
import { useLanguage } from '../context/LanguageContext';
import { 
  getStatusBadgeInfo, 
  calculateDaysRemaining, 
  getWasteRecommendation, 
  calculateWasteRiskScore,
  STATUS_TYPES 
} from '../utils/statusEngine';
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
  AlertCircle,
  Eye,
  Copy,
  Archive,
  Barcode as BarcodeIcon,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Flame,
  Calendar,
  DollarSign,
  MapPin,
  Tag,
  X,
  Check,
  Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  'All',
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

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('expiry_asc');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected Product for Details Modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const { t, tf, tc, tl, language } = useLanguage();

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

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm(language === 'ta' ? 'இந்த உணவை அகற்ற விரும்புகிறீர்களா?' : 'Remove this food item from inventory?')) {
      storage.deleteProduct(id);
      sound.playBeep(400, 0.05);
      showToast(language === 'ta' ? 'உணவு அகற்றப்பட்டது.' : 'Item removed from inventory.');
      if (selectedProduct?.id === id) setSelectedProduct(null);
      fetchProducts();
    }
  };

  const handleConsume = async (id, name) => {
    storage.markAsConsumed(id);
    sound.playSuccess();
    triggerConfetti(2500);
    showToast(language === 'ta' ? `🎉 "${name}" சாப்பிட்டதாக குறிக்கப்பட்டது & சேமிப்பில் சேர்க்கப்பட்டது!` : `🎉 Logged "${name}" as eaten!`);
    if (selectedProduct?.id === id) setSelectedProduct(null);
    fetchProducts();
  };

  const handleDiscard = (id, name) => {
    const reason = window.prompt(
      language === 'ta' ? 'கழிவாக அப்புறப்படுத்திய காரணம் என்ன?' : 'Reason for discarding?',
      'Past Expiry Date'
    );
    if (reason) {
      storage.markAsDiscarded(id, reason);
      sound.playBeep(350, 0.08);
      showToast(language === 'ta' ? `⚠️ "${name}" கழிவாக பதிவு செய்யப்பட்டது.` : `⚠️ Logged "${name}" as discarded.`);
      if (selectedProduct?.id === id) setSelectedProduct(null);
      fetchProducts();
    }
  };

  const handleDuplicate = (id) => {
    const dup = storage.duplicateProduct(id);
    if (dup) {
      sound.playSuccess();
      showToast(language === 'ta' ? 'உணவு நகலெடுக்கப்பட்டது!' : 'Product duplicated!');
      fetchProducts();
    }
  };

  const handleArchive = (id) => {
    storage.archiveProduct(id);
    sound.playBeep(700, 0.04);
    showToast(language === 'ta' ? 'உணவு காப்பகப்படுத்தப்பட்டது.' : 'Product archived.');
    if (selectedProduct?.id === id) setSelectedProduct(null);
    fetchProducts();
  };

  const handleCopyBarcode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    sound.playClick?.() || sound.playBeep(900, 0.03);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Filter & Search Logic
  const filteredProducts = products.filter((p) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      p.product_name.toLowerCase().includes(searchLower) ||
      (p.brand && p.brand.toLowerCase().includes(searchLower)) ||
      (p.barcode && p.barcode.toLowerCase().includes(searchLower)) ||
      (p.batch_number && p.batch_number.toLowerCase().includes(searchLower)) ||
      (p.category && p.category.toLowerCase().includes(searchLower)) ||
      (p.location && p.location.toLowerCase().includes(searchLower));

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'expiry_asc') return new Date(a.expiry_date) - new Date(b.expiry_date);
    if (sortBy === 'expiry_desc') return new Date(b.expiry_date) - new Date(a.expiry_date);
    if (sortBy === 'name_asc') return a.product_name.localeCompare(b.product_name);
    if (sortBy === 'qty_desc') return (Number(b.quantity) || 1) - (Number(a.quantity) || 1);
    if (sortBy === 'price_desc') return (Number(b.estimated_price) || 0) - (Number(a.estimated_price) || 0);
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <Sparkles size={13} />
            <span>{t('inventoryTitle')}</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Package className="text-emerald-600" size={32} />
            {t('inventoryTitle')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'ta'
              ? 'உங்கள் அனைத்து உணவுகளின் அடுக்கு வாழ்க்கை, சேமிப்பு இடம் மற்றும் பாதுகாப்பு நிலையை நிர்வகிக்கவும்.'
              : 'Manage food inventory, shelf-life monitoring, expiry tracking, and zero-waste actions.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
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
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 space-y-4">
        {/* Row 1: Search & View Modes */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder={language === 'ta' ? 'உணவு, பிராண்ட், பார்கோடு அல்லது இடம் தேடு...' : 'Search by name, brand, barcode, or location...'}
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{tc(c)}</option>
              ))}
            </select>

            {/* Sort selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none"
            >
              <option value="expiry_asc">{t('sortExpiryAsc')}</option>
              <option value="expiry_desc">{t('sortExpiryDesc')}</option>
              <option value="name_asc">{t('sortNameAsc')}</option>
              <option value="qty_desc">{language === 'ta' ? 'அளவு (அதிகம் முதல்)' : 'Quantity (High to Low)'}</option>
              <option value="price_desc">{language === 'ta' ? 'விலை (அதிகம் முதல்)' : 'Price (High to Low)'}</option>
            </select>

            {/* Table / Grid Toggle */}
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                title="Table View"
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                title="Card Grid View"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {[
            { id: 'ALL', label: t('allTab'), count: products.length },
            { id: STATUS_TYPES.SAFE, label: language === 'ta' ? 'பாதுகாப்பானது' : 'Safe', color: 'text-emerald-500' },
            { id: STATUS_TYPES.EXPIRING_SOON, label: language === 'ta' ? 'விரைவில் காலாவதி (7-30d)' : 'Expiring Soon (7-30d)', color: 'text-amber-500' },
            { id: STATUS_TYPES.CRITICAL, label: language === 'ta' ? 'அவசரம் (1-6d)' : 'Critical (1-6d)', color: 'text-orange-500' },
            { id: STATUS_TYPES.EXPIRED, label: language === 'ta' ? 'காலாவதியானது' : 'Expired', color: 'text-rose-500' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setStatusFilter(tab.id); setCurrentPage(1); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Inventory Content (Table or Grid) */}
      {loading ? (
        <div className="p-16 bg-white dark:bg-slate-900 rounded-3xl text-center text-xs text-slate-400">
          {language === 'ta' ? 'ஏற்றுகிறது...' : 'Loading food inventory...'}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="p-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center">
          <Package className="mx-auto text-slate-300 dark:text-slate-700 mb-3" size={48} />
          <h3 className="font-heading font-bold text-base text-slate-800 dark:text-white">
            {t('noProductsFound')}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {language === 'ta' ? 'பொருத்தமான உணவுகள் கிடைக்கவில்லை. புதிய உணவைச் சேர்க்கவும் அல்லது ஸ்கேன் செய்யவும்.' : 'No matching groceries found. Try resetting filters or adding new items.'}
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
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">{t('productDetailsTh')}</th>
                  <th className="px-6 py-4">{t('categoryTh')}</th>
                  <th className="px-6 py-4">{t('expiryDateTh')}</th>
                  <th className="px-6 py-4">{t('statusTh')}</th>
                  <th className="px-6 py-4">{language === 'ta' ? 'கழிவு ஆபத்து' : 'Waste Risk'}</th>
                  <th className="px-6 py-4 text-right">{t('actionsTh')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedProducts.map((p) => {
                  const badge = getStatusBadgeInfo(p.status, language);
                  const risk = calculateWasteRiskScore(p);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setSelectedProduct(p)}>
                          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                            {p.product_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-heading font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-600">
                              {tf(p.product_name)}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Qty: {p.quantity} {p.unit || ''} • {tl(p.location || 'Fridge')}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[11px]">
                          {tc(p.category || 'General')}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{p.expiry_date}</p>
                        <p className="text-[11px] text-slate-400">
                          {p.days_left < 0 ? `${Math.abs(p.days_left)}d ago` : p.days_left === 0 ? 'Today' : `${p.days_left}d left`}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] uppercase tracking-wider border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {badge.label}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${risk > 70 ? 'bg-rose-500' : risk > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${risk}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] font-bold text-slate-500">{risk}%</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setSelectedProduct(p)}
                            title="View Details"
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleConsume(p.id, p.product_name)}
                            title={t('iAteThis')}
                            className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-600 dark:text-emerald-400 transition-colors"
                          >
                            <Utensils size={15} />
                          </button>
                          <button
                            onClick={() => handleDuplicate(p.id)}
                            title="Duplicate"
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                          >
                            <Copy size={15} />
                          </button>
                          <button
                            onClick={() => handleArchive(p.id)}
                            title="Archive"
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                          >
                            <Archive size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            title="Delete"
                            className="p-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARD GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {paginatedProducts.map((p) => {
            const badge = getStatusBadgeInfo(p.status, language);
            const risk = calculateWasteRiskScore(p);
            return (
              <div
                key={p.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition-all hover:scale-[1.02] group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${badge.bg} ${badge.text} ${badge.border}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs font-bold text-slate-400">${p.estimated_price || 3.50}</span>
                  </div>

                  <h3 
                    onClick={() => setSelectedProduct(p)}
                    className="font-heading font-extrabold text-base text-slate-900 dark:text-white cursor-pointer group-hover:text-emerald-600 transition-colors"
                  >
                    {tf(p.product_name)}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Qty: {p.quantity} {p.unit || ''} • {tc(p.category)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin size={13} className="text-slate-400" />
                    <span>{tl(p.location || 'Fridge')}</span>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">EXP: {p.expiry_date}</span>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      {p.days_left < 0 ? `${Math.abs(p.days_left)}d ago` : p.days_left === 0 ? 'Expires Today' : `${p.days_left}d left`}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleConsume(p.id, p.product_name)}
                      title={t('iAteThis')}
                      className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    >
                      <Utensils size={14} />
                    </button>
                    <button
                      onClick={() => setSelectedProduct(p)}
                      title="Details"
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-400">
            {language === 'ta' ? `பக்கம் ${currentPage} / ${totalPages}` : `Page ${currentPage} of ${totalPages} (${sortedProducts.length} items)`}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-emerald-500 rounded-2xl text-white">
                  <Package size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                    {language === 'ta' ? 'உணவு விவரங்கள்' : 'Product Details Specification'}
                  </span>
                  <h2 className="font-heading font-extrabold text-xl">{tf(selectedProduct.product_name)}</h2>
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
              {/* Status & Recommendation Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">{language === 'ta' ? 'பாதுகாப்பு நிலை' : 'Expiry Status'}</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xl">{getStatusBadgeInfo(selectedProduct.status, language).icon}</span>
                    <span className="font-heading font-extrabold text-base text-slate-900 dark:text-white">
                      {getStatusBadgeInfo(selectedProduct.status, language).label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
                    {getWasteRecommendation(selectedProduct, language)}
                  </p>
                </div>

                <div className="text-center px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold uppercase text-slate-400">{language === 'ta' ? 'கழிவு ஆபத்து' : 'Waste Risk'}</span>
                  <p className="text-2xl font-heading font-extrabold text-amber-500">
                    {calculateWasteRiskScore(selectedProduct)}/100
                  </p>
                </div>
              </div>

              {/* Grid Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block">{language === 'ta' ? 'வகை' : 'Category'}</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{tc(selectedProduct.category)}</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block">{language === 'ta' ? 'அளவு' : 'Quantity'}</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{selectedProduct.quantity} {selectedProduct.unit || 'pcs'}</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block">{language === 'ta' ? 'சேமிப்பு இடம்' : 'Location'}</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{tl(selectedProduct.location || 'Fridge')}</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block">{language === 'ta' ? 'காலாவதி தேதி' : 'Expiry Date'}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">{selectedProduct.expiry_date}</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block">{language === 'ta' ? 'மதிப்பீட்டு விலை' : 'Estimated Price'}</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">${selectedProduct.estimated_price || 3.50}</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block">{language === 'ta' ? 'உரிமை' : 'Ownership'}</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{selectedProduct.ownership || 'Shared'}</span>
                </div>
              </div>

              {/* Barcode & Extra Meta */}
              {selectedProduct.barcode && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <BarcodeIcon size={16} className="text-emerald-500" />
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedProduct.barcode}</span>
                  </div>
                  <button
                    onClick={() => handleCopyBarcode(selectedProduct.barcode)}
                    className="text-emerald-600 font-bold hover:underline"
                  >
                    {copiedCode ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
              )}

              {/* Notes */}
              {selectedProduct.notes && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                  <span className="text-slate-400 block mb-1">{language === 'ta' ? 'குறிப்புகள்' : 'Notes'}:</span>
                  <p className="text-slate-800 dark:text-slate-200">{selectedProduct.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="p-5 bg-slate-100 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDiscard(selectedProduct.id, selectedProduct.product_name)}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-100 transition-colors"
                >
                  {language === 'ta' ? 'கழிவாக குறி' : 'Mark Discarded'}
                </button>
                <button
                  onClick={() => handleDelete(selectedProduct.id)}
                  className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 transition-colors"
                >
                  {language === 'ta' ? 'நீக்கு' : 'Delete'}
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDuplicate(selectedProduct.id)}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs"
                >
                  {language === 'ta' ? 'நகலெடு' : 'Duplicate'}
                </button>
                <button
                  onClick={() => handleConsume(selectedProduct.id, selectedProduct.product_name)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                >
                  <Utensils size={14} />
                  <span>{t('iAteThis')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
