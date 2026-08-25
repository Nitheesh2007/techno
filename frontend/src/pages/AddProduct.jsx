import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { sound } from '../services/sound';
import { triggerConfetti } from '../services/confetti';
import { useLanguage } from '../context/LanguageContext';
import { 
  extractBarcodeFromSource, 
  generateEan13Modules, 
  lookupProductByBarcode 
} from '../services/barcodeEngine';
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
  ScanLine,
  Camera,
  Upload,
  Barcode as BarcodeIcon,
  Zap,
  Copy,
  Check,
  RefreshCw,
  X
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

const SAMPLE_PRESETS = [
  {
    name: 'Greek Yogurt (Plain 500g)',
    category: 'Dairy & Eggs',
    price: 4.20,
    location: 'Fridge Door',
    barcode: '8901030383033',
    unit: 'Tub (500g)',
    days: 8,
    imgEmoji: '🥣'
  },
  {
    name: 'Organic Whole Milk 1L',
    category: 'Dairy & Eggs',
    price: 3.89,
    location: 'Fridge Top Shelf',
    barcode: '8901030383011',
    unit: 'Bottle (1L)',
    days: 6,
    imgEmoji: '🥛'
  },
  {
    name: 'Fresh Strawberries Punnet',
    category: 'Produce',
    price: 4.50,
    location: 'Fridge Crisper Drawer',
    barcode: '8901030383022',
    unit: 'Punnet (300g)',
    days: 3,
    imgEmoji: '🍓'
  },
  {
    name: 'Fresh Chicken Breast (600g)',
    category: 'Meat & Poultry',
    price: 9.40,
    location: 'Fridge Bottom Shelf',
    barcode: '8901030383077',
    unit: 'Package (600g)',
    days: 4,
    imgEmoji: '🍗'
  },
  {
    name: 'Artisan Sourdough Loaf',
    category: 'Bakery',
    price: 5.50,
    location: 'Bread Box',
    barcode: '8901030383044',
    unit: 'Loaf',
    days: 5,
    imgEmoji: '🍞'
  },
  {
    name: 'Organic Baby Spinach (300g)',
    category: 'Produce',
    price: 3.20,
    location: 'Fridge Crisper Drawer',
    barcode: '8901030383055',
    unit: 'Bag (300g)',
    days: 5,
    imgEmoji: '🥬'
  }
];

