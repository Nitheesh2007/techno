import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  translations, 
  translateFood, 
  translateCategory, 
  translateLocation,
  translateUnit,
  translateDay,
  translateMealType,
  translateCuisine,
  translateDiet,
  translateStatus
} from '../services/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('feg_language');
    if (saved && (saved === 'en' || saved === 'ta')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('feg_language', lang);
  };

  const t = (key, params = {}) => {
    const langDict = translations[language] || translations.en;
    let text = langDict[key] || translations.en[key] || key;

    if (typeof text === 'string' && params) {
      Object.keys(params).forEach(p => {
        text = text.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p]);
      });
    }

    return text;
  };

  const tf = (name) => translateFood(name, language);
  const tc = (category) => translateCategory(category, language);
  const tl = (location) => translateLocation(location, language);
  const tu = (unit) => translateUnit(unit, language);
  const tday = (day) => translateDay(day, language);
  const tmeal = (meal) => translateMealType(meal, language);
  const tcuisine = (cuisine) => translateCuisine(cuisine, language);
  const tdiet = (diet) => translateDiet(diet, language);
  const tstatus = (status) => translateStatus(status, language);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      tf, 
      tc, 
      tl,
      tu,
      tday,
      tmeal,
      tcuisine,
      tdiet,
      tstatus
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
