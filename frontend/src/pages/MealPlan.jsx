import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { triggerConfetti } from '../services/confetti';
import { useLanguage } from '../context/LanguageContext';
import { 
  CalendarDays, 
  Sparkles, 
  ChefHat, 
  RefreshCw, 
  Utensils, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Edit2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export default function MealPlan() {
  const [mealPlan, setMealPlan] = useState({});
  const [editingDay, setEditingDay] = useState(null);
  const [editMealType, setEditMealType] = useState('dinner');
  const [editValue, setEditValue] = useState('');
  const [toastMsg, setToastMsg] = useState(null);
  const { t, tf, tc, tl, language } = useLanguage();

  const loadPlan = () => {
    setMealPlan(storage.getMealPlan());
  };

  useEffect(() => {
    loadPlan();
  }, []);

  const handleSaveMeal = () => {
    if (!editingDay) return;
    const current = { ...mealPlan };
    if (!current[editingDay]) current[editingDay] = {};
    current[editingDay][editMealType] = editValue;

    storage.saveMealPlan(current);
    sound.playSuccess();
    setToastMsg(language === 'ta' ? `📅 ${editingDay} உணவு புதுப்பிக்கப்பட்டது!` : `📅 Updated ${editingDay} ${editMealType}!`);
    setTimeout(() => setToastMsg(null), 3000);
    setEditingDay(null);
    loadPlan();
  };

  const handleAutoPlan = () => {
    const products = storage.getProducts();
    const urgent = products.filter(p => p.status === 'URGENT' || p.status === 'EXPIRING SOON');

    const generated = {
      Monday: { breakfast: 'Smoothie Bowl', lunch: 'Garden Salad Wrap', dinner: urgent[0] ? `Zero-Waste Stir Fry with ${urgent[0].product_name}` : 'Penne Primavera' },
      Tuesday: { breakfast: 'Toast with Fruit', lunch: 'Toasted Melt', dinner: urgent[1] ? `Herb Roasted ${urgent[1].product_name}` : 'Veggie Skillet' },
      Wednesday: { breakfast: 'Oatmeal Porridge', lunch: 'Leftover Bowl', dinner: 'Creamy Garlic Pasta' },
      Thursday: { breakfast: 'Fruit Parfait', lunch: 'Crispy Sourdough Melt', dinner: 'Zero-Waste Kitchen Stew' },
      Friday: { breakfast: 'Scrambled Eggs', lunch: 'Fresh Green Salad', dinner: 'Chef Special Pizza' },
      Saturday: { breakfast: 'Pancakes with Berries', lunch: 'Sandwich Platter', dinner: 'Weekend Feast' },
      Sunday: { breakfast: 'Sunday Breakfast', lunch: 'Pasta Bowl', dinner: 'Fridge Reset Soup' }
    };

    storage.saveMealPlan(generated);
    sound.playSuccess();
    triggerConfetti(3000);
    setToastMsg(language === 'ta' ? '✨ காலாவதியாகும் உணவுகளைக் கொண்டு வாராந்திர உணவுத் திட்டம் உருவாக்கப்பட்டது!' : '✨ Auto-generated 7-day plan from expiring ingredients!');
    setTimeout(() => setToastMsg(null), 3500);
    loadPlan();
  };

  const dayLabels = {
    Monday: language === 'ta' ? 'திங்கட்கிழமை (Mon)' : 'Monday',
    Tuesday: language === 'ta' ? 'செவ்வாய்க்கிழமை (Tue)' : 'Tuesday',
    Wednesday: language === 'ta' ? 'புதன்கிழமை (Wed)' : 'Wednesday',
    Thursday: language === 'ta' ? 'வியாழக்கிழமை (Thu)' : 'Thursday',
    Friday: language === 'ta' ? 'வெள்ளிக்கிழமை (Fri)' : 'Friday',
    Saturday: language === 'ta' ? 'சனிக்கிழமை (Sat)' : 'Saturday',
    Sunday: language === 'ta' ? 'ஞாயிற்றுக்கிழமை (Sun)' : 'Sunday'
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
              <span>{t('navMealPlan')}</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <CalendarDays className="text-emerald-600" size={32} />
              {language === 'ta' ? 'பூஜ்ஜிய கழிவு வாராந்திர உணவுத் திட்டம்' : 'Zero-Waste Weekly Meal Planner'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'ta' ? 'காலாவதியாகும் உணவுகளை முன்கூட்டியே திட்டமிட்டு சமையுங்கள்.' : 'Schedule breakfast, lunch, and dinner to consume urgent ingredients first.'}
            </p>
          </div>

          <button
            onClick={handleAutoPlan}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <Sparkles size={16} />
            <span>{language === 'ta' ? 'தானியங்கி வாராந்திர திட்டம்' : '1-Click Auto-Plan'}</span>
          </button>
        </div>

        {/* 7-Day Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {DAYS_OF_WEEK.map((day) => {
            const plan = mealPlan[day] || {};
            return (
              <div
                key={day}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">
                      {dayLabels[day]}
                    </h3>
                  </div>

                  {/* 3 Slots */}
                  <div className="space-y-3">
                    {/* Breakfast */}
                    <div
                      onClick={() => { setEditingDay(day); setEditMealType('breakfast'); setEditValue(plan.breakfast || ''); }}
                      className="p-2.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 cursor-pointer hover:border-amber-400 text-xs transition-all"
                    >
                      <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-300 block mb-0.5">
                        🍳 {language === 'ta' ? 'காலை உணவு' : 'Breakfast'}
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 font-semibold truncate">
                        {tf(plan.breakfast) || <span className="text-slate-400 italic">{language === 'ta' ? '+ உணவு சேர்க்க கிளிக் செய்க' : '+ Add meal'}</span>}
                      </p>
                    </div>

                    {/* Lunch */}
                    <div
                      onClick={() => { setEditingDay(day); setEditMealType('lunch'); setEditValue(plan.lunch || ''); }}
                      className="p-2.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40 cursor-pointer hover:border-blue-400 text-xs transition-all"
                    >
                      <span className="text-[10px] font-bold uppercase text-blue-700 dark:text-blue-300 block mb-0.5">
                        🥪 {language === 'ta' ? 'மதிய உணவு' : 'Lunch'}
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 font-semibold truncate">
                        {tf(plan.lunch) || <span className="text-slate-400 italic">{language === 'ta' ? '+ உணவு சேர்க்க கிளிக் செய்க' : '+ Add meal'}</span>}
                      </p>
                    </div>

                    {/* Dinner */}
                    <div
                      onClick={() => { setEditingDay(day); setEditMealType('dinner'); setEditValue(plan.dinner || ''); }}
                      className="p-2.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 cursor-pointer hover:border-emerald-400 text-xs transition-all"
                    >
                      <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300 block mb-0.5">
                        🍲 {language === 'ta' ? 'இரவு உணவு' : 'Dinner'}
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 font-semibold truncate">
                        {tf(plan.dinner) || <span className="text-slate-400 italic">{language === 'ta' ? '+ உணவு சேர்க்க கிளிக் செய்க' : '+ Add meal'}</span>}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Edit Modal */}
        {editingDay && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-150">
              <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white mb-2">
                {language === 'ta' ? `${editingDay} உணவைத் திருத்து` : `Edit ${editingDay} ${editMealType}`}
              </h3>
              <input
                type="text"
                autoFocus
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                placeholder="e.g. Avocado Toast, Spinach Pasta..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500 mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingDay(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500"
                >
                  {language === 'ta' ? 'ரத்துசெய்' : 'Cancel'}
                </button>
                <button
                  onClick={handleSaveMeal}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md"
                >
                  {language === 'ta' ? 'சேமி' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
