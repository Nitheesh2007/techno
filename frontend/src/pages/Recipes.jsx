import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { aiEngine } from '../services/aiEngine';
import { storage } from '../services/storage';
import { sound, speakVoice, pauseVoice, resumeVoice, stopVoice } from '../services/sound';
import { triggerConfetti } from '../services/confetti';
import { useLanguage } from '../context/LanguageContext';
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
  Pause,
  Square,
  Volume2,
  Leaf, 
  ArrowRight,
  Search,
  Filter,
  Utensils,
  Globe,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cookedSuccess, setCookedSuccess] = useState(null);
  const [cookModalOpen, setCookModalOpen] = useState(false);
  const [mealTypeFilter, setMealTypeFilter] = useState('ALL');
  const [cuisineFilter, setCuisineFilter] = useState('ALL');
  const [dietaryFilter, setDietaryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  const [isVoicePaused, setIsVoicePaused] = useState(false);
  const { t, tf, tc, tl, language } = useLanguage();

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
    return () => stopVoice();
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
    setCookedSuccess(language === 'ta'
      ? `🍳 அற்புதம்! "${recipe.title}" சமைக்கப்பட்டது மற்றும் ${consumedCount || 1} காலாவதியாகும் பொருட்கள் பயன்படுத்தப்பட்டன!`
      : `🍳 Amazing! Cooked "${recipe.title}" and consumed ${consumedCount || 1} expiring item(s) from your kitchen!`);
    setTimeout(() => setCookedSuccess(null), 4000);
  };

  const handleReadRecipeAloud = (recipe) => {
    if (!recipe) return;
    setIsVoiceSpeaking(true);
    setIsVoicePaused(false);
    const speechText = language === 'ta'
      ? `${recipe.title}. செய்முறை விவரம்: ${recipe.summary}. சமையல் நேரம் ${recipe.cookTime}.`
      : `${recipe.title}. Summary: ${recipe.summary}. Cooking time is ${recipe.cookTime}. Ingredients include: ${recipe.matchedIngredients.join(', ')}.`;

    speakVoice(speechText, language, () => {
      setIsVoiceSpeaking(false);
      setIsVoicePaused(false);
    });
  };

  const handlePauseVoice = () => {
    pauseVoice();
    setIsVoicePaused(true);
    sound.playBeep(650, 0.03);
  };

  const handleResumeVoice = () => {
    resumeVoice();
    setIsVoicePaused(false);
    sound.playBeep(850, 0.03);
  };

  const handleStopVoice = () => {
    stopVoice();
    setIsVoiceSpeaking(false);
    setIsVoicePaused(false);
    sound.playBeep(450, 0.04);
  };

  const filteredRecipes = recipes.filter(r => {
    const matchesMeal = mealTypeFilter === 'ALL' || r.mealType === mealTypeFilter || (mealTypeFilter === 'Quick' && (r.cookTime.includes('10') || r.cookTime.includes('8') || r.cookTime.includes('0') || r.cookTime.includes('7')));
    const matchesCuisine = cuisineFilter === 'ALL' || r.cuisine === cuisineFilter;
    const matchesDiet = dietaryFilter === 'ALL' || r.dietary === dietaryFilter || r.tags.includes(dietaryFilter);
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.matchedIngredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.cuisine && r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesMeal && matchesCuisine && matchesDiet && matchesSearch;
  });

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <Sparkles size={13} />
            <span>{t('aiCulinaryBadge')} (20+ {language === 'ta' ? 'செய்முறைகள்' : 'Dishes'})</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <ChefHat className="text-emerald-600" size={32} />
            {t('recipesTitle')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'ta' ? 'உங்கள் குளிர்சாதனப் பெட்டியில் உள்ள காலாவதியாகும் உணவுகளைக் கொண்டு 20-க்கும் மேற்பட்ட சுவையான சமையல் குறிப்புகள்.' : 'Explore 20+ smart zero-waste culinary recipes engineered to rescue your ingredients before expiry.'}
          </p>
        </div>

        <button 
          onClick={fetchRecipes}
          disabled={loading}
          className="flex items-center space-x-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all hover:scale-105"
        >
          <RefreshCw className={loading ? 'animate-spin text-emerald-500' : 'text-emerald-500'} size={16} />
          <span>{t('regenerateBtn')}</span>
        </button>
      </div>

      {/* Search & Multi-Filter Deck */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 space-y-4">
        {/* Row 1: Search & Meal Type */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder={language === 'ta' ? 'செய்முறை அல்லது உணவுகளைத் தேடுங்கள்...' : 'Search recipes, ingredients, tags...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Meal Type Filter */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'ALL', label: language === 'ta' ? 'அனைத்து உணவுகள்' : 'All Dishes' },
              { id: 'Breakfast', label: language === 'ta' ? '🍳 காலை உணவு' : '🍳 Breakfast' },
              { id: 'Lunch', label: language === 'ta' ? '🥪 மதிய உணவு' : '🥪 Lunch' },
              { id: 'Dinner', label: language === 'ta' ? '🍲 இரவு உணவு' : '🍲 Dinner' },
              { id: 'Quick', label: language === 'ta' ? '⚡ விரைவு (< 15m)' : '⚡ Quick (< 15m)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMealTypeFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  mealTypeFilter === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Cuisine Pills & Dietary Filter */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Cuisine Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 mr-1 flex items-center gap-1">
              <Globe size={11} /> {language === 'ta' ? 'சமையல் வகை:' : 'Cuisine:'}
            </span>
            {['ALL', 'Italian', 'Asian', 'Mediterranean', 'Indian', 'Mexican', 'American', 'French'].map((c) => (
              <button
                key={c}
                onClick={() => setCuisineFilter(c)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
                  cuisineFilter === c
                    ? 'bg-teal-600 text-white font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {c === 'ALL' ? (language === 'ta' ? 'அனைத்து' : 'All') : c}
              </button>
            ))}
          </div>

          {/* Dietary Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-bold uppercase text-slate-400 mr-1 flex items-center gap-1">
              <Award size={11} /> {language === 'ta' ? 'உணவு முறை:' : 'Diet:'}
            </span>
            {['ALL', 'High-Protein', 'Vegetarian', 'Vegan'].map((d) => (
              <button
                key={d}
                onClick={() => setDietaryFilter(d)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
                  dietaryFilter === d
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {d === 'ALL' ? (language === 'ta' ? 'அனைத்து' : 'All') : d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-200 dark:border-slate-800">
          <ChefHat className="animate-bounce mx-auto text-emerald-500 mb-4" size={48} />
          <h3 className="font-heading font-bold text-lg text-slate-800 dark:text-white">
            {language === 'ta' ? 'AI செஃப் சமையலறையை ஆய்வு செய்து 20-க்கும் மேற்பட்ட புதிய செய்முறைகளை உருவாக்குகிறார்...' : 'AI Chef is Generating 20+ Fresh Culinary Creations...'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ta' ? 'சுவை, சமையல் நேரம் மற்றும் காலாவதி தேதிகள் பொருத்தப்படுகின்றன' : 'Matching flavor profiles, cooking times, and urgent expiry dates'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Recipe Cards Selector (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('suggestedDishes')} ({filteredRecipes.length} {language === 'ta' ? 'செய்முறைகள்' : 'dishes'})
              </h3>
            </div>

            {filteredRecipes.length === 0 ? (
              <p className="text-xs text-slate-400 p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                {language === 'ta' ? 'இந்த வடிகட்டலுக்கு செய்முறைகள் எதுவும் இல்லை.' : 'No recipes match this search/filter.'}
              </p>
            ) : (
              <div className="space-y-3 max-h-[780px] overflow-y-auto pr-1 custom-scrollbar">
                {filteredRecipes.map((r) => {
                  const isSelected = selectedRecipe?.id === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => {
                        handleStopVoice();
                        setSelectedRecipe(r);
                      }}
                      className={`p-4 sm:p-5 rounded-3xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-emerald-50/70 dark:bg-slate-800 border-emerald-500/50 shadow-md ring-2 ring-emerald-500/20 scale-[1.01]' 
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            {r.mealType || 'Dinner'}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {r.cuisine || 'Fusion'}
                          </span>
                          {r.dietary && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                              {r.dietary}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                          <Clock size={12} /> {r.cookTime}
                        </span>
                      </div>

                      <h4 className="font-heading font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                        {r.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {r.summary}
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Leaf size={12} /> {t('wasteSaved')}: {r.wasteSavedGrams}g
                        </span>
                        <span className="text-slate-400">{r.servings} {t('servings')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Active Recipe Details (7 cols) */}
          {selectedRecipe && (
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">
                        {selectedRecipe.cuisine}
                      </span>
                      {selectedRecipe.tags.map(tItem => (
                        <span key={tItem} className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {tItem}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
                      {selectedRecipe.title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {selectedRecipe.summary}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Voice Read Aloud Controls (Play, Pause, Stop) */}
                    {!isVoiceSpeaking ? (
                      <button
                        onClick={() => handleReadRecipeAloud(selectedRecipe)}
                        className="bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
                        title="Read recipe aloud"
                      >
                        <Volume2 size={15} />
                        <span>{language === 'ta' ? 'வாசி' : 'Read Aloud'}</span>
                      </button>
                    ) : (
                      <div className="flex items-center space-x-1 bg-emerald-50 dark:bg-emerald-950/80 p-1 rounded-xl border border-emerald-300 dark:border-emerald-700">
                        {isVoicePaused ? (
                          <button
                            onClick={handleResumeVoice}
                            className="p-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 px-2"
                            title="Resume voice"
                          >
                            <Play size={12} /> {language === 'ta' ? 'தொடர்' : 'Resume'}
                          </button>
                        ) : (
                          <button
                            onClick={handlePauseVoice}
                            className="p-1.5 rounded-lg bg-amber-500 text-white text-xs font-bold flex items-center gap-1 px-2"
                            title="Pause voice"
                          >
                            <Pause size={12} /> {language === 'ta' ? 'நிறுத்து' : 'Pause'}
                          </button>
                        )}
                        <button
                          onClick={handleStopVoice}
                          className="p-1.5 rounded-lg bg-rose-500 text-white text-xs font-bold flex items-center gap-1 px-2"
                          title="Stop voice"
                        >
                          <Square size={12} /> {language === 'ta' ? 'முடிக்க' : 'Stop'}
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        handleStopVoice();
                        setCookModalOpen(true);
                      }}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105 flex items-center space-x-1.5 whitespace-nowrap"
                    >
                      <Play size={14} />
                      <span>{t('startGuidedCooking')}</span>
                    </button>
                    <button
                      onClick={() => handleCookMeal(selectedRecipe)}
                      className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold px-3.5 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Check size={14} />
                      <span>{t('markConsumed')}</span>
                    </button>
                  </div>
                </div>

                {/* Quick Info Badges */}
                <div className="grid grid-cols-4 gap-3 my-6 text-center">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <Clock size={16} className="mx-auto text-emerald-500 mb-1" />
                    <p className="text-[10px] text-slate-400">{t('prepCook')}</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">{selectedRecipe.prepTime}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <Flame size={16} className="mx-auto text-amber-500 mb-1" />
                    <p className="text-[10px] text-slate-400">{t('calories')}</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">{selectedRecipe.calories} kcal</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <Users size={16} className="mx-auto text-blue-500 mb-1" />
                    <p className="text-[10px] text-slate-400">{t('servings')}</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">{selectedRecipe.servings}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <Leaf size={16} className="mx-auto text-teal-500 mb-1" />
                    <p className="text-[10px] text-slate-400">{t('wasteSaved')}</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">{selectedRecipe.wasteSavedGrams}g</p>
                  </div>
                </div>

                {/* Ingredients Section */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    {t('ingredientsNeeded')}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedRecipe.matchedIngredients.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                        <span>{tf(item)}</span>
                        <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                          <Check size={10} /> {t('inFridgeBadge')}
                        </span>
                      </div>
                    ))}
                    {selectedRecipe.missingIngredients.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/40 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                        <span>{tf(item)}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{t('pantryStaple')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cooking Steps */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    {t('cookingSteps')}
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
                      <strong className="block font-bold">{t('storageTipHeading')}</strong>
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
