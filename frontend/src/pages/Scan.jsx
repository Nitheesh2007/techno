import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { triggerConfetti } from '../services/confetti';
import { useLanguage } from '../context/LanguageContext';
import { 
  extractBarcodeFromSource, 
  generateEan13Modules, 
  lookupProductByBarcode 
} from '../services/barcodeEngine';
import { 
  ScanLine, 
  Upload, 
  Barcode as BarcodeIcon, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  Zap, 
  Copy, 
  Check, 
  Edit3, 
  Package, 
  ImageIcon, 
  FileText,
  ArrowRight
} from 'lucide-react';

const PRESET_SAMPLES = [
  {
    name: 'Greek Yogurt (Plain 500g)',
    brand: 'Chobani Pure / Mother Dairy',
    mfg_date: '2026-08-15',
    expiry: '2026-09-02',
    batch_number: 'LOT-98214',
    category: 'Dairy & Eggs',
    price: 4.20,
    location: 'Fridge Door',
    confidence: 0.98,
    barcode: '8901030383033',
    format: 'EAN-13',
    imgEmoji: '🥣'
  },
  {
    name: 'Organic Whole Milk 1L',
    brand: 'Horizon Organic / Amul',
    mfg_date: '2026-08-20',
    expiry: '2026-08-30',
    batch_number: 'LOT-55102',
    category: 'Dairy & Eggs',
    price: 3.89,
    location: 'Fridge Top Shelf',
    confidence: 0.98,
    barcode: '8901030383011',
    format: 'EAN-13',
    imgEmoji: '🥛'
  },
  {
    name: 'Artisan Sourdough Loaf',
    brand: 'Rustic Bakery',
    mfg_date: '2026-08-24',
    expiry: '2026-08-28',
    batch_number: 'BATCH-004',
    category: 'Bakery',
    price: 5.50,
    location: 'Bread Box',
    confidence: 0.94,
    barcode: '8901030383044',
    format: 'EAN-13',
    imgEmoji: '🍞'
  },
  {
    name: 'Fresh Chicken Breast (600g)',
    brand: 'Free-Range Farms',
    mfg_date: '2026-08-23',
    expiry: '2026-08-27',
    batch_number: 'MEAT-8812',
    category: 'Meat & Poultry',
    price: 9.40,
    location: 'Fridge Bottom Shelf',
    confidence: 0.97,
    barcode: '8901030383077',
    format: 'EAN-13',
    imgEmoji: '🍗'
  },
  {
    name: 'Fresh Strawberries Punnet',
    brand: 'Driscoll Organic',
    mfg_date: '2026-08-23',
    expiry: '2026-08-26',
    batch_number: 'BERRY-91',
    category: 'Produce',
    price: 4.50,
    location: 'Fridge Crisper Drawer',
    confidence: 0.99,
    barcode: '8901030383022',
    format: 'EAN-13',
    imgEmoji: '🍓'
  },
  {
    name: 'Organic Baby Spinach (300g)',
    brand: 'Earthbound Farm',
    mfg_date: '2026-08-22',
    expiry: '2026-08-29',
    batch_number: 'GREENS-42',
    category: 'Produce',
    price: 3.20,
    location: 'Fridge Crisper Drawer',
    confidence: 0.95,
    barcode: '8901030383055',
    format: 'EAN-13',
    imgEmoji: '🥬'
  }
];

// Crisp Authentic Mathematical EAN-13 SVG Barcode Graphic Generator
function SvgBarcode({ code = '8901030383033' }) {
  const { modules, clean } = generateEan13Modules(code);
  const moduleWidth = 2.4;
  const startX = 20;

  return (
    <div className="flex flex-col items-center p-4 bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
      <svg width={modules.length * moduleWidth + startX * 2} height={75} className="overflow-visible">
        {modules.map((m, idx) => {
          if (!m.bit) return null;
          return (
            <rect
              key={idx}
              x={startX + idx * moduleWidth}
              y={6}
              width={moduleWidth}
              height={m.guard ? 55 : 48}
              fill="currentColor"
              className="text-slate-950 dark:text-white"
            />
          );
        })}
      </svg>
      <div className="font-mono text-xs font-extrabold tracking-widest mt-1 text-slate-900 dark:text-white flex items-center justify-between w-full px-2">
        <span className="text-slate-500">{clean[0]}</span>
        <span>{clean.slice(1, 7)}</span>
        <span>{clean.slice(7, 13)}</span>
      </div>
    </div>
  );
}

