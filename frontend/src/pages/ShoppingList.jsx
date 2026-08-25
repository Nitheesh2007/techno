import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { triggerConfetti } from '../services/confetti';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShoppingCart, 
  Plus, 
  Check, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  Share2, 
  CheckCircle2, 
  RefreshCw,
  DollarSign
} from 'lucide-react';

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

export default function ShoppingList() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Produce');
  const [newItemQty, setNewItemQty] = useState(1);
  const [toastMsg, setToastMsg] = useState(null);
  const { t, tf, tc, language } = useLanguage();

  const loadList = () => {
    setItems(storage.getShoppingList());
  };

  useEffect(() => {
    loadList();
  }, []);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    storage.addShoppingItem({
      name: newItemName.trim(),
      category: newItemCategory,
      quantity: newItemQty,
      unit: 'pcs',
      estimatedPrice: 2.99,
      addedFrom: 'manual'
    });

    setNewItemName('');
    sound.playBeep(920, 0.04);
    loadList();
  };

  const handleToggle = (id) => {
    storage.toggleShoppingItem(id);
    sound.playClick?.() || sound.playBeep(800, 0.03);
    loadList();
  };

  const handleDelete = (id) => {
    storage.deleteShoppingItem(id);
    sound.playBeep(450, 0.04);
    loadList();
  };

  const handleTransferToFridge = () => {
    const result = storage.transferCheckedToInventory();
    if (result.transferred > 0) {
      sound.playSuccess();
      triggerConfetti(3000);
      setToastMsg(language === 'ta'
        ? `🎉 ${result.transferred} வாங்கிய உணவுகள் தானாக உங்கள் குளிர்சாதனப் பெட்டியில் சேர்க்கப்பட்டன!`
        : `🎉 Transferred ${result.transferred} bought items into your Kitchen Inventory with calculated shelf-life!`);
      setTimeout(() => setToastMsg(null), 4000);
      loadList();
    } else {
      alert(language === 'ta' ? 'முதலில் நீங்கள் வாங்கிய பொருட்களை சரிபார்க்கவும் (Check items).' : 'Please check/tick the items you purchased first!');
    }
  };

  const handleShareWhatsApp = () => {
    const unbought = items.filter(i => !i.checked);
    const text = language === 'ta'
      ? `🛒 *உணவு பாதுகாவலன் - ஷாப்பிங் பட்டியல்:*\n` + unbought.map(i => `• ${i.name} (${i.quantity} ${i.unit || ''})`).join('\n')
      : `🛒 *Food Guardian AI - Shopping List:*\n` + unbought.map(i => `• ${i.name} (${i.quantity} ${i.unit || ''})`).join('\n');
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const totalBudget = items.reduce((sum, i) => sum + (i.estimatedPrice || 3) * (i.quantity || 1), 0);
  const checkedBudget = items.filter(i => i.checked).reduce((sum, i) => sum + (i.estimatedPrice || 3) * (i.quantity || 1), 0);

  return (
    <DashboardLayout>
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 size={20} className="text-emerald-200" />
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
              <Sparkles size={13} />
              <span>{t('autoRestockBadge')}</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <ShoppingCart className="text-emerald-600" size={32} />
              {t('shoppingTitle')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t('shoppingSub')}
            </p>
          </div>

          {/* Quick Sharing & Fridge Transfer */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center space-x-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all shadow-sm"
            >
              <Share2 size={15} className="text-emerald-500" />
              <span>{language === 'ta' ? 'பகிர்' : 'Share List'}</span>
            </button>

            <button
              onClick={handleTransferToFridge}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
            >
              <CheckCircle2 size={16} />
              <span>{t('transferBoughtBtn')}</span>
            </button>
          </div>
        </div>

        {/* Budget Tally Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-6">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase">{t('cartTotal')}</span>
              <p className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">${totalBudget.toFixed(2)}</p>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
            <div>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase">{language === 'ta' ? 'கார்ட்டில் உள்ளவை' : 'In Cart (Checked)'}</span>
              <p className="text-2xl font-heading font-extrabold text-emerald-600 dark:text-emerald-400">${checkedBudget.toFixed(2)}</p>
            </div>
          </div>

          <span className="text-xs text-slate-400">
            {items.filter(i => !i.checked).length} {t('unboughtItems')}
          </span>
        </div>

        {/* Add Item Form */}
        <form onSubmit={handleAddItem} className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder={t('itemNamePlaceholder')}
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            className="px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{tc(c)}</option>)}
          </select>

          <input
            type="number"
            min="1"
            value={newItemQty}
            onChange={(e) => setNewItemQty(Number(e.target.value))}
            className="w-16 px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none"
          />

          <button
            type="submit"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs shadow-sm transition-all flex items-center justify-center space-x-1.5"
          >
            <Plus size={16} />
            <span>{t('addItemToShop')}</span>
          </button>
        </form>

        {/* Shopping Items List */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto text-slate-300 dark:text-slate-700 mb-3" size={44} />
              <p className="text-xs text-slate-400 max-w-sm mx-auto">{t('noShopItems')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    item.checked
                      ? 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <button
                      onClick={() => handleToggle(item.id)}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                        item.checked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-emerald-500'
                      }`}
                    >
                      {item.checked && <Check size={14} />}
                    </button>

                    <div>
                      <p className={`font-heading font-bold text-sm ${item.checked ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                        {tf(item.name)}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {tc(item.category)} • Qty: {item.quantity} {item.unit || ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      ${((item.estimatedPrice || 3) * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
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
