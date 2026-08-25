import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { 
  Barcode, 
  QrCode, 
  Printer, 
  Sparkles, 
  Plus, 
  Calendar, 
  MapPin, 
  Layers, 
  Tag,
  CheckCircle2,
  Copy
} from 'lucide-react';

export default function BarcodeHub() {
  const [labelForm, setLabelForm] = useState({
    title: 'Homemade Vegetable Lasagna',
    category: 'Meal Prep',
    preparedDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    location: 'Fridge Middle Shelf',
    servings: 2,
    instructions: 'Reheat in oven at 180°C for 15 mins. Consume within 4 days.'
  });

  const [savedLabels, setSavedLabels] = useState([
    {
      id: 'lbl-1',
      title: 'Grandma’s Chicken Broth',
      category: 'Soups',
      preparedDate: '2026-08-24',
      expiryDate: '2026-08-28',
      location: 'Freezer Basket',
      code: 'PREP-98412'
    },
    {
      id: 'lbl-2',
      title: 'Roasted Garlic Tomato Sauce',
      category: 'Pantry/Fridge',
      preparedDate: '2026-08-23',
      expiryDate: '2026-08-30',
      location: 'Fridge Top Shelf',
      code: 'PREP-44021'
    }
  ]);

  const [copyToast, setCopyToast] = useState(false);
  const canvasRef = useRef(null);

  // Draw simulated QR code onto canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw stylized QR pattern
    ctx.fillStyle = '#0f172a';
    const size = 160;
    const moduleCount = 21;
    const moduleSize = size / moduleCount;

    // Corner squares
    const drawCorner = (x, y) => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3);
    };

    drawCorner(0, 0);
    drawCorner(size - moduleSize * 7, 0);
    drawCorner(0, size - moduleSize * 7);

    // Random QR data dots based on string hash
    const hashStr = `${labelForm.title}-${labelForm.expiryDate}`;
    ctx.fillStyle = '#0f172a';
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if ((r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7)) continue;
        const charCode = hashStr.charCodeAt((r * c) % hashStr.length) || 45;
        if ((r + c + charCode) % 3 === 0) {
          ctx.fillRect(c * moduleSize, r * moduleSize, moduleSize * 0.9, moduleSize * 0.9);
        }
      }
    }
  }, [labelForm]);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToInventory = () => {
    storage.addProduct({
      product_name: labelForm.title,
      category: labelForm.category,
      expiry_date: labelForm.expiryDate,
      quantity: labelForm.servings,
      unit: 'servings',
      location: labelForm.location,
      notes: `Prep Date: ${labelForm.preparedDate} • ${labelForm.instructions}`
    });
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 3000);
  };

  return (
    <DashboardLayout>
      {copyToast && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 size={20} className="text-emerald-200" />
          <span className="text-sm font-semibold">🎉 Meal prep container saved to your active food inventory!</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
              <Sparkles size={13} />
              <span>Leftovers & Meal Prep Label Maker</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <QrCode className="text-emerald-600" size={32} />
              Printable Label & QR Code Designer
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Design scan-ready adhesive labels with expiration dates for homemade meal prep, frozen containers, and leftovers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all"
            >
              <Printer size={16} />
              <span>Print Label Sticker</span>
            </button>
            <button
              onClick={handleSaveToInventory}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
            >
              <Plus size={16} />
              <span>Track in Inventory</span>
            </button>
          </div>
        </div>

        {/* Layout: Form on Left, Live Printable Preview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Label Form (6 cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              Container Details
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Dish / Food Name
              </label>
              <input
                type="text"
                value={labelForm.title}
                onChange={e => setLabelForm({ ...labelForm, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Prepared Date
                </label>
                <input
                  type="date"
                  value={labelForm.preparedDate}
                  onChange={e => setLabelForm({ ...labelForm, preparedDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Expiry / Best By
                </label>
                <input
                  type="date"
                  value={labelForm.expiryDate}
                  onChange={e => setLabelForm({ ...labelForm, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Storage Location
                </label>
                <select
                  value={labelForm.location}
                  onChange={e => setLabelForm({ ...labelForm, location: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 outline-none"
                >
                  <option value="Fridge Middle Shelf">Fridge Middle Shelf</option>
                  <option value="Fridge Top Shelf">Fridge Top Shelf</option>
                  <option value="Freezer Basket">Freezer Compartment</option>
                  <option value="Pantry Shelf 1">Pantry Shelf</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Portions / Servings
                </label>
                <input
                  type="number"
                  min="1"
                  value={labelForm.servings}
                  onChange={e => setLabelForm({ ...labelForm, servings: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Reheating / Storage Note
              </label>
              <textarea
                rows={2}
                value={labelForm.instructions}
                onChange={e => setLabelForm({ ...labelForm, instructions: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none resize-none"
              />
            </div>
          </div>

          {/* Live Printable Label Preview (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="p-4 bg-slate-200 dark:bg-slate-800 rounded-3xl">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 text-center">
                📄 Live Sticker Preview (Print Format)
              </p>

              {/* Printable Physical Card */}
              <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-xl border-2 border-slate-900 flex flex-col justify-between max-w-md mx-auto">
                <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold bg-slate-900 text-white px-2 py-0.5 rounded">
                      FOOD GUARDIAN PREP
                    </span>
                    <h2 className="text-xl font-heading font-extrabold mt-1 text-slate-900 leading-tight">
                      {labelForm.title}
                    </h2>
                  </div>
                  <canvas ref={canvasRef} width="160" height="160" className="w-16 h-16 rounded border border-slate-300 flex-shrink-0" />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                  <div className="p-2 rounded bg-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">PREPPED ON:</span>
                    <span className="font-bold">{labelForm.preparedDate}</span>
                  </div>
                  <div className="p-2 rounded bg-emerald-100 text-emerald-900">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">USE BY (EXPIRY):</span>
                    <span className="font-extrabold text-sm">{labelForm.expiryDate}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200 mb-3">
                  <p><strong>📍 Storage:</strong> {labelForm.location} • <strong>🍽️ Servings:</strong> {labelForm.servings}</p>
                  <p className="mt-1"><strong>💡 Note:</strong> {labelForm.instructions}</p>
                </div>

                <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 border-t border-slate-200 pt-2">
                  <span>SCAN WITH APP TO LOG CONSUMPTION</span>
                  <span>ID: PREP-{Date.now().toString().slice(-6)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
