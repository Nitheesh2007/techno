import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Check, 
  Sparkles, 
  Clock, 
  ChefHat,
  Flame
} from 'lucide-react';
import { sound, speakVoice } from '../services/sound';
import { triggerConfetti } from '../services/confetti';
import { useLanguage } from '../context/LanguageContext';

export default function CookModeModal({ recipe, onClose, onMealCompleted }) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [ttsActive, setTtsActive] = useState(true);
  const { language, tf } = useLanguage();
  
  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  const steps = recipe?.instructions || (language === 'ta' ? [
    'தேவைக்கேற்ப பாத்திரம் அல்லது கடாயை முன்கூட்டியே சூடாக்கவும்.',
    'காலாவதியாகும் காய்கறிகள் மற்றும் பொருட்களை நறுக்கி தயார் செய்யவும்.',
    'கடாயில் 5-7 நிமிடங்கள் வதக்கி ஒன்றாக கலக்கவும்.',
    'கொத்தமல்லி தூவி சூடாக பரிமாறவும்!'
  ] : [
    'Preheat pan or oven as required.',
    'Chop and prepare your expiring ingredients.',
    'Sauté and combine in pan for 5-7 minutes.',
    'Garnish and serve hot!'
  ]);

  // Timer Tick
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            sound.playTimerAlert();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  // Voice Narration on Step Change with Tamil Speech Synthesis
  useEffect(() => {
    if (ttsActive) {
      const text = language === 'ta'
        ? `படி ${currentStepIdx + 1}: ${steps[currentStepIdx]}`
        : `Step ${currentStepIdx + 1}: ${steps[currentStepIdx]}`;

      speakVoice(text, language);
    }
  }, [currentStepIdx, ttsActive, language]);

  const toggleIng = (ing) => {
    setCheckedIngredients(prev => ({ ...prev, [ing]: !prev[ing] }));
  };

  const handleFinish = () => {
    sound.playSuccess();
    triggerConfetti(3500);
    if (onMealCompleted) {
      onMealCompleted(recipe);
    }
    onClose();
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white font-bold">
              <ChefHat size={22} />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                {language === 'ta' ? 'குரல் வழிகாட்டுதல் சமையல் முறை' : 'Step-by-Step Guided Cook Mode'}
              </span>
              <h2 className="font-heading font-extrabold text-lg sm:text-xl truncate max-w-md">{recipe.title}</h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTtsActive(!ttsActive)}
              className={`p-2 rounded-xl transition-colors ${ttsActive ? 'bg-white/20 text-white' : 'text-slate-400 hover:bg-white/10'}`}
              title={ttsActive ? (language === 'ta' ? 'குரல் வழிகாட்டல் இயக்கம்' : 'Voice narration on') : (language === 'ta' ? 'குரல் வழிகாட்டல் நிறுத்து' : 'Voice narration off')}
            >
              {ttsActive ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title={language === 'ta' ? 'மூடு' : 'Close'}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Ingredients Checklist (4 cols) */}
          <div className="md:col-span-4 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
            <div>
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                {language === 'ta' ? 'தேவையான பொருட்கள் பட்டியல்' : 'Ingredient Checklist'}
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {recipe.matchedIngredients?.map((ing, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleIng(ing)}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center space-x-2.5 cursor-pointer text-xs font-semibold"
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${checkedIngredients[ing] ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                      {checkedIngredients[ing] && <Check size={12} />}
                    </div>
                    <span className={checkedIngredients[ing] ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'}>
                      {tf(ing)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Built-in Cooking Countdown Timer */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                {language === 'ta' ? 'சமையல் டைமர்' : 'Cooking Timer'}
              </span>
              <div className="p-4 rounded-2xl bg-slate-900 text-white text-center">
                <p className="text-3xl font-mono font-extrabold tracking-wider text-emerald-400">
                  {formatTime(timerSeconds)}
                </p>
                <div className="flex justify-center space-x-2 mt-3">
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white transition-colors"
                  >
                    {timerRunning ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button
                    onClick={() => { setTimerRunning(false); setTimerSeconds(300); }}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors"
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button
                    onClick={() => setTimerSeconds(prev => prev + 60)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-300 font-bold"
                  >
                    +1m
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Active Step Guidance (8 cols) */}
          <div className="md:col-span-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Progress bar */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>{language === 'ta' ? `படி ${currentStepIdx + 1} / ${steps.length}` : `Step ${currentStepIdx + 1} of ${steps.length}`}</span>
                <span>{Math.round(((currentStepIdx + 1) / steps.length) * 100)}% {language === 'ta' ? 'முடிந்தது' : 'Completed'}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden mb-8">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentStepIdx + 1) / steps.length) * 100}%` }}
                />
              </div>

              {/* Large Step Typography */}
              <div className="p-8 rounded-3xl bg-emerald-50/50 dark:bg-slate-800/60 border border-emerald-200 dark:border-slate-700 min-h-[220px] flex items-center">
                <div className="space-y-4">
                  <span className="text-4xl font-heading font-extrabold text-emerald-600 dark:text-emerald-400">
                    0{currentStepIdx + 1}.
                  </span>
                  <p className="text-lg sm:text-2xl font-heading font-bold text-slate-900 dark:text-white leading-relaxed">
                    {steps[currentStepIdx]}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
                disabled={currentStepIdx === 0}
                className="flex items-center space-x-2 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft size={16} />
                <span>{language === 'ta' ? 'முந்தைய படி' : 'Previous Step'}</span>
              </button>

              {currentStepIdx < steps.length - 1 ? (
                <button
                  onClick={() => {
                    setCurrentStepIdx(prev => prev + 1);
                    sound.playBeep(980, 0.04);
                  }}
                  className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
                >
                  <span>{language === 'ta' ? 'அடுத்த படி' : 'Next Step'}</span>
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-2xl text-xs font-bold shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 animate-pulse"
                >
                  <Sparkles size={16} />
                  <span>{language === 'ta' ? 'சமையல் முடிந்தது! கொண்டாடுங்கள் 🎉' : 'Meal Finished! Celebrate 🎉'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