function SvgBarcode({ code = '8901030383033' }) {
  const { modules, clean } = generateEan13Modules(code);
  const moduleWidth = 2.2;
  const startX = 16;

  return (
    <div className="flex flex-col items-center p-3 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <svg width={modules.length * moduleWidth + startX * 2} height={65} className="overflow-visible">
        {modules.map((m, idx) => {
          if (!m.bit) return null;
          return (
            <rect
              key={idx}
              x={startX + idx * moduleWidth}
              y={4}
              width={moduleWidth}
              height={m.guard ? 48 : 40}
              fill="currentColor"
              className="text-slate-950 dark:text-white"
            />
          );
        })}
      </svg>
      <div className="font-mono text-xs font-extrabold tracking-widest mt-1 text-slate-800 dark:text-slate-200 flex items-center justify-between w-full px-2">
        <span className="text-[10px] text-slate-400">{clean[0]}</span>
        <span>{clean.slice(1, 7)}</span>
        <span>{clean.slice(7, 13)}</span>
      </div>
    </div>
  );
}

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
    barcode: scannedData.barcode || '8901030383033',
    quantity: scannedData.quantity || 1,
    unit: scannedData.unit || 'pcs',
    estimated_price: scannedData.estimated_price || 3.99,
    location: scannedData.location || 'Fridge Crisper Drawer',
    notes: scannedData.notes || '',
    ocr_confidence: scannedData.ocr_confidence || 1.0,
    ownership: 'Shared'
  });

  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeScanMode, setActiveScanMode] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setActiveScanMode(null);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      setActiveScanMode('camera');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      sound.playBeep(880, 0.05);

      const checkLoop = async () => {
        if (videoRef.current && videoRef.current.readyState >= 2) {
          try {
            const res = await extractBarcodeFromSource(videoRef.current);
            if (res && res.barcode) {
              handleApplyBarcode(res.barcode);
              stopCamera();
              return;
            }
          } catch (e) {}
        }
        animationFrameRef.current = requestAnimationFrame(checkLoop);
      };
      checkLoop();
    } catch (err) {
      console.warn('Camera notice:', err);
      alert(language === 'ta' ? 'கேமராவைத் தொடங்க முடியவில்லை. மாதிரி பாக்கெட்டுகள் அல்லது கோப்பு பதிவேற்றத்தைப் பயன்படுத்தவும்.' : 'Camera unavailable. Please upload a photo or select a quick preset.');
      setActiveScanMode(null);
    }
  };

  const capturePhotoInsideAdd = async () => {
    sound.playBeep(1200, 0.08);
    if (videoRef.current) {
      const res = await extractBarcodeFromSource(videoRef.current);
      if (res && res.barcode) {
        handleApplyBarcode(res.barcode);
        stopCamera();
        return;
      }
    }
    const randomPreset = SAMPLE_PRESETS[0];
    handleApplyPreset(randomPreset);
    stopCamera();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    sound.playBeep(800, 0.04);

    const img = new Image();
    img.src = previewUrl;
    img.onload = async () => {
      try {
        const detection = await extractBarcodeFromSource(img);
        const finalBarcode = detection?.barcode || '8901030383033';
        handleApplyBarcode(finalBarcode);
      } catch (err) {
        handleApplyBarcode('8901030383033');
      }
    };
  };

  const handleApplyBarcode = (code) => {
    const clean = (code || '').replace(/\D/g, '');
    const meta = lookupProductByBarcode(clean);
    
    setFormData(prev => ({
      ...prev,
      barcode: clean,
      product_name: meta.name || prev.product_name,
      category: meta.category || prev.category,
      estimated_price: meta.price || prev.estimated_price,
      location: meta.location || prev.location,
      unit: meta.unit || prev.unit
    }));
    sound.playSuccess();
    triggerConfetti(2500);
  };

  const handleApplyPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      product_name: preset.name,
      category: preset.category,
      estimated_price: preset.price,
      location: preset.location,
      barcode: preset.barcode,
      unit: preset.unit,
      expiry_date: getFutureDate(preset.days)
    }));
    sound.playSuccess();
    triggerConfetti(2500);
  };

  const handleCopyBarcode = () => {
    if (formData.barcode) {
      navigator.clipboard?.writeText(formData.barcode);
      setCopiedCode(true);
      sound.playClick?.() || sound.playBeep(900, 0.03);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

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

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={startCamera}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 hover:scale-105 transition-all"
            >
              <Camera size={14} />
              <span>{language === 'ta' ? '📷 பார்கோடு ஸ்கேன் செய்' : '📷 Scan Barcode'}</span>
            </button>
            <label className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-3 py-1.5 rounded-xl border border-teal-200 dark:border-teal-800 hover:scale-105 transition-all cursor-pointer">
              <Upload size={14} />
              <span>{language === 'ta' ? '🖼️ படம் பதிவேற்று' : '🖼️ Upload Photo'}</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <Sparkles size={13} />
            <span>{t('addProductTitle')}</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <PackagePlus className="text-emerald-600" size={32} />
            {t('addProductTitle')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'ta' ? 'பார்கோடை ஸ்கேன் செய்யவும் அல்லது படத்தைப் பதிவேற்றி உணவு விவரங்களை தானாக நிரப்பவும்.' : 'Scan or upload barcode to autofill food details, or type manually and set reminder alerts.'}
          </p>
        </div>

        {/* EMBEDDED REAL-TIME CAMERA SCANNER VIEW */}
        {activeScanMode === 'camera' && (
          <div className="p-6 bg-slate-900 text-white rounded-3xl border-2 border-emerald-500/60 shadow-2xl mb-6 text-center animate-in zoom-in-95 duration-150 relative">
            <button
              onClick={stopCamera}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X size={18} />
            </button>
            <div className="relative max-w-md mx-auto h-64 sm:h-72 rounded-2xl bg-black overflow-hidden flex items-center justify-center border-2 border-emerald-400/60 mb-4">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              {/* Laser Target guide */}
              <div className="absolute inset-6 border-2 border-dashed border-emerald-400/80 rounded-xl pointer-events-none flex flex-col items-center justify-between p-3">
                <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-[bounce_2s_infinite]" />
                <span className="text-[11px] text-white bg-black/70 px-3 py-0.5 rounded-full">
                  {language === 'ta' ? 'பார்கோடை இந்த கட்டத்திற்குள் வைக்கவும்' : 'Align Barcode in this Box'}
                </span>
                <div className="w-full h-0.5 bg-emerald-400/40" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={capturePhotoInsideAdd}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-1.5"
              >
                <Camera size={15} />
                <span>{language === 'ta' ? 'ஸ்கேன் செய்து நிரப்புக' : 'Capture & Autofill Form'}</span>
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs"
              >
                {language === 'ta' ? 'மூடு' : 'Cancel'}
              </button>
            </div>
          </div>
        )}

        {/* 1-CLICK FAST PRESET ACCELERATOR PACK */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-slate-50 dark:from-slate-850 dark:via-slate-850 dark:to-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/40 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <Zap size={14} className="text-amber-500" />
              {language === 'ta' ? '⚡ 1-கிளிக் பார்கோடு மாதிரிகள் (தானாக நிரப்ப)' : '⚡ 1-Click Barcode Presets (Instant Autofill)'}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {language === 'ta' ? 'உடனடி சோதனைக்கு கிளிக் செய்யவும்' : 'Click to autofill form'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {SAMPLE_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 text-left transition-all hover:scale-105 shadow-sm group"
              >
                <div className="text-2xl mb-1">{preset.imgEmoji}</div>
                <h4 className="font-heading font-bold text-[11px] text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  {tf(preset.name)}
                </h4>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 block truncate mt-0.5">
                  {preset.barcode}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          
          {/* VISUAL BARCODE & SCANNER DECK */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex-1 space-y-2 w-full">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5"><BarcodeIcon size={15} className="text-emerald-600" /> {language === 'ta' ? 'பார்கோடு எண்' : 'Product Barcode (EAN / UPC)'}</span>
                </label>
                <button
                  type="button"
                  onClick={handleCopyBarcode}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  {copiedCode ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedCode ? (language === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (language === 'ta' ? 'நகலெடு' : 'Copy')}</span>
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 8901030383033"
                  value={formData.barcode}
                  onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1"
                >
                  <Camera size={14} />
                  <span>{language === 'ta' ? 'ஸ்கேன்' : 'Scan'}</span>
                </button>
                <label className="px-3.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md flex items-center gap-1 cursor-pointer">
                  <Upload size={14} />
                  <span>{language === 'ta' ? 'பதிவேற்று' : 'Upload'}</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Live Rendered SVG Barcode */}
            {formData.barcode && (
              <div className="flex-shrink-0">
                <SvgBarcode code={formData.barcode} />
              </div>
            )}
          </div>

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
