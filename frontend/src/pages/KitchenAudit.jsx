import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { triggerConfetti } from '../services/confetti';
import { useLanguage } from '../context/LanguageContext';
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
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [cookItems, setCookItems] = useState([]);
  const [freezeItems, setFreezeItems] = useState([]);
  const [donateItems, setDonateItems] = useState([]);
  const [auditComplete, setAuditComplete] = useState(false);
  const { t, tf, tc, tl, language } = useLanguage();

  useEffect(() => {
    const list = storage.getProducts();
    setProducts(list);
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
            <span>{t('auditTitle')}</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-3">
            <ClipboardCheck className="text-emerald-600" size={32} />
            {t('auditTitle')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-lg mx-auto">
            {t('auditSub')}
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          {[
            { num: 1, label: t('auditStep1') },
            { num: 2, label: t('auditStep2') },
            { num: 3, label: t('auditStep3') },
            { num: 4, label: t('auditStep4') }
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
                {t('auditStep1')}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              {language === 'ta' ? 'அடுத்த 24-48 மணி நேரத்தில் சமைக்க வேண்டிய உணவுகளைத் தேர்ந்தெடுக்கவும்:' : 'Check off items that should be used immediately for dinner or meal prep:'}
            </p>

            {products.length === 0 ? (
              <p className="text-xs text-slate-400 p-8 text-center bg-slate-50 dark:bg-slate-800 rounded-2xl mb-6">{t('noItemsInInventory')}</p>
            ) : (
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
                        <p className="font-heading font-bold text-sm text-slate-900 dark:text-white">{tf(p.product_name)}</p>
                        <p className="text-xs text-slate-400">Qty: {p.quantity} {p.unit || ''} • {tl(p.location || 'Fridge')}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${p.status === 'URGENT' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                      {p.status === 'URGENT' ? t('statusUrgent') : t('statusSafe')}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-md"
              >
                <span>{language === 'ta' ? 'படி 2-க்கு தொடரவும்' : 'Continue to Step 2'}</span>
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
                {t('auditStep2')}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              {language === 'ta' ? 'கெடுதலைத் தடுத்து நீண்ட காலம் பாதுகாக்க பிரீசருக்கு மாற்ற வேண்டிய உணவுகளைத் தேர்ந்தெடுக்கவும்:' : 'Freezing pauses expiry for months. Select items you want to pause in the freezer:'}
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
                      <p className="font-heading font-bold text-sm text-slate-900 dark:text-white">{tf(p.product_name)}</p>
                      <p className="text-xs text-slate-400">{tl(p.location || 'Fridge')}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {freezeItems.includes(p.id) ? (language === 'ta' ? '❄️ பிரீசருக்கு மாற்று' : '❄️ Move to Freezer') : (language === 'ta' ? 'அப்படியே வை' : 'Keep on Shelf')}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-500">{language === 'ta' ? 'பின்செல்' : 'Back'}</button>
              <button
                onClick={() => setStep(3)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-md"
              >
                <span>{language === 'ta' ? 'படி 3-க்கு தொடரவும்' : 'Continue to Step 3'}</span>
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
                {t('auditStep3')}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              {language === 'ta' ? 'நீங்கள் பயன்படுத்தாத திறக்கப்படாத உலர் உணவுகளை அண்டை வீட்டாருடன் பகிர்ந்து கொள்ளுங்கள்:' : 'Unopened canned goods or dry staples to share with community food fridges:'}
            </p>

            <div className="space-y-3 mb-8">
              {products.map(p => (
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
                      <p className="font-heading font-bold text-sm text-slate-900 dark:text-white">{tf(p.product_name)}</p>
                      <p className="text-xs text-slate-400">Qty: {p.quantity} {p.unit || ''}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                    {donateItems.includes(p.id) ? (language === 'ta' ? '❤️ தானம் செய்' : '❤️ Donate') : (language === 'ta' ? 'வீட்டில் வை' : 'Keep at Home')}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-500">{language === 'ta' ? 'பின்செல்' : 'Back'}</button>
              <button
                onClick={handleApplyAudit}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-8 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-xl shadow-emerald-600/30 hover:scale-105 transition-all"
              >
                <Sparkles size={16} />
                <span>{t('completeAuditBtn')}</span>
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
              {language === 'ta' ? 'சமையலறை புத்துணர்ச்சி தணிக்கை முடிந்தது!' : 'Kitchen Freshness Audit Complete!'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              {language === 'ta' 
                ? `உங்கள் சமையலறை ஆரோக்கிய மதிப்பெண் ${healthScore}% ஆக உயர்ந்துள்ளது. +150 XP பெறப்பட்டது!`
                : `Your freshness health score has risen to ${healthScore}%. +150 Quest XP earned!`}
            </p>

            <div className="flex justify-center gap-3 mt-6">
              <Link
                to="/recipes"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-md"
              >
                {t('cookRecipeWithThese')}
              </Link>
              <Link
                to="/dashboard"
                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold px-6 py-3 rounded-2xl text-xs"
              >
                {t('navDashboard')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