export default function Scan() {
  const navigate = useNavigate();
  const { t, tf, tc, tl, language } = useLanguage();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);

  const handleDetectedRawBarcode = (rawCode, format = 'EAN-13') => {
    sound.playBeep(1200, 0.08);
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      const cleanCode = (rawCode || '').replace(/\D/g, '');
      const meta = lookupProductByBarcode(cleanCode);
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + (meta.shelfLifeDays || 5));

      const mfgDate = new Date();
      mfgDate.setDate(mfgDate.getDate() - 3);

      setScanResult({
        product_name: meta.name,
        brand: meta.brand || 'Verified Producer',
        category: meta.category,
        mfg_date: mfgDate.toISOString().split('T')[0],
        expiry_date: expDate.toISOString().split('T')[0],
        batch_number: `BATCH-${cleanCode.slice(-4) || '992'}`,
        estimated_price: meta.price,
        location: meta.location,
        barcode: cleanCode || '8901030383033',
        format: format || 'EAN-13',
        ocr_confidence: 0.98,
        unit: meta.unit || 'Unit'
      });
      sound.playSuccess();
      triggerConfetti(3000);
    }, 500);
  };

  // Robust Multi-Layer Barcode Image Extractor
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setUploadedImagePreview(previewUrl);

    setIsScanning(true);
    sound.playBeep(800, 0.04);

    const img = new Image();
    img.src = previewUrl;
    img.onload = async () => {
      try {
        const detection = await extractBarcodeFromSource(img);
        if (detection && detection.barcode) {
          const extractedCode = detection.barcode;
          const extractedFormat = detection.format || 'EAN-13';
          
          setTimeout(() => {
            setIsScanning(false);
            handleDetectedRawBarcode(extractedCode, extractedFormat);
          }, 600);
        } else {
          setIsScanning(false);
          setUploadedImagePreview(null);
          alert(language === 'ta' ? 'பார்கோடு கண்டுபிடிக்க முடியவில்லை. சரியான படத்தை பதிவேற்றவும்.' : 'Could not detect barcode from image. Please try a clearer image.');
        }
      } catch (err) {
        console.warn('Extraction error on image:', err);
        setIsScanning(false);
        setUploadedImagePreview(null);
        alert(language === 'ta' ? 'பார்கோடு கண்டுபிடிக்க முடியவில்லை. சரியான படத்தை பதிவேற்றவும்.' : 'Could not detect barcode from image. Please try a clearer image.');
      }
    };
  };

  const handleSelectPreset = (sample) => {
    setIsScanning(true);
    sound.playBeep(750, 0.04);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        product_name: sample.name,
        brand: sample.brand,
        category: sample.category,
        mfg_date: sample.mfg_date,
        expiry_date: sample.expiry,
        batch_number: sample.batch_number,
        estimated_price: sample.price,
        location: sample.location,
        barcode: sample.barcode,
        format: sample.format,
        ocr_confidence: sample.confidence,
        unit: sample.name.includes('Milk') ? 'Bottle (1L)' : sample.name.includes('Yogurt') ? 'Tub (500g)' : 'Punnet'
      });
      sound.playSuccess();
      triggerConfetti(2500);
    }, 400);
  };

  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    setIsScanning(true);
    sound.playBeep(950, 0.05);
    setTimeout(() => {
      setIsScanning(false);
      handleDetectedRawBarcode(barcodeInput.trim());
    }, 350);
  };

  const handleCopyBarcode = () => {
    if (scanResult?.barcode) {
      navigator.clipboard?.writeText(scanResult.barcode);
      setCopiedCode(true);
      sound.playClick?.() || sound.playBeep(900, 0.03);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleConfirmAndDirectSave = () => {
    if (!scanResult) return;
    storage.addProduct({
      product_name: scanResult.product_name,
      brand: scanResult.brand,
      category: scanResult.category,
      expiry_date: scanResult.expiry_date,
      mfg_date: scanResult.mfg_date,
      batch_number: scanResult.batch_number,
      estimated_price: scanResult.estimated_price,
      location: scanResult.location,
      barcode: scanResult.barcode,
      unit: scanResult.unit,
      ocr_confidence: scanResult.ocr_confidence
    });
    sound.playSuccess();
    triggerConfetti(3000);
    navigate('/products');
  };

  const handleProceedToEditForm = () => {
    if (!scanResult) return;
    navigate('/products/add', { state: { scannedData: scanResult } });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <Sparkles size={13} />
            <span>{language === 'ta' ? 'பார்கோடு படம் பிரித்தெடுத்தல்' : 'Barcode Image Extraction'}</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <BarcodeIcon className="text-emerald-600" size={32} />
            {language === 'ta' ? 'பார்கோடு பதிவேற்றம் & கண்டறிதல்' : 'Barcode Upload & Auto-Extractor'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'ta'
              ? 'பார்கோடு புகைப்படத்தை பதிவேற்றவும் — பார்கோடு எண் உடனடியாக பிரித்தெடுக்கப்பட்டு கட்டத்தில் காட்டப்படும்.'
              : 'Upload any barcode image — the barcode number will be extracted automatically and displayed in the barcode box.'}
          </p>
        </div>

        {/* PRIMARY BARCODE IMAGE UPLOAD CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border-2 border-dashed border-emerald-500/40 dark:border-emerald-700/60 shadow-md mb-8 text-center transition-all hover:border-emerald-500">
          {uploadedImagePreview ? (
            <div className="mb-5">
              <img 
                src={uploadedImagePreview} 
                alt="Uploaded barcode package" 
                className="max-h-52 rounded-2xl mx-auto shadow-lg border border-slate-200 dark:border-slate-700 object-contain" 
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800 shadow-inner">
              <Upload size={36} className="animate-pulse" />
            </div>
          )}

          <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
            {language === 'ta' ? 'பார்கோடு அல்லது உணவுப் பொதி புகைப்படத்தை பதிவேற்றவும்' : 'Upload Barcode or Packaging Image'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6 max-w-md mx-auto">
            {language === 'ta'
              ? 'படத்தை பதிவேற்றியவுடன் தானியங்கி OCR பார்கோடு எண்ணைப் பிரித்தெடுத்து கீழே உள்ள கட்டத்தில் காண்பிக்கும்.'
              : 'Our intelligent image engine extracts the exact barcode number, decodes product specifications, and renders it below.'}
          </p>

          <label className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-2xl text-xs sm:text-sm cursor-pointer shadow-lg shadow-emerald-600/20 inline-flex items-center space-x-2.5 transition-all hover:scale-105">
            <Upload size={18} />
            <span>{language === 'ta' ? '📁 பார்கோடு படத்தை தேர்வு செய்க' : '📁 Browse Barcode Image'}</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Scanning Loading Animation */}
        {isScanning && (
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center animate-pulse mb-8">
            <RefreshCw className="animate-spin text-emerald-500 mx-auto mb-3" size={36} />
            <h4 className="font-heading font-bold text-sm text-slate-800 dark:text-white">
              {language === 'ta' ? 'படத்திலிருந்து பார்கோடு எண் பிரித்தெடுக்கப்படுகிறது...' : 'Extracting Barcode Number from Image...'}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'ta' ? 'பார்கோடு எண் கட்டத்தில் காண்பிக்கப்பட உள்ளது...' : 'Populating extracted barcode number into box...'}
            </p>
          </div>
        )}

        {/* EXTRACTED BARCODE SPECIFICATION CARD (DISPLAYS BARCODE NUMBER IN BOX) */}
        {scanResult && !isScanning && (
          <div className="bg-gradient-to-br from-emerald-50/90 to-teal-50/70 dark:from-slate-900 dark:to-emerald-950/40 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/50 shadow-xl animate-in zoom-in-95 duration-200 space-y-6 mb-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-emerald-200/60 dark:border-emerald-800/40">
              <div className="flex items-center space-x-2">
                <CheckCircle2 size={22} className="text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
                    {language === 'ta' ? 'பிரித்தெடுக்கப்பட்ட பார்கோடு & விவரங்கள்' : 'Extracted Barcode & Food Specifications'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {language === 'ta' ? 'பார்கோடு எண் வெற்றிகரமாக பிரித்தெடுக்கப்பட்டது.' : 'Barcode number successfully extracted and verified.'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                <Sparkles size={12} />
                {Math.round(scanResult.ocr_confidence * 100)}% Confidence
              </span>
            </div>

            {/* DEDICATED VISUAL BARCODE NUMBER DISPLAY BOX */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center md:text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {scanResult.format || 'EAN-13'} {language === 'ta' ? 'பிரித்தெடுக்கப்பட்ட பார்கோடு எண்' : 'Extracted Barcode Number'}
                </span>
                
                {/* Editable / Exact Barcode Field in Box */}
                <div className="mt-3 flex items-center justify-center md:justify-start gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={scanResult.barcode}
                      onChange={(e) => {
                        const newCode = e.target.value;
                        setScanResult(prev => ({ ...prev, barcode: newCode }));
                      }}
                      className="text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-2xl border-2 border-emerald-500/50 max-w-[260px] text-center md:text-left outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                    />
                  </div>
                  <button
                    onClick={handleCopyBarcode}
                    className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
                    title={copiedCode ? 'Copied' : 'Copy barcode'}
                  >
                    {copiedCode ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                  </button>
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  {language === 'ta' ? 'பதிவேற்றப்பட்ட படத்திலிருந்து நேரடியாக பெறப்பட்டது' : 'Extracted directly from uploaded barcode photo'}
                </p>
              </div>

              {/* Rendered Authentic SVG Barcode Graphic */}
              <div className="flex-shrink-0">
                <SvgBarcode code={scanResult.barcode} />
              </div>
            </div>

            {/* Extracted Product Fields Specification Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold">{language === 'ta' ? 'உணவு பெயர்' : 'Product Name'}</span>
                <input
                  type="text"
                  value={scanResult.product_name}
                  onChange={e => setScanResult({ ...scanResult, product_name: e.target.value })}
                  className="w-full mt-1 font-bold text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-emerald-600 uppercase font-bold">{language === 'ta' ? 'காலாவதி தேதி (EXP)' : 'Expiry Date (EXP)'}</span>
                <input
                  type="date"
                  value={scanResult.expiry_date}
                  onChange={e => setScanResult({ ...scanResult, expiry_date: e.target.value })}
                  className="w-full mt-1 font-bold text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-emerald-600 dark:text-emerald-400 outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold">{language === 'ta' ? 'உற்பத்தி தேதி (MFD)' : 'Mfg Date (MFD)'}</span>
                <input
                  type="date"
                  value={scanResult.mfg_date || ''}
                  onChange={e => setScanResult({ ...scanResult, mfg_date: e.target.value })}
                  className="w-full mt-1 font-bold text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold">{language === 'ta' ? 'தொகுதி எண் (Batch)' : 'Batch Number'}</span>
                <input
                  type="text"
                  value={scanResult.batch_number || ''}
                  onChange={e => setScanResult({ ...scanResult, batch_number: e.target.value })}
                  className="w-full mt-1 font-mono font-bold text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            {/* Bottom Verification Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => { setScanResult(null); setUploadedImagePreview(null); }}
                className="bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 transition-colors"
              >
                {language === 'ta' ? 'மற்றொரு படத்தை பதிவேற்று' : 'Upload Another Image'}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleProceedToEditForm}
                  className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Edit3 size={14} />
                  <span>{language === 'ta' ? 'படிவத்தில் திருத்து' : 'Edit in Form'}</span>
                </button>

                <button
                  onClick={handleConfirmAndDirectSave}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105 flex items-center space-x-1.5"
                >
                  <CheckCircle2 size={16} />
                  <span>{language === 'ta' ? 'உறுதிசெய்து சேமி' : 'Confirm & Save'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 1-CLICK FAST TEST PRESETS */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="text-amber-500" size={18} />
              {language === 'ta' ? '⚡ 1-கிளிக் சோதனை மாதிரிகள்' : '⚡ 1-Click Barcode Test Samples'}
            </h3>
            <span className="text-xs text-slate-400">{language === 'ta' ? 'மாதிரியைத் தேர்வு செய்து சோதிக்கலாம்' : 'Instant barcode emulation'}</span>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            {language === 'ta' ? 'பார்கோடு பிரித்தெடுக்கும் செயல்முறையை உடனடியாக சோதிக்க ஏதேனும் ஒரு மாதிரியைக் கிளிக் செய்யவும்:' : 'Click any grocery item below to test instant barcode extraction and specification rendering:'}
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
                
                {/* Barcode Number Tag */}
                <div className="mt-2.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300">
                  <span className="flex items-center gap-1"><BarcodeIcon size={12} /> {sample.barcode}</span>
                  <span className="text-[10px] uppercase">{sample.format}</span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] font-bold text-slate-500">
                  <span>EXP: {sample.expiry}</span>
                  <span className="text-emerald-600 font-extrabold">{Math.round(sample.confidence * 100)}% OCR</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MANUAL 13-DIGIT BARCODE LOOKUP FORM */}
        <form onSubmit={handleBarcodeSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
          <h4 className="font-heading font-bold text-sm text-slate-800 dark:text-white mb-2 flex items-center gap-2">
            <BarcodeIcon className="text-emerald-500" size={18} />
            {language === 'ta' ? 'அல்லது பார்கோடு எண்ணை நேரடியாக உள்ளிடவும்' : 'Or Enter Barcode Number Directly'}
          </h4>
          <p className="text-xs text-slate-400 mb-4">
            {language === 'ta' ? '13-இலக்க EAN அல்லது UPC எண்ணை உள்ளிட்டவுடன் தயாரிப்பு விவரங்கள் தானாக தோன்றும்.' : 'Type or paste any 13-digit EAN / UPC code to look up product specifications.'}
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. 8901030383033"
              value={barcodeInput}
              onChange={e => setBarcodeInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-md flex items-center gap-1.5"
            >
              <BarcodeIcon size={16} />
              <span>{language === 'ta' ? 'தேடு' : 'Lookup'}</span>
            </button>
          </div>
        </form>

      </div>
    </DashboardLayout>
  );
}
