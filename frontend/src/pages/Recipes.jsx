import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { aiEngine } from '../services/aiEngine';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { triggerConfetti } from '../services/confetti';
import CookModeModal from '../components/CookModeModal';
import { 
  ChefHat, 
  RefreshCw, 
  Sparkles, 
  Clock, 
  Flame, 
  Users, 
  CheckCircle2, 
  Check, 
  Play, 
  Leaf, 
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterTag, setFilterTag] = useState('ALL');
  const [cookedSuccess, setCookedSuccess] = useState(null);
  const [cookModalOpen, setCookModalOpen] = useState(false);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const res = await aiEngine.generateRecipe();
      setRecipes(res.recipes);
      setSelectedRecipe(res.recipes[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleCookMeal = (recipe) => {
    const products = storage.getProducts();
    let consumedCount = 0;

    recipe.matchedIngredients.forEach(ingName => {
      const matched = products.find(p => p.product_name.toLowerCase().includes(ingName.toLowerCase()) || ingName.toLowerCase().includes(p.product_name.toLowerCase()));
      if (matched) {
        api.consumeProduct(matched.id);
        consumedCount++;
      }
    });

    sound.playSuccess();
    triggerConfetti(3000);
    setCookedSuccess(`🍳 Amazing! Cooked "${recipe.title}" and consumed ${consumedCount || 1} expiring item(s) from your kitchen!`);
    setTimeout(() => setCookedSuccess(null), 4000);
  };

  return (
    <DashboardLayout>
      {/* Cooked Success Toast */}
      {cookedSuccess && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 size={20} className="text-emerald-200" />
          <span className="text-sm font-semibold">{cookedSuccess}</span>
        </div>
      )}

      {/* Step-by-Step Cooking Modal */}
      {cookModalOpen && selectedRecipe && (
        <CookModeModal
          recipe={selectedRecipe}
          onClose={() => setCookModalOpen(false)}
          onMealCompleted={(rec) => handleCookMeal(rec)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <Sparkles size={13} />
            <span>AI Zero-Waste Culinary Engine</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <ChefHat className="text-emerald-600" size={32} />
            Smart Recipe Generator
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Chef recommendations crafted specifically from your expiring fridge ingredients.
          </p>
        </div>

        <button 
          onClick={fetchRecipes}
          disabled={loading}
          className="flex items-center space-x-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all hover:scale-105"
        >
          <RefreshCw className={loading ? 'animate-spin text-emerald-500' : 'text-emerald-500'} size={16} />
          <span>Regenerate Recipes</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-200 dark:border-slate-800">
          <ChefHat className="animate-bounce mx-auto text-emerald-500 mb-4" size={48} />
          <h3 className="font-heading font-bold text-lg text-slate-800 dark:text-white">
            AI Chef is Analyzing Your Kitchen...
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Matching flavor profiles, cooking times, and urgent expiry dates
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Recipe Cards Selector */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Suggested Dishes ({recipes.length})
            </h3>

            {recipes.map((r) => {
              const isSelected = selectedRecipe?.id === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRecipe(r)}
                  className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-emerald-50/70 dark:bg-slate-800 border-emerald-500/50 shadow-md ring-2 ring-emerald-500/20' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {r.difficulty}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} /> {r.cookTime}
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-slate-900 dark:text-white text-base">
                    {r.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {r.summary}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Leaf size={12} /> Saves {r.wasteSavedGrams}g waste
                    </span>
                    <span className="text-slate-400">{r.servings} servings</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Recipe Details */}
          {selectedRecipe && (
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                {/* Title & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedRecipe.tags.map(t => (
                        <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
                      {selectedRecipe.title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {selectedRecipe.summary}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setCookModalOpen(true)}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105 flex items-center space-x-1.5 whitespace-nowrap"
                    >
                      <Play size={14} />
                      <span>Start Guided Cooking</span>
                    </button>
                    <button
                      onClick={() => handleCookMeal(selectedRecipe)}
                      className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Check size={14} />
                      <span>Mark Consumed</span>
                    </button>
                  </div>
                </div>

                {/* Quick Info Badges */}
                <div className="grid grid-cols-4 gap-3 my-6 text-center">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <Clock size={16} className="mx-auto text-emerald-500 mb-1" />
                    <p className="text-[10px] text-slate-400">Prep / Cook</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">{selectedRecipe.prepTime}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <Flame size={16} className="mx-auto text-amber-500 mb-1" />
                    <p className="text-[10px] text-slate-400">Calories</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">{selectedRecipe.calories} kcal</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <Users size={16} className="mx-auto text-blue-500 mb-1" />
                    <p className="text-[10px] text-slate-400">Servings</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">{selectedRecipe.servings} ppl</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <Leaf size={16} className="mx-auto text-teal-500 mb-1" />
                    <p className="text-[10px] text-slate-400">Waste Saved</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">{selectedRecipe.wasteSavedGrams}g</p>
                  </div>
                </div>

                {/* Ingredients Section */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Ingredients Needed
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedRecipe.matchedIngredients.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                        <span>{item}</span>
                        <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                          <Check size={10} /> in fridge
                        </span>
                      </div>
                    ))}
                    {selectedRecipe.missingIngredients.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/40 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                        <span>{item}</span>
                        <span className="text-[10px] text-slate-400 font-medium">pantry staple</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step by Step Instructions */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Cooking Steps
                  </h4>
                  <div className="space-y-3">
                    {selectedRecipe.instructions.map((step, idx) => (
                      <div key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="flex-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Storage Pro Tip */}
                {selectedRecipe.storageTip && (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2">
                    <span className="text-base">💡</span>
                    <div>
                      <strong className="block font-bold">Leftover & Storage Tip:</strong>
                      <span>{selectedRecipe.storageTip}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
