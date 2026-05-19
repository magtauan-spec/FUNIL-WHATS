/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Send, User, ChevronRight, Star, Video, Phone, MoreVertical, Plus, Smile, Info, Play, Pause, Mic } from 'lucide-react';
import { ChatMessage, Option } from './types';
import { INITIAL_MESSAGES, FUNNEL_STEPS, SERGIO_AVATAR, CHECKOUT_URL } from './constants';

const WhatsAppAudio: React.FC<{ url: string; duration: string; avatar?: string }> = ({ url, duration, avatar }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error("Erro ao tocar áudio:", err);
          setError(true);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    setCurrentTime(formatTime(current));
    if (total) {
      setProgress((current / total) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime('0:00');
  };

  // Simulated waveform bar heights
  const bars = [
    4, 8, 12, 6, 10, 14, 8, 4, 6, 12, 10, 8, 4, 10, 14, 12, 8, 6, 4, 8, 12, 10, 6, 8, 14, 12, 8, 4, 6, 10, 8, 12, 6, 10, 14
  ];

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex items-center gap-2 py-2 px-1 min-w-[280px] relative">
      <audio 
        ref={audioRef} 
        src={url} 
        onTimeUpdate={handleTimeUpdate} 
        onEnded={handleEnded}
        onError={() => {
          console.error(`Não foi possível carregar o áudio em: ${url}`);
          setError(true);
        }}
        preload="metadata"
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
          <div className="relative h-6 flex items-center gap-[2.5px] px-1 group cursor-pointer">
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
          <span className="text-[11px] text-whatsapp-text-secondary">
            {isPlaying ? currentTime : duration}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-whatsapp-text-secondary">
              {duration}
            </span>
            <span className="text-[10px] text-whatsapp-text-secondary/60 ml-1">
              {now}
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
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [currentStep, setCurrentStep] = useState<string>('start');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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
      
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, msg.delay || 1000));
      setIsTyping(false);

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

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    const name = nameInput.trim();
    setUserName(name);
    
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'text',
      content: name,
      sender: 'user',
    };
    
    setMessages(prev => prev.filter(m => m.type !== 'input').concat(userMsg));
    addNextMessages(FUNNEL_STEPS.afterName(name));
    setCurrentStep('initialOptions');
  };

  const handleOptionClick = (option: Option, messageId: string) => {
    // 1. Remove the selection block (buttons) from the history
    setMessages(prev => prev.filter(m => m.id !== messageId));

    // 2. Add the chosen option as a real user message
    const userMsg: ChatMessage = {
      id: `user-choice-${Date.now()}`,
      type: 'text',
      content: option.label,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMsg]);

    // 3. Trigger handle flow transitions
    if (currentStep === 'initialOptions') {
      addNextMessages(FUNNEL_STEPS.afterInitialOptions(userName));
      setCurrentStep('doubtOptions');
    } else if (currentStep === 'doubtOptions') {
      addNextMessages(FUNNEL_STEPS.afterDoubtOptions(userName));
      setCurrentStep('finalChoice');
    } else if (option.value === 'final_step') {
      addNextMessages(FUNNEL_STEPS.checkout(userName));
      setCurrentStep('completed');
    } else if (option.value === 'checkout') {
      window.location.href = CHECKOUT_URL;
    }
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
                />
              );
            })}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-whatsapp-bubble-bot text-whatsapp-text-secondary px-3 py-1.5 rounded-lg text-[13px] italic">
                digitando...
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
          {!userName ? (
            <form onSubmit={handleNameSubmit} className="flex gap-2 w-full">
              <input 
                type="text" 
                placeholder="Digite seu nome..."
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-[#2a3942] text-whatsapp-text-primary text-[16px] rounded-lg px-4 py-2.5 outline-none placeholder:text-whatsapp-text-secondary pr-12"
                autoFocus
              />
              <button 
                type="submit"
                className="absolute right-1 top-1 w-9 h-9 bg-whatsapp-green rounded-full flex items-center justify-center shrink-0 shadow-lg active:scale-90 transition-transform"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          ) : (
            <div className="flex gap-2">
              <div className="w-full bg-[#2a3942] rounded-lg px-4 py-2.5 text-[15px] text-whatsapp-text-secondary">
                Digite uma mensagem
              </div>
              <div className="w-11 h-11 bg-whatsapp-green rounded-full flex items-center justify-center shrink-0 opacity-50 cursor-not-allowed">
                <Send className="w-5 h-5 text-white ml-0.5" />
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

const ChatBubble: React.FC<{ 
  msg: ChatMessage, 
  isFirstInGroup: boolean,
  onOptionClick: (opt: Option) => void,
}> = ({ 
  msg, 
  isFirstInGroup,
  onOptionClick, 
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
          <WhatsAppAudio url={msg.audioUrl || ''} duration={msg.duration || '0:00'} avatar={SERGIO_AVATAR} />
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
            <div className="flex flex-col gap-2 w-full">
              {msg.options?.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => onOptionClick(opt)}
                  className="bg-whatsapp-bubble-user text-whatsapp-text-primary text-[14.5px] py-3 px-4 rounded-xl whatsapp-shadow hover:brightness-110 active:scale-95 transition-all text-right border border-white/5 font-medium"
                >
                  {opt.label}
                </button>
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
