import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { triggerConfetti } from '../services/confetti';
import { 
  Recycle, 
  Sparkles, 
  Leaf, 
  FlaskConical, 
  Droplet, 
  Plus, 
  CheckCircle2, 
  RotateCcw,
  Soup,
  Sprout
} from 'lucide-react';

export default function CompostLab() {
  const [compost, setCompost] = useState(storage.getCompostData());
  const [toastMsg, setToastMsg] = useState(null);

  const handleAddScraps = (type, amount) => {
    const updated = storage.addCompostScrap(type, amount);
    setCompost({ ...updated });
    storage.addQuestXP(50);
    sound.playSuccess();
    triggerConfetti(2000);
    setToastMsg(`🌱 Added +${amount}kg of ${type === 'greens' ? 'Green Nitrogen (Kitchen Scraps)' : 'Brown Carbon (Paper/Leaves)'} to compost!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const totalKg = +(compost.greensKg + compost.brownsKg).toFixed(1);
  const greenPct = Math.round((compost.greensKg / totalKg) * 100);

  return (
    <DashboardLayout>
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 size={20} className="text-emerald-200" />
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <Sparkles size={13} />
            <span>Zero-Waste Upcycling & Soil Science</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Recycle className="text-emerald-600" size={32} />
            Food Scrap Repurposing & Compost Lab
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Turn inedible kitchen trimmings into delicious stocks, non-toxic household cleaners, and nutrient-dense garden compost.
          </p>
        </div>

        {/* Compost Bin Monitor Card */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl shadow-emerald-700/15">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                Live Compost Bin Status
              </span>
              <h2 className="text-2xl font-heading font-bold mt-2">
                Total Biomass: {totalKg} kg • Optimal 50/50 Balance
              </h2>
              <p className="text-emerald-100 text-xs sm:text-sm mt-1">
                Greens (Nitrogen/Moisture): <strong>{compost.greensKg}kg</strong> • Browns (Carbon/Structure): <strong>{compost.brownsKg}kg</strong>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleAddScraps('greens', 0.5)}
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Plus size={14} /> +0.5kg Kitchen Scraps
              </button>
              <button
                onClick={() => handleAddScraps('browns', 0.5)}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Plus size={14} /> +0.5kg Dry Paper/Leaves
              </button>
            </div>
          </div>

          {/* Balance Bar */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex justify-between text-xs font-bold mb-2">
              <span>Greens: {greenPct}% (Nitrogen)</span>
              <span>Browns: {100 - greenPct}% (Carbon)</span>
            </div>
            <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden flex">
              <div className="bg-emerald-400 h-full" style={{ width: `${greenPct}%` }} />
              <div className="bg-amber-400 h-full" style={{ width: `${100 - greenPct}%` }} />
            </div>
          </div>
        </div>

        {/* Repurposing Recipes Grid */}
        <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <FlaskConical className="text-emerald-600" size={22} />
          5 Creative Kitchen Scrap Upcycling Guides
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Vegetable Scrap Stock */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <Soup size={22} />
              </div>
              <h4 className="font-heading font-bold text-slate-900 dark:text-white text-base">
                Golden Scrap Veggie Broth
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Scraps: Carrot tops, onion skins, celery leaves, mushroom stems
              </p>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-3 space-y-1 leading-relaxed">
                <p>1. Store clean scraps in a gallon freezer bag until full.</p>
                <p>2. Dump into a pot with 8 cups water, 2 bay leaves, and black pepper.</p>
                <p>3. Simmer for 50 minutes, strain, and freeze in mason jars!</p>
              </div>
            </div>
            <span className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              💡 Saves $4.50 per batch of store stock
            </span>
          </div>

          {/* Card 2: Citrus Peel All-Purpose Cleaner */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-yellow-100 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400 flex items-center justify-center mb-3">
                <Sparkles size={22} />
              </div>
              <h4 className="font-heading font-bold text-slate-900 dark:text-white text-base">
                Citrus Eco Surface Cleaner
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Scraps: Lemon, lime, orange, and grapefruit rinds
              </p>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-3 space-y-1 leading-relaxed">
                <p>1. Fill a glass jar with citrus peels.</p>
                <p>2. Cover with plain white vinegar and seal for 2 weeks in dark cupboard.</p>
                <p>3. Strain into a spray bottle 1:1 with water for non-toxic grease cutting!</p>
              </div>
            </div>
            <span className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              🌿 100% natural, antimicrobial & zero plastic waste
            </span>
          </div>

          {/* Card 3: Banana Peel Plant Tea */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <Sprout size={22} />
              </div>
              <h4 className="font-heading font-bold text-slate-900 dark:text-white text-base">
                Banana Potassium Plant Fertilizer
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Scraps: 2-3 leftover banana peels
              </p>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-3 space-y-1 leading-relaxed">
                <p>1. Chop banana peels and place into a pitcher of water.</p>
                <p>2. Let steep for 48 hours to leach rich potassium, calcium & phosphorus.</p>
                <p>3. Pour water directly over indoor house plants or tomato vines!</p>
              </div>
            </div>
            <span className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              🪴 Boosts houseplant foliage growth & root vigor
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
