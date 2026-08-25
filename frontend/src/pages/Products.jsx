import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { storage, computeStatus, getDaysRemaining } from '../services/storage';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ChefHat, 
  Filter, 
  RotateCcw, 
  Sparkles,
  ArrowUpDown,
  Barcode,
  Calendar,
  Layers
} from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('expiry_asc');
  const [actionSuccess, setActionSuccess] = useState(null);
  const navigate = useNavigate();

  const loadProducts = () => {
    const list = storage.getProducts();
    setProducts(list);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleConsume = (id, name) => {
    api.consumeProduct(id);
    setActionSuccess(`✨ You saved "${name}" from being wasted! Recorded in sustainability stats.`);
    setTimeout(() => setActionSuccess(null), 3500);
    loadProducts();
  };

  const handleWaste = (id, name) => {
    if (window.confirm(`Mark "${name}" as discarded/wasted?`)) {
      api.markWasted(id);
      loadProducts();
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Remove "${name}" from inventory?`)) {
      storage.deleteProduct(id);
      loadProducts();
    }
  };

  const handleResetSample = () => {
    const list = storage.resetSampleData();
    setProducts(list);
    setActionSuccess('Sample kitchen products restored!');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const getStatusBadge = (status, daysLeft) => {
    switch (status) {
      case 'SAFE': 
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Safe ({daysLeft}d)</span>;
      case 'EXPIRING SOON': 
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Soon ({daysLeft}d)</span>;
      case 'URGENT': 
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 animate-pulse">Urgent ({daysLeft <= 0 ? 'Today' : `${daysLeft}d`})</span>;
      case 'EXPIRED': 
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">Expired ({Math.abs(daysLeft)}d ago)</span>;
      default: 
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  // Filter & Search Logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.location && p.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const status = computeStatus(p.expiry_date);
    const matchesStatus = statusFilter === 'ALL' || status === statusFilter;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'expiry_asc') {
      return new Date(a.expiry_date) - new Date(b.expiry_date);
    }
    if (sortBy === 'expiry_desc') {
      return new Date(b.expiry_date) - new Date(a.expiry_date);
    }
    if (sortBy === 'name_asc') {
      return a.product_name.localeCompare(b.product_name);
    }
    return 0;
  });

  return (
    <DashboardLayout>
      {/* Toast */}
      {actionSuccess && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 size={20} className="text-emerald-200" />
          <span className="text-sm font-semibold">{actionSuccess}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
            Food Inventory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your kitchen items, track shelf-life, and prevent waste.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetSample}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-colors"
            title="Restore default sample items"
          >
            <RotateCcw size={14} />
            <span>Reset Samples</span>
          </button>

          <Link 
            to="/products/add" 
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <Plus size={16} />
            <span>Add New Item</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items, categories, fridge..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['ALL', 'URGENT', 'EXPIRING SOON', 'SAFE', 'EXPIRED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === tab
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab === 'ALL' ? 'All Items' : tab}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <span className="text-xs text-slate-400">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="expiry_asc">Expiry (Closest first)</option>
            <option value="expiry_desc">Expiry (Furthest first)</option>
            <option value="name_asc">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Product Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Product Details</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Expiry Date</th>
                <th className="py-4 px-4">Freshness Status</th>
                <th className="py-4 px-6 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    <p className="text-base font-semibold">No items match your search or filter</p>
                    <button
                      onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
                      className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
                    >
                      Clear Filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const status = computeStatus(product.expiry_date);
                  const daysLeft = getDaysRemaining(product.expiry_date);

                  return (
                    <tr 
                      key={product.id} 
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Product details */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-base shadow-sm">
                            {product.product_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-heading font-bold text-slate-900 dark:text-white">
                              {product.product_name}
                            </p>
                            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>Qty: {product.quantity} {product.unit || 'unit'}</span>
                              {product.location && <span>• {product.location}</span>}
                              {product.barcode && (
                                <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                                  #{product.barcode.slice(-4)}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {product.category || 'General'}
                        </span>
                      </td>

                      {/* Expiry Date */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300 font-medium text-xs">
                          <Calendar size={14} className="text-slate-400" />
                          <span>{new Date(product.expiry_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4">
                        {getStatusBadge(status, daysLeft)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleConsume(product.id, product.product_name)}
                            className="bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white dark:bg-emerald-950/60 dark:hover:bg-emerald-600 dark:text-emerald-300 dark:hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                            title="Mark as Consumed (I Ate This)"
                          >
                            <CheckCircle2 size={14} />
                            <span className="hidden sm:inline">Ate It</span>
                          </button>

                          <button
                            onClick={() => navigate('/recipes')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Find Recipes with this item"
                          >
                            <ChefHat size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(product.id, product.product_name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Delete item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
