import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ChefHat, 
  Apple, 
  Clock, 
  Leaf,
  ChevronDown
} from 'lucide-react';
import { aiEngine } from '../services/aiEngine';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { useLanguage } from '../context/LanguageContext';

export default function FreshBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    // Initial welcome message based on language
    const welcome = language === 'ta'
      ? "👋 வணக்கம்! நான் FreshBot AI, உங்கள் சமையலறை உணவுப் பாதுகாவலன். உங்கள் உணவுகள் வீணாவதைத் தடுக்க நான் எவ்வாறு உதவ முடியும்?"
      : "👋 Hi there! I am FreshBot AI, your personal food waste guardian. How can I help you save food and cook smart today?";

    setMessages([
      { sender: 'bot', text: welcome, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);

    // Setup Web Speech Recognition
    try {
      if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = language === 'ta' ? 'ta-IN' : 'en-US';

        recognitionRef.current.onresult = (event) => {
          try {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            setIsListening(false);
            handleSend(transcript);
          } catch (e) {
            setIsListening(false);
          }
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    } catch (err) {
      console.warn('Speech recognition initialization notice:', err);
    }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // High-Quality Bilingual Voice Synthesizer
  const speakText = (text) => {
    try {
      if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const cleanText = (text || '').replace(/[*_#`•]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.lang = language === 'ta' ? 'ta-IN' : 'en-US';

      const voices = window.speechSynthesis.getVoices();
      if (language === 'ta') {
        const tamilVoice = voices.find(v => v.lang === 'ta-IN' || v.lang === 'ta_IN' || v.lang.startsWith('ta'));
        if (tamilVoice) {
          utterance.voice = tamilVoice;
        }
      }
      
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis notice:', err);
    }
  };

  const handleSend = async (manualText) => {
    const textToSend = manualText || input;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    sound.playClick?.() || sound.playBeep(800, 0.04);

    try {
      const response = await aiEngine.chatFreshBot(textToSend, language);
      
      let botResponseText = response.reply;
      if (language === 'ta' && (textToSend.includes('காலாவதி') || textToSend.includes('அவசரம்') || textToSend.includes('பிரிட்ஜ்'))) {
        const products = storage.getProducts();
        const urgent = products.filter(p => p.status === 'URGENT' || p.status === 'EXPIRING SOON');
        if (urgent.length === 0) {
          botResponseText = "✨ உங்கள் சமையலறை புத்தம் புதியதாக உள்ளது! அடுத்த 3 நாட்களில் எந்த உணவும் காலாவதியாகவில்லை.";
        } else {
          botResponseText = `🚨 அவசரம்: உங்கள் குளிர்சாதனப் பெட்டியில் ${urgent.map(u => u.product_name).join(', ')} விரைவில் காலாவதியாகிறது! இவற்றை வைத்து சமைக்க செய்முறையை உருவாக்குகிறேன்.`;
        }
      }

      const botMsg = {
        sender: 'bot',
        text: botResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: response.suggestedActions
      };

      setMessages((prev) => [...prev, botMsg]);
      speakText(botResponseText);
    } catch (err) {
      console.warn('FreshBot chat error caught safely:', err);
      const fallbackText = language === 'ta'
        ? "✨ FreshBot AI குரல் உதவியாளர் செயலில் உள்ளது! சமையல் குறிப்புகள் அல்லது காலாவதியாகும் உணவுகளைப் பற்றி கேளுங்கள்."
        : "✨ FreshBot AI is active! Ask me for quick zero-waste recipes or to check what's expiring.";
      
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: fallbackText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      speakText(fallbackText);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleListening = () => {
    try {
      if (!recognitionRef.current) {
        alert(language === 'ta' ? 'உங்கள் உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை. கீழே தட்டச்சு செய்யலாம்!' : 'Speech recognition is not supported in this browser. You can type below!');
        return;
      }

      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        recognitionRef.current.lang = language === 'ta' ? 'ta-IN' : 'en-US';
        recognitionRef.current.start();
        setIsListening(true);
      }
    } catch (err) {
      console.warn('Speech recognition toggle notice:', err);
      setIsListening(false);
    }
  };

  const quickPrompts = language === 'ta' ? [
    'குளிர்சாதனப் பெட்டியில் என்ன காலாவதியாகிறது?',
    'இன்றைய இரவு உணவு செய்முறை தாருங்கள்',
    'உணவு வீணாவதைத் தடுக்கும் சேமிப்பு முறைகள்',
    'பூஜ்ஜிய கழிவு சமையல் வழிகாட்டல்'
  ] : [
    "What's expiring soon?",
    "Quick recipe for dinner",
    "How to keep bread fresh?",
    "Zero-waste kitchen tips"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            sound.playBeep(900, 0.05);
          }}
          className="bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center relative group"
          aria-label="Open FreshBot Assistant"
        >
          <Bot size={26} className="animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
          </span>
          {/* Tooltip */}
          <span className="absolute right-full mr-3 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none font-semibold">
            {t('askFreshBot')} 🤖
          </span>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[540px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-2xl">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-sm flex items-center gap-1.5">
                  {t('freshBotTitle')}
                  <span className="text-[10px] bg-emerald-400 text-emerald-950 px-1.5 py-0.2 rounded-full font-bold">LIVE</span>
                </h3>
                <p className="text-[11px] text-emerald-100">{t('freshBotLive')}</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                title={voiceEnabled ? 'Mute speech voice' : 'Enable speech voice'}
                className="p-1.5 rounded-lg text-emerald-100 hover:bg-white/10 transition-colors"
              >
                {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-emerald-100 hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/40 custom-scrollbar">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/80 dark:border-slate-700 shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  <span className={`text-[9px] block text-right mt-1 ${m.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-slate-200 dark:border-slate-700 shadow-sm flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-1.5 overflow-x-auto custom-scrollbar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
            <button
              onClick={toggleListening}
              className={`p-2.5 rounded-2xl transition-all ${
                isListening 
                  ? 'bg-rose-500 text-white animate-pulse' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
              }`}
              title={isListening ? (language === 'ta' ? 'குரல் உள்ளீட்டை நிறுத்து' : 'Stop Listening') : (language === 'ta' ? 'குரல் உள்ளீடு' : 'Voice Input')}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            <input
              type="text"
              placeholder={isListening ? t('listening') : t('askAnything')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white px-3.5 py-2.5 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white p-2.5 rounded-2xl transition-colors shadow-sm"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
