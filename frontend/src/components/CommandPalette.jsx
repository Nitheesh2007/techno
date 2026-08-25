import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ScanLine, 
  ChefHat, 
  CalendarDays, 
  ShoppingCart, 
  Layers, 
  BookOpen, 
  Users, 
  BarChart3, 
  Bell, 
  Settings, 
  RotateCcw,
  Sparkles,
  Command,
  HeartPulse,
  ClipboardCheck,
  Recycle,
  Tag,
  Trophy,
  Home
} from 'lucide-react';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { t, tf, tc, tl, language } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      setProducts(storage.getProducts());
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const NAV_ITEMS = [
    { title: t('navDashboard'), path: '/dashboard', icon: LayoutDashboard, category: language === 'ta' ? 'வழிசெலுத்தல்' : 'Navigation' },
    { title: t('navProducts'), path: '/products', icon: Package, category: language === 'ta' ? 'இருப்பு' : 'Inventory' },
    { title: t('navAddProduct'), path: '/products/add', icon: PlusCircle, category: language === 'ta' ? 'செயல்' : 'Action' },
    { title: t('navScan'), path: '/scan', icon: ScanLine, category: language === 'ta' ? 'செயல்' : 'Action' },
    { title: t('navRecipes'), path: '/recipes', icon: ChefHat, category: language === 'ta' ? 'AI கருவிகள்' : 'AI Tools' },
    { title: t('navMealPlan'), path: '/meal-plan', icon: CalendarDays, category: language === 'ta' ? 'திட்டம்' : 'Planning' },
    { title: t('navShoppingList'), path: '/shopping-list', icon: ShoppingCart, category: language === 'ta' ? 'திட்டம்' : 'Planning' },
    { title: t('navFridgeMap'), path: '/fridge-map', icon: Layers, category: language === 'ta' ? 'சேமிப்பு' : 'Storage' },
    { title: t('navNutrition'), path: '/nutrition', icon: HeartPulse, category: language === 'ta' ? 'ஆரோக்கியம்' : 'Health' },
    { title: t('navAudit'), path: '/audit', icon: ClipboardCheck, category: language === 'ta' ? 'கருவிகள்' : 'Tools' },
    { title: t('navPreservation'), path: '/preservation-guide', icon: BookOpen, category: language === 'ta' ? 'அறிவுக்களஞ்சியம்' : 'Knowledge' },
    { title: t('navCompost'), path: '/compost', icon: Recycle, category: language === 'ta' ? 'மறுபயன்பாடு' : 'Sustainability' },
    { title: t('navDeals'), path: '/deals-radar', icon: Tag, category: language === 'ta' ? 'சேமிப்பு' : 'Savings' },
    { title: t('navChallenges'), path: '/challenges', icon: Trophy, category: language === 'ta' ? 'சவால்கள்' : 'Gamification' },
    { title: t('navHousehold'), path: '/household', icon: Home, category: language === 'ta' ? 'வீடு' : 'Household' },
    { title: t('navCommunity'), path: '/community', icon: Users, category: language === 'ta' ? 'சமூகம்' : 'Community' },
    { title: t('navBarcode'), path: '/barcode-hub', icon: Command, category: language === 'ta' ? 'கருவிகள்' : 'Tools' },
    { title: t('navAnalytics'), path: '/analytics', icon: BarChart3, category: language === 'ta' ? 'பகுப்பாய்வு' : 'Analytics' },
    { title: t('navAlerts'), path: '/notifications', icon: Bell, category: language === 'ta' ? 'எச்சரிக்கைகள்' : 'Alerts' },
    { title: t('navSettings'), path: '/settings', icon: Settings, category: language === 'ta' ? 'அமைப்புகள்' : 'System' }
  ];

  const filteredNav = NAV_ITEMS.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProducts = products.filter(p => 
    p.product_name.toLowerCase().includes(query.toLowerCase()) || 
    (p.category && p.category.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 5);

  const handleSelectNav = (path) => {
    sound.playClick?.() || sound.playBeep(900, 0.04);
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[75vh]">
        {/* Search Input */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-3">
          <Search className="text-slate-400" size={20} />
          <input
            type="text"
            autoFocus
            placeholder={language === 'ta' ? 'ஒரு கட்டளையைத் தட்டச்சு செய்யவும் அல்லது உணவைத் தேடவும்...' : 'Type a command, search food, or jump to page...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-slate-900 dark:text-white outline-none text-sm sm:text-base placeholder-slate-400"
          />
          <span className="text-[10px] font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-400 px-2 py-1 rounded">
            ESC {language === 'ta' ? 'மூடு' : 'close'}
          </span>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Matching Products */}
          {query.trim() && filteredProducts.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
                {language === 'ta' ? 'பொருந்திய குளிர்சாதனப் பொருட்கள்' : 'Matching Fridge Inventory'}
              </span>
              <div className="space-y-1">
                {filteredProducts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => { navigate('/products'); onClose(); }}
                    className="p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer text-xs transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-bold text-slate-900 dark:text-white">{tf(p.product_name)}</span>
                      <span className="text-slate-400 font-mono">({tl(p.location || 'Fridge')})</span>
                    </div>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{p.status === 'SAFE' ? t('statusSafe') : t('statusUrgent')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
              {language === 'ta' ? 'அனைத்து 20 தொகுதிகள் & குறுக்குவழிகள்' : 'All 20 Modules & Quick Actions'}
            </span>
            <div className="space-y-1">
              {filteredNav.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectNav(item.path)}
                    className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Icon size={16} />
                      </div>
                      <span className="font-heading font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
