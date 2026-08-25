import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { useLanguage } from '../context/LanguageContext';
import { 
  getStatusBadgeInfo, 
  calculateDaysRemaining, 
  getWasteRecommendation,
  calculateWasteRiskScore,
  STATUS_TYPES 
} from '../utils/statusEngine';
import { 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Plus, 
  Filter, 
  Search, 
  Eye, 
  Package, 
  X, 
  Utensils, 
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DAYS_OF_WEEK_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_OF_WEEK_TA = ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'];

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTHS_TA = [
  'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்',
  'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedDayProducts, setSelectedDayProducts] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const { t, tf, tc, tl, language } = useLanguage();

  useEffect(() => {
    setProducts(storage.getProducts());
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    sound.playBeep(850, 0.03);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    sound.playBeep(850, 0.03);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    sound.playBeep(900, 0.04);
  };

  // Calendar matrix calculations
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const daysArray = [];

  // Previous month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    daysArray.push({
      dayNumber: daysInPrevMonth - i,
      monthType: 'prev',
      dateString: new Date(year, month - 1, daysInPrevMonth - i).toISOString().split('T')[0]
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    daysArray.push({
      dayNumber: i,
      monthType: 'current',
      dateString: dStr
    });
  }

  // Next month padding (to reach full 35 or 42 grid)
  const remaining = (7 - (daysArray.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    daysArray.push({
      dayNumber: i,
      monthType: 'next',
      dateString: new Date(year, month + 1, i).toISOString().split('T')[0]
    });
  }

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesSearch = !searchTerm || p.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Map products by exact expiry date
  const productsByDate = {};
  filteredProducts.forEach(p => {
    if (p.expiry_date) {
      if (!productsByDate[p.expiry_date]) productsByDate[p.expiry_date] = [];
      productsByDate[p.expiry_date].push(p);
    }
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const daysOfWeek = language === 'ta' ? DAYS_OF_WEEK_TA : DAYS_OF_WEEK_EN;
  const monthName = language === 'ta' ? MONTHS_TA[month] : MONTHS_EN[month];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
              <Sparkles size={13} />
              <span>{language === 'ta' ? 'காலாவதி நாட்காட்டி' : 'Expiry Calendar'}</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <CalendarDays className="text-emerald-600" size={32} />
              <span>{monthName} {year}</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'ta' 
                ? 'உங்கள் உணவுகளின் காலாவதி தேதிகளை மாதாந்திர நாட்காட்டியில் நேரடியாகப் பார்த்து முன்கூட்டியே திட்டமிடுங்கள்.' 
                : 'Track approaching food expiries across the month to plan meals and prevent waste.'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={prevMonth}
              className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-sm"
              title="Previous Month"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
            >
              {language === 'ta' ? 'இன்று' : 'Today'}
            </button>
            <button
              onClick={nextMonth}
              className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-sm"
              title="Next Month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder={language === 'ta' ? 'நாட்காட்டியில் உணவு தேடு...' : 'Search calendar items...'}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end text-xs">
            <span className="text-slate-400 font-bold">{language === 'ta' ? 'வகை' : 'Category'}:</span>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none font-semibold"
            >
              <option value="All">{language === 'ta' ? 'அனைத்து வகைகளும்' : 'All Categories'}</option>
              <option value="Produce">{tc('Produce')}</option>
              <option value="Dairy & Eggs">{tc('Dairy & Eggs')}</option>
              <option value="Meat & Poultry">{tc('Meat & Poultry')}</option>
              <option value="Bakery">{tc('Bakery')}</option>
              <option value="Pantry">{tc('Pantry')}</option>
            </select>
          </div>
        </div>

        {/* CALENDAR MATRIX GRID */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
          {/* Day Names Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-center text-xs font-extrabold uppercase tracking-wider text-slate-400 py-3">
            {daysOfWeek.map((day, idx) => (
              <div key={idx} className={idx === 0 || idx === 6 ? 'text-amber-500' : ''}>
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800">
            {daysArray.map((cell, idx) => {
              const cellItems = productsByDate[cell.dateString] || [];
              const isToday = cell.dateString === todayStr;
              const isCurrentMonth = cell.monthType === 'current';

              return (
                <div
                  key={idx}
                  onClick={() => cellItems.length > 0 && setSelectedDayProducts({ date: cell.dateString, items: cellItems })}
                  className={`min-h-[110px] p-2 sm:p-2.5 flex flex-col justify-between transition-colors ${
                    isCurrentMonth ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-950/40 text-slate-300 dark:text-slate-600'
                  } ${isToday ? 'ring-2 ring-emerald-500 ring-inset bg-emerald-50/20 dark:bg-emerald-950/20' : ''} ${
                    cellItems.length > 0 ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday ? 'bg-emerald-600 text-white font-extrabold shadow-sm' : isCurrentMonth ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>
                    {cellItems.length > 0 && (
                      <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {cellItems.length}
                      </span>
                    )}
                  </div>

                  {/* Food Expiry Chips on this Day */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {cellItems.slice(0, 2).map((item) => {
                      const badge = getStatusBadgeInfo(item.status, language);
                      return (
                        <div
                          key={item.id}
                          onClick={(e) => { e.stopPropagation(); setSelectedProduct(item); }}
                          className={`text-[10px] px-2 py-0.5 rounded-lg truncate font-bold flex items-center justify-between border ${badge.bg} ${badge.text} ${badge.border} hover:scale-105 transition-transform`}
                        >
                          <span className="truncate">{tf(item.product_name)}</span>
                        </div>
                      );
                    })}

                    {cellItems.length > 2 && (
                      <span className="text-[9px] font-bold text-slate-400 block text-right">
                        +{cellItems.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SELECTED PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-emerald-500 rounded-2xl text-white">
                  <Package size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                    {language === 'ta' ? 'காலாவதி விவரம்' : 'Expiry Schedule'}
                  </span>
                  <h3 className="font-heading font-extrabold text-base">{tf(selectedProduct.product_name)}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'ta' ? 'காலாவதி தேதி' : 'Expiry Date'}</span>
                  <span className="font-bold text-base text-emerald-600 dark:text-emerald-400 mt-0.5 block">{selectedProduct.expiry_date}</span>
                </div>
                <span className={`px-3 py-1 rounded-full font-extrabold text-[10px] uppercase border ${getStatusBadgeInfo(selectedProduct.status, language).bg} ${getStatusBadgeInfo(selectedProduct.status, language).text} ${getStatusBadgeInfo(selectedProduct.status, language).border}`}>
                  {getStatusBadgeInfo(selectedProduct.status, language).label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block">{language === 'ta' ? 'அளவு' : 'Quantity'}</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{selectedProduct.quantity} {selectedProduct.unit || 'pcs'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block">{language === 'ta' ? 'இடம்' : 'Location'}</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{tl(selectedProduct.location || 'Fridge')}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
                <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">
                  💡 {language === 'ta' ? 'பரிந்துரை' : 'Recommendation'}:
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {getWasteRecommendation(selectedProduct, language)}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-100 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs"
              >
                {language === 'ta' ? 'மூடு' : 'Close'}
              </button>
              <Link
                to="/recipes"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Utensils size={14} />
                <span>{language === 'ta' ? 'செய்முறை சமைக்க' : 'Find Recipes'}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
