import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { triggerConfetti } from '../services/confetti';
import { 
  ClipboardCheck, 
  Sparkles, 
  Check, 
  Flame, 
  Snowflake, 
  Gift, 
  ArrowRight, 
  RotateCcw,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function KitchenAudit() {
  const [step, setStep] = useState(1); // 1: Urgent Review, 2: Freeze Triage, 3: Donation Check, 4: Final Summary
  const [products, setProducts] = useState([]);
  const [cookItems, setCookItems] = useState([]);
  const [freezeItems, setFreezeItems] = useState([]);
  const [donateItems, setDonateItems] = useState([]);
  const [auditComplete, setAuditComplete] = useState(false);

  useEffect(() => {
    const list = storage.getProducts();
    setProducts(list);
    // Pre-populate intelligent triage
    setCookItems(list.filter(p => p.status === 'URGENT').map(p => p.id));
    setFreezeItems(list.filter(p => (p.category === 'Bakery' || p.category === 'Meat & Poultry') && p.status === 'EXPIRING SOON').map(p => p.id));
    setDonateItems(list.filter(p => p.category === 'Pantry' && p.status === 'SAFE').slice(0, 1).map(p => p.id));
  }, []);

  const toggleCook = (id) => {
    setCookItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    sound.playClick?.() || sound.playBeep(800, 0.04);
  };

  const toggleFreeze = (id) => {
    setFreezeItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    sound.playClick?.() || sound.playBeep(800, 0.04);
  };

  const toggleDonate = (id) => {
    setDonateItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    sound.playClick?.() || sound.playBeep(800, 0.04);
  };

  const handleApplyAudit = () => {
    // Move freeze items to Freezer location in storage
    freezeItems.forEach(id => {
      storage.updateProduct(id, { location: 'Freezer Basket' });
    });

    storage.addQuestXP(150);
    sound.playSuccess();
    triggerConfetti(3500);
    setAuditComplete(true);
    setStep(4);
  };

  const healthScore = Math.min(100, Math.round(92 - (products.filter(p => p.status === 'URGENT').length * 4)));

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <Sparkles size={13} />
            <span>3-Minute Freshness Reset Tool</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-3">
            <ClipboardCheck className="text-emerald-600" size={32} />
            Kitchen Freshness Audit Wizard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-lg mx-auto">
            A quick interactive checklist to triage urgent items, freeze what can be saved, and ensure zero food waste.
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          {[
            { num: 1, label: '1. Cook Urgent' },
            { num: 2, label: '2. Freeze Guard' },
            { num: 3, label: '3. Community Share' },
            { num: 4, label: '4. Health Summary' }
          ].map(s => (
            <div key={s.num} className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s.num
                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/20'
                  : step > s.num
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}>
                {step > s.num ? <Check size={14} /> : s.num}
              </div>
              <span className={`text-xs font-bold hidden sm:inline ${step === s.num ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1: Cook Urgent */}
        {step === 1 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-2 mb-2">
              <Flame className="text-rose-500" size={20} />
              <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white">
                Step 1: Identify Items to Cook in the Next 24-48h
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Check off items that should be used immediately for dinner or meal prep:
            </p>

            <div className="space-y-3 mb-8">
              {products.map(p => (
                <div
                  key={p.id}
                  onClick={() => toggleCook(p.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    cookItems.includes(p.id)
                      ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-400 dark:border-rose-800'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center ${cookItems.includes(p.id) ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'}`}>
                      {cookItems.includes(p.id) && <Check size={14} />}
                    </div>
                    <div>
                      <p className="font-heading font-bold text-sm text-slate-900 dark:text-white">{p.product_name}</p>
                      <p className="text-xs text-slate-400">Qty: {p.quantity} {p.unit || ''} • {p.location || 'Fridge'}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${p.status === 'URGENT' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-md"
              >
                <span>Continue to Step 2: Freeze Triage</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Freeze Triage */}
        {step === 2 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-2 mb-2">
              <Snowflake className="text-blue-500" size={20} />
              <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white">
                Step 2: Move to Freezer to Pause Decay
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Freezing pauses expiry for months. Select items you won't finish this week to store in the freezer:
            </p>

            <div className="space-y-3 mb-8">
              {products.map(p => (
                <div
                  key={p.id}
                  onClick={() => toggleFreeze(p.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    freezeItems.includes(p.id)
                      ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-400 dark:border-blue-800'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center ${freezeItems.includes(p.id) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'}`}>
                      {freezeItems.includes(p.id) && <Check size={14} />}
                    </div>
                    <div>
                      <p className="font-heading font-bold text-sm text-slate-900 dark:text-white">{p.product_name}</p>
                      <p className="text-xs text-slate-400">Current: {p.location || 'Fridge'}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {freezeItems.includes(p.id) ? '❄️ Move to Freezer' : 'Keep on Shelf'}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-500">Back</button>
              <button
                onClick={() => setStep(3)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-md"
              >
                <span>Continue to Step 3: Donation Check</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Donation Screening */}
        {step === 3 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-2 mb-2">
              <Gift className="text-teal-500" size={20} />
              <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white">
                Step 3: Unopened Staples for Community Pantries
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Have extra unopened canned goods, pasta, or staples you don't plan to use? Share with neighbors:
            </p>

            <div className="space-y-3 mb-8">
              {products.filter(p => p.category === 'Pantry' || p.category === 'Produce').map(p => (
                <div
                  key={p.id}
                  onClick={() => toggleDonate(p.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    donateItems.includes(p.id)
                      ? 'bg-teal-50/60 dark:bg-teal-950/30 border-teal-400 dark:border-teal-800'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center ${donateItems.includes(p.id) ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'}`}>
                      {donateItems.includes(p.id) && <Check size={14} />}
                    </div>
                    <div>
                      <p className="font-heading font-bold text-sm text-slate-900 dark:text-white">{p.product_name}</p>
                      <p className="text-xs text-slate-400">Qty: {p.quantity} {p.unit || ''}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                    {donateItems.includes(p.id) ? '❤️ Donate to Food Fridge' : 'Keep at Home'}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-500">Back</button>
              <button
                onClick={handleApplyAudit}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-8 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-xl shadow-emerald-600/30 hover:scale-105 transition-all"
              >
                <Sparkles size={16} />
                <span>Complete Audit & Apply Triage 🎉</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Final Summary */}
        {step === 4 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl mx-auto mb-4">
              🏆
            </div>
            <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
              Kitchen Freshness Audit Complete!
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Your kitchen freshness health score has risen to <strong className="text-emerald-500">{healthScore}%</strong>. +150 Quest XP earned!
            </p>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8 text-left max-w-2xl mx-auto">
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300 block mb-1">🍳 Cook Today ({cookItems.length})</span>
                <p className="text-xs text-slate-600 dark:text-slate-300">Targeted for immediate zero-waste dinner.</p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 block mb-1">❄️ Frozen ({freezeItems.length})</span>
                <p className="text-xs text-slate-600 dark:text-slate-300">Decay paused in freezer shelf.</p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900">
                <span className="text-xs font-bold text-teal-700 dark:text-teal-300 block mb-1">❤️ Donated ({donateItems.length})</span>
                <p className="text-xs text-slate-600 dark:text-slate-300">Allocated for community pantry.</p>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <Link
                to="/recipes"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-md"
              >
                Cook Recipe with Urgent Items
              </Link>
              <Link
                to="/dashboard"
                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold px-6 py-3 rounded-2xl text-xs"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
