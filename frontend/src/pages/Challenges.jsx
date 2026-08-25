import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { triggerConfetti } from '../services/confetti';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  Award, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function Challenges() {
  const [data, setData] = useState(storage.getChallenges());
  const [toastMsg, setToastMsg] = useState(null);

  const loadData = () => {
    setData(storage.getChallenges());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClaim = (questId) => {
    const res = storage.completeQuest(questId);
    if (res.success) {
      sound.playSuccess();
      triggerConfetti(3000);
      setToastMsg(`⚡ Quest completed! Earned +${res.xpEarned} XP!`);
      setTimeout(() => setToastMsg(null), 3000);
      loadData();
    }
  };

  const nextLevelXp = data.level * 400;
  const currentLevelBaseXp = (data.level - 1) * 400;
  const levelProgressPct = Math.min(100, Math.round(((data.xp - currentLevelBaseXp) / (nextLevelXp - currentLevelBaseXp)) * 100));

  return (
    <DashboardLayout>
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <Zap size={20} className="text-amber-300 fill-amber-300" />
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
              <Sparkles size={13} />
              <span>Eco-Gamification & Level Progression</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Trophy className="text-emerald-600" size={32} />
              Zero-Waste Quests & Achievements
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Complete sustainability quests, maintain daily food preservation streaks, and unlock master eco-trophies.
            </p>
          </div>
        </div>

        {/* Level Progression Hero Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl shadow-emerald-700/15">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl font-heading font-extrabold shadow-inner">
                {data.level}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Guardian Rank</span>
                <h2 className="text-2xl font-heading font-extrabold mt-0.5">{data.levelTitle}</h2>
                <p className="text-xs text-emerald-100 mt-0.5">{data.xp} total XP accumulated</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3 rounded-2xl">
                <Flame size={28} className="text-amber-400 fill-amber-400 animate-bounce" />
                <div>
                  <p className="text-xl font-heading font-extrabold">{data.currentStreakDays} Days</p>
                  <p className="text-[11px] text-emerald-100">Zero-Waste Streak 🔥</p>
                </div>
              </div>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex justify-between text-xs font-bold mb-2">
              <span>Progress to Level {data.level + 1}</span>
              <span>{levelProgressPct}% ({data.xp} / {nextLevelXp} XP)</span>
            </div>
            <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-1000"
                style={{ width: `${levelProgressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Weekly Quests Section */}
        <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="text-amber-500" size={22} />
          Active Weekly Quests
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {data.quests.map((q) => (
            <div
              key={q.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                q.completed
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl p-2 rounded-2xl bg-slate-100 dark:bg-slate-800">
                    {q.badge}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                    +{q.xpReward} XP
                  </span>
                </div>
                <h4 className="font-heading font-bold text-slate-900 dark:text-white text-base">
                  {q.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {q.desc}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Progress: {q.progress} / {q.target}
                </span>

                {q.completed ? (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={14} /> Completed ✓
                  </span>
                ) : (
                  <button
                    onClick={() => handleClaim(q.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-1.5 rounded-xl text-xs shadow-sm transition-all"
                  >
                    Claim +{q.xpReward} XP
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Trophies Grid */}
        <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Award className="text-emerald-600" size={22} />
          Master Eco-Trophies
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {data.trophies.map((t) => (
            <div
              key={t.id}
              className={`p-5 rounded-3xl border text-center transition-all ${
                t.unlocked
                  ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-700/60 shadow-sm'
                  : 'bg-slate-100/60 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-50'
              }`}
            >
              <div className="text-3xl mb-2">{t.icon}</div>
              <h5 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                {t.title}
              </h5>
              <p className="text-[11px] text-slate-400 mt-1">{t.desc}</p>
              <span className={`inline-block mt-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                t.unlocked ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}>
                {t.unlocked ? 'Unlocked 🏆' : 'Locked 🔒'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
