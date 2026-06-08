import { ChatMessage } from './types';

export const SERGIO_AVATAR = "https://i.imgur.com/LUKdyfA.jpeg";
export const CHICKEN_MOCKUP = "https://i.imgur.com/pQSQWiP.jpeg";
export const TESTIMONIAL_IMG = "https://images.unsplash.com/photo-1560130954-43be1494879d?auto=format&fit=crop&q=80&w=200&h=200";

// Demonstration images
export const IMG_COOP = "https://i.imgur.com/e3RyTaH.jpeg";
export const IMG_FEED = "https://i.imgur.com/e3RyTaH.jpeg";
export const IMG_EGGS = "https://i.imgur.com/7t5qBbS.jpeg";
export const IMG_MARKET = "https://images.unsplash.com/photo-1488459711615-2287314233af?auto=format&fit=crop&q=80&w=600&h=400";

export const CHECKOUT_URL = "COLE_AQUI_O_LINK_DO_CHECKOUT";

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    type: 'text',
    content: 'Opa, tudo certo patrão? Aqui é o Sergio do Sitio , prazer! 👍🐓',
    sender: 'bot',
    delay: 2000,
  },
  {
    id: 'audio-initial',
    type: 'audio',
    audioUrl: '/WhatsApp Ptt 2026-05-30 at 00.59.43.ogg',
    duration: '0:39',
    sender: 'bot',
    delay: 2000,
  },
  {
    id: 'audio-initial-2',
    type: 'audio',
    audioUrl: '/WhatsApp Ptt 2026-05-30 at 00.59.47.ogg',
    duration: '0:39',
    sender: 'bot',
    delay: 10000,
  },
  {
    id: 'mockup-initial',
    type: 'image',
    imageUrl: CHICKEN_MOCKUP,
    sender: 'bot',
    delay: 2000,
  },
  {
    id: 'trust-msg-1',
    type: 'text',
    content: 'Para mostrar nossa confiança e compromisso, eu envio o Guia antes de você fazer o pagamento. 🙏',
    sender: 'bot',
    delay: 3000,
  },
  {
    id: 'trust-msg-2',
    type: 'text',
    content: 'Pode ser Patrão? 👍😁',
    sender: 'bot',
    delay: 2000,
  },
  {
    id: 'initial-trigger',
    type: 'options',
    options: [
      { label: 'Sim, pode Sergio. 😁', value: 'start_funnel' },
    ],
    sender: 'bot',
    delay: 2000,
  }
];

export const FUNNEL_STEPS: Record<string, (name: string) => ChatMessage[]> = {
  startFunnel: () => [
    {
      id: 'audio-3',
      type: 'audio',
      audioUrl: '/WhatsApp Ptt 2026-05-30 at 12.41.27.ogg',
      duration: '0:21',
      sender: 'bot',
      delay: 3000,
    },
    {
      id: 'receive-material-trigger',
      type: 'options',
      content: 'Chique demais! Escutou o áudio? Então clica no botão abaixo que preparei um negócio bem especial pra você baixar do jeitinho que prometido! 👇',
      options: [
        { label: '✅ Receber Material Agora', value: 'receive_materials' }
      ],
      sender: 'bot',
      delay: 6000,
    }
  ],
  receive_materials: () => [
    {
      id: 'pdf-unlocked-intro',
      type: 'text',
      content: 'Aqui está seu acesso liberado, patrão! Pode entrar para ler e analisar cada detalhe:',
      sender: 'bot',
      delay: 1500,
    },
    {
      id: 'pdf-materials-block',
      type: 'pdf_list',
      pdfItems: [
        {
          title: 'Guia de Criação Lucrativa Vol. 1',
          filename: '/GuiaCriaçãoLucrativa 1.pdf',
          pages: 54
        },
        {
          title: 'Guia Complementar - Galinheiro Barato & Manejos',
          filename: '/GuiaCriaçãoLucrativa 2.pdf',
          pages: 36
        }
      ],
      sender: 'bot',
      delay: 2000,
    }
  ],
  contribution_appeal: () => [
    {
      id: 'contribution-text',
      type: 'text',
      content: '🙏 Patrão, espero de verdade que esse material te ajude.\n\nComo forma de confiança, eu te entreguei tudo antes de pedir qualquer pagamento.\n\nAgora fica sua contribuição simbólica para ajudar esse projeto a continuar alcançando mais pessoas que querem transformar um espaço parado em renda com ovos 🥚💰',
      sender: 'bot',
      delay: 1500,
    },
    {
      id: 'contribution-price',
      type: 'price',
      price: 'R$27,00',
      content: 'Contribuição Única — Acesso Vitalício',
      sender: 'bot',
      delay: 1500,
    },
    {
      id: 'contribution-cta',
      type: 'options',
      options: [
        { label: 'CONCORDAR E CONTRIBUIR — R$27 🥚💰', value: 'checkout' },
        { label: 'Quero tirar uma dúvida', value: 'doubt' }
      ],
      sender: 'bot',
      delay: 1500,
    }
  ],
  step2: () => [],
  step3: () => []
};
