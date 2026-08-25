import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { 
  Settings as SettingsIcon, 
  DollarSign, 
  Volume2, 
  Bell, 
  Leaf, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar ($)' },
  { code: 'EUR', symbol: '€', name: 'Euro (€)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (£)' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (₹)' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar ($)' },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar ($)' }
];

const DIETARY_PREFERENCES = [
  'All (No Restrictions)',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Keto / Low-Carb',
  'Dairy-Free'
];

export default function Settings() {
  const [settings, setSettings] = useState(storage.getSettings());
  const [toastMsg, setToastMsg] = useState(null);
  const fileInputRef = useRef(null);

  const handleSave = (updated) => {
    setSettings(updated);
    storage.saveSettings(updated);
    sound.enabled = updated.soundEffects;
    sound.playSuccess();
    setToastMsg('Settings saved successfully!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleExportJSON = () => {
    const data = {
      products: storage.getProducts(),
      shoppingList: storage.getShoppingList(),
      mealPlan: storage.getMealPlan(),
      savings: storage.getSavingsStats(),
      settings: storage.getSettings(),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `food-guardian-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    sound.playBeep(980, 0.05);
    setToastMsg('📦 Backup JSON downloaded!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleExportCSV = () => {
    const products = storage.getProducts();
    const headers = ['Product Name', 'Category', 'Expiry Date', 'Quantity', 'Unit', 'Location', 'Status', 'Estimated Price'];
    const rows = products.map(p => [
      `"${p.product_name}"`,
      `"${p.category || ''}"`,
      `"${p.expiry_date}"`,
      p.quantity,
      `"${p.unit || ''}"`,
      `"${p.location || ''}"`,
      `"${p.status}"`,
      p.estimated_price || 0
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `food-guardian-inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    setToastMsg('📊 CSV Inventory file exported!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.products) storage.saveProducts(parsed.products);
        if (parsed.shoppingList) storage.saveShoppingList(parsed.shoppingList);
        if (parsed.mealPlan) storage.saveMealPlan(parsed.mealPlan);
        if (parsed.settings) storage.saveSettings(parsed.settings);
        sound.playSuccess();
        setToastMsg('🎉 Backup data restored successfully!');
        setTimeout(() => setToastMsg(null), 3500);
      } catch (err) {
        alert('Invalid backup file format');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all inventory and shopping items to factory sample data?')) {
      storage.resetSampleData();
      sound.playSuccess();
      setToastMsg('✨ Sample kitchen data restored!');
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  return (
    <DashboardLayout>
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 size={20} className="text-emerald-200" />
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <Sparkles size={13} />
            <span>Preferences & Data Management</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <SettingsIcon className="text-emerald-600" size={32} />
            Settings & Preferences
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Customize culinary dietary rules, currency, audio feedback, and backup your kitchen inventory.
          </p>
        </div>

        {/* Settings Form Cards */}
        <div className="space-y-6">
          {/* Card 1: Dietary & Currency */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Leaf className="text-emerald-500" size={20} />
              Dietary & Financial Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Dietary Preference (Customizes AI Recipes)
                </label>
                <select
                  value={settings.dietaryPreference}
                  onChange={(e) => handleSave({ ...settings, dietaryPreference: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {DIETARY_PREFERENCES.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Display Currency
                </label>
                <select
                  value={settings.currencyCode}
                  onChange={(e) => {
                    const found = CURRENCIES.find(c => c.code === e.target.value);
                    handleSave({ ...settings, currencyCode: e.target.value, currency: found?.symbol || '$' });
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Audio & Alerts */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Volume2 className="text-blue-500" size={20} />
              Sound FX & Notification Rules
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <p className="font-heading font-bold text-sm text-slate-900 dark:text-white">Synthesizer Sound Effects</p>
                  <p className="text-xs text-slate-400 mt-0.5">Chimes for scan, cooking timers, and food savings</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEffects}
                  onChange={(e) => handleSave({ ...settings, soundEffects: e.target.checked })}
                  className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Expiry Alert Lead Time
                </label>
                <select
                  value={settings.leadTimeDays}
                  onChange={(e) => handleSave({ ...settings, leadTimeDays: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={1}>1 Day Before Expiry</option>
                  <option value={2}>2 Days Before Expiry</option>
                  <option value={3}>3 Days Before Expiry (Recommended)</option>
                  <option value={5}>5 Days Before Expiry</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 3: Data Backup & Restore */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="text-teal-500" size={20} />
              Backup & Inventory Export
            </h3>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExportJSON}
                className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors"
              >
                <Download size={16} />
                <span>Export Full Backup (JSON)</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors"
              >
                <Download size={16} />
                <span>Export Inventory (CSV)</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors"
              >
                <Upload size={16} />
                <span>Restore Backup File</span>
              </button>

              <button
                onClick={handleResetData}
                className="flex items-center space-x-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors ml-auto"
              >
                <RotateCcw size={16} />
                <span>Reset to Sample Data</span>
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJSON}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
