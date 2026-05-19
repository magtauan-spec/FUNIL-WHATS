import { ChatMessage } from './types';

export const SERGIO_AVATAR = "https://i.imgur.com/LUKdyfA.jpeg";
export const CHICKEN_MOCKUP = "https://i.imgur.com/pQSQWiP.jpeg";
export const TESTIMONIAL_IMG = "https://images.unsplash.com/photo-1560130954-43be1494879d?auto=format&fit=crop&q=80&w=200&h=200";

export const CHECKOUT_URL = "COLE_AQUI_O_LINK_DO_CHECKOUT";

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    type: 'text',
    content: 'Opa, tudo certo? 🐔 Antes de começar, me fala seu nome rapidinho.',
    sender: 'bot',
    delay: 1000,
  },
  {
    id: 'input-name',
    type: 'input',
    sender: 'bot',
  }
];

export const FUNNEL_STEPS: Record<string, (name: string) => ChatMessage[]> = {
  afterName: (name) => [
    {
      id: '2',
      type: 'text',
      content: `Boa, ${name}. Vamos lá… vou te explicar rapidinho como funciona.`,
      sender: 'bot',
      delay: 1500,
    },
    {
      id: 'audio-1',
      type: 'audio',
      audioUrl: '/audio-1.mp3',
      duration: '0:36',
      sender: 'bot',
      delay: 1000,
    },
    {
      id: 'desc-mockup',
      type: 'text',
      content: 'Esse aqui é o guia completo 👇',
      sender: 'bot',
      delay: 1500,
    },
    {
      id: 'mockup',
      type: 'image',
      imageUrl: CHICKEN_MOCKUP,
      imageCaption: 'Guia Criação Lucrativa de Galinha Caipira',
      sender: 'bot',
      delay: 1000,
    },
    {
      id: 'initial-query',
      type: 'options',
      content: 'Hoje você já cria galinha ou ainda quer começar?',
      options: [
        { label: 'Já crio algumas', value: 'ja_crio' },
        { label: 'Quero começar do zero', value: 'começar' },
        { label: 'Tenho quintal ou sítio parado', value: 'espaco' },
      ],
      sender: 'bot',
      delay: 1500,
    }
  ],
  afterInitialOptions: (name) => [
    {
      id: 'after-opt',
      type: 'text',
      content: `Perfeito, ${name}. Então esse material pode te ajudar bastante, porque ele mostra o caminho sem enrolação.`,
      sender: 'bot',
      delay: 1500,
    },
    {
      id: 'learn-intro',
      type: 'text',
      content: 'Dentro dele você aprende:',
      sender: 'bot',
      delay: 1000,
    },
    {
      id: 'checklist-learn',
      type: 'checklist',
      items: [
        'Como montar um galinheiro simples',
        'Como alimentar melhor as galinhas',
        'Como organizar a criação',
        'Como produzir ovos',
        'Como evitar erros no começo',
        'Como vender ovos na sua região'
      ],
      sender: 'bot',
      delay: 500,
    },
    {
      id: 'start-small',
      type: 'text',
      content: 'E não precisa começar grande. Dá pra começar pequeno, com o espaço que você já tem, e ir melhorando aos poucos.',
      sender: 'bot',
      delay: 2000,
    },
    {
      id: 'doubt-query',
      type: 'options',
      content: 'Qual dessas dúvidas mais trava você hoje?',
      options: [
        { label: 'Não sei por onde começar', value: 'por_onde' },
        { label: 'Tenho medo de gastar errado', value: 'medo_gastar' },
        { label: 'Não sei montar o galinheiro', value: 'montar' },
        { label: 'Não sei vender os ovos', value: 'vender' },
      ],
      sender: 'bot',
      delay: 1500,
    }
  ],
  afterDoubtOptions: (name) => [
    {
      id: 'doubt-response',
      type: 'text',
      content: 'Essa é justamente a parte que mais trava quem quer começar. Por isso o guia foi feito pra tirar você do chute.',
      sender: 'bot',
      delay: 1500,
    },
    {
      id: 'testimonial-header',
      type: 'text',
      content: 'Olha o que algumas pessoas estão falando:',
      sender: 'bot',
      delay: 1000,
    },
    {
      id: 'testimonial-card',
      type: 'testimonial',
      name: 'João Batista',
      location: 'MG',
      content: 'Comprei achando que era só mais um material, mas me surpreendi. Eu tava perdido sem saber como começar, agora já separei o espaço do galinheiro e tô organizando minha criação aos poucos. Bem direto e fácil de entender.',
      sender: 'bot',
      delay: 1000,
    },
    {
      id: 'before-audio-2',
      type: 'text',
      content: 'Antes de te passar o acesso, escuta isso aqui rapidinho 👇',
      sender: 'bot',
      delay: 2000,
    },
    {
      id: 'audio-2',
      type: 'audio',
      audioUrl: '/audio-2.mp3',
      duration: '0:22',
      sender: 'bot',
      delay: 1000,
    },
    {
      id: 'after-audio-2',
      type: 'text',
      content: 'Você recebe o guia principal + os bônus e pode acessar pelo celular, computador ou imprimir.',
      sender: 'bot',
      delay: 2000,
    },
    {
      id: 'bonus-checklist',
      type: 'bonus',
      items: [
        'Guia de Ração Caseira',
        'Programa Completo de Vacinação das Aves',
        'Guia de Doenças e Emergências',
        'Estratégia Para Vender Ovos'
      ],
      sender: 'bot',
      delay: 1000,
    },
    {
      id: 'price-intro',
      type: 'text',
      content: 'Hoje o acesso completo está saindo por apenas:',
      sender: 'bot',
      delay: 2000,
    },
    {
      id: 'price-card',
      type: 'price',
      price: 'R$27,00',
      content: 'Pagamento único. Acesso imediato. Material digital.',
      sender: 'bot',
      delay: 1000,
    },
    {
      id: 'final-query',
      type: 'options',
      content: `${name}, quer acessar agora e começar do jeito certo?`,
      options: [
        { label: 'Sim, quero acessar agora', value: 'final_step' },
        { label: 'Quero garantir meu acesso', value: 'final_step' },
      ],
      sender: 'bot',
      delay: 1500,
    }
  ],
  checkout: (name) => [
    {
      id: 'final-confirm',
      type: 'text',
      content: 'Perfeito 🙏 clique abaixo para acessar com segurança.',
      sender: 'bot',
      delay: 1000,
    },
    {
      id: 'final-cta',
      type: 'final_cta',
      sender: 'bot',
      delay: 500,
      price: 'R$27',
    }
  ]
};
