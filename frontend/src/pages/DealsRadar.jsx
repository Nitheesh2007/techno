import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { useLanguage } from '../context/LanguageContext';
import { 
  Tag, 
  Sparkles, 
  Plus, 
  ShoppingCart, 
  Store, 
  TrendingDown, 
  CheckCircle2, 
  Search,
  ExternalLink
} from 'lucide-react';

const DEALS = [
  {
    id: 'deal-1',
    item: 'Organic Hass Avocados (Bag of 4)',
    store: 'Aldi',
    originalPrice: 4.99,
    dealPrice: 2.49,
    discountPct: 50,
    category: 'Produce',
    type: 'Surplus Markdown',
    expiresInDays: 3,
    badgeColor: 'bg-rose-500'
  },
  {
    id: 'deal-2',
    item: 'Artisan Whole Wheat Sourdough',
    store: "Trader Joe's",
    originalPrice: 4.80,
    dealPrice: 2.99,
    discountPct: 38,
    category: 'Bakery',
    type: "Manager's Special",
    expiresInDays: 2,
    badgeColor: 'bg-amber-500'
  },
  {
    id: 'deal-3',
    item: 'Free-Range Organic Large Eggs (12pk)',
    store: 'Whole Foods Market',
    originalPrice: 6.49,
    dealPrice: 3.99,
    discountPct: 38,
    category: 'Dairy & Eggs',
    type: 'Weekly Eco Deal',
    expiresInDays: 14,
    badgeColor: 'bg-emerald-500'
  },
  {
    id: 'deal-4',
    item: 'Organic Baby Spinach Clamshell (16oz)',
    store: 'Walmart Supercenter',
    originalPrice: 5.20,
    dealPrice: 2.60,
    discountPct: 50,
    category: 'Produce',
    type: 'Rescue Discount',
    expiresInDays: 3,
    badgeColor: 'bg-rose-500'
  },
  {
    id: 'deal-5',
    item: 'Boneless Skinless Chicken Thighs (1kg)',
    store: 'Aldi',
    originalPrice: 8.90,
    dealPrice: 5.30,
    discountPct: 40,
    category: 'Meat & Poultry',
    type: 'Daily Fresh Markdown',
    expiresInDays: 2,
    badgeColor: 'bg-purple-500'
  }
];

export default function DealsRadar() {
  const [activeStore, setActiveStore] = useState('ALL');
  const [toastMsg, setToastMsg] = useState(null);
  const { t, tf, tc, language } = useLanguage();

  const handleAddDealToCart = (deal) => {
    storage.addShoppingItem({
      name: deal.item,
      category: deal.category,
      quantity: 1,
      unit: 'deal pack',
      estimatedPrice: deal.dealPrice,
      addedFrom: 'deals'
    });
    sound.playSuccess();
    setToastMsg(language === 'ta'
      ? `🛒 "${deal.item}" $${deal.dealPrice.toFixed(2)} (${deal.discountPct}% தள்ளுபடி) விலையில் ஷாப்பிங் பட்டியலில் சேர்க்கப்பட்டது!`
      : `🛒 Added "${deal.item}" at $${deal.dealPrice.toFixed(2)} (${deal.discountPct}% off) to your Shopping List!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredDeals = DEALS.filter(d => activeStore === 'ALL' || d.store === activeStore);

  return (
    <DashboardLayout>
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 size={20} className="text-emerald-200" />
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
              <Sparkles size={13} />
              <span>{t('dealsTitle')}</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Tag className="text-emerald-600" size={32} />
              {t('dealsTitle')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t('dealsSub')}
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6">
          {['ALL', 'Aldi', "Trader Joe's", 'Whole Foods Market', 'Walmart Supercenter'].map((store) => (
            <button
              key={store}
              onClick={() => setActiveStore(store)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                activeStore === store
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {store === 'ALL' ? t('allStoresTab') : store}
            </button>
          ))}
        </div>

        {/* Deals Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredDeals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-emerald-500/50 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {deal.store}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white ${deal.badgeColor}`}>
                    {deal.discountPct}% OFF
                  </span>
                </div>

                <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base">
                  {tf(deal.item)}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {tc(deal.category)} • {deal.type}
                </p>

                <div className="flex items-baseline space-x-2 my-4">
                  <span className="text-2xl font-heading font-extrabold text-emerald-600 dark:text-emerald-400">
                    ${deal.dealPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    ${deal.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600">
                    ({language === 'ta' ? 'சேமிப்பு' : 'Save'} ${(deal.originalPrice - deal.dealPrice).toFixed(2)})
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleAddDealToCart(deal)}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <ShoppingCart size={14} />
                <span>{t('addToShoppingListBtn')}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
