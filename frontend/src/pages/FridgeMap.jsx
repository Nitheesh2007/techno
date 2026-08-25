import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage, computeStatus, getDaysRemaining } from '../services/storage';
import { 
  Layers, 
  Sparkles, 
  Thermometer, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  ChefHat, 
  Info,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ZONES = [
  {
    id: 'Fridge Top Shelf',
    name: 'Fridge Top Shelf',
    type: 'fridge',
    temp: '3°C - 5°C (37°F - 41°F)',
    description: 'Most consistent temperature. Perfect for dairy, drinks, and cooked leftovers.',
    color: 'border-blue-400 dark:border-blue-500'
  },
  {
    id: 'Fridge Middle Shelf',
    name: 'Fridge Middle Shelf',
    type: 'fridge',
    temp: '3°C - 4°C (37°F - 39°F)',
    description: 'Stable cool environment for eggs, cheeses, and meal preps.',
    color: 'border-cyan-400 dark:border-cyan-500'
  },
  {
    id: 'Fridge Bottom Shelf',
    name: 'Fridge Bottom Shelf',
    type: 'fridge',
    temp: '1°C - 2°C (34°F - 36°F)',
    description: 'Coldest zone in the fridge. Best for raw meat, poultry, and fish.',
    color: 'border-indigo-400 dark:border-indigo-500'
  },
  {
    id: 'Fridge Crisper Drawer',
    name: 'Fridge Crisper Drawer',
    type: 'fridge',
    temp: '4°C - 6°C (39°F - 43°F)',
    description: 'Humidity-controlled chamber. Keeps leafy greens crisp and berries fresh longer.',
    color: 'border-emerald-400 dark:border-emerald-500'
  },
  {
    id: 'Fridge Door',
    name: 'Fridge Door Bins',
    type: 'fridge',
    temp: '6°C - 8°C (43°F - 46°F)',
    description: 'Warmest part subject to opening. Great for sauces, condiments, and butter.',
    color: 'border-amber-400 dark:border-amber-500'
  },
  {
    id: 'Freezer',
    name: 'Deep Freezer Compartment',
    type: 'freezer',
    temp: '-18°C (0°F)',
    description: 'Stops biological decay completely. Store frozen meat, bread, and soups.',
    color: 'border-sky-400 dark:border-sky-500'
  },
  {
    id: 'Pantry Shelf 1',
    name: 'Pantry Shelves',
    type: 'pantry',
    temp: '18°C - 22°C (64°F - 72°F)',
    description: 'Dry, dark environment for grains, pasta, oils, and canned staples.',
    color: 'border-amber-600 dark:border-amber-700'
  },
  {
    id: 'Bread Box',
    name: 'Bread Box & Countertop',
    type: 'counter',
    temp: 'Room Temperature',
    description: 'Room temperature with ventilation. Never refrigerate fresh bread!',
    color: 'border-orange-400 dark:border-orange-500'
  }
];

export default function FridgeMap() {
  const [products, setProducts] = useState([]);
  const [selectedZone, setSelectedZone] = useState(ZONES[0]);
  const navigate = useNavigate();

  useEffect(() => {
    setProducts(storage.getProducts());
  }, []);

  const getZoneItems = (zoneId) => {
    return products.filter(p => (p.location || 'Fridge Top Shelf').toLowerCase().includes(zoneId.toLowerCase()) || zoneId.toLowerCase().includes((p.location || '').toLowerCase()));
  };

  const selectedZoneItems = getZoneItems(selectedZone.id);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
              <Sparkles size={13} />
              <span>Smart Thermal & Storage Mapping</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Layers className="text-emerald-600" size={32} />
              Kitchen Storage & Fridge Map
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Visual 2D layout of your refrigerator, freezer, and pantry compartments with thermal guidelines.
            </p>
          </div>

          <Link
            to="/products/add"
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <span>Assign New Item to Zone</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 2D Interactive Fridge Graphic & Zone Inspector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Left: 2D Visual Refrigerator Model (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>🧊 Refrigerator & Storage Schematic</span>
              </h3>
              <span className="text-xs text-slate-400">Click any zone to inspect</span>
            </div>

            {/* Refrigerator Frame */}
            <div className="border-4 border-slate-300 dark:border-slate-700 rounded-3xl p-4 bg-slate-50 dark:bg-slate-950/60 space-y-3 relative overflow-hidden">
              {/* Fridge Zones */}
              {ZONES.slice(0, 5).map((zone) => {
                const zoneItems = getZoneItems(zone.id);
                const hasUrgent = zoneItems.some(i => i.status === 'URGENT');
                const isSelected = selectedZone.id === zone.id;

                return (
                  <div
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-slate-800 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                          {zone.name}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">({zone.temp})</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {zoneItems.length} items stored
                      </p>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {zoneItems.map((item, idx) => (
                        <span
                          key={idx}
                          title={`${item.product_name} (${item.status})`}
                          className={`w-3 h-3 rounded-full ${
                            item.status === 'URGENT' ? 'bg-rose-500 animate-ping' :
                            item.status === 'EXPIRING SOON' ? 'bg-amber-500' :
                            'bg-emerald-500'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Other Storage Zones Grid */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {ZONES.slice(5).map((zone) => {
                  const zoneItems = getZoneItems(zone.id);
                  const isSelected = selectedZone.id === zone.id;

                  return (
                    <div
                      key={zone.id}
                      onClick={() => setSelectedZone(zone)}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-center ${
                        isSelected
                          ? 'bg-emerald-50/80 dark:bg-slate-800 border-emerald-500 shadow-md'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                      }`}
                    >
                      <p className="font-heading font-bold text-xs text-slate-900 dark:text-white truncate">
                        {zone.name}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{zoneItems.length} items</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Zone Detail Inspector (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    Zone Inspector
                  </span>
                  <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white mt-1">
                    {selectedZone.name}
                  </h3>
                </div>
                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center gap-1.5 font-mono text-xs font-bold">
                  <Thermometer size={16} />
                  <span>{selectedZone.temp}</span>
                </div>
              </div>

              {/* Guidelines */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 mb-6 text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-2">
                <Info size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{selectedZone.description}</span>
              </div>

              {/* Items Stored in this zone */}
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Items in this Zone ({selectedZoneItems.length})
              </h4>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {selectedZoneItems.length === 0 ? (
                  <p className="p-6 text-center text-xs text-slate-400">No items currently stored in this compartment.</p>
                ) : (
                  selectedZoneItems.map(item => {
                    const daysLeft = getDaysRemaining(item.expiry_date);
                    return (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                            {item.product_name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Qty: {item.quantity} {item.unit || ''}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            item.status === 'URGENT' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                            item.status === 'EXPIRING SOON' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                            'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}>
                            {daysLeft <= 0 ? 'Expires Today' : `${daysLeft}d left`}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <Link
                to="/products"
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                View Full Inventory →
              </Link>
              <Link
                to="/recipes"
                className="text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl transition-colors"
              >
                Cook with these Items
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
