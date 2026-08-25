import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { triggerConfetti } from '../services/confetti';
import { useLanguage } from '../context/LanguageContext';
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
  const { t, tf, tc, tl, language } = useLanguage();

  const handleAddScraps = (type, amount) => {
    const updated = storage.addCompostScrap(type, amount);
    setCompost({ ...updated });
    storage.addQuestXP(50);
    sound.playSuccess();
    triggerConfetti(2000);
    setToastMsg(language === 'ta'
      ? `🌱 உரத்திற்கு +${amount}kg ${type === 'greens' ? 'காய்கறி கழிவுகள்' : 'காய்ந்த இலைகள்/காகிதம்'} சேர்க்கப்பட்டது!`
      : `🌱 Added +${amount}kg of ${type === 'greens' ? 'Green Kitchen Scraps' : 'Brown Carbon (Paper/Leaves)'} to compost!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const totalKg = +(compost.greensKg + compost.brownsKg).toFixed(1);
  const greenPct = totalKg === 0 ? 50 : Math.round((compost.greensKg / totalKg) * 100);

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
            <span>{t('compostTitle')}</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Recycle className="text-emerald-600" size={32} />
            {t('compostTitle')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('compostSub')}
          </p>
        </div>

        {/* Compost Bin Monitor Card */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl shadow-emerald-700/15">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                {t('compostMonitorTitle')}
              </span>
              <h2 className="text-2xl font-heading font-bold mt-2">
                {language === 'ta' ? `மொத்த உரம்: ${totalKg} kg • சமச்சீர் சமநிலை` : `Total Biomass: ${totalKg} kg • Optimal 50/50 Balance`}
              </h2>
              <p className="text-emerald-100 text-xs sm:text-sm mt-1">
                {language === 'ta' 
                  ? `பச்சை சமையலறை கழிவுகள்: ${compost.greensKg}kg • காய்ந்த இலைகள்/காகிதம்: ${compost.brownsKg}kg`
                  : `Greens (Kitchen Scraps): ${compost.greensKg}kg • Browns (Carbon): ${compost.brownsKg}kg`}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleAddScraps('greens', 0.5)}
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Plus size={14} /> {t('addGreensBtn')}
              </button>
              <button
                onClick={() => handleAddScraps('browns', 0.5)}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Plus size={14} /> {t('addBrownsBtn')}
              </button>
            </div>
          </div>

          {/* Balance Bar */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex justify-between text-xs font-bold mb-2">
              <span>{language === 'ta' ? 'பச்சை கழிவு:' : 'Greens:'} {greenPct}%</span>
              <span>{language === 'ta' ? 'காய்ந்த இலைகள்:' : 'Browns:'} {100 - greenPct}%</span>
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
          {t('scrapRecipesTitle')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <Soup size={22} />
              </div>
              <h4 className="font-heading font-bold text-slate-900 dark:text-white text-base">
                {language === 'ta' ? 'காய்கறி கழிவு சத்து சூப்' : 'Golden Scrap Veggie Broth'}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'ta' ? 'தோல்கள்: கேரட், வெங்காயம், கொத்தமல்லி தண்டு' : 'Scraps: Carrot tops, onion skins, celery leaves'}
              </p>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-3 space-y-1 leading-relaxed">
                <p>1. {language === 'ta' ? 'காய்கறி தோல்களை சேகரித்து வைக்கவும்.' : 'Store clean scraps in a freezer bag.'}</p>
                <p>2. {language === 'ta' ? '8 கப் தண்ணீரில் 50 நிமிடம் வேக வைக்கவும்.' : 'Simmer with 8 cups water & pepper for 50 mins.'}</p>
                <p>3. {language === 'ta' ? 'வடிகட்டி சூப்பாக பயன்படுத்தவும்!' : 'Strain and use as rich homemade broth!'}</p>
              </div>
            </div>
            <span className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              💡 {language === 'ta' ? 'கடை சூப் செலவில் $4.50 மிச்சம்' : 'Saves $4.50 per batch of store stock'}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-yellow-100 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400 flex items-center justify-center mb-3">
                <Sparkles size={22} />
              </div>
              <h4 className="font-heading font-bold text-slate-900 dark:text-white text-base">
                {language === 'ta' ? 'எலுமிச்சை தோல் இயற்கை கிளீனர்' : 'Citrus Eco Surface Cleaner'}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'ta' ? 'தோல்கள்: எலுமிச்சை, ஆரஞ்சு, சாத்துக்குடி' : 'Scraps: Lemon, lime, orange rinds'}
              </p>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-3 space-y-1 leading-relaxed">
                <p>1. {language === 'ta' ? 'எலுமிச்சை தோல்களை ஜாடியில் போடவும்.' : 'Fill a glass jar with citrus peels.'}</p>
                <p>2. {language === 'ta' ? 'வினிகர் ஊற்றி 2 வாரம் ஊற வைக்கவும்.' : 'Cover with white vinegar for 2 weeks.'}</p>
                <p>3. {language === 'ta' ? 'வடிகட்டி ஸ்ப்ரேயாக பயன்படுத்தவும்!' : 'Strain for non-toxic natural cleaning spray!'}</p>
              </div>
            </div>
            <span className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              🌿 {language === 'ta' ? '100% ரசாயனம் இல்லாத இயற்கை கிளீனர்' : '100% natural, antimicrobial & zero plastic'}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <Sprout size={22} />
              </div>
              <h4 className="font-heading font-bold text-slate-900 dark:text-white text-base">
                {language === 'ta' ? 'வாழைப்பழ தோல் செடி உரம்' : 'Banana Potassium Plant Fertilizer'}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'ta' ? 'தோல்கள்: 2-3 வாழைப்பழ தோல்கள்' : 'Scraps: 2-3 leftover banana peels'}
              </p>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-3 space-y-1 leading-relaxed">
                <p>1. {language === 'ta' ? 'வாழைப்பழ தோல்களை வெட்டி தண்ணீரில் ஊற வைக்கவும்.' : 'Chop banana peels and steep in water pitcher.'}</p>
                <p>2. {language === 'ta' ? '48 மணி நேரம் ஊற வைக்கவும்.' : 'Let sit for 48 hours to leach potassium.'}</p>
                <p>3. {language === 'ta' ? 'செடிகளுக்கு ஊற்றவும்!' : 'Pour water over indoor house plants & tomatoes!'}</p>
              </div>
            </div>
            <span className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              🪴 {language === 'ta' ? 'தாவரங்களின் வேர் வளர்ச்சியைத் தூண்டுகிறது' : 'Boosts plant foliage growth & root vigor'}
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
