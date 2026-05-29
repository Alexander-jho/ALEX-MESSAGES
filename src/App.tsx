import React, { useState, useEffect, useRef } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  Sparkles, 
  Download, 
  Share2, 
  Copy, 
  Sunrise, 
  Sun, 
  Coffee, 
  Compass, 
  Sunset, 
  Moon, 
  Clock, 
  Check, 
  Heart, 
  RotateCw, 
  History, 
  Sliders, 
  Info, 
  BookMarked,
  X,
  Plus,
  BookmarkCheck,
  ChevronRight,
  Sparkle
} from 'lucide-react';
import html2canvas from 'html2canvas';

import { TimeOfDay, MessageStyle, CardConfig, GeneratedMessage, UserPreferences } from './types';
import { MOMENTS_OF_DAY, MESSAGE_STYLES, getMomentDetails, detectTimeOfDay } from './data';

export default function App() {
  // Main configurations & states
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(detectTimeOfDay());
  const [style, setStyle] = useState<MessageStyle>('soft_romantic');
  const [modelOption, setModelOption] = useState<'flash' | 'pro'>('flash');
  
  // Custom Memory Core
  const [customRecipient, setCustomRecipient] = useState<string>(() => {
    return localStorage.getItem('alex_recipient_name') || '';
  });
  const [customPromptNuance, setCustomPromptNuance] = useState<string>(() => {
    return localStorage.getItem('alex_recipient_nuance') || 'calm';
  });

  // Current Card State
  const [currentMessage, setCurrentMessage] = useState<GeneratedMessage>(() => {
    const moment = getMomentDetails(detectTimeOfDay());
    return {
      id: 'default-init',
      text: moment.fallbackMessages.soft_romantic,
      timeOfDay: detectTimeOfDay(),
      style: 'soft_romantic',
      atmosphereSuggestion: moment.cardConfig.atmosphere,
      colorAccent: '#F59E0B',
      isFavorite: false,
      createdAt: new Date().toISOString()
    };
  });

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState<boolean>(false);
  const [savedFavoritesOnly, setSavedFavoritesOnly] = useState<boolean>(false);
  
  // History list
  const [messageHistory, setMessageHistory] = useState<GeneratedMessage[]>(() => {
    try {
      const stored = localStorage.getItem('alex_messages_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Ref for the card capturing
  const cardRef = useRef<HTMLDivElement>(null);
  const selectStyle = (newStyle: MessageStyle) => {
    setStyle(newStyle);
    triggerAutoMessage(timeOfDay, newStyle);
  };

  // Trigger Toast Notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Persist memory on changes
  useEffect(() => {
    localStorage.setItem('alex_recipient_name', customRecipient);
  }, [customRecipient]);

  useEffect(() => {
    localStorage.setItem('alex_recipient_nuance', customPromptNuance);
  }, [customPromptNuance]);

  useEffect(() => {
    localStorage.setItem('alex_messages_history', JSON.stringify(messageHistory));
  }, [messageHistory]);

  // Keep favorite flag updated if toggled via other views
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Toggle on current if it matches
    if (currentMessage.id === id) {
      setCurrentMessage(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
    }

    // Toggle in history
    setMessageHistory(prev => 
      prev.map(msg => msg.id === id ? { ...msg, isFavorite: !msg.isFavorite } : msg)
    );
    showToast("Estado guardado en favoritos.");
  };

  // Perform automatic generation upon configuration adjustments
  const triggerAutoMessage = async (chosenTime: TimeOfDay, chosenStyle: MessageStyle) => {
    setIsLoading(true);
    try {
      // API call to Express proxy
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeOfDay: chosenTime,
          style: chosenStyle,
          modelOption,
          recipientName: customRecipient,
          nuance: customPromptNuance
        })
      });

      if (!response.ok) {
        throw new Error("HTTP Response Error");
      }

      const data = await response.json();
      
      const newMsg: GeneratedMessage = {
        id: `msg-${Date.now()}`,
        text: data.message,
        timeOfDay: chosenTime,
        style: chosenStyle,
        atmosphereSuggestion: data.atmosphereSuggestion,
        colorAccent: data.colorAccent || '#F59E0B',
        isFavorite: false,
        createdAt: new Date().toISOString()
      };

      setCurrentMessage(newMsg);
      // Append to memory history
      setMessageHistory(prev => [newMsg, ...prev.slice(0, 49)]); // keep last 50
    } catch (err) {
      // Fine-grained beautiful human fallback without failing
      const momentDetails = getMomentDetails(chosenTime);
      const fallbackText = momentDetails.fallbackMessages[chosenStyle] || momentDetails.fallbackMessages.soft_romantic;
      
      const newMsg: GeneratedMessage = {
        id: `fallback-${Date.now()}`,
        text: fallbackText + (customRecipient ? `, ${customRecipient}.` : ''),
        timeOfDay: chosenTime,
        style: chosenStyle,
        atmosphereSuggestion: momentDetails.cardConfig.atmosphere,
        colorAccent: '#F59E0B',
        isFavorite: false,
        createdAt: new Date().toISOString()
      };

      setCurrentMessage(newMsg);
      setMessageHistory(prev => [newMsg, ...prev.slice(0, 49)]);
      showToast("Nota: Usando motor poético local sin conexión. Agrega tu API Key para activar la IA en vivo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Generar otro mensaje button click
  const handleGenerateClick = () => {
    triggerAutoMessage(timeOfDay, style);
  };

  // On mount or moment select trigger first time load
  useEffect(() => {
    triggerAutoMessage(timeOfDay, style);
  }, [timeOfDay]);

  // Copy text to clipboard
  const copyMessageText = async () => {
    try {
      await navigator.clipboard.writeText(currentMessage.text);
      showToast("Mensaje copiado con éxito.");
    } catch {
      showToast("No se pudo copiar el mensaje.");
    }
  };

  // Share using Web Share API or copy link
  const shareCard = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ALEX Messages',
          text: currentMessage.text,
          url: window.location.href,
        });
        showToast("Compartido con éxito.");
      } catch {
        // user cancelled or failed, carry on
      }
    } else {
      copyMessageText();
    }
  };

  // Download Card as high-res PNG
  const downloadCardPNG = async () => {
    if (!cardRef.current) return;
    showToast("Renderizando tarjeta premium...");
    try {
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        scale: 2, // High DPI capture
        backgroundColor: null,
        logging: false
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `ALEX-Messages-${timeOfDay}-${style}.png`;
      link.href = dataUrl;
      link.click();
      showToast("Tarjeta descargada con éxito.");
    } catch (err) {
      showToast("Error al exportar la imagen de la tarjeta.");
    }
  };

  // Restore historic card to preview
  const handleRestoreCard = (hist: GeneratedMessage) => {
    setCurrentMessage(hist);
    setTimeOfDay(hist.timeOfDay);
    setStyle(hist.style);
    setShowHistoryDrawer(false);
    showToast("Mensaje del historial restablecido.");
  };

  // Get current active moment config & details
  const moment = getMomentDetails(timeOfDay);
  const activeConfig = moment.cardConfig;

  // Icons mapper component to ensure accurate, clean rendering
  const MomentIcon = ({ name, className }: { name: string; className?: string }) => {
    switch (name) {
      case 'Sunrise': return <Sunrise className={className} />;
      case 'Sun': return <Sun className={className} />;
      case 'Coffee': return <Coffee className={className} />;
      case 'Compass': return <Compass className={className} />;
      case 'Sunset': return <Sunset className={className} />;
      case 'Moon': return <Moon className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      default: return <Clock className={className} />;
    }
  };

  return (
    <div className={`min-h-screen relative w-full overflow-x-hidden flex flex-col transition-all duration-1000 bg-gradient-to-br ${moment.gradientClass} font-sans text-slate-800 selection:bg-rose-100 selection:text-rose-900`}>
      
      {/* BACKGROUND ATMOSPHERIC CHROMA ENGINE */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        
        {/* Soft floating bokeh particles or starlight depending on mode */}
        {activeConfig.effectType === 'stars' && (
          <div className="absolute inset-0 opacity-40">
            {Array.from({ length: 40 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute bg-white rounded-full animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  animationDuration: `${Math.random() * 3 + 2}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Rain dynamic simulation overlay */}
        {timeOfDay === 'night' && (
          <div className="absolute inset-0 opacity-15 overflow-hidden">
            {Array.from({ length: 25 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute bg-sky-200 w-[1px] h-[30px] rounded-full rain-drop"
                style={{
                  top: `${Math.random() * -30}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 1 + 0.8}s`,
                  animationDelay: `${Math.random() * 1.5}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Cinematic Golden dust floating in afternoon dust beams */}
        {activeConfig.effectType === 'dust' && (
          <div className="absolute inset-0 opacity-30">
            {Array.from({ length: 15 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute bg-orange-200/50 rounded-full blur-[1px] animate-atmospheric-drift"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 6 + 3}px`,
                  height: `${Math.random() * 6 + 3}px`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 6 + 6}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Sunlight Rays for sunrise */}
        {activeConfig.effectType === 'rays' && (
          <div className="absolute top-0 left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_top,rgba(253,230,138,0.15)_0%,transparent_60%)] pointer-events-none rotate-12 blur-[10px]" />
        )}

        {/* Botanical soft swaying shadows for media mañana */}
        {activeConfig.effectType === 'shadows' && (
          <div className="absolute bottom-[-10%] right-[-5%] w-[80%] md:w-[40%] h-[70%] bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.04)_0%,transparent_70%)] opacity-85 rotate-[-12deg]" />
        )}

        {/* Warm radial glow backing the card container */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-lg aspect-square rounded-full blur-[140px] opacity-25 mix-blend-multiply transition-colors duration-1000"
          style={{ backgroundColor: currentMessage.colorAccent || '#F59E0B' }}
        />
      </div>

      {/* APPMOBILE HEADER APP */}
      <header className="relative w-full z-20 px-6 py-4 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-slate-950/5 dark:bg-white/5 backdrop-blur-md border border-slate-950/10 dark:border-white/10 shadow-sm">
            <Sparkles className="w-4 h-4 text-rose-505 mix-blend-difference" />
            <div className="absolute inset-0 rounded-full border border-rose-450 animate-ping opacity-20" />
          </div>
          <div>
            <span className="text-xs uppercase font-mono tracking-[0.22em] text-slate-500 block">Atmosphere Core</span>
            <h1 className="text-base font-serif font-semibold tracking-tight text-slate-900 dark:text-white mt-[-2px]">ALEX Messages</h1>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Timeline memory indicators */}
          <button 
            onClick={() => setShowHistoryDrawer(true)}
            className="flex items-center gap-2 px-3 py-1.5 h-9 rounded-full text-xs font-medium bg-white/60 hover:bg-white/95 text-slate-700 backdrop-blur-md border border-slate-200/50 hover:border-slate-300 transition-all shadow-sm cursor-pointer"
            title="Ver Historial"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Memoria ({messageHistory.length})</span>
          </button>

          {/* Settings button */}
          <button 
            onClick={() => setShowConfigModal(true)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/60 hover:bg-white/95 text-slate-700 backdrop-blur-md border border-slate-200/50 hover:border-slate-300 transition-all shadow-sm cursor-pointer"
            title="Ajustar Tonos & Destinatario"
          >
            <Sliders className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row items-center justify-center gap-12 z-10">
        
        {/* LEFT COLUMN: ACTIVE CARD & ACTIONS */}
        <section className="w-full max-w-md flex flex-col items-center justify-center gap-8">
          
          {/* THE METAPHORIC VISUAL CARD Container with elegant glassmorphism */}
          <div className="w-full relative group">
            
            {/* Soft backdrop cinematic glowing frame */}
            <div className="absolute inset-x-4 inset-y-2 rounded-[30px] bg-gradient-to-tr from-pink-500/10 to-indigo-500/10 opacity-70 blur-2xl group-hover:scale-105 transition-all duration-750 pointer-events-none" />

            <div 
              ref={cardRef}
              id="cinematic-tarjeta"
              className={`w-full aspect-[4/5] sm:aspect-[4/5] rounded-[28px] p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl transition-all duration-1000 ${activeConfig.glassStyles}`}
            >
              
              {/* Internal local glow */}
              <div 
                className="absolute -top-1/4 -right-1/4 w-1/2 aspect-square rounded-full blur-[60px] opacity-15"
                style={{ backgroundColor: currentMessage.colorAccent }}
              />

              {/* CARD HEADER */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2 opacity-75">
                  <MomentIcon name={moment.iconName} className="w-4 h-4" />
                  <span className="text-[10px] font-mono tracking-widest uppercase">{moment.name}</span>
                </div>
                
                {/* Visual Accent Circle */}
                <span 
                  className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_0_rgba(0,0,0,0.1)]"
                  style={{ backgroundColor: currentMessage.colorAccent }}
                />
              </div>

              {/* CARD CONTENT - MESSAGE BODY */}
              <div className="my-auto z-10 px-1 py-4 text-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentMessage.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    className={`text-xl sm:text-2xl font-serif leading-[1.65] font-medium tracking-wide ${
                      timeOfDay === 'night' || timeOfDay === 'sleeping' ? 'text-slate-100 font-light' : 'text-slate-900'
                    }`}
                  >
                    “{currentMessage.text}”
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* CARD FOOTER */}
              <div className="flex items-end justify-between z-10 border-t border-slate-900/5 dark:border-white/5 pt-4 opacity-75">
                <div>
                  <span className="text-[8px] font-mono tracking-widest uppercase block text-slate-400">Estilo Generado</span>
                  <span className="text-[11px] font-serif font-light italic mt-[-2px] block">
                    {MESSAGE_STYLES.find(s => s.key === style)?.name || "Romántico suave"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Miniature brand icon or date */}
                  <div className="text-right">
                    <span className="text-[8px] font-mono tracking-widest uppercase block text-slate-400">Atmosphere</span>
                    <span className="text-[10px] font-mono font-light tracking-tight block">ALEX_M</span>
                  </div>
                </div>
              </div>
              
              {/* Subtle ambient lens reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
            </div>
            
            {/* Floating Action Button inside the grid */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-full shadow-lg z-20">
              <button
                onClick={(e) => toggleFavorite(currentMessage.id, e)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-500/5 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                title="Añadir a Favoritos"
              >
                <Heart 
                  className={`w-4 h-4 transition-all ${
                    currentMessage.isFavorite 
                      ? 'fill-rose-500 text-rose-500 scale-110' 
                      : 'hover:text-rose-500'
                  }`} 
                />
              </button>

              <button
                onClick={copyMessageText}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-500/5 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                title="Copiar Mensaje"
              >
                <Copy className="w-4 h-4 hover:text-indigo-500 transition-colors" />
              </button>

              <button
                onClick={shareCard}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-500/5 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                title="Compartir"
              >
                <Share2 className="w-4 h-4 hover:text-emerald-500 transition-colors" />
              </button>

              <button
                onClick={downloadCardPNG}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-900 hover:bg-slate-850 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 transition-all cursor-pointer"
                title="Descargar Tarjeta"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Generar otro button */}
          <div className="w-full flex flex-col items-center gap-2 mt-6">
            <button
              onClick={handleGenerateClick}
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-medium text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 transition-all transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-wait cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Sintonizando mentes...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generar otro mensaje</span>
                </>
              )}
            </button>
            
            {/* Soft atmosphere detail label */}
            <p className="text-[11px] font-mono tracking-wider text-slate-400 uppercase flex items-center gap-1">
              <Sparkle className="w-3 h-3 text-amber-500" />
              <span>Ambiente: {currentMessage.atmosphereSuggestion}</span>
            </p>
          </div>

        </section>

        {/* RIGHT COLUMN: INTERACTIVE TUNING AND OPTIONS */}
        <section className="w-full max-w-lg flex flex-col gap-8">
          
          {/* MOMENT OF THE DAY DIAL SECTION */}
          <div className="bg-white/40 dark:bg-slate-950/20 backdrop-blur-md rounded-3xl p-6 border border-white/50 dark:border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 block">Sintonizador del Reloj</span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Momento del día</h3>
              </div>
              <span className="text-xs font-mono bg-slate-950/5 dark:bg-white/5 px-2.5 py-1 rounded-md text-slate-500">
                {MOMENTS_OF_DAY.find(m => m.key === timeOfDay)?.hourRange}
              </span>
            </div>

            {/* Horizontal Timeline flow */}
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
              {MOMENTS_OF_DAY.map((mom) => {
                const isActive = mom.key === timeOfDay;
                return (
                  <button
                    key={mom.key}
                    onClick={() => {
                      setTimeOfDay(mom.key);
                    }}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-between gap-2 border transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 shadow-md scale-[1.03]' 
                        : 'bg-white/20 hover:bg-white/50 border-transparent text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    <MomentIcon name={mom.iconName} className={`w-4 h-4 ${isActive ? 'text-indigo-505 mix-blend-difference' : 'text-slate-400'}`} />
                    <div className="text-center">
                      <span className="text-[11px] font-serif font-medium block leading-none">{mom.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-stone-500 text-[11px] font-light mt-4 text-center">
              {moment.description} Los mensajes se adaptan orgánicamente a estas vibraciones.
            </p>
          </div>

          {/* CHOOSE STYLE AND MODEL CONFIG */}
          <div className="bg-white/40 dark:bg-slate-950/20 backdrop-blur-md rounded-3xl p-6 border border-white/50 dark:border-white/5 flex flex-col gap-6">
            
            {/* Quick Emotional filter pills */}
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 block mb-2">Canal Emocional</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: 'soft_romantic', label: 'Modo romántico suave' },
                  { key: 'elegant', label: 'Modo elegante' },
                  { key: 'mysterious', label: 'Modo misterioso' },
                  { key: 'deep', label: 'Modo profundo' }
                ].map((mode) => {
                  const isCurSelected = style === mode.key;
                  return (
                    <button
                      key={mode.key}
                      onClick={() => selectStyle(mode.key as MessageStyle)}
                      className={`px-4 py-2 rounded-full text-xs font-serif tracking-wide border transition-all cursor-pointer ${
                        isCurSelected 
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow'
                          : 'bg-white/50 border-slate-200/50 hover:bg-white text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      {mode.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Extended list styles drawer selector directly on single UI dashboard */}
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 block mb-2">Expresión Poética Ampliada</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {MESSAGE_STYLES.map((st) => {
                  const isCurSt = style === st.key;
                  return (
                    <button
                      key={st.key}
                      onClick={() => selectStyle(st.key)}
                      className={`px-3 py-2 rounded-xl text-left border transition-all cursor-pointer ${
                        isCurSt
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-md'
                          : 'bg-white/20 hover:bg-white/65 border-transparent text-slate-650 hover:text-slate-800'
                      }`}
                    >
                      <h4 className="text-xs font-medium block leading-tight">{st.name}</h4>
                      <span className="text-[9px] font-light block line-clamp-1 opacity-60">{st.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gemini Intelligence Engine Selector */}
            <div className="flex items-center justify-between border-t border-slate-900/5 dark:border-white/5 pt-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 block">Motor de Pensamiento AI</span>
                <span className="text-xs font-semibold text-slate-900 dark:text-white">Profundidad Intelectual</span>
              </div>

              {/* Pill selector */}
              <div className="flex items-center p-0.5 bg-slate-950/5 dark:bg-slate-950/40 rounded-full border border-slate-200/50 dark:border-slate-800/10">
                <button
                  onClick={() => setModelOption('flash')}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wider uppercase transition-all cursor-pointer ${
                    modelOption === 'flash'
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                      : 'text-slate-500'
                  }`}
                >
                  Flash 3.5
                </button>
                <button
                  onClick={() => setModelOption('pro')}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wider uppercase transition-all cursor-pointer ${
                    modelOption === 'pro'
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                      : 'text-slate-500'
                  }`}
                >
                  Pro 3.1
                </button>
              </div>
            </div>

          </div>

          {/* METAPHORIC ACCENT / INTENTIONAL DISCLAIMER */}
          <div className="p-4 rounded-2xl bg-slate-400/5 border border-slate-400/10 flex gap-3 text-xs leading-5 font-light text-slate-500">
            <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <p>
              <strong>ALEX Messages</strong> escribe de forma madura y muy humana. Para crear una adicción afectiva saludable, evitamos el uso de emojis molestos y palabras bruscas de amor comercial, optando por melodías verbales refinadas.
            </p>
          </div>

        </section>
      </main>

      {/* HISTORIAL/FAVORITOS DE MENSAJES SLIDING DRAWER */}
      <AnimatePresence>
        {showHistoryDrawer && (
          <>
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistoryDrawer(false)}
              className="fixed inset-0 bg-slate-950 z-40 cursor-pointer"
            />

            {/* Sliding Drawer right */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-slate-950 z-50 border-l border-slate-200 dark:border-slate-900 p-6 shadow-2xl flex flex-col justify-between"
            >
              <div>
                {/* Header widget */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-rose-500 block">Memoria Poética</span>
                    <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white">Mensajes Almacenados</h3>
                  </div>
                  <button 
                    onClick={() => setShowHistoryDrawer(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Filter toggle Favorites vs and all */}
                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg mb-6 text-xs font-mono">
                  <button
                    onClick={() => setSavedFavoritesOnly(false)}
                    className={`flex-1 py-1.5 rounded-md text-center cursor-pointer transition-all ${
                      !savedFavoritesOnly 
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow'
                        : 'text-slate-500'
                    }`}
                  >
                    Todo ({messageHistory.length})
                  </button>
                  <button
                    onClick={() => setSavedFavoritesOnly(true)}
                    className={`flex-1 py-1.5 rounded-md text-center cursor-pointer transition-all ${
                      savedFavoritesOnly 
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow'
                        : 'text-slate-500'
                    }`}
                  >
                    Favoritos ({messageHistory.filter(h => h.isFavorite).length})
                  </button>
                </div>

                {/* History list content */}
                <div className="flex-1 overflow-y-auto max-h-[60vh] space-y-3.5 pr-1">
                  {messageHistory.length === 0 ? (
                    <div className="text-center py-12 text-stone-400">
                      <BookMarked className="w-8 h-8 mx-auto stroke-[1.2] mb-3 opacity-60" />
                      <p className="text-xs font-light">Ningún mensaje en el cofre todavía.</p>
                    </div>
                  ) : (
                    messageHistory
                      .filter(h => !savedFavoritesOnly || h.isFavorite)
                      .map((hist) => {
                        const mDetails = getMomentDetails(hist.timeOfDay);
                        return (
                          <div
                            key={hist.id}
                            onClick={() => handleRestoreCard(hist)}
                            className="p-4 rounded-xl border border-slate-100 dark:border-slate-900 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-905/20 hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-all group flex flex-col justify-between gap-3 relative"
                          >
                            <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-3 leading-relaxed font-serif font-medium">
                              “{hist.text}”
                            </p>
                            
                            <div className="flex items-center justify-between border-t border-slate-900/5 dark:border-white/5 pt-2">
                              <span className="text-[9px] font-mono uppercase bg-stone-100 dark:bg-stone-900 p-1 rounded">
                                {mDetails.name} • {MESSAGE_STYLES.find(s => s.key === hist.style)?.name || "Sutil"}
                              </span>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => toggleFavorite(hist.id, e)}
                                  className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                                >
                                  <Heart className={`w-3.5 h-3.5 ${hist.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                                </button>
                                
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {new Date(hist.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>

              {/* Drawer footer delete operations */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-900">
                <button
                  onClick={() => {
                    if(confirm("¿Deseas vaciar el historial de mensajes de la memoria?")) {
                      setMessageHistory([]);
                      showToast("Historial vaciado correctamente.");
                    }
                  }}
                  className="w-full text-center text-rose-500 hover:text-rose-600 font-mono text-xs cursor-pointer py-2"
                >
                  Vaciar toda la memoria
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CONF CONFIGURATION DRAWERS/MODAL */}
      <AnimatePresence>
        {showConfigModal && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfigModal(false)}
              className="fixed inset-0 bg-slate-950 z-40 cursor-pointer"
            />

            {/* Centered Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-x-6 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white dark:bg-slate-950 rounded-3xl p-6 border border-slate-250 dark:border-slate-900 z-50 shadow-2xl flex flex-col gap-6"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-rose-500 block">Sintonizador del Tono</span>
                  <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white">Memoria del Mensajero</h3>
                </div>
                <button 
                  onClick={() => setShowConfigModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form elements */}
              <div className="space-y-4">
                
                {/* Recipient name */}
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1.5">Nombre de la persona especial (Opcional)</label>
                  <input
                    type="text"
                    value={customRecipient}
                    onChange={(e) => setCustomRecipient(e.target.value)}
                    placeholder="Escribe su nombre aquí..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-stone-50/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                  <span className="text-[10px] text-slate-400 font-light block mt-1">
                    Esto se añadirá sutilmente a algunas estructuras del mensaje.
                  </span>
                </div>

                {/* Personality Nuances for custom adjusting prompt */}
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1.5 font-medium">Filtro de personalidad (Ajuste del Tono)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'calm', name: 'Independiente / Madura', desc: 'Presencia serena y equilibrada.' },
                      { key: 'mystic', name: 'Mística / Poética', desc: 'Misterio denso y alta sensibilidad.' },
                      { key: 'tender', name: 'Íntima / Escasa', desc: 'Hogareña, tierna y sutil.' },
                      { key: 'distance', name: 'Espíritu a Distancia', desc: 'Cobijo cálido que acorta millas.' }
                    ].map((nu) => (
                      <button
                        key={nu.key}
                        onClick={() => setCustomPromptNuance(nu.key)}
                        className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                          customPromptNuance === nu.key
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-sm'
                            : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <h5 className="text-xs font-semibold block">{nu.name}</h5>
                        <p className={`text-[10px] mt-0.5 leading-tight ${customPromptNuance === nu.key ? 'text-slate-300 dark:text-slate-600 font-light' : 'text-slate-400'}`}>
                          {nu.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Close Button saving */}
              <button
                onClick={() => {
                  setShowConfigModal(false);
                  triggerAutoMessage(timeOfDay, style);
                  showToast("Ajustes de memoria aplicados.");
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 dark:bg-white dark:hover:bg-slate-105 text-white dark:text-slate-900 font-medium text-xs tracking-wider uppercase shadow-md transition-all cursor-pointer mt-2"
              >
                Guardar y reconfigurar IA
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FIXED FLOATING TOAST BAR CHROMA */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 30, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-50 px-6 py-3.5 rounded-full bg-slate-950/90 text-white text-xs tracking-wider font-light backdrop-blur-md shadow-2xl border border-white/10 flex items-center gap-2 max-w-sm text-center"
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER METRICS AND DEVELOPER LABELS */}
      <footer className="w-full text-center py-8 px-6 mt-12 bg-white/5 border-t border-slate-900/5 dark:border-white/5 relative z-10 text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase">
        <p className="hover:text-slate-600 transition-colors">ALEX Messages © 2026</p>
        <p className="text-[9px] text-slate-400 font-light tracking-[0.1em] mt-1.5 normal-case px-4">
          Un santuario privado de poemas y silencios románticos. Escribe despacio, vive lento.
        </p>
      </footer>

    </div>
  );
}
