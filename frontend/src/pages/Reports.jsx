import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { useLanguage } from '../context/LanguageContext';
import { 
  FileText, 
  Download, 
  Printer, 
  Sparkles, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Package, 
  Leaf,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';

export default function Reports() {
  const [stats, setStats] = useState(storage.getDashboardStats());
  const [products, setProducts] = useState([]);
  const [wasteRecords, setWasteRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { t, tf, tc, tl, language } = useLanguage();

  useEffect(() => {
    setProducts(storage.getProducts());
    setWasteRecords(storage.getWasteRecords());
    setStats(storage.getDashboardStats());
  }, []);

  const handlePrint = () => {
    sound.playClick?.() || sound.playBeep(900, 0.04);
    window.print();
  };

  const handleExportCSV = () => {
    sound.playSuccess();
    const rows = [
      ['Product Name', 'Category', 'Quantity', 'Unit', 'Expiry Date', 'Status', 'Estimated Price ($)', 'Waste Risk (%)']
    ];

    products.forEach(p => {
      rows.push([
        `"${p.product_name || ''}"`,
        `"${p.category || 'General'}"`,
        p.quantity || 1,
        `"${p.unit || 'pcs'}"`,
        p.expiry_date || '',
        p.status || 'SAFE',
        p.estimated_price || 3.50,
        p.waste_risk || 0
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `food_expiry_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const consumedCount = wasteRecords.filter(w => w.action === 'CONSUMED').length;
  const discardedCount = wasteRecords.filter(w => w.action === 'DISCARDED').length;
  const totalHandled = consumedCount + discardedCount;
  const wasteRate = totalHandled === 0 ? 0 : Math.round((discardedCount / totalHandled) * 100);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 print:hidden">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
              <Sparkles size={13} />
              <span>{language === 'ta' ? 'அறிக்கையிடல் மையம்' : 'Report Generator'}</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <FileText className="text-emerald-600" size={32} />
              <span>{language === 'ta' ? 'மாதாந்திர உணவுக் கழிவு அறிக்கை' : 'Monthly Food & Waste Audit Report'}</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'ta' 
                ? 'உங்கள் சமையலறை பயன்பாடு, சேமிப்பு மற்றும் கழிவு விவரங்களின் முழு அறிக்கை.' 
                : 'Export comprehensive zero-waste summaries, financial loss audits, and shelf-life metrics.'}
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-50 shadow-sm transition-all"
            >
              <FileSpreadsheet size={15} className="text-emerald-600" />
              <span>{language === 'ta' ? 'CSV ஆக பதிவிறக்கு' : 'Export CSV'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
            >
              <Printer size={15} />
              <span>{language === 'ta' ? 'அச்சிடு / PDF' : 'Print / PDF'}</span>
            </button>
          </div>
        </div>

        {/* Printable Report Document Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 sm:p-10 space-y-8 print:border-none print:shadow-none">
          {/* Report Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Food Expiry Guardian AI • Monthly Executive Report
              </span>
              <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white mt-1">
                {language === 'ta' ? 'சமையலறை நிலை மற்றும் கழிவு தணிக்கை' : 'Kitchen Inventory & Waste Audit Summary'}
              </h2>
              <span className="text-xs text-slate-400 mt-1 block">
                Generated on: {new Date().toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', { dateStyle: 'full' })}
              </span>
            </div>

            <div className="text-right p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{language === 'ta' ? 'கழிவு தடுப்பு விகிதம்' : 'Waste-Free Efficiency'}</span>
              <span className="text-2xl font-heading font-extrabold text-emerald-600 dark:text-emerald-400">{stats.wasteScore}%</span>
            </div>
          </div>

          {/* Key Executive Metrics 4-Col Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{language === 'ta' ? 'மொத்த உணவுகள்' : 'Active Stock'}</span>
              <span className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white mt-1 block">{stats.total_products} items</span>
              <span className="text-[10px] text-slate-400 mt-1 block">{stats.safe_products} safe • {stats.expiring_soon} soon</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 block">{language === 'ta' ? 'சேமிக்கப்பட்ட மதிப்பு' : 'Financial Saved'}</span>
              <span className="text-2xl font-heading font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">${stats.moneySaved}</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 block">{stats.foodItemsSaved} meals preserved</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
              <span className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-300 block">{language === 'ta' ? 'கழிவு இழப்பு' : 'Discarded Loss'}</span>
              <span className="text-2xl font-heading font-extrabold text-rose-600 dark:text-rose-400 mt-1 block">${stats.actual_financial_waste || stats.potential_waste_loss}</span>
              <span className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 block">{stats.itemsWasted} items discarded</span>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
              <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-300 block">{language === 'ta' ? 'கார்பன் தடுப்பு' : 'CO₂ Offset'}</span>
              <span className="text-2xl font-heading font-extrabold text-teal-600 dark:text-teal-400 mt-1 block">{stats.co2PreventedKg} kg</span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 mt-1 block">Greenhouse gas offset</span>
            </div>
          </div>

          {/* Current Inventory Audit Table */}
          <div>
            <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white mb-3">
              {language === 'ta' ? '1. தற்போதைய இருப்பு நிலை விவரங்கள்' : '1. Current Inventory Audit Breakdown'}
            </h3>
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Expiry Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400">No active products in inventory.</td>
                    </tr>
                  ) : (
                    products.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{tf(p.product_name)}</td>
                        <td className="p-3 text-slate-500">{tc(p.category)}</td>
                        <td className="p-3 text-slate-500">{p.expiry_date}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            p.status === 'SAFE' ? 'bg-emerald-100 text-emerald-700' :
                            p.status === 'CRITICAL' ? 'bg-orange-100 text-orange-700' :
                            p.status === 'EXPIRING SOON' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono font-bold">${p.estimated_price || 3.50}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Waste vs Consumed History Table */}
          <div>
            <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white mb-3">
              {language === 'ta' ? '2. கழிவு & பயன்பாட்டு செயல்பாட்டு பதிவு' : '2. Waste & Consumption Audit Log'}
            </h3>
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Item</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Details / Reason</th>
                    <th className="p-3 text-right">Value ($)</th>
                    <th className="p-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {wasteRecords.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400">No waste or consumption records logged yet.</td>
                    </tr>
                  ) : (
                    wasteRecords.slice(0, 10).map(w => (
                      <tr key={w.id}>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{w.product_name}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            w.action === 'CONSUMED' ? 'bg-emerald-100 text-emerald-700' :
                            w.action === 'DONATED' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {w.action}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500">{w.reason || w.notes || 'Routine kitchen consumption'}</td>
                        <td className="p-3 text-right font-mono font-bold">
                          {w.action === 'DISCARDED' ? `-$${w.value_lost}` : `+$${w.value_saved}`}
                        </td>
                        <td className="p-3 text-right text-slate-400">{new Date(w.timestamp).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signoff Footer */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Food Expiry Guardian AI Engine • Certified Zero-Waste SaaS</span>
            <span>Report Verification ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
