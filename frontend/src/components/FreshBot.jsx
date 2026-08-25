import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  RotateCcw,
  ChefHat,
  Leaf
} from 'lucide-react';
import api from '../services/api';

export default function FreshBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: '👋 Hi there! I am FreshBot AI, your personal food waste guardian. How can I help you save food and cook smart today?',
      suggestions: ['What is expiring soon?', 'Suggest a dinner recipe', 'How to store bread & berries', 'Show my savings']
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Text to Speech
  const speakText = (text) => {
    if (!ttsEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    // Clean text for speech
    const cleanText = text.replace(/[*_#•]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Speech Recognition (Voice Input)
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use keyboard input.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleSend = async (messageText) => {
    const query = messageText || input;
    if (!query.trim() || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: query.trim() }]);
    setLoading(true);

    try {
      const { data } = await api.post('/ai/chat', { message: query.trim() });
      const reply = data.reply || "I've checked your inventory and everything looks organized!";
      const suggestions = data.suggestions || ['What is expiring soon?', 'Generate a zero-waste recipe'];
      
      setMessages(prev => [...prev, { role: 'bot', content: reply, suggestions }]);
      speakText(reply);
    } catch (err) {
      const fallback = "I'm checking your kitchen inventory. Ask me what items are expiring or request a zero-waste recipe!";
      setMessages(prev => [...prev, { role: 'bot', content: fallback }]);
      speakText(fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xl shadow-emerald-600/30 hover:scale-110 active:scale-95 transition-all z-40 flex items-center gap-2 group ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        }`}
        title="Chat with FreshBot AI"
      >
        <Bot size={24} className="group-hover:rotate-12 transition-transform" />
        <span className="font-heading font-bold text-sm pr-1 hidden sm:inline">Ask FreshBot</span>
        <span className="w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping absolute -top-1 -right-1" />
      </button>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[92vw] sm:w-[420px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col z-50 overflow-hidden h-[540px] animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-primary-600 text-white flex justify-between items-center shadow-sm">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm flex items-center gap-1.5">
                  FreshBot AI
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">GPT-Engine</span>
                </h3>
                <p className="text-[11px] text-emerald-100">Live Inventory Intelligence</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`p-1.5 rounded-lg transition-colors ${ttsEnabled ? 'bg-white/30 text-white' : 'text-white/70 hover:bg-white/20'}`}
                title={ttsEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
              >
                {ttsEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button 
                onClick={() => setMessages([{ role: 'bot', content: 'Chat reset. How can I help you manage your food today?', suggestions: ['What is expiring soon?', 'Dinner ideas'] }])}
                className="p-1.5 rounded-lg text-white/70 hover:bg-white/20 transition-colors"
                title="Reset conversation"
              >
                <RotateCcw size={16} />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:bg-white/20 transition-colors"
                title="Close chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-br-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/80 dark:border-slate-700/80'
                }`}>
                  <div className="whitespace-pre-line">
                    {m.content}
                  </div>
                </div>

                {/* Suggestion Chips */}
                {m.suggestions && m.suggestions.length > 0 && i === messages.length - 1 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                    {m.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug)}
                        className="text-[11px] bg-emerald-50 hover:bg-emerald-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-slate-700 transition-colors flex items-center gap-1"
                      >
                        <Sparkles size={10} />
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-xs text-slate-400 bg-white dark:bg-slate-800 p-3 rounded-2xl w-fit border border-slate-200 dark:border-slate-700">
                <Leaf size={14} className="animate-spin text-emerald-500" />
                <span>FreshBot is analyzing your fridge & recipes...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2"
          >
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl transition-all ${
                isListening 
                  ? 'bg-rose-500 text-white animate-bounce' 
                  : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Voice Input"
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={isListening ? "Listening... speak now" : "Ask FreshBot anything..."}
              className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 border border-transparent focus:border-emerald-500 transition-all"
            />
            
            <button 
              type="submit" 
              disabled={!input.trim() || loading} 
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl shadow-md transition-all disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
