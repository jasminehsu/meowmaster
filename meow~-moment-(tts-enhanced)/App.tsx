
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { STATES, CATS, UI_TEXT, GOOGLE_SHEET_CSV_URL } from './constants';
import { LanguageCode, AppStep, Quote, MultilingualText } from './types';
import { GeminiService } from './services/gemini';

// Icons
const SvgIcon = ({ name, className = "w-6 h-6" }: { name: string; className?: string }) => {
  if (name === "audio_spark") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
        <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
      </svg>
    );
  }
  // Other icons omitted for brevity but they'd be standard Lucide-style
  return <span className={className}>?</span>;
};

const App: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('zh-TW');
  const [step, setStep] = useState<AppStep>('state');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<Record<string, Quote[]>>({});
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [rxNo, setRxNo] = useState(0);
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const t = useCallback((key: keyof typeof UI_TEXT['zh-TW']) => {
    return UI_TEXT[currentLang][key] || UI_TEXT['zh-TW'][key];
  }, [currentLang]);

  const getText = useCallback((textObj: MultilingualText | undefined) => {
    if (!textObj) return '';
    return textObj[currentLang] || textObj['zh-TW'] || '';
  }, [currentLang]);

  // Initial Data Load
  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        const csv = await response.text();
        // Simple CSV parsing (Ideally use a lib, but following logic from snippet)
        const rows = csv.split('\n').map(row => row.split(','));
        const header = rows[0];
        const scenarioIdx = header.findIndex(h => h.includes('scenarioIds'));
        const mainIdx = header.findIndex(h => h.includes('main_tw'));
        const actionIdx = header.findIndex(h => h.includes('action_tw'));
        const authorIdx = header.findIndex(h => h.includes('author_tw'));

        const data: Record<string, Quote[]> = { start: [], conflict: [], win: [], tired: [], push: [] };
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row[mainIdx]) continue;
          const q: Quote = {
            main: { 'zh-TW': row[mainIdx] },
            action: { 'zh-TW': row[actionIdx] || '' },
            author: { 'zh-TW': row[authorIdx] || '貓大師' }
          };
          const scenarios = row[scenarioIdx]?.split(',') || Object.keys(data);
          scenarios.forEach(sid => {
            const cleanSid = sid.trim();
            if (data[cleanSid]) data[cleanSid].push(q);
          });
        }
        setQuotes(data);
      } catch (err) {
        console.error("Failed to fetch sheet", err);
      }
    };
    fetchSheetData();
  }, []);

  const handleStateSelect = (sid: string) => {
    setSelectedScenario(sid);
    const pool = quotes[sid] || [];
    if (pool.length > 0) {
      setCurrentQuote(pool[Math.floor(Math.random() * pool.length)]);
    }
    setStep('quote');
  };

  const handleCatSelect = () => {
    setRxNo(prev => prev + 1);
    setStep('rx');
  };

  const handleTTS = async () => {
    if (!currentQuote?.action || isTtsLoading) return;
    
    // Stop previous audio
    if (currentSourceRef.current) {
      currentSourceRef.current.stop();
    }

    setIsTtsLoading(true);
    const textToRead = getText(currentQuote.action);
    const buffer = await GeminiService.generateSpeech(textToRead, 'Kore');
    setIsTtsLoading(false);

    if (buffer) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.start();
      currentSourceRef.current = source;
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-lg border-b border-stone-200">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-xl">🐾</div>
            <div>
              <h1 className="text-sm font-black tracking-widest text-stone-800 uppercase">{t('appTitle')}</h1>
              <p className="text-[10px] text-stone-500 tracking-wider mt-0.5">{t('appSubtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setCurrentLang(currentLang === 'zh-TW' ? 'en' : 'zh-TW')} className="text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors">
               {currentLang === 'zh-TW' ? 'ENGLISH' : '繁體中文'}
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 mt-8">
        {step === 'state' && (
          <div className="bg-white/90 rounded-3xl p-8 shadow-xl border border-white/50 backdrop-blur-md">
            <h2 className="text-2xl font-bold mb-2">{t('stateTitle')}</h2>
            <p className="text-stone-500 text-sm mb-6">{t('stateSubtitle')}</p>
            <div className="flex flex-wrap gap-3">
              {STATES.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleStateSelect(s.id)}
                  className="flex items-center gap-3 px-6 py-3 bg-white border border-stone-200 rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  <span>{s.icon}</span>
                  <span className="text-sm font-medium">{getText(s.label)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'quote' && currentQuote && (
          <div className="bg-white/90 rounded-3xl p-8 shadow-xl border border-white/50 backdrop-blur-md text-center">
            <div className="text-stone-400 text-xs mb-4">🐾 {t('todayQuote')}</div>
            <div className="text-2xl font-medium leading-relaxed mb-4">
              “{getText(currentQuote.main)}”
            </div>
            <div className="text-xs text-stone-400 uppercase tracking-widest mb-8">
              — {getText(currentQuote.author)}
            </div>
            <div className="h-px bg-stone-100 w-full mb-8" />
            <p className="text-stone-400 text-xs mb-6">{t('pickCat')}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {CATS.map(c => (
                <button
                  key={c.id}
                  onClick={handleCatSelect}
                  className="group relative flex flex-col items-center p-4 rounded-2xl bg-stone-50 border border-stone-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🐱</div>
                  <span className="text-xs font-bold text-stone-500">{getText(c.name)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'rx' && currentQuote && (
          <div className="bg-white/90 rounded-3xl p-8 shadow-xl border border-white/50 backdrop-blur-md flex flex-col gap-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
               <span className="text-xl">🐾</span> {t('masterRx')}
            </h2>

            {/* Prescription Paper */}
            <div className="relative overflow-hidden bg-[#FFFDF7] border border-stone-200 rounded-2xl p-6 grid-dot min-h-[160px] flex flex-col justify-center text-center">
              <div className="absolute top-4 left-4 text-[10px] text-stone-400 tracking-tighter opacity-50 font-mono">
                RX-{String(rxNo).padStart(4, '0')}
              </div>
              <div className="absolute top-4 right-4 text-[10px] text-stone-400 opacity-50">
                {new Date().toLocaleDateString('zh-TW')}
              </div>
              
              <div className="text-lg text-stone-700 leading-relaxed font-medium mb-6 px-4">
                {getText(currentQuote.action) || t('rxMissing')}
              </div>

              {/* TTS Feature Integration */}
              <div className="flex flex-col items-center gap-2">
                <button 
                  onClick={handleTTS}
                  disabled={isTtsLoading}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm transition-all shadow-sm ${
                    isTtsLoading 
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200 active:scale-95'
                  }`}
                >
                  {isTtsLoading ? (
                    <div className="w-4 h-4 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <SvgIcon name="audio_spark" className="w-4 h-4" />
                  )}
                  <span className="font-bold">{isTtsLoading ? t('ttsLoading') : t('ttsButton')}</span>
                </button>
                <p className="text-[10px] text-stone-400 tracking-tight">{t('ttsTip')}</p>
              </div>

              <div className="mt-8 text-[9px] text-stone-300 tracking-[0.3em] font-black uppercase">CAT MASTER RECIPE</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setStep('quote')}
                className="flex-1 py-4 bg-stone-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-colors shadow-lg active:scale-[0.98]"
              >
                {t('again')}
              </button>
              <button
                onClick={() => setStep('state')}
                className="flex-1 py-4 bg-stone-100 text-stone-800 rounded-2xl font-bold text-sm hover:bg-stone-200 transition-colors active:scale-[0.98]"
              >
                {t('changeState')}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
