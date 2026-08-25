import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useLanguage } from '../context/LanguageContext';
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  Snowflake, 
  Flame,
  Leaf
} from 'lucide-react';

const PRESERVATION_DATA = [
  {
    name: 'Leafy Greens (Spinach, Kale, Lettuce)',
    fridgeDays: '5 - 7 Days',
    counterDays: '1 Day (Wilts fast)',
    freezerDays: '6 - 8 Months (Blanched)',
    bestStorage: 'Crisper drawer with paper towel in airtight container to absorb humidity.',
    revivalHack: 'Submerge limp leaves in an ice-water bath for 15 minutes to restore crisp cell turgor!',
    ethylene: 'Sensitive'
  },
  {
    name: 'Fresh Berries (Strawberries, Blueberries)',
    fridgeDays: '5 - 8 Days',
    counterDays: '1 - 2 Days',
    freezerDays: '10 - 12 Months',
    bestStorage: 'Keep unwashed in breathable container until immediately before eating.',
    revivalHack: 'Wash in 1:3 white vinegar to water bath to kill mold spores, dry completely before chilling.',
    ethylene: 'Neutral'
  },
  {
    name: 'Avocados & Bananas',
    fridgeDays: '3 - 5 Days (Once ripe)',
    counterDays: '4 - 7 Days (Ripening)',
    freezerDays: '3 - 6 Months (Peeled/Mashed)',
    bestStorage: 'Keep at room temperature until ripe; transfer to fridge to pause over-ripening.',
    revivalHack: 'Coat exposed avocado cut with lemon juice or olive oil and store with cut onion.',
    ethylene: 'High Emitter'
  },
  {
    name: 'Artisan & Sliced Bread',
    fridgeDays: 'Do NOT refrigerate (Stales 6x faster)',
    counterDays: '3 - 5 Days',
    freezerDays: '3 - 6 Months (Pre-sliced)',
    bestStorage: 'Store at room temp in bread box or freeze slices separated by parchment.',
    revivalHack: 'Spritz stale bread crust with water and bake at 350°F (175°C) for 6 minutes to revive softness!',
    ethylene: 'Neutral'
  },
  {
    name: 'Fresh Dairy & Soft Cheeses',
    fridgeDays: '7 - 14 Days',
    counterDays: '2 Hours Max',
    freezerDays: '2 - 3 Months (Hard cheese only)',
    bestStorage: 'Store on middle fridge shelf. Avoid door bins due to temperature swings.',
    revivalHack: 'Freeze leftover milk or heavy cream in silicone ice cube trays for easy cooking additions.',
    ethylene: 'Neutral'
  }
];

export default function PreservationGuide() {
  const [searchTerm, setSearchTerm] = useState('');
  const { t, tf, tc, tl, language } = useLanguage();

  const filtered = PRESERVATION_DATA.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.bestStorage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <Sparkles size={13} />
            <span>{t('preservationTitle')}</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <BookOpen className="text-emerald-600" size={32} />
            {t('preservationTitle')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('preservationSub')}
          </p>
        </div>

        {/* Ethylene Gas Visual Rule Card */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl shadow-orange-500/15">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle size={22} className="text-amber-200" />
            <h3 className="font-heading font-bold text-xl">{t('ethyleneGasTitle')}</h3>
          </div>
          <p className="text-amber-100 text-xs sm:text-sm max-w-2xl leading-relaxed mb-6">
            {t('ethyleneGasDesc')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200 block mb-1">
                💨 {t('emittersTitle')}
              </span>
              <p className="text-xs sm:text-sm font-semibold">
                {language === 'ta' ? 'வாழைப்பழம், ஆப்பிள், அவகேடோ, தக்காளி, பேரிக்காய்' : 'Bananas, Apples, Avocados, Tomatoes, Pears, Cantaloupes'}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200 block mb-1">
                🥬 {t('sensitiveTitle')}
              </span>
              <p className="text-xs sm:text-sm font-semibold">
                {language === 'ta' ? 'கீரைகள், ப்ரோக்கோலி, வெள்ளரிக்காய், கேரட், உருளைக்கிழங்கு' : 'Leafy Greens, Broccoli, Cucumbers, Carrots, Potatoes'}
              </p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={language === 'ta' ? 'உணவு பாதுகாப்பு மற்றும் மீட்பு குறிப்புகளைத் தேடுங்கள்...' : 'Search food preservation rules & revival tricks...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>

        {/* Guides List */}
        <div className="space-y-4">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                  {tf(item.name)}
                </h3>
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                  item.ethylene === 'High Emitter' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                  item.ethylene === 'Sensitive' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                  'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  Gas: {item.ethylene}
                </span>
              </div>

              {/* Shelf Lifespans */}
              <div className="grid grid-cols-3 gap-3 my-4 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold block mb-0.5">🧊 {language === 'ta' ? 'குளிர்சாதனப் பெட்டி' : 'Fridge'}</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.fridgeDays}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold block mb-0.5">🏡 {language === 'ta' ? 'அறை வெப்பநிலை' : 'Counter'}</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.counterDays}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold block mb-0.5">❄️ {language === 'ta' ? 'டீப் பிரீசர்' : 'Freezer'}</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.freezerDays}</p>
                </div>
              </div>

              {/* Tips */}
              <div className="space-y-2 text-xs">
                <p className="text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white">💡 {language === 'ta' ? 'சிறந்த சேமிப்பு முறை:' : 'Optimal Storage:'}</strong> {item.bestStorage}
                </p>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200">
                  <strong>✨ {language === 'ta' ? 'உணவு மீட்பு தந்திரம்:' : 'Revival Hack:'}</strong> {item.revivalHack}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
