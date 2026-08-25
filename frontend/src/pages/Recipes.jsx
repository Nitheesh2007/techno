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
  Award,
  Wand2,
  PlusCircle,
  Compass,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ALL_CUISINES = [
  { id: 'ALL', label: 'All Cuisines', emoji: '🌍' },
  { id: 'Indian', label: 'Indian', emoji: '🇮🇳' },
  { id: 'Italian', label: 'Italian', emoji: '🇮🇹' },
  { id: 'Asian', label: 'Asian', emoji: '🥢' },
  { id: 'Mediterranean', label: 'Mediterranean', emoji: '🫒' },
  { id: 'Mexican', label: 'Mexican', emoji: '🇲🇽' },
  { id: 'French', label: 'French', emoji: '🥐' },
  { id: 'American', label: 'American', emoji: '🇺🇸' }
];

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
  
  // Voice Controls State
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  const [isVoicePaused, setIsVoicePaused] = useState(false);
  
  // Manual AI Recipe Studio State
  const [showManualStudio, setShowManualStudio] = useState(false);
  const [manualForm, setManualForm] = useState({
    ingredients: 'Paneer, Spinach, Garlic, Basmati Rice',
    cuisine: 'Indian',
    mealType: 'Dinner',
    dietary: 'Vegetarian',
    notes: 'Extra aromatic, low oil, zero waste'
  });
  const [isGeneratingManual, setIsGeneratingManual] = useState(false);

  const { t, tf, tc, tl, language } = useLanguage();

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const res = await aiEngine.generateRecipe();
      setRecipes(res.recipes);
      if (!selectedRecipe && res.recipes.length > 0) {
        setSelectedRecipe(res.recipes[0]);
      }
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
      ? `${recipe.title}. வகை: ${recipe.cuisine}. செய்முறை விவரம்: ${recipe.summary}. சமையல் நேரம் ${recipe.cookTime}.`
      : `${recipe.title}. Cuisine: ${recipe.cuisine}. Summary: ${recipe.summary}. Cooking time is ${recipe.cookTime}. Ingredients include: ${recipe.matchedIngredients.join(', ')}.`;

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

  // Generate Custom Manual Recipe from Studio
  const handleGenerateManualRecipe = async (e) => {
    e.preventDefault();
    setIsGeneratingManual(true);
    sound.playBeep(900, 0.05);

    try {
      const customRecipe = await aiEngine.generateManualRecipe(manualForm);
      setRecipes(prev => [customRecipe, ...prev]);
      setSelectedRecipe(customRecipe);
      setShowManualStudio(false);
      sound.playSuccess();
      triggerConfetti(3500);
    } catch (err) {
      console.warn('Manual generation error:', err);
    } finally {
      setIsGeneratingManual(false);
    }
  };

  const filteredRecipes = recipes.filter(r => {
    const matchesMeal = mealTypeFilter === 'ALL' || r.mealType === mealTypeFilter || (mealTypeFilter === 'Quick' && (r.cookTime.includes('10') || r.cookTime.includes('8') || r.cookTime.includes('0') || r.cookTime.includes('7')));
    const matchesCuisine = cuisineFilter === 'ALL' || r.cuisine.toLowerCase() === cuisineFilter.toLowerCase();
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
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2 border border-emerald-500/20">
            <Sparkles size={13} className="text-amber-500" />
            <span>100+ {language === 'ta' ? 'உலகளாவிய சமையல் குறிப்புகள்' : 'Global Master Culinary Recipes'} (115+ {language === 'ta' ? 'உணவுகள்' : 'Dishes'})</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <ChefHat className="text-emerald-600" size={32} />
            {t('recipesTitle')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'ta'
              ? 'இந்தியன், இத்தாலியன், ஆசியன், மெக்சிகன் உள்ளிட்ட 100-க்கும் மேற்பட்ட சமையல் குறிப்புகள் மற்றும் தனிப்பயன் AI செய்முறை ஸ்டுடியோ.'
              : 'Over 100+ zero-waste recipes across Indian, Italian, Asian, Mediterranean, Mexican, French, and American cuisines.'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Manual AI Recipe Generator Button */}
          <button
            onClick={() => setShowManualStudio(!showManualStudio)}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <Wand2 size={15} />
            <span>{language === 'ta' ? '✨ தனிப்பயன் AI செய்முறை உருவாக்கு' : '✨ Manual AI Recipe Studio'}</span>
          </button>

          <button 
            onClick={fetchRecipes}
            disabled={loading}
            className="flex items-center space-x-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all hover:scale-105"
          >
            <RefreshCw className={loading ? 'animate-spin text-emerald-500' : 'text-emerald-500'} size={16} />
            <span>{t('regenerateBtn')}</span>
          </button>
        </div>
      </div>

      {/* MANUAL AI RECIPE GENERATOR STUDIO MODAL / CARD */}
      {showManualStudio && (
        <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/60 to-slate-50 dark:from-slate-850 dark:via-slate-850 dark:to-emerald-950/30 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/50 shadow-xl mb-8 animate-in zoom-in-95 duration-150 relative">
          <button
            onClick={() => setShowManualStudio(false)}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-md">
              <Wand2 size={18} />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
                {language === 'ta' ? '✨ கைமுறை AI செய்முறை யோசனை ஸ்டுடியோ' : '✨ Manual AI Recipe Idea Studio'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'ta'
                  ? 'உங்களிடம் உள்ள எந்த பொருட்களையும் தட்டச்சு செய்து உங்கள் விருப்பமான சமையல் வகையில் புதிய செய்முறையை உடனடியாக உருவாக்குங்கள்.'
                  : 'Type any ingredients you have and customize your cuisine style for instant tailored culinary instructions.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerateManualRecipe} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'ta' ? 'பொருட்கள் (கமாவால் பிரிக்கவும்):' : 'Available Ingredients (comma separated):'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paneer, Spinach, Garlic, Basmati Rice, Tomatoes"
                  value={manualForm.ingredients}
                  onChange={(e) => setManualForm({ ...manualForm, ingredients: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'ta' ? 'சமையல் வகை (Cuisine):' : 'Target Cuisine:'}
                </label>
                <select
                  value={manualForm.cuisine}
                  onChange={(e) => setManualForm({ ...manualForm, cuisine: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                >
                  {['Indian', 'Italian', 'Asian', 'Mediterranean', 'Mexican', 'French', 'American', 'Fusion'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'ta' ? 'உணவு நேரம்:' : 'Meal Type:'}
                </label>
                <select
                  value={manualForm.mealType}
                  onChange={(e) => setManualForm({ ...manualForm, mealType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                >
                  {['Dinner', 'Lunch', 'Breakfast', 'Quick Snack'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'ta' ? 'உணவு விருப்பம்:' : 'Dietary Preference:'}
                </label>
                <select
                  value={manualForm.dietary}
                  onChange={(e) => setManualForm({ ...manualForm, dietary: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                >
                  {['Vegetarian', 'Non-Vegetarian', 'Mixed', 'Vegan', 'High-Protein', 'Gluten-Free', 'Keto-Friendly'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'ta' ? 'கூடுதல் விருப்பங்கள்:' : 'Custom Cooking Notes / Goal:'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Extra spicy, one-pot, crispy"
                  value={manualForm.notes}
                  onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isGeneratingManual}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-2xl text-xs shadow-md shadow-emerald-600/20 flex items-center space-x-2 transition-all hover:scale-105"
              >
                {isGeneratingManual ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>{language === 'ta' ? 'உருவாக்குகிறது...' : 'Generating Recipe...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>{language === 'ta' ? '🚀 தனிப்பயன் செய்முறையை உருவாக்கு' : '🚀 Generate Bespoke AI Recipe'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ALL CUISINES PILL SELECTOR & MULTI-FILTER DECK */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 space-y-4">
        {/* Row 1: Search & Cuisine Horizontal Scroll Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-80 flex-shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder={language === 'ta' ? '100+ செய்முறைகளைத் தேடுங்கள்...' : 'Search across 100+ recipes, ingredients, tags...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
            />
          </div>

          {/* All Cuisines Pill Bar */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full pb-1 lg:pb-0 custom-scrollbar">
            {ALL_CUISINES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCuisineFilter(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shadow-sm ${
                  cuisineFilter === c.id
                    ? 'bg-emerald-600 text-white scale-105 shadow-emerald-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{c.emoji}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Meal Type & Dietary Filters */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Meal Type Filter */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 mr-1 flex items-center gap-1">
              <Utensils size={11} /> {language === 'ta' ? 'உணவு வகை:' : 'Meal:'}
            </span>
            {[
              { id: 'ALL', label: language === 'ta' ? 'அனைத்து' : 'All' },
              { id: 'Breakfast', label: '🍳 Breakfast' },
              { id: 'Lunch', label: '🥪 Lunch' },
              { id: 'Dinner', label: '🍲 Dinner' },
              { id: 'Quick', label: '⚡ Quick (< 15m)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMealTypeFilter(tab.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
                  mealTypeFilter === tab.id
                    ? 'bg-teal-600 text-white font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dietary Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-bold uppercase text-slate-400 mr-1 flex items-center gap-1">
              <Award size={11} /> {language === 'ta' ? 'உணவு முறை:' : 'Diet:'}
            </span>
            {['ALL', 'Vegetarian', 'Non-Vegetarian', 'Mixed', 'Vegan', 'High-Protein'].map((d) => (
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
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
          <ChefHat className="animate-bounce mx-auto text-emerald-500 mb-4" size={48} />
          <h3 className="font-heading font-bold text-lg text-slate-800 dark:text-white">
            {language === 'ta' ? '100-க்கும் மேற்பட்ட சமையல் குறிப்புகள் ஏற்றப்படுகின்றன...' : 'Loading 100+ Global Master Culinary Recipes...'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ta' ? 'அனைத்து உலக சமையல் குறிப்புகளும் ஒருங்கிணைக்கப்படுகின்றன' : 'Matching all international cuisines and pantry expiry dates'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Recipe Cards Selector (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('suggestedDishes')} ({filteredRecipes.length} {language === 'ta' ? 'செய்முறைகள்' : 'recipes found'})
              </h3>
            </div>

            {filteredRecipes.length === 0 ? (
              <p className="text-xs text-slate-400 p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                {language === 'ta' ? 'இந்த வடிகட்டலுக்கு செய்முறைகள் எதுவும் இல்லை.' : 'No recipes match this cuisine/search filter.'}
              </p>
            ) : (
              <div className="space-y-3 max-h-[820px] overflow-y-auto pr-1 custom-scrollbar">
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
                            {tcuisine(r.cuisine || 'Global')}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {tmeal(r.mealType || 'Dinner')}
                          </span>
                          {r.dietary && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                              {tdiet(r.dietary)}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                          <Clock size={12} /> {r.cookTime}
                        </span>
                      </div>

                      <h4 className="font-heading font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                        {t(r.title)}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {t(r.summary)}
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
                        {tcuisine(selectedRecipe.cuisine)}
                      </span>
                      {selectedRecipe.tags?.map(tItem => (
                        <span key={tItem} className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {tcuisine(tItem) !== tItem ? tcuisine(tItem) : (tmeal(tItem) !== tItem ? tmeal(tItem) : (tdiet(tItem) !== tItem ? tdiet(tItem) : tItem))}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
                      {t(selectedRecipe.title)}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {t(selectedRecipe.summary)}
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
                    {selectedRecipe.matchedIngredients?.map((item, idx) => {
                      const allProducts = storage.getProducts();
                      const matchedProd = allProducts.find(p => p.product_name.toLowerCase().includes(item.toLowerCase()) || item.toLowerCase().includes(p.product_name.toLowerCase()));
                      const locationBadge = matchedProd && matchedProd.location ? tl(matchedProd.location) : t('inFridgeBadge');
                      
                      return (
                        <div key={idx} className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                          <span>{tf(item)}</span>
                          <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                            <Check size={10} /> {locationBadge}
                          </span>
                        </div>
                      );
                    })}
                    {selectedRecipe.missingIngredients?.map((item, idx) => (
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
                    {selectedRecipe.instructions?.map((step, idx) => (
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
