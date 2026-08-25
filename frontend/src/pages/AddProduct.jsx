import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { storage } from '../services/storage';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowLeft, 
  Barcode, 
  Calendar, 
  Layers, 
  MapPin, 
  DollarSign, 
  Check,
  ScanLine
} from 'lucide-react';

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

const LOCATIONS = [
  'Fridge Top Shelf',
  'Fridge Crisper Drawer',
  'Fridge Door',
  'Freezer',
  'Pantry Shelf',
  'Countertop',
  'Bread Box'
];

export default function AddProduct() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    product_name: '',
    category: 'Produce',
    expiry_date: '',
    quantity: 1,
    unit: 'Units',
    barcode: '',
    location: 'Fridge Top Shelf',
    estimated_price: 3.99,
    notes: ''
  });

  const [ocrConfidence, setOcrConfidence] = useState(null);
  const [barcodeQuery, setBarcodeQuery] = useState('');

  // Handle scanned data passed from /scan
  useEffect(() => {
    if (location.state) {
      const { product_name, category, expiry_date, batch_number, ocr_confidence, mrp, barcode } = location.state;
      setFormData(prev => ({
        ...prev,
        product_name: product_name || prev.product_name,
        category: category || prev.category,
        expiry_date: expiry_date || prev.expiry_date,
        barcode: barcode || prev.barcode,
        notes: batch_number ? `Batch: ${batch_number}` : prev.notes
      }));
      if (ocrConfidence !== undefined) {
        setOcrConfidence(ocr_confidence);
      }
    }
  }, [location.state]);

  const handleQuickDate = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setFormData(prev => ({ ...prev, expiry_date: d.toISOString().split('T')[0] }));
  };

  const handleBarcodeLookup = async () => {
    if (!barcodeQuery) return;
    const res = await api.lookupBarcode(barcodeQuery);
    if (res.found) {
      setFormData(prev => ({
        ...prev,
        product_name: res.product_name,
        category: res.category,
        expiry_date: res.expiry_date,
        barcode: barcodeQuery
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      storage.addProduct(formData);
      navigate('/products');
    } catch (error) {
      console.error(error);
      alert('Failed to save product');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            to="/products"
            className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Inventory</span>
          </Link>
          <Link
            to="/scan"
            className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800"
          >
            <ScanLine size={14} />
            <span>Scan from Camera / Photo</span>
          </Link>
        </div>

        {/* Scanned Badge Banner if applicable */}
        {ocrConfidence && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles size={18} className="text-emerald-500" />
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
                Data extracted from OCR Scan ({(ocrConfidence * 100).toFixed(0)}% confidence)
              </span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Review & Confirm</span>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h1 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white mb-2">
            Add Food Item
          </h1>
          <p className="text-xs text-slate-400 mb-8">
            Enter the details of the item or scan barcode to automatically track freshness.
          </p>

          {/* Barcode Quick Autofill */}
          <div className="mb-8 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <Barcode size={14} /> Quick Barcode Auto-Fill
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Scan or type barcode (e.g. 8901030383011)"
                value={barcodeQuery}
                onChange={e => setBarcodeQuery(e.target.value)}
                className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
              <button
                type="button"
                onClick={handleBarcodeLookup}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl text-xs font-bold transition-colors"
              >
                Autofill
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Item Name *
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g. Organic Almond Milk, Whole Wheat Bread"
                value={formData.product_name}
                onChange={e => setFormData({ ...formData, product_name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
            </div>

            {/* Category & Storage Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Category
                </label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Storage Location
                </label>
                <select 
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                >
                  {LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Expiry Date with 1-click Quick Presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Expiry Date *
                </label>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[11px] text-slate-400">Quick set:</span>
                  <button type="button" onClick={() => handleQuickDate(2)} className="text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 hover:text-emerald-700 px-2 py-0.5 rounded font-semibold transition-colors">+2 Days</button>
                  <button type="button" onClick={() => handleQuickDate(5)} className="text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 hover:text-emerald-700 px-2 py-0.5 rounded font-semibold transition-colors">+5 Days</button>
                  <button type="button" onClick={() => handleQuickDate(14)} className="text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 hover:text-emerald-700 px-2 py-0.5 rounded font-semibold transition-colors">+2 Weeks</button>
                </div>
              </div>

              <input 
                type="date" 
                required
                value={formData.expiry_date}
                onChange={e => setFormData({ ...formData, expiry_date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
            </div>

            {/* Quantity & Unit & Estimated Price */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Quantity
                </label>
                <input 
                  type="number" 
                  min="1"
                  value={formData.quantity}
                  onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Unit
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. 500g, Pack, Bottle"
                  value={formData.unit}
                  onChange={e => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Est. Cost ($)
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.estimated_price}
                  onChange={e => setFormData({ ...formData, estimated_price: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Storage Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Keep sealed after opening, store in dark cupboard"
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none text-sm resize-none"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3.5 rounded-2xl shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01] flex items-center justify-center space-x-2"
            >
              <Check size={18} />
              <span>Save to Inventory</span>
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
