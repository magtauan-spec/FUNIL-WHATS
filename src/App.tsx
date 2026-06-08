/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Send, User, ChevronRight, Star, Video, Phone, MoreVertical, Plus, Smile, Info, Play, Pause, Mic, X } from 'lucide-react';
import { ChatMessage, Option, PdfItem } from './types';
import { INITIAL_MESSAGES, FUNNEL_STEPS, SERGIO_AVATAR, CHECKOUT_URL, CHECKOUT_URL_990, CHECKOUT_URL_2700, CHECKOUT_URL_4700 } from './constants';
import { LocalPdfViewer } from './components/LocalPdfViewer';

const WhatsAppAudio: React.FC<{ 
  id: string;
  url: string; 
  duration: string; 
  avatar?: string;
  currentlyPlayingId: string | null;
  onPlay: () => void;
  onPause: () => void;
  onEnded: () => void;
}> = ({ id, url, duration, avatar, currentlyPlayingId, onPlay, onPause, onEnded }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [displayedDuration, setDisplayedDuration] = useState(duration);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const parseDurationToSeconds = (durStr: string): number => {
    if (!durStr) return 39;
    const parts = durStr.split(':');
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10);
      const seconds = parseInt(parts[1], 10);
      if (!isNaN(minutes) && !isNaN(seconds)) {
        return (minutes * 60) + seconds;
      }
    }
    return 39;
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return duration;
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    setDisplayedDuration(duration);
    setCurrentTime('0:00');
    setProgress(0);
    setIsPlaying(false);
    setError(false);
  }, [url, duration]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (currentlyPlayingId === id) {
      if (!isPlaying) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => {
            console.error("Erro ao tocar áudio automático:", err);
            setError(true);
          });
      }
    } else {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [currentlyPlayingId, id]);

  const handleDurationUpdate = () => {
    if (audioRef.current) {
      const dur = audioRef.current.duration;
      if (!isNaN(dur) && isFinite(dur) && dur > 1) {
        setDisplayedDuration(formatTime(dur));
      }
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      onPause();
    } else {
      onPlay();
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setError(false);
        })
        .catch(err => {
          console.error("Erro ao tocar áudio:", err);
          setError(true);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const fallbackTotal = parseDurationToSeconds(duration);
    const total = audioRef.current.duration && isFinite(audioRef.current.duration) && audioRef.current.duration > 0
      ? audioRef.current.duration
      : fallbackTotal;

    setCurrentTime(formatTime(current));
    if (total && !isNaN(total) && isFinite(total) && total > 0) {
      setProgress((current / total) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime('0:00');
    onEnded();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || error) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const fallbackTotal = parseDurationToSeconds(duration);
    const total = audioRef.current.duration && isFinite(audioRef.current.duration) && audioRef.current.duration > 0
      ? audioRef.current.duration
      : fallbackTotal;

    const targetTime = percentage * total;
    if (!isNaN(targetTime) && isFinite(targetTime)) {
      audioRef.current.currentTime = targetTime;
      setProgress(percentage * 100);
      setCurrentTime(formatTime(targetTime));
    }
  };

  // Simulated waveform bar heights
  const bars = [
    4, 8, 12, 6, 10, 14, 8, 4, 6, 12, 10, 8, 4, 10, 14, 12, 8, 6, 4, 8, 12, 10, 6, 8, 14, 12, 8, 4, 6, 10, 8, 12, 6, 10, 14
  ];

  return (
    <div className="flex items-center gap-2 py-2 px-1 min-w-[280px] relative">
      <audio 
        ref={audioRef} 
        src={url} 
        onTimeUpdate={handleTimeUpdate} 
        onEnded={handleEnded}
        onLoadedMetadata={handleDurationUpdate}
        onDurationChange={handleDurationUpdate}
        onCanPlay={handleDurationUpdate}
        onError={() => {
          console.error(`Não foi possível carregar o áudio em: ${url}`);
          setError(true);
        }}
        preload="auto"
      />
      
      <button 
        onClick={togglePlay}
        className="w-10 h-10 flex items-center justify-center shrink-0"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-whatsapp-text-primary fill-whatsapp-text-primary" />
        ) : (
          <Play className="w-5 h-5 text-whatsapp-text-primary fill-whatsapp-text-primary ml-1" />
        )}
      </button>

      <div className="flex-1 flex flex-col pt-1">
        {error ? (
          <span className="text-[10px] text-red-400 font-medium whitespace-nowrap">Erro ao carregar áudio</span>
        ) : (
          <div 
            onClick={handleSeek}
            className="relative h-6 flex items-center gap-[2.5px] px-1 group cursor-pointer"
          >
            {bars.map((height, i) => {
              const barProgress = (i / bars.length) * 100;
              const isPlayed = progress > barProgress;
              return (
                <div 
                  key={i} 
                  className="w-[2.5px] rounded-full transition-colors duration-200"
                  style={{ 
                    height: `${height + 4}px`,
                    backgroundColor: isPlayed ? '#34B7F1' : '#939ba1'
                  }}
                />
              );
            })}
            
            <div 
              className="absolute h-3.5 w-3.5 bg-[#34B7F1] rounded-full shadow-sm bottom-1 -ml-1.5 transition-all duration-100"
              style={{ left: `${progress}%` }}
            />
          </div>
        )}
        <div className="flex justify-between items-center px-1 mt-1">
          <span className="text-[11px] text-whatsapp-text-secondary select-none">
            {currentTime}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-whatsapp-text-secondary select-none">
              {duration}
            </span>
          </div>
        </div>
      </div>

      <div className="relative shrink-0 ml-1">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
          <img src={avatar || "https://i.imgur.com/LUKdyfA.jpeg"} alt="Audio Sender" className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-1 -left-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-100 flex items-center justify-center">
          <Mic className="w-3 h-3 text-[#00a884] fill-[#00a884]" />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingStatus, setTypingStatus] = useState<'typing' | 'recording' | 'online'>('online');
  const [currentlyPlayingAudioId, setCurrentlyPlayingAudioId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [currentStep, setCurrentStep] = useState<string>('start');
  const [previewPdf, setPreviewPdf] = useState<PdfItem | null>(null);
  const [pdf1Loaded, setPdf1Loaded] = useState(false);
  const [pdf2Loaded, setPdf2Loaded] = useState(false);
  const [contributionTriggered, setContributionTriggered] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const handleClosePdf = () => {
    setPreviewPdf(null);
  };

  const handlePdfView = (pdf: PdfItem) => {
    setPreviewPdf(pdf);
  };

  const scrollToBottom = () => {
    // Scroll auto-scroll disabled as requested by user
  };

  // Auto-scroll on messages or typing updates is disabled to let the lead scroll the funnel manually.

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    // Filter out input message from being rendered in bubbles
    const filteredInitial = INITIAL_MESSAGES.filter(m => m.type !== 'input');
    addNextMessages(filteredInitial);
  }, []);

  const addNextMessages = async (sequence: ChatMessage[]) => {
    for (const msg of sequence) {
      if (msg.type === 'input') {
        setMessages(prev => [...prev, msg]);
        break;
      }
      
      const status = msg.type === 'audio' ? 'recording' : 'typing';
      setTypingStatus(status);
      await new Promise(resolve => setTimeout(resolve, msg.delay || 1000));
      setTypingStatus('online');

      if (msg.type === 'options' && msg.content) {
        // First add the text part as a separate bot message
        const textMsg: ChatMessage = {
          ...msg,
          id: `${msg.id}-text`,
          type: 'text',
          sender: 'bot',
          options: undefined,
          content: msg.content
        };
        setMessages(prev => [...prev, textMsg]);
        await new Promise(resolve => setTimeout(resolve, 400));
        
        // Then add the options part without text
        const optionsMsg: ChatMessage = {
          ...msg,
          content: undefined
        };
        setMessages(prev => [...prev, optionsMsg]);
      } else {
        setMessages(prev => [...prev, msg]);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const handleOptionClick = (option: Option, messageId: string) => {
    // 1. Remove the selection block (buttons) from the history
    setMessages(prev => prev.filter(m => m.id !== messageId));

    // 2. Add the chosen option as a real user message (unless receiving materials directly)
    if (option.value !== 'receive_materials') {
      const userMsg: ChatMessage = {
        id: `user-choice-${Date.now()}`,
        type: 'text',
        content: option.label,
        sender: 'user',
      };
      setMessages(prev => [...prev, userMsg]);
    }

    // 3. Trigger handle flow transitions
    if (option.value === 'start_funnel') {
      addNextMessages(FUNNEL_STEPS.startFunnel(''));
    } else if (option.value === 'receive_materials') {
      addNextMessages(FUNNEL_STEPS.receive_materials(''));
    } else if (option.value === 'step_2') {
      addNextMessages(FUNNEL_STEPS.step2(''));
    } else if (option.value === 'step_3') {
      addNextMessages(FUNNEL_STEPS.step3(''));
    } else if (option.value === 'doubt') {
      window.location.href = "https://wa.me/SEU_NUMERO_AQUI";
    } else if (option.value === 'checkout_990') {
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'InitiateCheckout', { value: 9.90, currency: 'BRL', content_name: 'Contribuição R$9,90' });
      }
      window.location.href = CHECKOUT_URL_990;
    } else if (option.value === 'checkout_2700') {
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'InitiateCheckout', { value: 27.00, currency: 'BRL', content_name: 'Contribuição R$27,00' });
      }
      window.location.href = CHECKOUT_URL_2700;
    } else if (option.value === 'checkout_4700') {
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'InitiateCheckout', { value: 47.00, currency: 'BRL', content_name: 'Contribuição R$47,00' });
      }
      window.location.href = CHECKOUT_URL_4700;
    } else if (option.value === 'checkout') {
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'InitiateCheckout', { value: 27.00, currency: 'BRL', content_name: 'Contribuição R$27,00' });
      }
      window.location.href = CHECKOUT_URL;
    }
  };

  const handleAudioEnded = (endedId: string) => {
    setMessages(currentMessages => {
      const currentIndex = currentMessages.findIndex(m => m.id === endedId);
      if (currentIndex !== -1) {
        const nextAudioMessage = currentMessages.slice(currentIndex + 1).find(m => m.type === 'audio');
        if (nextAudioMessage && nextAudioMessage.id !== 'audio-3') {
          setTimeout(() => {
            setCurrentlyPlayingAudioId(nextAudioMessage.id);
          }, 100);
        } else {
          setCurrentlyPlayingAudioId(null);
        }
      } else {
        setCurrentlyPlayingAudioId(null);
      }
      return currentMessages;
    });
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#0b141a] overflow-hidden relative selection:bg-whatsapp-green/30">
      <div className="whatsapp-pattern absolute inset-0 z-0 pointer-events-none opacity-[0.05]"></div>

      {/* Header */}
      <header className="bg-whatsapp-header p-3 px-4 flex items-center justify-between whatsapp-shadow z-10">
        <div className="flex items-center gap-3">
          <ChevronRight className="w-6 h-6 text-whatsapp-text-secondary rotate-180 md:hidden" />
          <div className="relative">
            <img 
              src={SERGIO_AVATAR} 
              alt="Sergio do Sitio" 
              className="w-10 h-10 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-whatsapp-green rounded-full border-2 border-whatsapp-header"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-whatsapp-text-primary font-medium text-[15px]">Sergio do Sítio 🐔</h1>
            <span className="text-whatsapp-text-secondary text-[11px]">online</span>
          </div>
        </div>
        <div className="flex items-center gap-5 text-whatsapp-text-secondary">
          <Video className="w-5 h-5" />
          <Phone className="w-4 h-4" />
          <MoreVertical className="w-5 h-5" />
        </div>
      </header>

      {/* Commercial Banner */}
      <div className="z-10 bg-whatsapp-banner-bg/80 backdrop-blur px-4 py-2 flex items-center justify-center gap-2 text-[12px] text-[#ffd279] border-b border-white/5">
        <Info className="w-3.5 h-3.5" />
        <span>Esta é uma conta comercial</span>
      </div>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-12 md:px-0 custom-scrollbar z-10 relative">
        <div className={`max-w-2xl mx-auto flex flex-col gap-2 ${currentStep === 'completed' ? 'pb-20' : 'pb-4'}`}>
          <AnimatePresence mode="popLayout">
            {messages.map((msg, index) => {
              // Determine if it's the start of a group (for the tail)
              const isFirstInGroup = index === 0 || messages[index - 1].sender !== msg.sender;
              return (
                <ChatBubble 
                  key={msg.id} 
                  msg={msg} 
                  isFirstInGroup={isFirstInGroup}
                  onOptionClick={(opt) => handleOptionClick(opt, msg.id)}
                  currentlyPlayingId={currentlyPlayingAudioId}
                  onAudioPlay={(id) => setCurrentlyPlayingAudioId(id)}
                  onAudioPause={() => setCurrentlyPlayingAudioId(null)}
                  onAudioEnded={handleAudioEnded}
                  onPdfView={handlePdfView}
                />
              );
            })}
          </AnimatePresence>
          
          {typingStatus !== 'online' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-whatsapp-bubble-bot text-whatsapp-text-secondary px-3 py-1.5 rounded-lg text-[13px] italic flex items-center gap-1.5 animate-pulse">
                {typingStatus === 'recording' ? (
                  <>
                    <Mic className="w-3.5 h-3.5 text-whatsapp-text-secondary" />
                    <span>gravando áudio...</span>
                  </>
                ) : (
                  <span>digitando...</span>
                )}
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Footer Input Bar */}
      <footer className="bg-whatsapp-header p-2 flex items-center gap-2 z-20 relative px-4">
        <div className="flex items-center gap-3 text-whatsapp-text-secondary">
          <Smile className="w-6 h-6 cursor-pointer hover:text-whatsapp-text-primary" />
          <Plus className="w-6 h-6 cursor-pointer hover:text-whatsapp-text-primary" />
        </div>
        
        <div className="flex-1 relative">
          <div className="flex gap-2">
            <div className="w-full bg-[#2a3942] rounded-lg px-4 py-2.5 text-[15px] text-whatsapp-text-secondary">
              Digite uma mensagem
            </div>
            <div className="w-11 h-11 bg-whatsapp-green rounded-full flex items-center justify-center shrink-0 opacity-50 cursor-not-allowed">
              <Send className="w-5 h-5 text-white ml-0.5" />
            </div>
          </div>
        </div>
      </footer>

      {/* PDF Visualizer Overlay - Permanently Rendered and Preloaded */}
      <div 
        className={`fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-0 sm:p-4 transition-all duration-300 ${
          previewPdf ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'
        }`}
      >
        <div 
          className={`bg-[#1f2c34] rounded-none sm:rounded-2xl w-full sm:max-w-4xl h-full sm:h-[88vh] flex flex-col overflow-hidden shadow-2xl border-none sm:border border-white/10 transition-all duration-300 transform ${
            previewPdf ? 'scale-100' : 'scale-95'
          }`}
        >
          {/* Modal Header */}
          <div className="bg-[#111b21] p-3.5 sm:p-4 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-red-400/10 text-red-400 rounded-lg shrink-0">
                <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-7 6c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1m-4 5h8v2H8v-2m0-3h8v2H8V11Z" />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="text-white font-bold text-sm sm:text-base leading-tight truncate">
                  {previewPdf ? previewPdf.title : "Carregando material..."}
                </h3>
                <span className="text-[11px] sm:text-xs text-whatsapp-text-secondary font-medium">
                  {previewPdf ? `${previewPdf.pages} páginas • Leitor Digital Integrado` : "Livro Digital"}
                </span>
              </div>
            </div>
            <button 
              onClick={handleClosePdf}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-whatsapp-text-secondary hover:text-white cursor-pointer hover:scale-105 active:scale-95 shrink-0"
              aria-label="Fechar PDF"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* PDF Embed / View Area via Local HTML5 Canvas */}
          {previewPdf ? (
            <LocalPdfViewer 
              url={previewPdf.filename}
              title={previewPdf.title}
              pagesCount={previewPdf.pages}
              onClose={handleClosePdf}
            />
          ) : (
            <div className="flex-1 bg-[#0b141a] flex items-center justify-center">
              <span className="text-sm text-whatsapp-text-secondary">Nenhum livro selecionado</span>
            </div>
          )}
          
          {/* Elder Helpful Guidance Bar */}
          <div className="bg-[#111b21] p-2 text-center text-[11px] text-whatsapp-text-secondary select-none shrink-0 border-t border-white/5">
            <button 
              onClick={handleClosePdf}
              className="text-whatsapp-green font-bold hover:underline cursor-pointer"
            >
              Voltar para Conversa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ChatBubble: React.FC<{ 
  msg: ChatMessage, 
  isFirstInGroup: boolean,
  onOptionClick: (opt: Option) => void,
  currentlyPlayingId: string | null;
  onAudioPlay: (id: string) => void;
  onAudioPause: () => void;
  onAudioEnded: (id: string) => void;
  onPdfView?: (pdf: PdfItem) => void;
}> = ({ 
  msg, 
  isFirstInGroup,
  onOptionClick, 
  currentlyPlayingId,
  onAudioPlay,
  onAudioPause,
  onAudioEnded,
  onPdfView,
}) => {
  const isBot = msg.sender === 'bot';
  const showOnRight = !isBot || msg.type === 'options';

  return (
    <motion.div
      initial={isFirstInGroup ? { opacity: 0, scale: 0.95, y: 10 } : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex ${showOnRight ? 'justify-end' : 'justify-start'} w-full mb-[2px]`}
    >
      <div className={`
        max-w-[85%] md:max-w-[75%]
        ${msg.type === 'options' ? '' : (showOnRight ? 'bg-whatsapp-bubble-user' : 'bg-whatsapp-bubble-bot')} 
        ${msg.type === 'options' ? '' : 'p-[6px] px-3 rounded-lg whatsapp-shadow'}
        ${isFirstInGroup && msg.type !== 'options' ? (showOnRight ? 'bubble-out-tail rounded-tr-none' : 'bubble-in-tail rounded-tl-none') : ''}
      `}>
        {msg.type === 'text' && (
          <p className="text-whatsapp-text-primary text-[14.5px] leading-[1.4] whitespace-pre-wrap">
            {msg.content}
          </p>
        )}
        
        {msg.type === 'audio' && (
          <WhatsAppAudio 
            id={msg.id}
            url={msg.audioUrl || ''} 
            duration={msg.duration || '0:00'} 
            avatar={SERGIO_AVATAR} 
            currentlyPlayingId={currentlyPlayingId}
            onPlay={() => onAudioPlay(msg.id)}
            onPause={onAudioPause}
            onEnded={() => onAudioEnded(msg.id)}
          />
        )}

        {msg.type === 'image' && (
          <div className="space-y-1.5 p-0.5">
            <div className="rounded-md overflow-hidden bg-black/20">
              <img 
                src={msg.imageUrl} 
                alt={msg.imageCaption} 
                className="w-full h-auto cursor-pointer hover:opacity-95 transition-opacity"
                referrerPolicy="no-referrer"
              />
            </div>
            {msg.imageCaption && (
              <p className="text-whatsapp-text-primary text-[13.5px] font-medium leading-tight">
                {msg.imageCaption}
              </p>
            )}
          </div>
        )}

        {msg.type === 'video' && (
          <div className="space-y-1.5 p-0.5">
            <div className="rounded-md overflow-hidden bg-black/20 w-full max-w-[320px]">
              <video 
                src={msg.videoUrl} 
                controls
                playsInline
                className="w-full h-auto rounded-md"
              />
            </div>
            {msg.imageCaption && (
              <p className="text-whatsapp-text-primary text-[13.5px] font-medium leading-tight">
                {msg.imageCaption}
              </p>
            )}
          </div>
        )}


        {msg.type === 'options' && (
          <div className="flex flex-col gap-2 items-end w-full">
            {msg.content && (
               <div className="bg-whatsapp-bubble-bot p-[6px] px-3 rounded-lg rounded-tl-none bubble-in-tail whatsapp-shadow self-start mb-2">
                 <p className="text-whatsapp-text-primary text-[14.5px] leading-[1.4]">{msg.content}</p>
                 <div className="flex justify-end mt-1 select-none">
                    <span className="text-[10px] text-whatsapp-text-secondary leading-none">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                 </div>
               </div>
            )}
            <div className="flex flex-col gap-2 w-full max-w-sm sm:max-w-md mx-auto mt-2">
              {msg.options?.map((opt, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => onOptionClick(opt)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    boxShadow: [
                      "0 0 0 0 rgba(37, 211, 102, 0)",
                      "0 0 15px 3px rgba(37, 211, 102, 0.35)",
                      "0 0 0 0 rgba(37, 211, 102, 0)"
                    ]
                  }}
                  transition={{
                    boxShadow: {
                      repeat: Infinity,
                      duration: 2,
                    },
                    duration: 0.3
                  }}
                  className="w-full bg-[#128c7e] text-white font-bold text-[16px] py-4 px-6 rounded-2xl flex items-center justify-between gap-3 shadow-[0_4px_14px_rgba(18,140,126,0.4)] hover:bg-[#075e54] transition-all cursor-pointer select-none border border-whatsapp-green/40"
                >
                  <span className="flex-1 text-center font-bold tracking-wide">{opt.label}</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    className="shrink-0 bg-white/20 p-1.5 rounded-full flex items-center justify-center ms-auto"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </motion.span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {msg.type === 'checklist' && (
          <div className="space-y-2 py-1">
            {msg.items?.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-whatsapp-text-primary text-[14px]">
                <Check className="w-4 h-4 text-whatsapp-green mt-0.5 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {msg.type === 'price' && (
          <div className="text-center p-6 my-2 border-2 border-dashed border-whatsapp-green/40 rounded-2xl bg-black/20 shadow-inner">
            <h2 className="text-whatsapp-green text-5xl font-black mb-1 drop-shadow-sm">{msg.price}</h2>
            <p className="text-whatsapp-text-secondary text-[11px] uppercase font-black tracking-[0.2em]">{msg.content}</p>
          </div>
        )}

        {msg.type === 'testimonial' && (
          <div className="bg-[#182229] rounded-xl p-3 border border-white/5 space-y-3 mt-1">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />)}
              </div>
              <span className="text-[11px] text-whatsapp-text-secondary">há 3h</span>
            </div>
            <p className="text-whatsapp-text-primary text-[13.5px] italic leading-snug">
              "{msg.content}"
            </p>
            <div className="pt-2 flex justify-between items-center text-[10px] text-whatsapp-text-secondary border-t border-white/5">
              <span className="font-bold text-whatsapp-text-primary uppercase tracking-tight">{msg.name} — {msg.location}</span>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-whatsapp-green" />
                  <span>Verificado</span>
                </div>
            </div>
          </div>
        )}

        {msg.type === 'bonus' && (
          <div className="space-y-2 py-1">
            {msg.items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-black/30 p-2.5 rounded-xl border border-white/5">
                <span className="text-xl">🎁</span>
                <span className="text-whatsapp-text-primary text-[13px] font-bold">{item}</span>
              </div>
            ))}
          </div>
        )}

        {msg.type === 'pdf_list' && (
          <div className="flex flex-col gap-2.5 w-full my-1.5 min-w-[280px]">
            {msg.pdfItems?.map((pdf, idx) => (
              <div 
                key={idx} 
                className="bg-[#111b21] hover:bg-[#18252f] transition-all rounded-xl p-3 border border-white/5 flex items-center justify-between gap-3 shadow-md group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 bg-red-500/10 text-red-500 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-red-500 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-7 6c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1m-4 5h8v2H8v-2m0-3h8v2H8V11Z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex flex-col justify-center">
                    <p className="text-whatsapp-text-primary text-[13.5px] font-bold leading-tight truncate group-hover:text-whatsapp-green transition-colors">
                      {pdf.title}
                    </p>
                    <span className="text-[10.5px] text-whatsapp-text-secondary mt-0.5">
                      Livro PDF • {pdf.pages} pág.
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => onPdfView && onPdfView(pdf)}
                  className="bg-whatsapp-green hover:bg-[#128c7e] text-white font-bold text-[12px] py-1.5 px-3.5 rounded-lg flex items-center gap-0.5 shrink-0 whatsapp-shadow transition-colors cursor-pointer"
                >
                  <span>Visualizar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {msg.type === 'final_cta' && (
          <div className="py-2">
             <a 
              href={CHECKOUT_URL}
              className="block w-full bg-whatsapp-green text-white text-center font-bold py-4 rounded-xl text-[16px] shadow-lg active:scale-95 transition-transform uppercase tracking-wider whatsapp-shadow"
            >
              ACESSAR AGORA — R$27
            </a>
          </div>
        )}

        {msg.type !== 'options' && (
          <div className="flex justify-end gap-1 mt-1 select-none">
            <span className="text-[10px] text-whatsapp-text-secondary leading-none mt-1">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {!isBot && (
              <div className="flex text-blue-400">
                <Check className="w-3.5 h-3.5 -mr-1.5" />
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
