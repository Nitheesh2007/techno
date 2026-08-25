import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { triggerConfetti } from '../services/confetti';
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  Check, 
  ArrowRight, 
  Sparkles, 
  DollarSign, 
  Share2, 
  Printer, 
  RotateCcw,
  CheckCircle2,
  PackagePlus,
  Layers
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
  'Snacks'
];

export default function ShoppingList() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Produce');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('pcs');
  const [newItemPrice, setNewItemPrice] = useState(3.50);
  const [toastMsg, setToastMsg] = useState(null);

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
      unit: newItemUnit,
      estimatedPrice: newItemPrice,
      addedFrom: 'manual'
    });

    setNewItemName('');
    sound.playBeep(980, 0.05);
    loadList();
  };

  const handleToggle = (id) => {
    storage.toggleShoppingItem(id);
    sound.playClick?.() || sound.playBeep(600, 0.04);
    loadList();
  };

  const handleDelete = (id) => {
    storage.deleteShoppingItem(id);
    loadList();
  };

  const handleTransferToInventory = () => {
    const res = storage.transferCheckedToInventory();
    if (res.transferred > 0) {
      sound.playSuccess();
      triggerConfetti(2500);
      setToastMsg(`🎉 Transferred ${res.transferred} bought items to your Food Inventory with auto-calculated expiry dates!`);
      setTimeout(() => setToastMsg(null), 4500);
      loadList();
    } else {
      alert('Please check off the items you bought before transferring to inventory.');
    }
  };

  const handleCopyFormatted = () => {
    const text = items.map(i => `${i.checked ? '✅' : '⬜'} ${i.name} (${i.quantity} ${i.unit}) - $${i.estimatedPrice.toFixed(2)}`).join('\n');
    navigator.clipboard.writeText(`🛒 Food Guardian Shopping List:\n\n${text}`);
    setToastMsg('📋 Shopping list copied to clipboard!');
    setTimeout(() => setToastMsg(null), 2500);
  };

  const totalEstimated = items.reduce((acc, i) => acc + (i.estimatedPrice || 0) * (i.quantity || 1), 0);
  const checkedEstimated = items.filter(i => i.checked).reduce((acc, i) => acc + (i.estimatedPrice || 0) * (i.quantity || 1), 0);
  const checkedCount = items.filter(i => i.checked).length;

  return (
    <DashboardLayout>
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 size={20} className="text-emerald-200" />
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
              <Sparkles size={13} />
              <span>Smart Restock & Grocery Budgeting</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <ShoppingCart className="text-emerald-600" size={32} />
              Smart Shopping List
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Restock ingredients automatically as you cook, budget groceries, and transfer bought items to your fridge in 1 click.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyFormatted}
              className="flex items-center space-x-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
              title="Copy to Clipboard"
            >
              <Share2 size={15} />
              <span>Share List</span>
            </button>
            <button
              onClick={handleTransferToInventory}
              disabled={checkedCount === 0}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
            >
              <PackagePlus size={16} />
              <span>Transfer Bought ({checkedCount}) to Fridge</span>
            </button>
          </div>
        </div>

        {/* Budget Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Est. Budget</p>
            <p className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white mt-1">
              ${totalEstimated.toFixed(2)}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{items.length} items on list</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">In Cart (Checked)</p>
            <p className="text-2xl font-heading font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              ${checkedEstimated.toFixed(2)}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{checkedCount} items bought</p>
          </div>

          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800/80 dark:to-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 shadow-inner flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Auto-Restock AI</p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Items you eat are auto-added here so you never run dry.
              </p>
            </div>
            <Sparkles size={24} className="text-emerald-500 flex-shrink-0" />
          </div>
        </div>

        {/* Quick Add Bar */}
        <form onSubmit={handleAddItem} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Add item (e.g. Oat Milk, Greek Yogurt, Avocados)..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="flex-1 w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            className="w-full md:w-44 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 outline-none"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="number"
              min="1"
              value={newItemQty}
              onChange={(e) => setNewItemQty(e.target.value)}
              className="w-20 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
              title="Quantity"
            />
            <input
              type="number"
              step="0.1"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
              className="w-24 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
              title="Est Price ($)"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-1 whitespace-nowrap"
            >
              <Plus size={16} />
              <span>Add</span>
            </button>
          </div>
        </form>

        {/* Shopping Items List */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Grocery Items ({items.length})
            </h3>
            {checkedCount > 0 && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {checkedCount} ready for fridge transfer
              </span>
            )}
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <ShoppingCart size={36} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p className="font-bold text-sm">Your shopping list is clear</p>
                <p className="text-xs mt-1">Add items above or let auto-restock populate it as you cook.</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggle(item.id)}
                  className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                    item.checked
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 text-slate-400 dark:text-slate-500'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                      item.checked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}>
                      {item.checked && <Check size={14} />}
                    </div>

                    <div>
                      <p className={`font-heading font-bold text-sm ${item.checked ? 'line-through' : ''}`}>
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>Qty: {item.quantity} {item.unit}</span>
                        <span>•</span>
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.2 rounded text-[10px] font-semibold">{item.category}</span>
                        {item.addedFrom === 'restock' && (
                          <span className="text-emerald-600 text-[10px] font-bold">✨ Auto-Restocked</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="font-heading font-bold text-sm">
                      ${((item.estimatedPrice || 0) * (item.quantity || 1)).toFixed(2)}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
