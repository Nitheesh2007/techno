import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { useLanguage } from '../context/LanguageContext';
import { 
  QrCode, 
  Printer, 
  Sparkles, 
  Tag, 
  Calendar, 
  MapPin, 
  CheckCircle2,
  Layers
} from 'lucide-react';

export default function BarcodeHub() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customTitle, setCustomTitle] = useState('Leftover Roast Veggies');
  const [customPrepDate, setCustomPrepDate] = useState(new Date().toISOString().split('T')[0]);
  const [customExpiry, setCustomExpiry] = useState(new Date(Date.now() + 3*86400000).toISOString().split('T')[0]);
  const [customLocation, setCustomLocation] = useState('Fridge Top Shelf');
  const canvasRef = useRef(null);
  const { t, tf, tc, tl, language } = useLanguage();

  useEffect(() => {
    const list = storage.getProducts();
    setProducts(list);
    if (list.length > 0) {
      setSelectedProduct(list[0]);
      setCustomTitle(list[0].product_name);
      setCustomExpiry(list[0].expiry_date);
      setCustomLocation(list[0].location || 'Fridge Top Shelf');
    }
  }, []);

  // Simple clean QR matrix pattern renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 180;
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Draw stylized QR pattern
    ctx.fillStyle = '#0f172a';
    const cellSize = 10;
    const count = size / cellSize;

    // Outer corner anchors
    const drawAnchor = (x, y) => {
      ctx.fillRect(x, y, 70, 70);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 10, y + 10, 50, 50);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 20, y + 20, 30, 30);
    };

    drawAnchor(10, 10);
    drawAnchor(100, 10);
    drawAnchor(10, 100);

    // Pseudorandom internal matrix based on title
    const hash = (customTitle + customExpiry).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if ((r < 8 && c < 8) || (r < 8 && c > 9) || (r > 9 && c < 8)) continue;
        if ((r * c + hash) % 3 === 0 || (r + c + hash) % 5 === 0) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize - 1, cellSize - 1);
        }
      }
    }
  }, [customTitle, customExpiry]);

  const handlePrint = () => {
    sound.playBeep(980, 0.05);
    window.print();
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
              <Sparkles size={13} />
              <span>{t('barcodeHubTitle')}</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <QrCode className="text-emerald-600" size={32} />
              {t('barcodeHubTitle')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t('barcodeHubSub')}
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <Printer size={16} />
            <span>{t('printLabelsBtn')}</span>
          </button>
        </div>

        {/* 2-Column Designer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Controls */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              {language === 'ta' ? 'லேபிள் விவரங்களைத் திருத்து' : 'Label Customizer'}
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                {t('containerNameLabel')}
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={e => setCustomTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  {t('prepDateLabel')}
                </label>
                <input
                  type="date"
                  value={customPrepDate}
                  onChange={e => setCustomPrepDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  {t('expiryDateLabel')}
                </label>
                <input
                  type="date"
                  value={customExpiry}
                  onChange={e => setCustomExpiry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                {t('locationLabel')}
              </label>
              <input
                type="text"
                value={customLocation}
                onChange={e => setCustomLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
              />
            </div>
          </div>

          {/* Live Sticker Card Preview */}
          <div className="bg-slate-100 dark:bg-slate-800/40 rounded-3xl p-6 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 mb-3 tracking-wider">
              {language === 'ta' ? 'அச்சிடும் தோற்றம்' : 'Live Print Sticker Preview'}
            </span>

            {/* The Actual Sticker */}
            <div className="bg-white text-slate-900 w-72 p-5 rounded-2xl shadow-xl border border-slate-300 space-y-3">
              <div className="flex items-center justify-between border-b pb-2 border-slate-200">
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-emerald-700">
                  🌱 {t('brandName')}
                </span>
                <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                  #FG-{Math.abs(customTitle.length * 821)}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <canvas ref={canvasRef} className="w-20 h-20 rounded-lg border border-slate-200" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-heading font-extrabold text-xs truncate text-slate-900">
                    {tf(customTitle)}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1">
                    <strong>Prep:</strong> {customPrepDate}
                  </p>
                  <p className="text-[10px] text-rose-600 font-bold">
                    <strong>USE BY:</strong> {customExpiry}
                  </p>
                  <p className="text-[9px] text-slate-400 truncate mt-0.5">
                    📍 {tl(customLocation)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
