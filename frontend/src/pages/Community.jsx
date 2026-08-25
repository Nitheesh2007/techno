import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { triggerConfetti } from '../services/confetti';
import { useLanguage } from '../context/LanguageContext';
import { 
  Users, 
  Gift, 
  MapPin, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Heart,
  Share2
} from 'lucide-react';

const COMMUNITY_FRIDGES = [
  {
    name: 'Downtown 24/7 Community Fridge & Pantry',
    address: '422 Central Ave, Downtown',
    distance: '0.8 miles away',
    openStatus: 'Open 24/7',
    accepts: 'Fresh produce, sealed bakery, canned goods',
    fridgeColor: 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
  },
  {
    name: 'West End Mutual Aid Sharing Pantry',
    address: '108 Elm Street, West End',
    distance: '1.4 miles away',
    openStatus: 'Open 7 AM - 9 PM',
    accepts: 'Dry grains, unopened sauces, sealed dairy',
    fridgeColor: 'border-teal-400 bg-teal-50/50 dark:bg-teal-950/20'
  },
  {
    name: 'St. Mary Food Rescue Station',
    address: '750 Oak Blvd, North District',
    distance: '2.1 miles away',
    openStatus: 'Open 24/7',
    accepts: 'All unopened food staples and fresh fruits',
    fridgeColor: 'border-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
  }
];

export default function Community() {
  const [donations, setDonations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [donateName, setDonateName] = useState('');
  const [donateCategory, setDonateCategory] = useState('Produce');
  const [donateQty, setDonateQty] = useState(2);
  const [donateLocation, setDonateLocation] = useState('Downtown 24/7 Community Fridge & Pantry');
  const [toastMsg, setToastMsg] = useState(null);
  const { t, tf, tc, tl, language } = useLanguage();

  const loadDonations = () => {
    setDonations(storage.getDonations());
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const handleCreateDonation = (e) => {
    e.preventDefault();
    if (!donateName.trim()) return;

    storage.addDonation({
      name: donateName.trim(),
      category: donateCategory,
      quantity: donateQty,
      bestBefore: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      donor: 'Alex Rivera',
      location: donateLocation
    });

    storage.addQuestXP(150);
    sound.playSuccess();
    triggerConfetti(2500);
    setToastMsg(language === 'ta'
      ? `❤️ "${donateName}" சமூக உணவு தானமாகப் பட்டியலிடப்பட்டது! +150 XP பெறப்பட்டது!`
      : `❤️ Listed "${donateName}" for community donation! Earned +150 XP!`);
    setTimeout(() => setToastMsg(null), 3500);

    setDonateName('');
    setShowModal(false);
    loadDonations();
  };

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
              <Sparkles size={13} />
              <span>{t('communityTitle')}</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Users className="text-emerald-600" size={32} />
              {t('communityTitle')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t('communitySub')}
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <Heart size={16} />
            <span>{t('donateFoodBtn')}</span>
          </button>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Left: Available Surplus Listings (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-1">
              {t('availableSurplus')}
            </h3>
            <p className="text-xs text-slate-400 mb-6">{language === 'ta' ? 'அண்டை வீட்டாரால் பகிரப்பட்ட திறக்கப்படாத உணவுகள்' : 'Listed by neighbors and community fridges ready for pickup'}</p>

            {donations.length === 0 ? (
              <p className="text-xs text-slate-400 p-8 text-center bg-slate-50 dark:bg-slate-800 rounded-2xl">{language === 'ta' ? 'தற்போது தானங்கள் எதுவும் இல்லை. நீங்கள் முதல் உணவைத் தானம் செய்யுங்கள்!' : 'No surplus food listed currently. Be the first to share!'}</p>
            ) : (
              <div className="space-y-3">
                {donations.map((d) => (
                  <div
                    key={d.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          {tc(d.category)}
                        </span>
                        <span className="text-xs text-slate-400">Qty: {d.quantity}</span>
                      </div>
                      <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                        {tf(d.name)}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <MapPin size={11} className="text-emerald-500" /> {d.location}
                      </p>
                    </div>

                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      {d.status === 'Available' ? (language === 'ta' ? 'கிடைக்கும்' : 'Available') : (language === 'ta' ? 'பெறப்பட்டது' : 'Claimed')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Nearby 24/7 Community Fridges (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-1">
                {t('nearbyFridges')}
              </h3>
              <p className="text-xs text-slate-400 mb-6">{language === 'ta' ? '24 மணி நேர இலவச சமூக குளிர்சாதனப் பெட்டிகள்' : 'Drop-off locations open to the public'}</p>

              <div className="space-y-4">
                {COMMUNITY_FRIDGES.map((f, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border ${f.fridgeColor} transition-all`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {f.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{f.address}</p>
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-600 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-700">
                        {f.distance}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300">
                      <strong>{language === 'ta' ? 'ஏற்றுக்கொள்ளப்படுபவை:' : 'Accepts:'}</strong> {f.accepts}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Donate Food */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-150">
              <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white mb-2">
                {t('donateFoodBtn')}
              </h3>
              <p className="text-xs text-slate-400 mb-6">{language === 'ta' ? 'உபரி உணவை சமூகப் பகிர்விற்கு பட்டியலிடுங்கள்:' : 'List an item for neighborhood food rescue:'}</p>

              <form onSubmit={handleCreateDonation} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    {t('productNameLabel')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Canned Soup, Fresh Apples..."
                    value={donateName}
                    onChange={e => setDonateName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      {t('categoryLabel')}
                    </label>
                    <select
                      value={donateCategory}
                      onChange={e => setDonateCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                    >
                      {['Produce', 'Pantry', 'Bakery', 'Dairy & Eggs'].map(c => <option key={c} value={c}>{tc(c)}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      {t('quantityLabel')}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={donateQty}
                      onChange={e => setDonateQty(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'ta' ? 'இலக்கு சமூக குளிர்சாதன பெட்டி' : 'Target Drop-off Fridge'}
                  </label>
                  <select
                    value={donateLocation}
                    onChange={e => setDonateLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                  >
                    {COMMUNITY_FRIDGES.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500"
                  >
                    {language === 'ta' ? 'ரத்துசெய்' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md"
                  >
                    {t('donateFoodBtn')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
