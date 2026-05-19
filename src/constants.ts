import { ChatMessage } from './types';

export const SERGIO_AVATAR = "https://i.imgur.com/LUKdyfA.jpeg";
export const CHICKEN_MOCKUP = "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=600&h=400";
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
      content: `Show, ${name}. Vou te mostrar uma coisa simples, mas que muita gente do interior tá usando pra aproveitar melhor o quintal ou sítio.`,
      sender: 'bot',
      delay: 1500,
    },
    {
      id: '3',
      type: 'text',
      content: 'Hoje tem muita gente com espaço parado, criando no chute ou querendo começar com galinha caipira, mas sem saber o primeiro passo.',
      sender: 'bot',
      delay: 2000,
    },
    {
      id: '4',
      type: 'text',
      content: 'E o problema é esse: quando começa sem direção, a pessoa gasta errado, monta galinheiro de qualquer jeito, alimenta mal as aves e depois não entende por que não tem resultado.',
      sender: 'bot',
      delay: 2500,
    },
    {
      id: '5',
      type: 'image',
      imageUrl: CHICKEN_MOCKUP,
      imageCaption: 'Guia Criação Lucrativa de Galinha Caipira',
      sender: 'bot',
      delay: 1500,
    },
    {
      id: '6',
      type: 'text',
      content: 'Foi por isso que criamos o Guia Criação Lucrativa de Galinha Caipira.',
      sender: 'bot',
      delay: 1500,
    },
    {
      id: '7',
      type: 'text',
      content: 'Ele é um material simples, visual e direto, feito pra quem quer começar do zero ou organizar melhor a criação que já tem.',
      sender: 'bot',
      delay: 2000,
    },
    {
      id: '8',
      type: 'options',
      content: 'Hoje você já cria galinha ou ainda quer começar?',
      options: [
        { label: 'Já crio algumas', value: 'ja_crio' },
        { label: 'Quero começar do zero', value: 'começar' },
        { label: 'Tenho quintal ou sítio parado', value: 'espaco' },
      ],
      sender: 'bot',
      delay: 1000,
    }
  ],
  afterInitialOptions: (name) => [
    {
      id: '9',
      type: 'text',
      content: `Perfeito, ${name}. Então esse guia pode te ajudar bastante, porque ele mostra o caminho sem enrolação.`,
      sender: 'bot',
      delay: 1500,
    },
    {
      id: '10',
      type: 'text',
      content: 'Dentro dele você aprende passo a passo:',
      sender: 'bot',
      delay: 1000,
    },
    {
      id: '11',
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
      id: '12',
      type: 'text',
      content: 'E o melhor: não precisa começar grande.',
      sender: 'bot',
      delay: 2000,
    },
    {
      id: '13',
      type: 'text',
      content: 'Muita gente acha que precisa de sítio enorme, muito dinheiro ou experiência, mas dá pra começar pequeno, com o espaço que você já tem, e ir melhorando aos poucos.',
      sender: 'bot',
      delay: 2500,
    },
    {
      id: '14',
      type: 'options',
      content: 'Qual dessas dúvidas mais trava você hoje?',
      options: [
        { label: 'Não sei por onde começar', value: 'por_onde' },
        { label: 'Tenho medo de gastar errado', value: 'medo_gastar' },
        { label: 'Não sei montar o galinheiro', value: 'montar' },
        { label: 'Não sei vender os ovos', value: 'vender' },
      ],
      sender: 'bot',
      delay: 1000,
    }
  ],
  afterDoubtOptions: (name) => [
    {
      id: '15',
      type: 'text',
      content: 'Essa é justamente a parte que mais trava quem quer começar. Por isso o guia foi feito pra tirar você do chute.',
      sender: 'bot',
      delay: 1500,
    },
    {
      id: '16',
      type: 'text',
      content: 'Em vez de ficar vendo vídeo solto na internet e continuar perdido, você segue um passo a passo organizado, direto no celular.',
      sender: 'bot',
      delay: 2000,
    },
    {
      id: '17',
      type: 'testimonial',
      name: 'João Batista',
      location: 'MG',
      content: 'Comprei achando que era só mais um material, mas me surpreendi. Eu tava perdido sem saber como começar, agora já separei o espaço do galinheiro e tô organizando minha criação aos poucos. Bem direto e fácil de entender.',
      sender: 'bot',
      delay: 2000,
    },
    {
      id: '18',
      type: 'text',
      content: 'É esse tipo de clareza que o material entrega: você olha pro seu espaço e começa a entender o que fazer primeiro.',
      sender: 'bot',
      delay: 2000,
    },
    {
      id: '19',
      type: 'options',
      content: 'Você quer usar esse guia pra começar do jeito certo?',
      options: [
        { label: 'Sim, quero começar certo', value: 'sim_começar' },
        { label: 'Quero entender o que recebo', value: 'estou_vendo' },
      ],
      sender: 'bot',
      delay: 1000,
    }
  ],
  offer: (name) => [
    {
      id: '21',
      type: 'text',
      content: 'Hoje o acesso completo ao Guia Criação Lucrativa de Galinha Caipira está saindo por apenas:',
      sender: 'bot',
      delay: 1500,
    },
    {
      id: '22',
      type: 'price',
      price: 'R$27,00',
      content: 'Pagamento único. Acesso imediato. Material digital.',
      sender: 'bot',
      delay: 1000,
    },
    {
      id: '24',
      type: 'text',
      content: 'E comprando agora, você também leva bônus pra começar com mais segurança:',
      sender: 'bot',
      delay: 2000,
    },
    {
      id: '25',
      type: 'bonus',
      items: [
        'Guia de Ração Caseira',
        'Programa Completo de Vacinação das Aves',
        'Guia de Doenças e Emergências',
        'Estratégia Para Vender Ovos'
      ],
      sender: 'bot',
      delay: 500,
    },
    {
      id: '26',
      type: 'text',
      content: 'Tudo isso pra você não começar no escuro, não gastar dinheiro à toa e não depender de tentativa e erro.',
      sender: 'bot',
      delay: 2000,
    },
    {
      id: '27',
      type: 'text',
      content: 'Essa condição promocional pode sair do ar a qualquer momento. Se você quer começar sua criação do jeito certo, essa é a hora.',
      sender: 'bot',
      delay: 2500,
    },
    {
      id: '28',
      type: 'options',
      content: `${name}, você quer acessar o guia agora?`,
      options: [
        { label: 'Sim, quero acessar agora', value: 'checkout' },
        { label: 'Quero garantir meu acesso', value: 'checkout' },
      ],
      sender: 'bot',
      delay: 1500,
    },
    {
      id: '29',
      type: 'text',
      content: 'Perfeito. Clique no botão abaixo e finalize seu acesso com segurança. Assim que confirmar o pagamento, você recebe o material no seu e-mail.',
      sender: 'bot',
      delay: 1000,
    },
    {
      id: '30',
      type: 'final_cta',
      sender: 'bot',
      delay: 500,
      price: 'R$27',
    }
  ]
};
