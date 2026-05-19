/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Send, User, ChevronRight, Star, Video, Phone, MoreVertical, Plus, Smile, Info } from 'lucide-react';
import { ChatMessage, Option } from './types';
import { INITIAL_MESSAGES, FUNNEL_STEPS, SERGIO_AVATAR, CHECKOUT_URL } from './constants';

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
      setMessages(prev => [...prev, msg]);
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

  const handleOptionClick = (option: Option) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'text',
      content: option.label,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMsg]);

    if (currentStep === 'initialOptions') {
      addNextMessages(FUNNEL_STEPS.afterInitialOptions(userName));
      setCurrentStep('doubtOptions');
    } else if (currentStep === 'doubtOptions') {
      addNextMessages(FUNNEL_STEPS.afterDoubtOptions(userName));
      setCurrentStep('finalChoice');
    } else if (currentStep === 'finalChoice') {
      if (option.value === 'estou_vendo') {
        addNextMessages([
          {
            id: '20',
            type: 'text',
            content: 'Você recebe o guia principal completo + bônus, tudo digital, com acesso imediato. Pode abrir no celular, computador ou imprimir se quiser.',
            sender: 'bot',
            delay: 1000,
          },
          ...FUNNEL_STEPS.offer(userName)
        ]);
        setCurrentStep('offer');
      } else {
        addNextMessages(FUNNEL_STEPS.offer(userName));
        setCurrentStep('offer');
      }
    } else if (option.value === 'checkout') {
      window.location.href = CHECKOUT_URL;
    }
  };

  return (
    <div className="flex flex-col h-screen h-[100dvh] w-full bg-[#0b141a] overflow-hidden relative selection:bg-whatsapp-green/30">
      <div className="whatsapp-pattern absolute inset-0 z-0 pointer-events-none opacity-[0.04]"></div>

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
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-0 custom-scrollbar z-10 relative">
        <div className="max-w-2xl mx-auto flex flex-col gap-2">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, index) => {
              // Determine if it's the start of a group (for the tail)
              const isFirstInGroup = index === 0 || messages[index - 1].sender !== msg.sender;
              return (
                <ChatBubble 
                  key={msg.id} 
                  msg={msg} 
                  isFirstInGroup={isFirstInGroup}
                  onOptionClick={handleOptionClick}
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
                className="w-full bg-[#2a3942] text-whatsapp-text-primary text-[15px] rounded-lg px-4 py-2.5 outline-none placeholder:text-whatsapp-text-secondary pr-12"
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

      {/* CTA Fixed Overlay */}
      {currentStep === 'offer' && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-[80px] left-0 right-0 p-4 z-40 pointer-events-none"
        >
          <div className="max-w-md mx-auto pointer-events-auto">
            <a 
              href={CHECKOUT_URL}
              className="w-full bg-whatsapp-green hover:brightness-110 text-white font-black py-4.5 rounded-xl flex items-center justify-center gap-3 whatsapp-shadow transition-all active:scale-95 text-[18px] uppercase tracking-wide border-b-4 border-black/20"
            >
              ACESSAR AGORA — R$27
              <ChevronRight className="w-6 h-6" />
            </a>
          </div>
        </motion.div>
      )}
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

  return (
    <motion.div
      initial={isFirstInGroup ? { opacity: 0, scale: 0.95, y: 10 } : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} w-full mb-[2px]`}
    >
      <div className={`
        max-w-[85%] md:max-w-[75%]
        ${isBot ? 'bg-whatsapp-bubble-bot' : 'bg-whatsapp-bubble-user'} 
        p-[6px] px-3 rounded-lg whatsapp-shadow
        ${isFirstInGroup ? (isBot ? 'bubble-in-tail rounded-tl-none' : 'bubble-out-tail rounded-tr-none') : ''}
      `}>
        {msg.type === 'text' && (
          <p className="text-whatsapp-text-primary text-[14.5px] leading-[1.4] whitespace-pre-wrap">
            {msg.content}
          </p>
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
          <div className="space-y-3 py-1 px-0.5">
            {msg.content && <p className="text-whatsapp-text-primary text-[14.5px] mb-2">{msg.content}</p>}
            <div className="flex flex-col gap-2">
              {msg.options?.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => onOptionClick(opt)}
                  className="bg-whatsapp-green/10 border border-whatsapp-green/40 text-whatsapp-green text-[14px] font-bold py-2.5 px-4 rounded-xl text-center hover:bg-whatsapp-green hover:text-white transition-all active:scale-95 shadow-sm"
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
              className="block w-full bg-whatsapp-green text-white text-center font-bold py-3.5 rounded-xl text-[14px] shadow-lg active:scale-95 transition-transform uppercase tracking-wider"
            >
              Acessar Agora
            </a>
          </div>
        )}

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
      </div>
    </motion.div>
  );
}
