import { ChatMessage } from './types';

export const SERGIO_AVATAR = "https://i.imgur.com/LUKdyfA.jpeg";
export const CHICKEN_MOCKUP = "https://i.imgur.com/pQSQWiP.jpeg";
export const TESTIMONIAL_IMG = "https://images.unsplash.com/photo-1560130954-43be1494879d?auto=format&fit=crop&q=80&w=200&h=200";

// Demonstration images
export const IMG_COOP = "https://i.imgur.com/e3RyTaH.jpeg";
export const IMG_FEED = "https://i.imgur.com/e3RyTaH.jpeg";
export const IMG_EGGS = "https://i.imgur.com/7t5qBbS.jpeg";
export const IMG_MARKET = "https://images.unsplash.com/photo-1488459711615-2287314233af?auto=format&fit=crop&q=80&w=600&h=400";

export const CHECKOUT_URL = "https://checkout.bigmaney.com/checkout/cmp35t4dv00651yrmzf0bdrj2?offer=ISSA6SP";
export const CHECKOUT_URL_990 = "https://checkout.bigmaney.com/checkout/cmp35t4dv00651yrmzf0bdrj2?offer=4X90TB1";
export const CHECKOUT_URL_2700 = "https://checkout.bigmaney.com/checkout/cmp35t4dv00651yrmzf0bdrj2?offer=ISSA6SP";
export const CHECKOUT_URL_4700 = "https://checkout.bigmaney.com/checkout/cmp35t4dv00651yrmzf0bdrj2?offer=ID10LKZ";

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
    content: 'Esse material é digital e já vem todo organizadinho 🐔\n\nNele você aprende como começar sua criação de galinha caipira, produzir ovos e transformar seu quintal ou sítio em uma fonte de renda 🥚💰\n\nVocê vai ver como montar um galinheiro simples, alimentar melhor as galinhas, evitar gastar errado e vender ovos aí na sua cidade.\n\nSe fez sentido pra você, eu te envio agora o material completo e você não paga nada antes.\n\nDepois de receber, você faz uma contribuição simbólica para ajudar esse projeto a continuar alcançando mais gente que quer tirar dinheiro de um espaço parado.\n\nSugestões:\n\nR$9,90  \nR$27  — mais escolhido \nR$47 🙏\n\nPosso contar com sua contribuição depois que eu enviar? Me confirma aqui que já te mando 👍🐔',
    sender: 'bot',
    delay: 3000,
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
      delay: 1500,
    },
    {
      id: 'contribution-text',
      type: 'text',
      content: 'Perfeito! 🙏\nProntinho, já te enviei o material 🐔🤍\n\nAgora fica sua contribuição simbólica pra ajudar esse projeto a continuar alcançando mais gente que quer transformar quintal parado em renda com ovos 🥚💰\n\nApós contribuir, vou reenviar o Guia Completo no seu WhatsApp e e-mail para garantir que você não perca nada',
      sender: 'bot',
      delay: 5000,
    },
    {
      id: 'contribution-bonus-image',
      type: 'image',
      imageUrl: 'https://i.imgur.com/jfsJVXQ.jpeg',
      sender: 'bot',
      delay: 2000,
    },
    {
      id: 'contribution-bonus-text',
      type: 'text',
      content: '🎁 Esses são os bônus que eu separei pra quem contribui com o projeto.\n\n✅ Guia de Ração Caseira  \n✅ Modelo de Galinheiro Simples  \n✅ Estratégia Para Vender Ovos  \n✅ Guia de Doenças e Emergências  \n✅ Checklist da Primeira Semana',
      sender: 'bot',
      delay: 2000,
    },
    {
      id: 'contribution-cta',
      type: 'options',
      options: [
        { label: 'Contribuir com R$9,90', value: 'checkout_990' },
        { label: 'Contribuir com R$27,00', value: 'checkout_2700' },
        { label: 'Contribuir com R$47,00', value: 'checkout_4700' }
      ],
      sender: 'bot',
      delay: 2000,
    }
  ],
  receive_materials: () => [],
  contribution_appeal: () => [],
  step2: () => [],
  step3: () => []
};
