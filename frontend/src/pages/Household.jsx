import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { useLanguage } from '../context/LanguageContext';
import { 
  Home, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Calendar, 
  ShieldCheck, 
  Activity, 
  UserPlus
} from 'lucide-react';

export default function Household() {
  const [household, setHousehold] = useState(storage.getHousehold());
  const [products, setProducts] = useState(storage.getProducts());
  const [newChoreText, setNewChoreText] = useState('');
  const [assignedMember, setAssignedMember] = useState('Maya Lin');
  const [dueDay, setDueDay] = useState('Friday');
  const [toastMsg, setToastMsg] = useState(null);
  const { t, tf, tc, tl, language } = useLanguage();

  const loadData = () => {
    setHousehold(storage.getHousehold());
    setProducts(storage.getProducts());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddChore = (e) => {
    e.preventDefault();
    if (!newChoreText.trim()) return;

    storage.addHouseholdChore(newChoreText.trim(), assignedMember, dueDay);
    setNewChoreText('');
    sound.playSuccess();
    setToastMsg(language === 'ta' ? `🧹 ${assignedMember}-க்கு வேலை ஒதுக்கப்பட்டது!` : `🧹 Assigned chore to ${assignedMember}!`);
    setTimeout(() => setToastMsg(null), 3000);
    loadData();
  };

  const handleToggleChore = (choreId) => {
    storage.toggleChoreStatus(choreId);
    sound.playClick?.() || sound.playBeep(900, 0.04);
    loadData();
  };

  const handleToggleOwnership = (productId, currentOwnership) => {
    const nextOwnership = currentOwnership === 'Shared' ? 'Personal (Alex)' : 'Shared';
    storage.updateProduct(productId, { ownership: nextOwnership });
    sound.playClick?.() || sound.playBeep(700, 0.04);
    loadData();
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
              <span>{t('householdTitle')}</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Home className="text-emerald-600" size={32} />
              {t('householdTitle')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t('householdSub')}
            </p>
          </div>
        </div>

        {/* Household Overview Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                {t('kitchenSpaceTitle')}
              </span>
              <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white mt-2">
                {household.name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {household.members.length} {language === 'ta' ? 'உறுப்பினர்கள்' : 'active members'} • {products.length} {language === 'ta' ? 'உணவுகள்' : 'food items'}
              </p>
            </div>

            {/* Member Avatars */}
            <div className="flex items-center space-x-3">
              {household.members.map((mem) => (
                <div key={mem.id} className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-2xl">{mem.avatar}</span>
                  <div>
                    <p className="font-heading font-bold text-xs text-slate-900 dark:text-white">{mem.name}</p>
                    <span className="text-[10px] text-slate-400 font-semibold">{mem.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Two Columns: Chore Board & Food Ownership */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Chore Rotation Board (6 cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-1">
                {t('sharedChoreRotation')}
              </h3>
              <p className="text-xs text-slate-400 mb-6">{language === 'ta' ? 'துடைப்பு, காலாவதி சோதனை மற்றும் பொருட்கள் வாங்கும் பணிகள்' : 'Wipe-downs, expiry checks, and restock duties'}</p>

              {/* Chores List */}
              <div className="space-y-3 mb-6">
                {household.chores.length === 0 ? (
                  <p className="text-xs text-slate-400 p-4 text-center">{language === 'ta' ? 'வேலைகள் எதுவும் இல்லை! புதிய வேலையைச் சேர்க்கவும்.' : 'No active chores. Add one below!'}</p>
                ) : (
                  household.chores.map((chore) => (
                    <div
                      key={chore.id}
                      onClick={() => handleToggleChore(chore.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        chore.status === 'Completed'
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-slate-400'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${chore.status === 'Completed' ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'}`}>
                          {chore.status === 'Completed' && <CheckCircle2 size={13} />}
                        </div>
                        <div>
                          <p className={`font-heading font-bold text-sm ${chore.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                            {chore.chore}
                          </p>
                          <p className="text-xs text-slate-400">{chore.assignedTo} • {chore.due}</p>
                        </div>
                      </div>

                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        chore.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {chore.status === 'Completed' ? (language === 'ta' ? 'முடிந்தது' : 'Done') : (language === 'ta' ? 'நிலுவையில்' : 'Pending')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Add Chore Form */}
            <form onSubmit={handleAddChore} className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder={language === 'ta' ? 'புதிய வேலை (எ.கா. தட்டுகளைத் துடைக்க)...' : 'New chore...'}
                value={newChoreText}
                onChange={e => setNewChoreText(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <select
                value={assignedMember}
                onChange={e => setAssignedMember(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 outline-none"
              >
                {household.members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
              </select>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
              >
                {t('assignChoreBtn')}
              </button>
            </form>
          </div>

          {/* Food Ownership (Shared vs Personal Tagging) (6 cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-1">
                {t('foodOwnershipTagger')}
              </h3>
              <p className="text-xs text-slate-400 mb-6">{language === 'ta' ? 'உணவு உரிமையை மாற்ற கிளிக் செய்யவும்' : 'Click to toggle between Shared Food vs Personal Item'}</p>

              {products.length === 0 ? (
                <p className="text-xs text-slate-400 p-6 text-center">{t('noItemsInInventory')}</p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {products.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-heading font-bold text-sm text-slate-900 dark:text-white">{tf(item.product_name)}</p>
                        <p className="text-xs text-slate-400">{tl(item.location || 'Fridge')} • Qty: {item.quantity}</p>
                      </div>

                      <button
                        onClick={() => handleToggleOwnership(item.id, item.ownership || 'Shared')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          item.ownership?.includes('Personal')
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        }`}
                      >
                        {item.ownership?.includes('Personal') ? t('personalItem') : t('sharedWithHouse')}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
