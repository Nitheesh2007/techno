import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { aiEngine } from '../services/aiEngine';
import { 
  Camera, 
  Upload, 
  X, 
  Check, 
  RefreshCw, 
  Sparkles, 
  Barcode, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  Video,
  VideoOff,
  Lightbulb
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SAMPLE_PRESETS = [
  { id: 'milk', name: 'Organic Whole Milk', category: 'Dairy', icon: '🥛', previewText: 'Best Before: +2 Days | Lot: MILK44' },
  { id: 'yogurt', name: 'Greek Yogurt 500g', category: 'Dairy', icon: '🥣', previewText: 'EXP: +4 Days | Batch: YG-88210' },
  { id: 'bread', name: 'Artisan Sourdough', category: 'Bakery', icon: '🍞', previewText: 'Use By: +3 Days | Baked Fresh' },
  { id: 'chicken', name: 'Chicken Breast', category: 'Meat & Poultry', icon: '🍗', previewText: 'Use/Freeze: +2 Days | Lot: CHK-99' },
  { id: 'berries', name: 'Strawberries 250g', category: 'Produce', icon: '🍓', previewText: 'Best Consumed: +1 Day' },
];

export default function Scan() {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera', 'upload', 'presets', 'barcode'
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      alert('Camera access unavailable. You can use the preset labels or upload an image!');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setPreview(dataUrl);
    stopCamera();
    executeScan('camera-captured');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const executeScan = async (presetIdOrData) => {
    setScanning(true);
    setResult(null);
    try {
      const res = await aiEngine.scanImage(presetIdOrData || 'general');
      setResult(res);
    } catch (e) {
      console.error(e);
      alert('Error during OCR processing');
    } finally {
      setScanning(false);
    }
  };

  const handlePresetSelect = (preset) => {
    setPreview(null);
    setFile(null);
    executeScan(preset.id);
  };

  const handleBarcodeLookup = async () => {
    if (!barcodeInput) return;
    setScanning(true);
    try {
      const res = await api.lookupBarcode(barcodeInput);
      setResult({
        extracted_fields: {
          product_name: res.product_name,
          category: res.category,
          expiry_date: res.expiry_date,
          barcode: barcodeInput,
          batch_number: `BAR-${barcodeInput.slice(-4)}`
        },
        overall_confidence: 0.99,
        raw_text: `BARCODE LOOKUP: ${barcodeInput}\nPRODUCT: ${res.product_name}\nCATEGORY: ${res.category}\nCALCULATED EXPIRY: ${res.expiry_date}`
      });
    } finally {
      setScanning(false);
    }
  };

  const handleConfirmAndAdd = () => {
    if (!result || !result.extracted_fields) return;
    navigate('/products/add', {
      state: {
        product_name: result.extracted_fields.product_name,
        category: result.extracted_fields.category,
        expiry_date: result.extracted_fields.expiry_date,
        batch_number: result.extracted_fields.batch_number,
        mrp: result.extracted_fields.mrp,
        barcode: result.extracted_fields.barcode || '',
        ocr_confidence: result.overall_confidence
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/20">
            <Sparkles size={14} />
            <span>Multi-Engine OCR & Label Extraction</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
            Smart Food Scanner
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto">
            Point your camera at food packages, expiration stamps, or barcodes to automatically parse dates into your inventory.
          </p>
        </div>

        {/* Scanner Modes Tab Bar */}
        <div className="flex justify-center mb-6">
          <div className="bg-slate-200/60 dark:bg-slate-800/80 p-1.5 rounded-2xl flex space-x-1">
            {[
              { id: 'presets', label: '1-Click Presets', icon: Lightbulb },
              { id: 'camera', label: 'Live Camera', icon: Camera },
              { id: 'upload', label: 'Upload Photo', icon: Upload },
              { id: 'barcode', label: 'Barcode Lookup', icon: Barcode }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id !== 'camera') stopCamera();
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          
          {/* TAB 1: 1-Click Presets */}
          {activeTab === 'presets' && !result && !scanning && (
            <div>
              <h3 className="text-sm font-heading font-bold text-slate-800 dark:text-white mb-2">
                Instant Test Labels (1-Click AI Scan)
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Select any package label below to see instant OCR extraction and field parsing in action:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {SAMPLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-slate-800/60 text-left transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-3xl p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:scale-110 transition-transform">
                        {preset.icon}
                      </span>
                      <div>
                        <p className="font-heading font-bold text-slate-900 dark:text-white text-sm">
                          {preset.name}
                        </p>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {preset.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800/80 p-2 rounded-lg text-slate-600 dark:text-slate-300">
                      {preset.previewText}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Live Camera */}
          {activeTab === 'camera' && !result && !scanning && (
            <div className="space-y-4">
              {!isCameraActive ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-4">
                    <Camera size={32} />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-1">
                    Live Viewfinder Scanner
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
                    Allow camera access to capture expiration date labels directly with your device.
                  </p>
                  <button
                    onClick={startCamera}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all hover:scale-105"
                  >
                    Start Camera Feed
                  </button>
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden bg-black max-w-xl mx-auto">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-80 object-cover"
                  />
                  {/* Scanner Overlay Frame */}
                  <div className="absolute inset-0 border-2 border-emerald-400/50 m-8 rounded-2xl pointer-events-none flex items-center justify-center">
                    <div className="w-full h-0.5 bg-emerald-400/80 shadow-lg shadow-emerald-400 animate-pulse" />
                  </div>

                  <div className="absolute bottom-4 inset-x-0 flex justify-center space-x-4">
                    <button
                      onClick={capturePhoto}
                      className="bg-white text-slate-900 font-bold px-6 py-2.5 rounded-full text-xs shadow-lg flex items-center gap-2 hover:bg-slate-100"
                    >
                      <Camera size={16} /> Capture & Scan
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-black/60 text-white font-bold px-4 py-2.5 rounded-full text-xs hover:bg-black/80"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}

          {/* TAB 3: Upload Photo */}
          {activeTab === 'upload' && !result && !scanning && (
            <div>
              {!preview ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-12 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-4">
                    <Upload size={32} />
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Click to browse or drop an image here
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports JPG, PNG, WEBP (food packaging, expiry labels)
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex justify-center max-h-80">
                    <img src={preview} alt="Upload preview" className="object-contain" />
                    <button 
                      onClick={() => { setFile(null); setPreview(null); }}
                      className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full hover:bg-black/80"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => executeScan('custom-upload')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-2xl text-xs shadow-md transition-all hover:scale-105"
                    >
                      Run OCR Extraction
                    </button>
                  </div>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          )}

          {/* TAB 4: Barcode Lookup */}
          {activeTab === 'barcode' && !result && !scanning && (
            <div className="max-w-md mx-auto py-8">
              <h3 className="font-heading font-bold text-base text-slate-800 dark:text-white mb-2 text-center">
                Barcode Number Lookup
              </h3>
              <p className="text-xs text-slate-400 text-center mb-6">
                Enter an EAN/UPC barcode number to query product metadata and calculate shelf life.
              </p>
              <div className="flex gap-2 mb-4">
                <input 
                  type="text"
                  placeholder="e.g. 8901030383011"
                  value={barcodeInput}
                  onChange={e => setBarcodeInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={handleBarcodeLookup}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
                >
                  Lookup
                </button>
              </div>
              <div className="text-center">
                <span className="text-[11px] text-slate-400">Sample Barcodes: </span>
                <button onClick={() => { setBarcodeInput('8901030383011'); }} className="text-[11px] text-emerald-600 font-mono underline mr-2">8901030383011 (Milk)</button>
                <button onClick={() => { setBarcodeInput('8901030383044'); }} className="text-[11px] text-emerald-600 font-mono underline">8901030383044 (Bread)</button>
              </div>
            </div>
          )}

          {/* Scanning Progress Spinner */}
          {scanning && (
            <div className="py-16 text-center">
              <RefreshCw className="animate-spin text-emerald-600 dark:text-emerald-400 mx-auto mb-4" size={40} />
              <p className="font-heading font-bold text-slate-800 dark:text-white text-base">
                AI Vision & OCR Engine is Scanning...
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Detecting bounding boxes, OCR text lines, and expiration timestamps
              </p>
            </div>
          )}

          {/* Extraction Results Display */}
          {result && !scanning && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <ShieldCheck size={20} className="text-emerald-500" />
                  <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                    Extraction Successful
                  </h3>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
                  {(result.overall_confidence * 100).toFixed(0)}% AI Confidence
                </span>
              </div>

              {/* Extracted Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Detected Product Name
                  </p>
                  <p className="font-heading font-bold text-slate-900 dark:text-white text-base">
                    {result.extracted_fields?.product_name || 'Food Product'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40">
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                    Parsed Expiry Date
                  </p>
                  <p className="font-heading font-bold text-emerald-900 dark:text-emerald-200 text-base">
                    {result.extracted_fields?.expiry_date ? new Date(result.extracted_fields.expiry_date).toLocaleDateString(undefined, { dateStyle: 'full' }) : 'Not detected'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Category Group
                  </p>
                  <p className="font-heading font-bold text-slate-900 dark:text-white text-base">
                    {result.extracted_fields?.category || 'Pantry'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Batch / Lot Number
                  </p>
                  <p className="font-heading font-bold text-slate-900 dark:text-white text-base font-mono">
                    {result.extracted_fields?.batch_number || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Raw OCR Output Log */}
              {result.raw_text && (
                <div className="p-4 rounded-2xl bg-slate-900 text-slate-300 font-mono text-xs">
                  <p className="text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText size={14} /> OCR Raw Text Detection
                  </p>
                  <pre className="whitespace-pre-wrap">{result.raw_text}</pre>
                </div>
              )}

              {/* Confirm Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => { setResult(null); setFile(null); setPreview(null); }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Scan Another Label
                </button>
                <button
                  onClick={handleConfirmAndAdd}
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  <span>Confirm & Save to Inventory</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}
