import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Snowflake, 
  Wind, 
  Lightbulb, 
  CheckCircle2, 
  AlertTriangle,
  HeartPulse,
  Leaf
} from 'lucide-react';

const ENCYCLOPEDIA = [
  {
    name: 'Fresh Strawberries & Berries',
    category: 'Produce',
    canFreeze: true,
    shelfLifeFridge: '5-7 days',
    shelfLifeCounter: '1-2 days',
    shelfLifeFreezer: '6 months',
    ethyleneType: 'Neutral',
    preservationTip: 'Do not wash until ready to eat! Store in a glass jar or breathable container with a dry paper towel at the bottom to absorb humidity.',
    revivalHack: 'If slightly soft, blend into smoothies or simmer with a spoon of sugar into a quick pancake compote.'
  },
  {
    name: 'Leafy Greens & Baby Spinach',
    category: 'Produce',
    canFreeze: true,
    shelfLifeFridge: '7-10 days',
    shelfLifeCounter: '1 day',
    shelfLifeFreezer: '8 months (blanched)',
    ethyleneType: 'Sensitive',
    preservationTip: 'Keep in the crisper drawer wrapped loosely with a clean towel. Keep away from apples and bananas!',
    revivalHack: 'Submerge limp leaves in an ice-water bath for 10 minutes. The cells will re-hydrate and turn crunchy again!'
  },
  {
    name: 'Artisan & Sourdough Bread',
    category: 'Bakery',
    canFreeze: true,
    shelfLifeFridge: 'Avoid (stales faster)',
    shelfLifeCounter: '4-5 days',
    shelfLifeFreezer: '3 months',
    ethyleneType: 'Neutral',
    preservationTip: 'Never store bread in the refrigerator—the starch retrogrades 3x faster! Keep in a bread box or slice and freeze immediately.',
    revivalHack: 'Sprinkle water on the crust of stale bread and bake at 180°C (350°F) for 5 minutes. The crust will be crisp and interior tender like fresh out of the oven!'
  },
  {
    name: 'Organic Whole Milk',
    category: 'Dairy',
    canFreeze: true,
    shelfLifeFridge: '7-10 days opened',
    shelfLifeCounter: '2 hours max',
    shelfLifeFreezer: '3 months',
    ethyleneType: 'Neutral',
    preservationTip: 'Store in the middle or back of the main fridge shelf. Never store milk in the fridge door where temperatures fluctuate every time it opens.',
    revivalHack: 'If milk is turning slightly sour (before curdling), use it for baking pancakes, scones, or making paneer cheese!'
  },
  {
    name: 'Avocados (Hass)',
    category: 'Produce',
    canFreeze: true,
    shelfLifeFridge: '7-10 days (ripe)',
    shelfLifeCounter: '3-5 days (to ripen)',
    shelfLifeFreezer: '4 months (mashed)',
    ethyleneType: 'High Producer',
    preservationTip: 'Ripen on the counter. Once ripe, move to the fridge to halt ripening for up to a week. If cut in half, keep the pit in and brush with lemon juice.',
    revivalHack: 'To ripen rock-hard avocados quickly, place in a paper bag with an apple or banana for 24 hours.'
  },
  {
    name: 'Bananas',
    category: 'Produce',
    canFreeze: true,
    shelfLifeFridge: '5-7 days (skin blackens, fruit stays firm)',
    shelfLifeCounter: '3-6 days',
    shelfLifeFreezer: '6 months (peeled)',
    ethyleneType: 'High Producer',
    preservationTip: 'Wrap the crown (stem) with plastic wrap to slow down ethylene gas release. Keep separate from other fruits.',
    revivalHack: 'Peel overripe black bananas, chop into chunks, and freeze in ziploc bags for instant ice-cream-like smoothie bowls or banana bread.'
  },
  {
    name: 'Hard Cheeses (Cheddar, Parmesan)',
    category: 'Dairy',
    canFreeze: true,
    shelfLifeFridge: '3-4 weeks opened',
    shelfLifeCounter: '1 day',
    shelfLifeFreezer: '6 months (grated)',
    ethyleneType: 'Neutral',
    preservationTip: 'Wrap in parchment or wax paper rather than plastic wrap. This allows the cheese to breathe without trapping surface moisture.',
    revivalHack: 'Save parmesan rinds in the freezer and drop them into tomato sauces, soups, and risottos for incredible umami flavor!'
  },
  {
    name: 'Fresh Herbs (Cilantro, Parsley, Basil)',
    category: 'Herbs',
    canFreeze: true,
    shelfLifeFridge: '10-14 days',
    shelfLifeCounter: 'Basil only (loves room temp)',
    shelfLifeFreezer: '6 months (in olive oil)',
    ethyleneType: 'Sensitive',
    preservationTip: 'Trim herb stems like fresh flowers and place upright in a glass of water covered loosely with a plastic bag in the fridge (Basil stays on counter).',
    revivalHack: 'Finely chop wilting herbs, pack into ice cube trays, fill with olive oil, and freeze. Pop a cube directly into your hot cooking pan!'
  }
];

export default function PreservationGuide() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  const filteredItems = ENCYCLOPEDIA.filter(item => {
    const matchQuery = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.preservationTip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.revivalHack.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = activeCategory === 'ALL' || item.category === activeCategory;
    return matchQuery && matchCat;
  });

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <Sparkles size={13} />
            <span>Culinary Science & Food Life Extension</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <BookOpen className="text-emerald-600" size={32} />
            Food Preservation Encyclopedia
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Science-backed storage techniques, ethylene gas compatibility rules, and instant food revival hacks.
          </p>
        </div>

        {/* Ethylene Gas Education Card */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl shadow-teal-700/10">
          <div className="flex items-center space-x-2 mb-3">
            <Wind size={20} className="text-teal-200" />
            <h3 className="font-heading font-bold text-lg">
              The Golden Ethylene Gas Rule
            </h3>
          </div>
          <p className="text-teal-100 text-xs sm:text-sm leading-relaxed max-w-3xl mb-4">
            Certain fruits produce high levels of <strong>ethylene gas</strong> (a natural ripening hormone), while others are extremely sensitive to it and will rot twice as fast if stored adjacent to each other!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Gas Emitters (Keep Isolated)</span>
              <p className="text-xs text-white mt-1 font-semibold">Apples, Bananas, Avocados, Tomatoes, Melons, Peaches</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Gas Sensitive (Spoils Quickly Near Emitters)</span>
              <p className="text-xs text-white mt-1 font-semibold">Leafy Greens, Broccoli, Cucumbers, Carrots, Berries, Potatoes</p>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search foods, tips, revival hacks..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['ALL', 'Produce', 'Dairy', 'Bakery', 'Herbs'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Encyclopedia Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {item.category}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-slate-400">
                    <Snowflake size={14} className={item.canFreeze ? 'text-blue-500' : 'text-slate-300'} />
                    <span>{item.canFreeze ? 'Freeze OK' : 'No Freeze'}</span>
                  </div>
                </div>

                <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white mb-3">
                  {item.name}
                </h3>

                {/* Lifespan Badges */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 font-semibold">Fridge</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">{item.shelfLifeFridge}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 font-semibold">Counter</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">{item.shelfLifeCounter}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 font-semibold">Freezer</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">{item.shelfLifeFreezer}</p>
                  </div>
                </div>

                {/* Pro Storage Tip */}
                <div className="mb-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white block mb-1">🌿 Best Storage Technique:</strong>
                  {item.preservationTip}
                </div>

                {/* Revival Hack */}
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2">
                  <Lightbulb size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Revival & Anti-Waste Hack:</strong>
                    <span>{item.revivalHack}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
