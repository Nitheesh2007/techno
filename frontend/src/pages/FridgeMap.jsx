import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';
import { 
  Layers, 
  Thermometer, 
  Sparkles, 
  Info, 
  ArrowRight,
  Snowflake,
  Package,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FridgeMap() {
  const [products, setProducts] = useState([]);
  const [selectedZone, setSelectedZone] = useState('Fridge Middle Shelf');
  const { t, tf, tc, tl, language } = useLanguage();

  useEffect(() => {
    setProducts(storage.getProducts());
  }, []);

  const ZONES = [
    {
      id: 'Fridge Top Shelf',
      title: t('topShelfTitle'),
      temp: '4°C - 5°C',
      desc: t('topShelfDesc'),
      color: 'border-blue-300 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20'
    },
    {
      id: 'Fridge Middle Shelf',
      title: t('middleShelfTitle'),
      temp: '3°C - 4°C',
      desc: t('middleShelfDesc'),
      color: 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20'
    },
    {
      id: 'Fridge Bottom Shelf',
      title: t('bottomShelfTitle'),
      temp: '2°C (Coldest)',
      desc: t('bottomShelfDesc'),
      color: 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/20'
    },
    {
      id: 'Fridge Crisper Drawer',
      title: t('crisperTitle'),
      temp: '4°C (High Humidity)',
      desc: t('crisperDesc'),
      color: 'border-teal-300 dark:border-teal-800 bg-teal-50/40 dark:bg-teal-950/20'
    },
    {
      id: 'Fridge Door',
      title: t('doorTitle'),
      temp: '6°C - 8°C (Fluctuates)',
      desc: t('doorDesc'),
      color: 'border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20'
    },
    {
      id: 'Freezer Basket',
      title: t('freezerTitle'),
      temp: '-18°C (Deep Freeze)',
      desc: t('freezerDesc'),
      color: 'border-cyan-300 dark:border-cyan-800 bg-cyan-50/40 dark:bg-cyan-950/20'
    },
    {
      id: 'Pantry Shelf 1',
      title: t('pantryTitle'),
      temp: '20°C (Dry Storage)',
      desc: t('pantryDesc'),
      color: 'border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40'
    }
  ];

  const currentZoneObj = ZONES.find(z => z.id === selectedZone) || ZONES[0];
  const itemsInZone = products.filter(p => p.location === selectedZone || (selectedZone === 'Fridge Middle Shelf' && !p.location));

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
              <Sparkles size={13} />
              <span>{t('fridgeMapTitle')}</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Layers className="text-emerald-600" size={32} />
              {t('fridgeMapTitle')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t('fridgeMapSub')}
            </p>
          </div>

          <Link
            to="/products/add"
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <Plus size={16} />
            <span>{t('addItem')}</span>
          </Link>
        </div>

        {/* 2D Schematic Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Interactive Fridge Shell (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                🧊 {language === 'ta' ? 'குளிர்சாதன பெட்டி அடுக்குகள்' : 'Refrigerator Interior Schematic'}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                {products.length} {language === 'ta' ? 'உணவுகள் உள்ளன' : 'Total Food Items'}
              </span>
            </div>

            {/* Zones Stack */}
            <div className="space-y-3">
              {ZONES.map((zone) => {
                const count = products.filter(p => p.location === zone.id || (zone.id === 'Fridge Middle Shelf' && !p.location)).length;
                const isSelected = selectedZone === zone.id;

                return (
                  <div
                    key={zone.id}
                    onClick={() => setSelectedZone(zone.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${zone.color} ${
                      isSelected
                        ? 'ring-2 ring-emerald-500 shadow-md scale-[1.01]'
                        : 'hover:border-emerald-400/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`w-3 h-3 rounded-full ${count > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`} />
                        <div>
                          <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                            {zone.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{zone.temp}</p>
                        </div>
                      </div>

                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                        {count} {language === 'ta' ? 'உணவுகள்' : 'items'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Zone Inspection Detail Card (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
                <Info size={14} />
                <span>{language === 'ta' ? 'அடுக்கு விவரங்கள்' : 'Shelf Inspector & Advice'}</span>
              </div>

              <h3 className="text-xl font-heading font-extrabold text-slate-900 dark:text-white">
                {currentZoneObj.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {currentZoneObj.desc}
              </p>

              {/* Items Stored in Zone */}
              <div className="mt-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  {language === 'ta' ? 'இந்த தட்டில் உள்ள உணவுகள்' : 'Stored in this Compartment'} ({itemsInZone.length})
                </h4>

                {itemsInZone.length === 0 ? (
                  <p className="text-xs text-slate-400 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-center">
                    {t('noItemsInZone')}
                  </p>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {itemsInZone.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-heading font-bold text-xs text-slate-900 dark:text-white">
                            {tf(item.product_name)}
                          </p>
                          <p className="text-[10px] text-slate-400">Qty: {item.quantity} {item.unit || ''}</p>
                        </div>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          item.status === 'SAFE' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {item.status === 'SAFE' ? t('statusSafe') : t('statusUrgent')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Link
              to="/products/add"
              className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm transition-all text-center flex items-center justify-center space-x-1.5"
            >
              <Plus size={14} />
              <span>{language === 'ta' ? 'இந்த தட்டில் உணவு சேர்' : 'Add Item to this Shelf'}</span>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
