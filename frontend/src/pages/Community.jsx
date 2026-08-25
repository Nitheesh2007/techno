import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { triggerConfetti } from '../services/confetti';
import { 
  Users, 
  Heart, 
  Share2, 
  MapPin, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Gift, 
  Award, 
  Building2, 
  Clock,
  ArrowRight
} from 'lucide-react';

const COMMUNITY_FRIDGES = [
  {
    name: 'Downtown Community Food Fridge #2',
    address: '452 Elm Street, Downtown',
    distance: '0.8 miles away',
    hours: 'Open 24/7',
    accepts: ['Fresh Produce', 'Unopened Dairy', 'Canned Goods', 'Bread'],
    status: 'Active & Accepting'
  },
  {
    name: 'St. Mary Food Pantry & Kitchen',
    address: '109 Oak Avenue, Midtown',
    distance: '1.4 miles away',
    hours: 'Mon-Sat: 8 AM - 6 PM',
    accepts: ['Dry Staples', 'Canned Vegetables', 'Packaged Snacks', 'Baby Food'],
    status: 'High Need for Staples'
  },
  {
    name: 'West End Eco Fridge Hub',
    address: '780 Pine Boulevard, West End',
    distance: '2.1 miles away',
    hours: 'Open 24/7',
    accepts: ['Fresh Fruit', 'Bakery Loaves', 'Pantry Staples'],
    status: 'Active & Accepting'
  }
];

export default function Community() {
  const [donations, setDonations] = useState([]);
  const [products, setProducts] = useState([]);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [targetFridge, setTargetFridge] = useState(COMMUNITY_FRIDGES[0].name);
  const [toastMsg, setToastMsg] = useState(null);

  const loadData = () => {
    setDonations(storage.getDonations());
    setProducts(storage.getProducts());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDonateProduct = (e) => {
    e.preventDefault();
    if (!selectedProductId) return;

    const prod = products.find(p => p.id === selectedProductId);
    if (!prod) return;

    storage.addDonation({
      name: prod.product_name,
      category: prod.category,
      quantity: prod.quantity,
      bestBefore: prod.expiry_date,
      donor: 'Alex Rivera (You)',
      location: targetFridge
    });

    // Remove from active inventory
    storage.deleteProduct(prod.id);

    sound.playSuccess();
    triggerConfetti(3000);
    setToastMsg(`❤️ Thank you! "${prod.product_name}" listed for community donation at ${targetFridge}.`);
    setTimeout(() => setToastMsg(null), 4000);

    setShowDonateModal(false);
    loadData();
  };

  const handleClaim = (id, name) => {
    const updated = donations.map(d => d.id === id ? { ...d, status: 'Claimed' } : d);
    localStorage.setItem('feg_donations', JSON.stringify(updated));
    setDonations(updated);
    sound.playSuccess();
    setToastMsg(`🙌 You reserved "${name}" for pickup!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <DashboardLayout>
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <Heart size={20} className="text-rose-300 fill-rose-300" />
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
              <Sparkles size={13} />
              <span>Zero-Waste Neighborhood Network</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Users className="text-emerald-600" size={32} />
              Community Food Rescue & Sharing Hub
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Share surplus food before it expires with local community pantries, neighbors, and food banks.
            </p>
          </div>

          <button
            onClick={() => setShowDonateModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <Gift size={16} />
            <span>Donate Surplus Food</span>
          </button>
        </div>

        {/* Community Hero Badges Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xl flex-shrink-0">
              ❤️
            </div>
            <div>
              <p className="font-heading font-bold text-sm text-slate-900 dark:text-white">Community Giver</p>
              <p className="text-xs text-slate-400">4 items shared this month</p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xl flex-shrink-0">
              🌱
            </div>
            <div>
              <p className="font-heading font-bold text-sm text-slate-900 dark:text-white">Zero Waste Hero</p>
              <p className="text-xs text-slate-400">Top 10% in neighborhood</p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xl flex-shrink-0">
              🏆
            </div>
            <div>
              <p className="font-heading font-bold text-sm text-slate-900 dark:text-white">Meals Rescued</p>
              <p className="text-xs text-slate-400">18 meals fed to families</p>
            </div>
          </div>
        </div>

        {/* Two Columns: Live Donation Feed & Nearby Pantries */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Live Donation Feed (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                  Live Community Food Feed
                </h3>
                <p className="text-xs text-slate-400">Items available for pickup near you</p>
              </div>
              <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-3 py-1 rounded-full">
                {donations.filter(d => d.status === 'Available').length} Available Now
              </span>
            </div>

            <div className="space-y-4">
              {donations.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    item.status === 'Available'
                      ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                      : 'bg-slate-100/50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {item.category}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">Shared by {item.donor}</span>
                      </div>
                      <h4 className="font-heading font-bold text-slate-900 dark:text-white text-base">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin size={13} className="text-emerald-500" />
                        <span>Pickup Location: {item.location}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Best Before: {new Date(item.bestBefore).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      {item.status === 'Available' ? (
                        <button
                          onClick={() => handleClaim(item.id, item.name)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all"
                        >
                          Claim Item
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full">
                          Claimed ✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Pantries & Fridges (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-1">
              Nearby Community Fridges & Pantries
            </h3>
            <p className="text-xs text-slate-400 mb-6">Drop off or pickup food anytime</p>

            <div className="space-y-4">
              {COMMUNITY_FRIDGES.map((hub, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                        {hub.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                        <MapPin size={12} /> {hub.address} ({hub.distance})
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {hub.status}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 flex flex-wrap gap-1">
                    {hub.accepts.map(acc => (
                      <span key={acc} className="text-[10px] bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md font-semibold text-slate-600 dark:text-slate-300">
                        {acc}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Donation Modal */}
        {showDonateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-150">
              <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white mb-2">
                Donate Surplus Food to Community
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Choose an item from your kitchen to make available at a local community fridge.
              </p>

              <form onSubmit={handleDonateProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Select Item from Inventory
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">-- Choose an item to donate --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.product_name} ({p.quantity} {p.unit || ''}) - Expires in {p.days_left}d
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Drop-off Location
                  </label>
                  <select
                    value={targetFridge}
                    onChange={(e) => setTargetFridge(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {COMMUNITY_FRIDGES.map(f => (
                      <option key={f.name} value={f.name}>{f.name} ({f.distance})</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowDonateModal(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-emerald-600/20"
                  >
                    Confirm Donation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
