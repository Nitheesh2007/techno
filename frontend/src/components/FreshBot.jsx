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
  Volume1,
  RotateCcw,
  Smile,
  Zap,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { aiEngine } from '../services/aiEngine';
import { storage } from '../services/storage';
import { sound, speakVoice } from '../services/sound';
import { useLanguage } from '../context/LanguageContext';

export default function FreshBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    // Initial welcome message based on language
    const welcome = language === 'ta'
      ? "👋 **வணக்கம்! நான் FreshBot AI.**\nஉங்கள் சமையலறை உணவுப் பாதுகாவலன் மற்றும் குரல் உதவியாளர். காலாவதியாகும் உணவுகள், சமையல் குறிப்புகள் மற்றும் சேமிப்பு முறைகள் பற்றி என்னிடம் கேளுங்கள்!"
      : "👋 **Hi there! I am FreshBot AI.**\nYour zero-waste kitchen assistant and voice companion. Ask me anything about recipes, food expiration, or smart kitchen hacks!";

    setMessages([
      { 
        sender: 'bot', 
        text: welcome, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: language === 'ta'
          ? ['குளிர்சாதனப் பெட்டியில் என்ன உள்ளது?', 'இன்றைய இரவு உணவு செய்முறை', 'பால் சேமிப்பு முறை']
          : ["What's expiring soon?", 'Suggest a dinner recipe', 'How to keep milk fresh']
      }
    ]);

    // Setup Web Speech Recognition for Tamil (ta-IN) & English (en-US)
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
  }, [messages, isOpen, isTyping]);

  // Voice Synthesizer with Tamil ta-IN integration
  const speakText = (text) => {
    if (!voiceEnabled) return;
    setIsSpeaking(true);
    // Strip markdown formatting symbols for natural speech audio
    const cleanSpeech = text.replace(/[*_#•`]/g, '').replace(/\[.*?\]\(.*?\)/g, '');
    speakVoice(cleanSpeech, language, () => setIsSpeaking(false));
  };

  const handleTestVoice = () => {
    const testText = language === 'ta'
      ? "வணக்கம்! நான் FreshBot AI. சமையலறை மற்றும் உணவுகளைப் பற்றி என்னிடம் கேளுங்கள்."
      : "Hello! I am FreshBot AI, your personal zero-waste kitchen assistant.";
    speakText(testText);
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

      const botMsg = {
        sender: 'bot',
        text: response.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: response.suggestedActions
      };

      setMessages((prev) => [...prev, botMsg]);
      speakText(response.reply);
    } catch (err) {
      console.warn('FreshBot chat error caught safely:', err);
      const fallbackText = language === 'ta'
        ? "✨ FreshBot AI தமிழ் உதவியாளர் தயார்! சமையல் குறிப்புகள் அல்லது காலாவதியாகும் உணவுகள் பற்றி கேளுங்கள்."
        : "✨ FreshBot AI is online! Ask me for zero-waste recipes or to check expiring food items.";
      
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
        sound.playBeep(900, 0.05);
      }
    } catch (err) {
      console.warn('Speech recognition toggle notice:', err);
      setIsListening(false);
    }
  };

  const quickPrompts = language === 'ta' ? [
    '🍎 குளிர்சாதனப் பெட்டியில் என்ன உள்ளது?',
    '👨‍🍳 இரவு உணவு செய்முறை தாருங்கள்',
    '🍞 ரொட்டியை பாதுகாப்பது எப்படி?',
    '🥛 பால் கெடாமல் வைக்கும் வழி',
    '📊 எனது சேமிப்பு புள்ளிவிவரங்கள்'
  ] : [
    "🍎 What's expiring soon?",
    "👨‍🍳 Suggest a quick dinner recipe",
    "🍞 How to keep bread fresh?",
    "🥛 How to store milk properly?",
    "📊 Show my savings & impact"
  ];

  const handleClearChat = () => {
    sound.playBeep(450, 0.04);
    const welcome = language === 'ta'
      ? "👋 **உரையாடல் மீட்டமைக்கப்பட்டது.**\nபுதிய சமையல் குறிப்புகள் அல்லது காலாவதி விவரங்களை கேட்கலாம்!"
      : "👋 **Chat cleared.**\nAsk me any food question, recipe idea, or fridge check!";
    setMessages([{ sender: 'bot', text: welcome, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            sound.playBeep(900, 0.05);
            if (language === 'ta') {
              handleTestVoice();
            }
          }}
          className="bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-700 hover:to-teal-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center relative group border-2 border-white/20"
          aria-label="Open FreshBot Assistant"
        >
          <Bot size={26} className="animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
          </span>
          {/* Tooltip */}
          <span className="absolute right-full mr-3 bg-slate-900 dark:bg-slate-800 text-white text-xs px-3.5 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none font-bold border border-slate-700">
            {language === 'ta' ? 'FreshBot AI உடன் பேசுங்கள் 🤖' : 'Chat with FreshBot AI 🤖'}
          </span>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[560px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <Bot size={22} className={isSpeaking ? 'animate-bounce text-amber-300' : ''} />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-sm flex items-center gap-1.5">
                  {t('freshBotTitle')}
                  <span className="text-[9px] bg-emerald-400 text-emerald-950 px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider">
                    {language === 'ta' ? 'ஆன்லைன்' : 'ONLINE'}
                  </span>
                </h3>
                <p className="text-[11px] text-emerald-100 font-medium">
                  {language === 'ta' ? 'தமிழ் & ஆங்கிலம் குரல் உதவியாளர்' : 'Smart Voice & Kitchen AI'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleTestVoice}
                title={language === 'ta' ? 'குரல் ஒலியை சோதிக்கவும்' : 'Test voice audio'}
                className="p-1.5 rounded-xl text-emerald-100 hover:bg-white/10 transition-colors"
              >
                <Volume1 size={17} />
              </button>
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                title={voiceEnabled ? (language === 'ta' ? 'குரலை முடக்கு' : 'Mute speech') : (language === 'ta' ? 'குரலை இயக்கு' : 'Enable speech')}
                className="p-1.5 rounded-xl text-emerald-100 hover:bg-white/10 transition-colors"
              >
                {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button
                onClick={handleClearChat}
                title={language === 'ta' ? 'உரையாடலை மீட்டமை' : 'Reset chat history'}
                className="p-1.5 rounded-xl text-emerald-100 hover:bg-white/10 transition-colors"
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-emerald-100 hover:bg-white/10 transition-colors"
                title={language === 'ta' ? 'மூடு' : 'Close'}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/60 dark:bg-slate-950/60 custom-scrollbar">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/80 dark:border-slate-700 shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-line font-normal space-y-1">
                    {m.text.split('\n').map((line, lIdx) => {
                      if (line.startsWith('•') || line.startsWith('-')) {
                        return <div key={lIdx} className="pl-2 font-medium">{line}</div>;
                      }
                      if (line.includes('**')) {
                        const parts = line.split('**');
                        return (
                          <p key={lIdx}>
                            {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-extrabold">{p}</strong> : p)}
                          </p>
                        );
                      }
                      return <p key={lIdx}>{line}</p>;
                    })}
                  </div>
                  
                  {/* Suggested Action Chips */}
                  {m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap gap-1.5">
                      {m.suggestedActions.map((action, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => handleSend(action)}
                          className="text-[10px] bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 px-2.5 py-1 rounded-xl font-bold transition-all border border-emerald-200 dark:border-emerald-800/60 text-left hover:scale-105"
                        >
                          💬 {action}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className={`text-[9px] block text-right mt-1.5 font-mono ${m.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-slate-200 dark:border-slate-700 shadow-sm flex items-center space-x-1.5">
                  <span className="text-[11px] text-slate-400 font-semibold mr-1">FreshBot</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Category Chips */}
          <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-1.5 overflow-x-auto custom-scrollbar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full whitespace-nowrap transition-colors flex-shrink-0 font-medium"
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
                  ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title={isListening ? (language === 'ta' ? 'குரல் உள்ளீட்டை நிறுத்து' : 'Stop Listening') : (language === 'ta' ? 'குரல் உள்ளீடு' : 'Voice Input')}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            <input
              type="text"
              placeholder={isListening ? (language === 'ta' ? 'கேட்கிறேன்... பேசுங்கள்' : 'Listening... Speak now') : (language === 'ta' ? 'சமையல் அல்லது உணவு பற்றி கேளுங்கள்...' : 'Ask about recipes, expiry, food hacks...')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white px-3.5 py-2.5 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white p-2.5 rounded-2xl transition-colors shadow-md shadow-emerald-600/20"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
