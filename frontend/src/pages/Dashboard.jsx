import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { triggerConfetti } from '../services/confetti';
import { useLanguage } from '../context/LanguageContext';
import { 
  Package, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Plus, 
  ScanLine, 
  CheckCircle2, 
  Utensils, 
  ChefHat, 
  TrendingUp,
  Leaf,
  DollarSign,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Layers,
  ShoppingCart,
  BookOpen,
  Bell,
  ArrowRight,
  Zap,
  Globe,
  HeartPulse,
  ClipboardCheck,
  Recycle,
  Tag,
  Trophy,
  Home,
  Users,
  BarChart3,
  Settings,
  Bot,
  CalendarDays
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState(storage.getDashboardStats());
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [consumedItemName, setConsumedItemName] = useState(null);
  const [guideExpanded, setGuideExpanded] = useState(true);
  const [modulesTab, setModulesTab] = useState('ALL');
  const { t, tf, tc, tl, language } = useLanguage();
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
      setStats(storage.getDashboardStats());
    } catch (e) {
      console.error(e);
      const local = storage.getProducts();
      setProducts(local);
      setStats(storage.getDashboardStats());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleConsume = async (id, name) => {
    try {
      await api.consumeProduct(id);
      sound.playSuccess();
      triggerConfetti(2500);
      setConsumedItemName(name);
      setTimeout(() => setConsumedItemName(null), 3500);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const urgentItems = products.filter(p => p.status === 'URGENT' || p.status === 'EXPIRING SOON');

  // Chart 1: Expiry Timeline Data
  const timelineData = [
    { name: t('statusSafe'), count: stats.safe_products, fill: '#10b981' },
    { name: t('statusSoon'), count: stats.expiring_soon, fill: '#f59e0b' },
    { name: t('statusUrgent'), count: stats.urgent_products, fill: '#f43f5e' },
    { name: t('statusExpired'), count: stats.expired_products, fill: '#64748b' }
  ];

  // Chart 2: Category Breakdown Data
  const categoryCounts = {};
  products.forEach(p => {
    const cat = p.category || (language === 'ta' ? 'பொதுவானது' : 'General');
    categoryCounts[cat] = (categoryCounts[cat] || 0) + (p.quantity || 1);
  });

  const categoryColors = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#14b8a6', '#6366f1'];
  const categoryData = Object.keys(categoryCounts).map((cat, idx) => ({
    name: cat,
    value: categoryCounts[cat],
    fill: categoryColors[idx % categoryColors.length]
  }));

  // Complete Directory of All Integrated Modules
  const ALL_MODULES = [
    {
      id: 'products',
      name: language === 'ta' ? 'உணவுப் பட்டியல் & இருப்பு' : 'Food Inventory Manager',
      path: '/products',
      icon: Package,
      group: 'culinary',
      badge: 'Core',
      badgeColor: 'bg-emerald-500',
      desc: language === 'ta'
        ? 'உங்கள் குளிர்சாதனப் பெட்டியில் உள்ள அனைத்து உணவுகளின் அடுக்கு வாழ்க்கை, சேமிப்பு இடம் மற்றும் பாதுகாப்பு நிலையை நேரடியாகக் கண்காணிக்கவும்.'
        : 'Real-time kitchen inventory tracking with status indicators (Safe, Soon, Urgent, Expired), live search, and celebratory waste logging.'
    },
    {
      id: 'add',
      name: language === 'ta' ? 'உணவு சேர் & நினைவூட்டல்' : 'Add Food & Reminder Lead-Time',
      path: '/products/add',
      icon: Plus,
      group: 'culinary',
      badge: 'Reminder Alert',
      badgeColor: 'bg-teal-500',
      desc: language === 'ta'
        ? 'உணவுகளைச் சேர்த்து, காலாவதிக்கு எத்தனை நாட்களுக்கு முன்பு (1, 2, 3, 5, 7 நாட்கள்) எச்சரிக்கை பெற வேண்டும் என்பதைத் தேர்ந்தெடுக்கவும்.'
        : 'Manual food entry with customizable expiry reminder lead-time options and real-time target alert date preview.'
    },
    {
      id: 'scan',
      name: language === 'ta' ? 'ஸ்மார்ட் OCR & பார்கோடு ஸ்கேனர்' : 'Smart OCR & Barcode Scanner',
      path: '/scan',
      icon: ScanLine,
      group: 'culinary',
      badge: 'AI Vision',
      badgeColor: 'bg-indigo-500',
      desc: language === 'ta'
        ? 'கேமரா, புகைப்பட பதிவேற்றம் அல்லது 1-கிளிக் சோதனை மாதிரிகள் மூலம் பார்கோடு மற்றும் காலாவதி தேதிகளைத் தானாகப் பிரித்தெடுக்கவும்.'
        : 'Multi-engine scanner featuring live camera viewfinder, photo upload, 1-click presets, and exact decoded barcode visual displays.'
    },
    {
      id: 'recipes',
      name: language === 'ta' ? '20+ ஸ்மார்ட் AI செய்முறை செஃப்' : '20+ Smart AI Recipe Generator',
      path: '/recipes',
      icon: ChefHat,
      group: 'culinary',
      badge: '20+ Recipes',
      badgeColor: 'bg-amber-500',
      desc: language === 'ta'
        ? 'காலாவதியாகும் பொருட்களைக் கொண்டு 20-க்கும் மேற்பட்ட சர்வதேச உணவு குறிப்புகள், உணவு வகை/சமையல் வடிகட்டல்கள் மற்றும் குரல் டைமர்கள்.'
        : '20+ international zero-waste culinary recipes tailored to your ingredients with live search, meal type filters, and guided cook mode.'
    },
    {
      id: 'meal-plan',
      name: language === 'ta' ? 'பூஜ்ஜிய கழிவு வாராந்திர உணவுத் திட்டம்' : 'Zero-Waste Weekly Meal Planner',
      path: '/meal-plan',
      icon: CalendarDays,
      group: 'culinary',
      badge: '7-Day Plan',
      badgeColor: 'bg-purple-500',
      desc: language === 'ta'
        ? 'வாராந்திர காலை, மதிய மற்றும் இரவு உணவு அட்டவணை; 1-கிளிக்கில் காலாவதியாகும் உணவுகளுக்கு முன்னுரிமை அளித்து தானியங்கி திட்டம் உருவாக்கவும்.'
        : '7-day meal matrix with 1-click auto-planning that intelligently schedules dishes to consume urgent fridge ingredients first.'
    },
    {
      id: 'shopping',
      name: language === 'ta' ? 'ஸ்மார்ட் ஷாப்பிங் பட்டியல் & மறுஇருப்பு' : 'Smart Shopping List & Auto-Restock',
      path: '/shopping-list',
      icon: ShoppingCart,
      group: 'grocery',
      badge: 'Auto-Restock',
      badgeColor: 'bg-blue-500',
      desc: language === 'ta'
        ? 'சாப்பிட்டு முடித்த உணவுகள் தானாக இங்கே சேர்க்கப்படும். 1-கிளிக்கில் வாங்கியவற்றை மீண்டும் குளிர்சாதனப் பெட்டியில் சேர்க்கலாம்.'
        : 'Consumed foods automatically populate in shopping list; features budget tally, WhatsApp sharing, and 1-click fridge transfer.'
    },
    {
      id: 'fridge-map',
      name: language === 'ta' ? '2D குளிர்சாதன பெட்டி வரைபடம்' : 'Interactive 2D Fridge Thermal Map',
      path: '/fridge-map',
      icon: Layers,
      group: 'grocery',
      badge: '7 Zones',
      badgeColor: 'bg-cyan-500',
      desc: language === 'ta'
        ? 'மேல் தட்டு, நடு தட்டு, கீழ் தட்டு, காய்கறி டிராயர் மற்றும் பிரீசர் என 7 வெப்பநிலை அடுக்குகளின் ஆய்வு மற்றும் வழிகாட்டி.'
        : 'Interactive 2D schematic of 7 thermal storage zones with temperature guidelines, compartment inspector, and shelf advice.'
    },
    {
      id: 'preservation',
      name: language === 'ta' ? 'உணவுப் பாதுகாப்பு வழிகாட்டி' : 'Preservation & Shelf-Life Encyclopedia',
      path: '/preservation-guide',
      icon: BookOpen,
      group: 'grocery',
      badge: 'Knowledge',
      badgeColor: 'bg-emerald-600',
      desc: language === 'ta'
        ? 'எத்திலீன் வாயு வெளியிடும் பழங்கள் vs உணர்திறன் கொண்ட காய்கறிகள் ஒப்பீடு மற்றும் உணவை மீட்கும் சிறந்த முறைகள்.'
        : 'Searchable storage rules, Ethylene Gas compatibility matrix (Emitters vs Sensitive), and anti-waste food revival hacks.'
    },
    {
      id: 'deals',
      name: language === 'ta' ? 'மளிகை சலுகைகள் & தள்ளுபடி ரேடார்' : 'Grocery Deals & Markdown Radar',
      path: '/deals-radar',
      icon: Tag,
      group: 'grocery',
      badge: '30-50% Off',
      badgeColor: 'bg-rose-500',
      desc: language === 'ta'
        ? 'அருகிலுள்ள சூப்பர் மார்க்கெட்டுகளில் உள்ள உபரி மளிகைப் பொருட்களின் தள்ளுபடி சலுகைகளைக் கண்டறிந்து வண்டியில் சேர்க்கவும்.'
        : 'Find discounted near-expiry and surplus groceries (30-50% off) at nearby stores and add them directly to your shopping list.'
    },
    {
      id: 'nutrition',
      name: language === 'ta' ? 'ஊட்டச்சத்து & மேக்ரோ கண்ணோட்டம்' : 'Nutritional & Macro Horizon',
      path: '/nutrition',
      icon: HeartPulse,
      group: 'health',
      badge: 'Macros',
      badgeColor: 'bg-pink-500',
      desc: language === 'ta'
        ? 'உங்கள் இருப்பில் உள்ள மொத்த கலோரி, புரதம், கார்போஹைட்ரேட், கொழுப்பு, நார்ச்சத்து மற்றும் உணவு சமநிலை ஆலோசகர்.'
        : 'Live nutritional macro breakdown (Calories, Protein, Carbs, Fats, Fiber) and AI dietary balance suggestions.'
    },
    {
      id: 'audit',
      name: language === 'ta' ? '3 நிமிட சமையலறை தணிக்கை' : '3-Minute Kitchen Freshness Audit',
      path: '/audit',
      icon: ClipboardCheck,
      group: 'health',
      badge: '+150 XP',
      badgeColor: 'bg-amber-600',
      desc: language === 'ta'
        ? '4-படி விரைவு வழிகாட்டி: அவசர சமையல், பிரீசரில் சேமித்தல், சமூக தானம் மற்றும் சமையலறை ஆரோக்கிய மதிப்பெண்.'
        : 'Guided 4-step triage wizard (Cook Urgent, Freeze Triage, Community Donate, Health Score) awarding +150 Quest XP.'
    },
    {
      id: 'compost',
      name: language === 'ta' ? 'உணவுக் கழிவு உரம் & மறுபயன்பாடு' : 'Scrap Repurposing & Compost Lab',
      path: '/compost',
      icon: Recycle,
      group: 'health',
      badge: 'Eco Lab',
      badgeColor: 'bg-lime-600',
      desc: language === 'ta'
        ? 'சாப்பிட முடியாத காய்கறி தோல்களைக் கொண்டு சத்து சூப், இயற்கை கிளீனர் மற்றும் வாழைப்பழ தோல் செடி உரம் தயாரித்தல்.'
        : 'Inedible scrap upcycling recipes (Veggie Broth, Citrus Cleaner, Banana Plant Fertilizer) and live compost biomass gauge.'
    },
    {
      id: 'analytics',
      name: language === 'ta' ? 'சுற்றுச்சூழல் & கழிவு பகுப்பாய்வு' : 'Sustainability & Waste Analytics',
      path: '/analytics',
      icon: BarChart3,
      group: 'health',
      badge: 'Analytics',
      badgeColor: 'bg-teal-600',
      desc: language === 'ta'
        ? 'மாதாந்திர பண சேமிப்பு வரைபடம், தடுக்கப்பட்ட கார்பன் (CO₂) உமிழ்வு மற்றும் சேமிக்கப்பட்ட நீர் கண்காணிப்பு.'
        : '5-month financial savings area chart, greenhouse gas offsets (kg CO₂), and agricultural virtual water conserved.'
    },
    {
      id: 'challenges',
      name: language === 'ta' ? 'பூஜ்ஜிய கழிவு சவால்கள் & கோப்பைகள்' : 'Zero-Waste Quests & Eco-Trophies',
      path: '/challenges',
      icon: Trophy,
      group: 'community',
      badge: 'Gamification',
      badgeColor: 'bg-amber-500',
      desc: language === 'ta'
        ? 'வாராந்திர சவால்களை முடித்து, பாதுகாவலர் நிலையை உயர்த்தி, தினசரி சாதனை தொடர் மற்றும் பதக்கங்களை வெல்லுங்கள்.'
        : 'Weekly sustainability quests, Guardian level rank progression, daily preservation streaks 🔥, and master trophies.'
    },
    {
      id: 'household',
      name: language === 'ta' ? 'வீட்டு சமையலறை & அறை நண்பர்கள்' : 'Household & Roommate Kitchen',
      path: '/household',
      icon: Home,
      group: 'community',
      badge: 'Household',
      badgeColor: 'bg-indigo-600',
      desc: language === 'ta'
        ? 'உணவு உரிமையை (அனைவருக்கும் பொதுவானது / தனிப்பட்டது) குறிக்கவும் மற்றும் சமையலறை சுத்தம் செய்யும் வேலைகளைப் பகிரவும்.'
        : 'Organize food ownership (Shared vs Personal) and manage shared roommate chore rotations seamlessly.'
    },
    {
      id: 'community',
      name: language === 'ta' ? 'சமூக உணவு மீட்பு & பகிர்வு' : 'Community Food Rescue & Sharing',
      path: '/community',
      icon: Users,
      group: 'community',
      badge: 'Community',
      badgeColor: 'bg-sky-500',
      desc: language === 'ta'
        ? 'உபரி உணவுகளை அண்டை வீட்டாருக்குப் பட்டியலிடவும் மற்றும் 24/7 இலவச சமூக குளிர்சாதன பெட்டிகளைக் கண்டறியவும்.'
        : 'List surplus groceries for neighborhood rescue and locate nearby 24/7 Community Fridges and food pantries.'
    },
    {
      id: 'notifications',
      name: language === 'ta' ? 'எச்சரிக்கைகள் & காலாவதி அறிவிப்புகள்' : 'Alerts & Expiry Notifications',
      path: '/notifications',
      icon: Bell,
      group: 'community',
      badge: 'Alerts',
      badgeColor: 'bg-rose-500',
      desc: language === 'ta'
        ? 'விரைவில் காலாவதியாகும் மற்றும் அவசர உணவுகளின் நேரடி அறிவிப்புப் பட்டியல் மற்றும் படித்ததாகக் குறிக்கும் வசதி.'
        : 'Live notification timeline of approaching expiries, reminder triggers, and urgency filter controls.'
    },
    {
      id: 'settings',
      name: language === 'ta' ? 'அமைப்புகள் & தரவு காப்புப்பிரதி' : 'Settings, Language & Backup',
      path: '/settings',
      icon: Settings,
      group: 'community',
      badge: 'System',
      badgeColor: 'bg-slate-600',
      desc: language === 'ta'
        ? 'காட்சி மொழி (தமிழ்/English), உணவு விருப்பத்தேர்வுகள், ஒலி அமைப்புகள் மற்றும் JSON/CSV தரவு ஏற்றுமதி/மீட்டமைப்பு.'
        : 'Display language switcher, dietary profiles (Vegetarian, Vegan, Keto), sound effects, and JSON/CSV backup engine.'
    }
  ];

  const filteredModules = ALL_MODULES.filter(m => {
    if (modulesTab === 'ALL') return true;
    return m.group === modulesTab;
  });

  return (
    <DashboardLayout>
      {/* Consumed Toast Notification */}
      {consumedItemName && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 size={20} className="text-emerald-200" />
          <span className="text-sm font-semibold">
            {language === 'ta' 
              ? `🎉 சிறப்பு! "${consumedItemName}" சாப்பிட்டதாக குறிக்கப்பட்டது & தானாக ஷாப்பிங் பட்டியலில் சேர்க்கப்பட்டது!`
              : `🎉 Great! Logged "${consumedItemName}" as eaten & added to auto-restock!`}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <Sparkles size={13} />
            <span>{t('assistantActive')}</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('dashboardTitle')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('dashboardSub', { name: 'Alex' })}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Link
            to="/scan"
            className="flex items-center space-x-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-4 py-2.5 rounded-xl font-bold text-xs transition-all hover:scale-105 shadow-sm"
          >
            <ScanLine size={16} />
            <span>{t('quickScan')}</span>
          </Link>

          <Link
            to="/products/add"
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <Plus size={16} />
            <span>{t('addItem')}</span>
          </Link>
        </div>
      </div>

      {/* TOP MODULE 1: COMPREHENSIVE PLATFORM INSTRUCTIONS & QUICK START GUIDE */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 border border-emerald-500/30 shadow-xl mb-8 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400">
              <HelpCircle size={22} />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <span>⭐ {language === 'ta' ? 'முதல் தொகுதி: பயன்பாட்டு வழிகாட்டி' : 'Module 1: Quick Platform Guide & Instructions'}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-heading font-extrabold text-white">
                {language === 'ta' ? 'சமையலறை வழிகாட்டி & விரைவு வழிமுறைகள்' : 'How Food Guardian Works: 4-Step Fast Guide'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setGuideExpanded(!guideExpanded)}
            className="flex items-center space-x-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-emerald-300 px-3 py-1.5 rounded-xl transition-all border border-white/15"
          >
            <span>{guideExpanded ? (language === 'ta' ? 'சுருக்கு' : 'Hide Guide') : (language === 'ta' ? 'முழு வழிகாட்டியைப் பார்' : 'Show Instructions')}</span>
            {guideExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>

        {guideExpanded && (
          <div className="mt-5 space-y-4 relative z-10 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* 4 Interactive Guide Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Step 1 */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-emerald-400/40 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-heading font-extrabold text-sm mb-2 group-hover:scale-110 transition-transform">
                    1
                  </div>
                  <h3 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
                    <ScanLine size={15} className="text-emerald-400" />
                    {language === 'ta' ? 'உணவை ஸ்கேன்/சேர்' : 'Scan or Add Food'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {language === 'ta' 
                      ? 'கேமரா, புகைப்படம் அல்லது பார்கோடு மூலம் உணவுப் பாக்கெட்டுகளை ஸ்கேன் செய்து உடனடியாகச் சேர்க்கவும்.' 
                      : 'Scan packaging with camera, photo upload, or 1-click OCR presets.'}
                  </p>
                </div>
                <Link
                  to="/scan"
                  className="mt-3 inline-flex items-center space-x-1 text-[11px] font-extrabold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>{language === 'ta' ? 'ஸ்கேனரைத் திறக்க' : 'Open Scanner'}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              {/* Step 2 */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-emerald-400/40 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-heading font-extrabold text-sm mb-2 group-hover:scale-110 transition-transform">
                    2
                  </div>
                  <h3 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
                    <Bell size={15} className="text-amber-400" />
                    {language === 'ta' ? 'எச்சரிக்கை நாட்கள் அமை' : 'Set Reminder Lead'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {language === 'ta' 
                      ? 'காலாவதிக்கு 1, 2, 3, 5 அல்லது 7 நாட்களுக்கு முன்பாக உங்களுக்கு தானாக நினைவூட்டல் அனுப்பப்படும்.' 
                      : 'Choose how many days before expiry to be alerted (1, 2, 3, 5, or 7 days).'}
                  </p>
                </div>
                <Link
                  to="/products/add"
                  className="mt-3 inline-flex items-center space-x-1 text-[11px] font-extrabold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span>{language === 'ta' ? 'உணவு சேர் படிவம்' : 'Add Item Form'}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              {/* Step 3 */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-emerald-400/40 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-heading font-extrabold text-sm mb-2 group-hover:scale-110 transition-transform">
                    3
                  </div>
                  <h3 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
                    <ChefHat size={15} className="text-teal-400" />
                    {language === 'ta' ? '20+ AI செய்முறைகள்' : 'Cook 20+ AI Recipes'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {language === 'ta' 
                      ? 'அவசர உணவுகளை வீணாக்காமல் சமைக்க 20-க்கும் மேற்பட்ட சர்வதேச உணவு குறிப்புகளைப் பெறுங்கள்.' 
                      : 'Rescue urgent ingredients with AI Chef recommendations & voice-guided timers.'}
                  </p>
                </div>
                <Link
                  to="/recipes"
                  className="mt-3 inline-flex items-center space-x-1 text-[11px] font-extrabold text-teal-400 hover:text-teal-300 transition-colors"
                >
                  <span>{language === 'ta' ? 'செய்முறைகளைக் காண்க' : 'Browse Recipes'}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              {/* Step 4 */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-emerald-400/40 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-heading font-extrabold text-sm mb-2 group-hover:scale-110 transition-transform">
                    4
                  </div>
                  <h3 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
                    <ShoppingCart size={15} className="text-blue-400" />
                    {language === 'ta' ? 'மறுஇருப்பு & 2D வரைபடம்' : 'Auto-Restock & Map'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {language === 'ta' 
                      ? 'சாப்பிட்ட உணவுகள் தானாக ஷாப்பிங் பட்டியலில் சேரும். 1-கிளிக்கில் மீண்டும் குளிர்சாதன பெட்டியில் சேர்க்கலாம்.' 
                      : 'Consumed foods auto-restock to your shopping list & transfer in 1 click.'}
                  </p>
                </div>
                <Link
                  to="/shopping-list"
                  className="mt-3 inline-flex items-center space-x-1 text-[11px] font-extrabold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>{language === 'ta' ? 'ஷாப்பிங் பட்டியல்' : 'Shopping List'}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Card 1: Total Products */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('totalProducts')}</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Package size={20} />
            </div>
          </div>
          <p className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
            {stats.total_products}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">{t('trackedInInv')}</span>
        </div>

        {/* Card 2: Fresh & Safe */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{t('freshSafe')}</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="text-3xl font-heading font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats.safe_products}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">{t('goodShelfLife')}</span>
        </div>

        {/* Card 3: Expiring Soon */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">{t('expiringSoon')}</span>
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-3xl font-heading font-extrabold text-amber-500">
            {stats.expiring_soon}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">{t('next3Days')}</span>
        </div>

        {/* Card 4: Urgent & Expired */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">{t('urgentExpired')}</span>
            <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500">
              <AlertTriangle size={20} />
            </div>
          </div>
          <p className="text-3xl font-heading font-extrabold text-rose-500">
            {stats.urgent_products + stats.expired_products}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">{t('needsImmediate')}</span>
        </div>
      </div>

      {/* Empty Fresh State Banner if 0 products */}
      {products.length === 0 && (
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 dark:from-slate-900 dark:via-emerald-950/40 dark:to-slate-900 rounded-3xl p-8 sm:p-12 border border-emerald-200/80 dark:border-emerald-800/40 text-center mb-8 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            ✨
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
            {t('noItemsInInventory')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            {language === 'ta' 
              ? 'உங்கள் உணவுப் பாக்கெட்டுகளை ஸ்கேன் செய்யவும் அல்லது கைமுறையாகச் சேர்த்து அடுக்கு வாழ்க்கையைக் கண்காணிக்கவும்.'
              : 'Scan your food packages with OCR or manually add groceries to start smart tracking.'}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link
              to="/scan"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2"
            >
              <ScanLine size={16} />
              <span>{t('scanLabelBtn')}</span>
            </Link>

            <Link
              to="/products/add"
              className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold px-6 py-3 rounded-2xl text-xs shadow-sm hover:bg-slate-50 flex items-center gap-2"
            >
              <Plus size={16} />
              <span>{t('addNewProductBtn')}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Sustainability Impact Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl shadow-emerald-700/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="bg-white/20 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {t('ecoImpact')}
            </span>
            <span className="text-emerald-200 text-xs font-semibold">{t('sustainabilityMilestone')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold">
            {t('preventedBanner', { count: stats.foodItemsSaved })}
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm">
            {t('savedDetails', { saved: stats.moneySaved, co2: stats.co2PreventedKg })}
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
          <div className="text-center px-2">
            <p className="text-2xl font-heading font-extrabold">${stats.moneySaved}</p>
            <span className="text-[10px] uppercase font-bold text-emerald-100">{t('moneySaved')}</span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center px-2">
            <p className="text-2xl font-heading font-extrabold">{stats.wasteScore}%</p>
            <span className="text-[10px] uppercase font-bold text-emerald-100">{t('wasteFreeScore')}</span>
          </div>
        </div>
      </div>

      {/* Urgent Action List */}
      {urgentItems.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                {t('urgentHeading')} ({urgentItems.length})
              </h3>
            </div>
            <Link 
              to="/recipes"
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
            >
              <ChefHat size={14} />
              <span>{t('cookRecipeWithThese')} →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {urgentItems.map((item) => (
              <div 
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      {item.days_left <= 0 ? t('expiresToday') : item.days_left === 1 ? t('expiresTomorrow') : t('daysLeft', { days: item.days_left })}
                    </span>
                    <span className="text-xs text-slate-400">{tl(item.location || 'Fridge')}</span>
                  </div>
                  <h4 className="font-heading font-bold text-slate-900 dark:text-white text-sm">
                    {tf(item.product_name)}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Qty: {item.quantity} {item.unit || ''} • {tc(item.category)}
                  </p>
                </div>

                <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                  <button
                    onClick={() => handleConsume(item.id, item.product_name)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1"
                  >
                    <Utensils size={12} />
                    <span>{t('iAteThis')}</span>
                  </button>
                  <Link
                    to="/recipes"
                    className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold py-1.5 px-3 rounded-xl text-xs transition-colors"
                  >
                    {t('findRecipe')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALL PLATFORM MODULES MASTER DIRECTORY & EXPLORER (DETAILED EXPLANATIONS) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-1">
              <Sparkles size={12} />
              <span>{language === 'ta' ? 'அனைத்து தொகுதிகளின் வழிகாட்டி' : 'Complete Modules Explorer'}</span>
            </div>
            <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
              {language === 'ta' ? 'அனைத்து தொகுதிகளின் விவரங்கள் & நேரடி இணைப்புகள்' : 'Platform Modules & Capability Directory'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'ta' ? 'ஒவ்வொரு தொகுதியும் எவ்வாறு செயல்படுகிறது என்பதைப் புரிந்து கொண்டு ஒரே கிளிக்கில் அணுகவும்.' : 'Understand how each zero-waste module works and jump directly to any feature.'}
            </p>
          </div>

          {/* Group Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'ALL', label: language === 'ta' ? 'அனைத்தும் (18)' : 'All (18)' },
              { id: 'culinary', label: language === 'ta' ? '🍳 சமையல் & இருப்பு' : '🍳 Culinary & Stock' },
              { id: 'grocery', label: language === 'ta' ? '🛒 மளிகை & சேமிப்பு' : '🛒 Grocery & Storage' },
              { id: 'health', label: language === 'ta' ? '🥗 நலம் & பகுப்பாய்வு' : '🥗 Health & Eco' },
              { id: 'community', label: language === 'ta' ? '🤝 சமூகம் & அமைப்புகள்' : '🤝 Community & System' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setModulesTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  modulesTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModules.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.id}
                to={m.path}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-all hover:scale-[1.02] flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon size={20} />
                    </div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full text-white ${m.badgeColor}`}>
                      {m.badge}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {m.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span>{language === 'ta' ? 'தொகுதியைத் திறக்க' : 'Launch Module'}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Analytics Charts Grid */}
      {products.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Timeline Horizon Bar Chart (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-1">
              {t('expiryTimelineStatus')}
            </h3>
            <p className="text-xs text-slate-400 mb-6">{t('itemsByShelf')}</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} 
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown Donut (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-1">
                {t('categoryBreakdown')}
              </h3>
              <p className="text-xs text-slate-400 mb-4">{t('spreadAcrossDepts')}</p>

              <div className="h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {categoryData.slice(0, 4).map(c => (
                <div key={c.name} className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.fill }} />
                  <span>{tc(c.name)} ({c.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
