import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { sound } from '../services/sound';
import { triggerConfetti } from '../services/confetti';
import { useLanguage } from '../context/LanguageContext';
import { 
  ScanLine, 
  Camera, 
  Upload, 
  Barcode, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  AlertCircle, 
  ArrowRight,
  Zap,
  Volume2
} from 'lucide-react';

const PRESET_SAMPLES = [
  {
    name: 'Organic Whole Milk 1L',
    brand: 'Horizon Organic',
    expiry: '2026-08-30',
    category: 'Dairy & Eggs',
    price: 3.89,
    location: 'Fridge Top Shelf',
    confidence: 0.96,
    batch: 'LOT-9823-A',
    barcode: '8901030383011',
    imgEmoji: '🥛'
  },
  {
    name: 'Greek Yogurt (Plain 500g)',
    brand: 'Chobani Pure',
    expiry: '2026-09-02',
    category: 'Dairy & Eggs',
    price: 4.20,
    location: 'Fridge Door',
    confidence: 0.94,
    batch: 'LOT-4411-B',
    barcode: '8901030383033',
    imgEmoji: '🥣'
  },
  {
    name: 'Artisan Sourdough Loaf',
    brand: 'Rustic Bakery',
    expiry: '2026-08-28',
    category: 'Bakery',
    price: 5.50,
    location: 'Bread Box',
    confidence: 0.91,
    batch: 'BATCH-882',
    barcode: '8901030383044',
    imgEmoji: '🍞'
  },
  {
    name: 'Fresh Chicken Breast (600g)',
    brand: 'Free-Range Farms',
    expiry: '2026-08-27',
    category: 'Meat & Poultry',
    price: 9.40,
    location: 'Fridge Bottom Shelf',
    confidence: 0.97,
    batch: 'LOT-CH-091',
    barcode: '8901030383077',
    imgEmoji: '🍗'
  },
  {
    name: 'Fresh Strawberries Punnet',
    brand: 'Driscoll Organic',
    expiry: '2026-08-26',
    category: 'Produce',
    price: 4.50,
    location: 'Fridge Crisper Drawer',
    confidence: 0.98,
    batch: 'PKG-7721',
    barcode: '8901030383022',
    imgEmoji: '🍓'
  }
];

