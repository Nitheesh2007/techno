import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { 
  CalendarDays, 
  Sparkles, 
  ChefHat, 
  Plus, 
  Check, 
  Clock, 
  Utensils, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MealPlan() {
  const [mealPlan, setMealPlan] = useState(storage.getMealPlan());
  const [activeDay, setActiveDay] = useState('Monday');
  const [editSlot, setEditSlot] = useState(null); // { day, slot }
  const [editText, setEditText] = useState('');
  const [successToast, setSuccessToast] = useState(null);

  const handleSaveSlot = () => {
    if (!editSlot) return;
    const updated = { ...mealPlan };
    updated[editSlot.day] = {
      ...updated[editSlot.day],
      [editSlot.slot]: editText
    };
    setMealPlan(updated);
    storage.saveMealPlan(updated);
    setEditSlot(null);
    setSuccessToast('Meal plan updated successfully!');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleAutoGenerateZeroWaste = () => {
    const products = storage.getProducts();
    const urgentItems = products.filter(p => p.status === 'URGENT' || p.status === 'EXPIRING SOON');
    const urgentName1 = urgentItems[0]?.product_name || 'Fresh Produce';
    const urgentName2 = urgentItems[1]?.product_name || 'Artisan Bakery';

    const newPlan = { ...mealPlan };
    newPlan[activeDay] = {
      breakfast: `Zero-Waste ${urgentName2} French Toast / Parfait`,
      lunch: `Quick ${urgentName1} Sauté & Toast`,
      dinner: `AI Chef Zero-Waste Stir Fry with ${urgentName1}`
    };

    setMealPlan(newPlan);
    storage.saveMealPlan(newPlan);
    setSuccessToast(`✨ Optimized ${activeDay}'s plan with your expiring items!`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  return (
    <DashboardLayout>
      {/* Toast */}
      {successToast && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 size={20} className="text-emerald-200" />
          <span className="text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <Sparkles size={13} />
            <span>Weekly Zero-Waste Planner</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <CalendarDays className="text-emerald-600" size={32} />
            Meal Planner
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize breakfast, lunch, and dinner to consume items before they expire.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAutoGenerateZeroWaste}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <Sparkles size={16} />
            <span>Auto-Plan with Expiring Items</span>
          </button>
          <Link
            to="/recipes"
            className="flex items-center space-x-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <ChefHat size={16} className="text-emerald-500" />
            <span>Browse AI Recipes</span>
          </Link>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-5 py-3 rounded-2xl font-heading font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
              activeDay === day
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Day Meal Slots Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {['breakfast', 'lunch', 'dinner'].map((slot) => {
          const currentMeal = mealPlan[activeDay]?.[slot] || 'No meal scheduled';
          const isEditing = editSlot?.day === activeDay && editSlot?.slot === slot;

          return (
            <div
              key={slot}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {slot.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{activeDay}</span>
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      placeholder="Enter dish name..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                      autoFocus
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveSlot}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditSlot(null)}
                        className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-heading font-bold text-slate-900 dark:text-white text-lg">
                      {currentMeal}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                      <Utensils size={13} /> Balanced Zero-Waste Recipe
                    </p>
                  </div>
                )}
              </div>

              {!isEditing && (
                <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => {
                      setEditSlot({ day: activeDay, slot });
                      setEditText(currentMeal);
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    Edit Meal ✏️
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Week Overview Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-4">
          Weekly Overview Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Day</th>
                <th className="py-3 px-4">Breakfast</th>
                <th className="py-3 px-4">Lunch</th>
                <th className="py-3 px-4">Dinner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {DAYS.map(d => (
                <tr key={d} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{d}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{mealPlan[d]?.breakfast || '-'}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{mealPlan[d]?.lunch || '-'}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{mealPlan[d]?.dinner || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