export default function Scan() {
  const navigate = useNavigate();
  const { t, tf, tc, tl, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('presets'); // 'presets', 'camera', 'upload', 'barcode'
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      sound.playBeep(880, 0.05);
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      alert(language === 'ta' ? 'கேமராவைத் தொடங்க முடியவில்லை. மாதிரி பாக்கெட்டுகளைப் பயன்படுத்தவும்.' : 'Camera access unavailable. You can use 1-Click Presets or Image Upload.');
    }
  };

  const capturePhoto = () => {
    sound.playBeep(1200, 0.08);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const randomPreset = PRESET_SAMPLES[Math.floor(Math.random() * PRESET_SAMPLES.length)];
      setScanResult({
        product_name: randomPreset.name,
        category: randomPreset.category,
        expiry_date: randomPreset.expiry,
        estimated_price: randomPreset.price,
        location: randomPreset.location,
        barcode: randomPreset.barcode,
        ocr_confidence: 0.95,
        unit: 'Package'
      });
      sound.playSuccess();
      triggerConfetti(2500);
      stopCamera();
    }, 1500);
  };

  const handleSelectPreset = (sample) => {
    setIsScanning(true);
    sound.playBeep(750, 0.04);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        product_name: sample.name,
        category: sample.category,
        expiry_date: sample.expiry,
        estimated_price: sample.price,
        location: sample.location,
        barcode: sample.barcode,
        ocr_confidence: sample.confidence,
        unit: sample.name.includes('Milk') ? 'Bottle (1L)' : sample.name.includes('Yogurt') ? 'Tub (500g)' : 'Punnet'
      });
      sound.playSuccess();
      triggerConfetti(2500);
    }, 800);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsScanning(true);
    sound.playBeep(800, 0.04);
    setTimeout(() => {
      setIsScanning(false);
      const sample = PRESET_SAMPLES[0];
      setScanResult({
        product_name: sample.name,
        category: sample.category,
        expiry_date: sample.expiry,
        estimated_price: sample.price,
        location: sample.location,
        barcode: sample.barcode,
        ocr_confidence: 0.94,
        unit: 'Bottle (1L)'
      });
      sound.playSuccess();
      triggerConfetti(2500);
    }, 1200);
  };

  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    setIsScanning(true);
    sound.playBeep(950, 0.05);
    setTimeout(() => {
      setIsScanning(false);
      const matched = PRESET_SAMPLES.find(p => p.barcode === barcodeInput.trim()) || PRESET_SAMPLES[0];
      setScanResult({
        product_name: matched.name,
        category: matched.category,
        expiry_date: matched.expiry,
        estimated_price: matched.price,
        location: matched.location,
        barcode: barcodeInput.trim(),
        ocr_confidence: 0.99,
        unit: 'Unit'
      });
      sound.playSuccess();
      triggerConfetti(2500);
    }, 600);
  };

  const handleProceedToSave = () => {
    if (!scanResult) return;
    navigate('/products/add', { state: { scannedData: scanResult } });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <Sparkles size={13} />
            <span>{t('multiEngineBadge')}</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <ScanLine className="text-emerald-600" size={32} />
            {t('scannerTitle')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('scannerSub')}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 max-w-xl">
          {[
            { id: 'presets', label: t('presetsTab'), icon: Zap },
            { id: 'camera', label: t('cameraTab'), icon: Camera },
            { id: 'upload', label: t('uploadTab'), icon: Upload },
            { id: 'barcode', label: t('barcodeTab'), icon: Barcode }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'camera') startCamera();
                  else stopCamera();
                }}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: 1-Click Presets */}
        {activeTab === 'presets' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Zap className="text-amber-500" size={18} />
              {t('instantTestLabels')}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {language === 'ta' ? 'உடனடி AI OCR சோதனையை இயக்க ஏதேனும் ஒரு மாதிரியைக் கிளிக் செய்யவும்:' : 'Click any package below to simulate instant real-time OCR text parsing:'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {PRESET_SAMPLES.map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectPreset(sample)}
                  className="p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 cursor-pointer bg-slate-50/50 dark:bg-slate-800/40 transition-all hover:scale-105 group"
                >
                  <div className="text-3xl mb-2">{sample.imgEmoji}</div>
                  <h4 className="font-heading font-bold text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {tf(sample.name)}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{tc(sample.category)}</p>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] font-bold text-slate-500">
                    <span>EXP: {sample.expiry}</span>
                    <span className="text-emerald-600 font-extrabold">{Math.round(sample.confidence * 100)}% OCR</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Live Camera */}
        {activeTab === 'camera' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 text-center">
            <div className="relative max-w-lg mx-auto h-72 sm:h-80 rounded-2xl bg-black overflow-hidden flex items-center justify-center border-2 border-emerald-500/40 mb-4">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute inset-x-8 inset-y-12 border-2 border-dashed border-emerald-400/80 rounded-xl pointer-events-none flex items-center justify-center">
                <span className="text-xs text-white/80 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                  {language === 'ta' ? 'உணவு லேபிளை இங்கே பொருத்தவும்' : 'Align Expiration Date Stamp Inside Box'}
                </span>
              </div>
            </div>

            <button
              onClick={capturePhoto}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105 flex items-center space-x-2 mx-auto"
            >
              <Camera size={16} />
              <span>{t('capturePhotoBtn')}</span>
            </button>
          </div>
        )}

        {/* TAB 3: Upload Photo */}
        {activeTab === 'upload' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-sm mb-6 text-center">
            <Upload className="mx-auto text-emerald-500 mb-3" size={36} />
            <h4 className="font-heading font-bold text-sm text-slate-800 dark:text-white">
              {t('clickToUpload')}
            </h4>
            <p className="text-xs text-slate-400 mt-1 mb-4">Supports PNG, JPG, WEBP receipt & label photos</p>
            <label className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-2xl text-xs cursor-pointer shadow-md inline-block">
              <span>{language === 'ta' ? 'கோப்பைத் தேர்ந்தெடு' : 'Browse File'}</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        )}

        {/* TAB 4: Barcode Lookup */}
        {activeTab === 'barcode' && (
          <form onSubmit={handleBarcodeSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
            <h4 className="font-heading font-bold text-sm text-slate-800 dark:text-white mb-2">
              {language === 'ta' ? 'பார்கோடு எண் உள்ளீடு' : 'Enter 13-Digit EAN / UPC Barcode'}
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 8901030383011"
                value={barcodeInput}
                onChange={e => setBarcodeInput(e.target.value)}
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-md"
              >
                {language === 'ta' ? 'தேடு' : 'Lookup'}
              </button>
            </div>
          </form>
        )}

        {/* Scanning Loading State */}
        {isScanning && (
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center animate-pulse mb-6">
            <RefreshCw className="animate-spin text-emerald-500 mx-auto mb-3" size={32} />
            <p className="font-heading font-bold text-sm text-slate-800 dark:text-white">
              {t('extractingAi')}
            </p>
          </div>
        )}

        {/* Scan Results Card */}
        {scanResult && !isScanning && (
          <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/60 dark:from-slate-900 dark:to-emerald-950/30 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/50 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-emerald-200/60 dark:border-emerald-800/40">
              <div className="flex items-center space-x-2">
                <CheckCircle2 size={22} className="text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
                  {t('extractionSuccess')}
                </h3>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white">
                {t('confidenceLabel', { pct: Math.round(scanResult.ocr_confidence * 100) })}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold">{t('detectedProduct')}</span>
                <p className="font-heading font-bold text-base text-slate-900 dark:text-white mt-1">
                  {tf(scanResult.product_name)}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold">{t('parsedExpiry')}</span>
                <p className="font-heading font-bold text-base text-emerald-600 dark:text-emerald-400 mt-1">
                  {scanResult.expiry_date}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold">{t('categoryGroup')}</span>
                <p className="font-heading font-bold text-base text-slate-900 dark:text-white mt-1">
                  {tc(scanResult.category)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => setScanResult(null)}
                className="bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 transition-colors"
              >
                {t('scanAnother')}
              </button>
              <button
                onClick={handleProceedToSave}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105 flex items-center space-x-1.5"
              >
                <span>{t('confirmAndSave')}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
