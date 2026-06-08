import React, { useState } from 'react';
import { PdfItem } from '../types';
import { 
  X, BookOpen, ChevronRight, ChevronLeft, Download, 
  Calculator, Check, AlertTriangle, Lightbulb, Menu, 
  Sparkles, Award, Compass, Heart, HelpCircle
} from 'lucide-react';

interface DigitalBookReaderProps {
  pdf: PdfItem;
  onClose: () => void;
}

export const DigitalBookReader: React.FC<DigitalBookReaderProps> = ({ pdf, onClose }) => {
  const isGuide1 = pdf.filename.includes('1') || pdf.title.toLowerCase().includes('vol. 1') || pdf.title.toLowerCase().includes('criação');
  
  // Custom calculator state
  const [feedAmount, setFeedAmount] = useState<number>(50); // default 50kg

  // Feed Ingredients Breakdown (Milho (60%), Soja (25%), Calcário (8%), Núcleo (5%), Sal (2%))
  const calcIngredients = (amount: number) => {
    return [
      { name: '🌽 Milho Moído (Energia)', weight: (amount * 0.60).toFixed(2), pct: '60%' },
      { name: '🌱 Farelo de Soja (Proteína)', weight: (amount * 0.25).toFixed(2), pct: '25%' },
      { name: '🥚 Calcário Calcítico (Cálcio p/ Casca)', weight: (amount * 0.08).toFixed(2), pct: '8%' },
      { name: '💊 Núcleo de Postura (Vitaminas)', weight: (amount * 0.05).toFixed(2), pct: '5%' },
      { name: '🧂 Sal Comum (Minerais Básicos)', weight: (amount * 0.02).toFixed(2), pct: '2%' },
    ];
  };

  // Structured Content for Book 1
  const chaptersGuide1 = [
    {
      id: 'cover',
      title: 'Capa Oficial',
      shortTitle: 'Início',
      content: (
        <div className="flex flex-col items-center text-center justify-center py-8 px-4 max-w-lg mx-auto">
          <div className="w-20 h-20 bg-whatsapp-green/20 rounded-full flex items-center justify-center mb-6">
            <Award className="w-10 h-10 text-whatsapp-green animate-bounce" />
          </div>
          <span className="bg-whatsapp-green/20 text-whatsapp-green text-xs uppercase px-3 py-1.5 rounded-full font-extrabold tracking-wider mb-3">
            Volume 1 • Guia Prático Ilustrado
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            CRIAÇÃO LUCRATIVA DE GALINHA CAIPIRA
          </h1>
          <p className="text-whatsapp-text-secondary italic text-sm mt-3">
            "Como montar um pequeno negócio no quintal para produzir ovos de alto valor e lucrar todo mês"
          </p>
          
          <div className="w-full h-[1px] bg-white/10 my-6"></div>
          
          <div className="bg-[#1f2c34] p-4 rounded-xl border border-white/5 w-full text-left">
            <h4 className="text-white font-bold text-sm flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-whatsapp-green" /> O que você vai dominar:
            </h4>
            <ul className="text-xs text-whatsapp-text-secondary space-y-2 mt-2">
              <li className="flex items-center gap-2">🟢 <span className="font-semibold text-white/90">Espaço Inteligente</span>: Quantas aves cabem no seu quintal?</li>
              <li className="flex items-center gap-2">🟢 <span className="font-semibold text-white/90">Raça Certa</span>: Embrapa 051 de postura rápida.</li>
              <li className="flex items-center gap-2">🟢 <span className="font-semibold text-white/90">Economia Extrema</span>: Como formular sua própria ração.</li>
              <li className="flex items-center gap-2">🟢 <span className="font-semibold text-white/90">Vendas Directas</span>: Como cobrar até R$ 25 por dúzia na sua região.</li>
            </ul>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full">
            <a 
              href={pdf.filename}
              download
              className="flex-1 bg-white/10 hover:bg-white/15 active:scale-95 text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-white/10 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" /> Baixar PDF Original ({(pdf.pages)} págs)
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'cap1',
      title: 'Capítulo 1: O Segredo do Quintal Lucrativo',
      shortTitle: '1. Quintal Lucrativo',
      content: (
        <div className="space-y-5 text-whatsapp-text-secondary text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Capítulo 1: O Quintal que Gera Renda Recorrente</h2>
          
          <p>
            O ovo caipira legítimo é hoje um dos alimentos mais procurados nos grandes e pequenos centros urbanos. As pessoas estão fugindo do ovo industrial (aquele ovo branco, sem sabor, de granja de confinamento cruel) e aceitam pagar até <strong>o dobro do preço</strong> por ovos caipiras vermelhos, com a gema bem laranjinha e produzidos em sistemas onde a galinha é livre e feliz.
          </p>

          <div className="bg-[#128c7e]/15 border-l-4 border-[#128c7e] p-4 rounded-r-xl my-4">
            <h4 className="text-white font-bold text-xs sm:text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-whatsapp-green shrink-0" /> DICA DO SERGIO PARA INICIAR:
            </h4>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              "Você não precisa de um sítio gigante de 10 hectares para começar. Um quintal pequeno de apenas <strong>30 a 50 metros quadrados</strong> já é perfeito para abrigar de 20 a 50 galinhas poedeiras de forma saudável e totalmente lucrativa!"
            </p>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white mt-6">Regra de Ouro do Espaço (Densidade)</h3>
          <p>
            Para que a criação não vire bagunça e as aves não tenham estresse (o que faz com que parem de botar ovos), siga a recomendação abaixo:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
            <div className="bg-[#1f2c34] p-4 rounded-xl border border-white/5">
              <span className="text-[#128c7e] font-extrabold text-lg block">COCHEIRA / GALINHEIRO</span>
              <span className="text-white font-bold text-sm block mt-1">Área Interna Coberta</span>
              <p className="text-xs text-gray-400 mt-2">
                Máximo de <strong>4 a 5 galinhas por metro quadrado</strong>. Serve para dormir, botar nos ninhos e se proteger da chuva.
              </p>
            </div>
            <div className="bg-[#1f2c34] p-4 rounded-xl border border-white/5">
              <span className="text-whatsapp-green font-extrabold text-lg block">PIQUETE DE PASTEJO</span>
              <span className="text-white font-bold text-sm block mt-1">Área Externa com Terra/Pasto</span>
              <p className="text-xs text-gray-400 mt-2">
                Mínimo de <strong>1 galinha por metro quadrado</strong>. É onde as aves vão ciscando, pegando sol, comendo capim e insetos.
              </p>
            </div>
          </div>

          <p>
            Construir piquetes rotacionados (estilo "dividir o pasto ao meio") economiza até 20% do gasto com ração cozida, pois a grama sempre cresce fresca.
          </p>
        </div>
      )
    },
    {
      id: 'cap2',
      title: 'Capítulo 2: Escolhendo as Melhores Galinhas (A Raça Ideal)',
      shortTitle: '2. Melhores Raças',
      content: (
        <div className="space-y-5 text-whatsapp-text-secondary text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Capítulo 2: Como não errar na escolha da Aves</h2>
          
          <p>
            O erro número um do iniciante é comprar qualquer "galinha de terreiro" sem procedência genética para produzir ovos comerciais. As galinhas comuns ou mestiças comerciais botam cerca de 80 a 100 ovos por ano e comem como leoas. Isso dá prejuízo! Você precisa de aves selecionadas geneticamente para postura caipira.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-white mt-6">As 3 Campeãs Caipiras de Alta Postura</h3>
          
          <div className="space-y-3 my-3">
            <div className="p-4 bg-[#1f2c34] rounded-xl border-l-4 border-yellow-500">
              <h4 className="text-white font-bold text-sm">🏅 1. Embrapa 051 (Estrela Nacional)</h4>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                Uma galinha híbrida de cor marrom escuro desenvolvida especialmente para a agricultura familiar brasileira. Bota cerca de <strong>300 ovos avermelhados por ciclo de postura</strong>. É dócil, super caipira, rústica, aguenta nosso calor e tem ótima carcaça ao final do período de postura.
              </p>
            </div>
            
            <div className="p-4 bg-[#1f2c34] rounded-xl border-l-4 border-amber-600">
              <h4 className="text-white font-bold text-sm">🐔 2. Isa Brown / Novogen Brown</h4>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                As galinhas marrons mais conhecidas mundialmente pela velocidade de postura. Elas botam até <strong>320 ovos grandes no primeiro ano</strong>. Exigem uma ração um pouco mais balanceada por botarem muito, e se adaptam muito bem ao pastejo caipira controlado.
              </p>
            </div>

            <div className="p-4 bg-[#1f2c34] rounded-xl border-l-4 border-gray-500">
              <h4 className="text-white font-bold text-sm">🐓 3. Caipira Negra (Glines Pretas de Postura)</h4>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                Aves pretas e cinzas de linhagem européia adaptadas ao Brasil. São excelentes catadoras de pasto e botam ovos de gema forte muito requisitados. Produzem de 240 a 270 ovos/ano.
              </p>
            </div>
          </div>

          <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-xl my-4">
            <h4 className="text-white font-bold text-xs sm:text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" /> CUIDADO COM ESSE GOLPE:
            </h4>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              "Nunca compre aves chamadas apenas 'Caipira Caipira de Postura' sem saber de onde vieram ou sem o certificado do incubatório. Compre sempre os chamados 'Pintos de 1 Dia' vacinados ou as 'Galinhas Prontas para Postura' (com cerca de 16 semanas)."
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'cap3',
      title: 'Capítulo 3: Alimentação e Redução de Custos (Postura Forte)',
      shortTitle: '3. Alimentação & Custos',
      content: (
        <div className="space-y-5 text-whatsapp-text-secondary text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Capítulo 3: Nutrição Inteligente sem Prejuízo</h2>
          
          <p>
            O maior pesadelo do pequeno avicultor é a conta da casa de ração. O milho e a soja industriais encareceram muito. Se você comprar ração ensacada comercial pronta para toda a vida das galinhas, sua margem de lucro vai lá para o ralo. A chave do sucesso é a <strong>fórmula caseira de postura</strong>.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-white mt-6">A Fórmula Perfeita de Ração de Postura (100% Caseira)</h3>
          <p>
            Misture bem os ingredientes abaixo para obter o melhor custo-benefício de proteína (soja), energia (milho) e cálcio (calcário):
          </p>

          {/* Interactive Calculator Widget! */}
          <div className="bg-[#111b21] p-5 rounded-2xl border border-white/10 my-6">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-whatsapp-green" />
              <h4 className="text-white font-extrabold text-sm sm:text-base">Calculadora de Ração Caipira do Sergio</h4>
            </div>
            
            <p className="text-xs text-gray-400 mb-4">
              Digite abaixo quantos quilos (kg) de ração você quer preparar e veja na hora o cálculo exato de cada ingrediente:
            </p>

            <div className="flex items-center gap-3 bg-[#1f2c34] p-3 rounded-xl border border-white/5 max-w-sm">
              <label htmlFor="feedAmountInput" className="text-xs text-white font-bold uppercase shrink-0">Quantidade Total (kg):</label>
              <input 
                id="feedAmountInput"
                type="number"
                min="1"
                max="5000"
                value={feedAmount}
                onChange={(e) => setFeedAmount(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full bg-[#111b21] text-white font-extrabold text-center text-lg py-1 rounded border border-whatsapp-green outline-none"
              />
            </div>

            <div className="mt-4 space-y-2">
              {calcIngredients(feedAmount).map((ing, i) => (
                <div key={i} className="flex justify-between items-center bg-[#1f2c34]/50 p-2.5 rounded-lg border border-white/5 text-xs sm:text-sm">
                  <span className="text-white font-medium">{ing.name}</span>
                  <div className="text-right">
                    <span className="text-whatsapp-green font-extrabold text-sm block">{ing.weight} kg</span>
                    <span className="text-[10px] text-gray-400 block">Proporção: {ing.pct}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-[#128c7e]/10 p-3 rounded-lg border border-[#128c7e]/30 text-xs">
              💡 <strong>Instrução técnica:</strong> O <em>Calcário Calcítico</em> é fundamental. Sem ele, a casca do ovo sai frágil ou mole ("ovo de casca de vento"), o que impede a venda do seu produto. Amassar as próprias folhas de bananeira e capim picado reduz sua despesa diária!
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'cap4',
      title: 'Capítulo 4: Vendas, Margem de Lucro e Negócios',
      shortTitle: '4. Vendas e Lucro',
      content: (
        <div className="space-y-5 text-whatsapp-text-secondary text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Capítulo 4: Como Vender Toda a Produção Sem Chorar Preço</h2>
          
          <p>
            Entenda uma coisa: <strong>Você não é doador de ovos e nem disputa preço com ovos industriais brancos de R$ 10,00 da prateleira baixa do mercado.</strong> Quem compra legítimo ovo caipira está comprando mais saúde, frescor, carinho animal e o gostinho da roça!
          </p>

          <h3 className="text-base sm:text-lg font-bold text-white mt-6">Passos para Agregar 300% de Valor nos Seus Ovos</h3>

          <div className="space-y-4 my-4">
            <div className="bg-[#1f2c34] p-4 rounded-xl flex gap-3 items-start border border-white/5">
              <span className="text-xl shrink-0">📦</span>
              <div>
                <h4 className="text-white font-bold text-xs sm:text-sm">Use Embalagens de Papelão Rústico</h4>
                <p className="text-xs text-gray-300 mt-1">
                  Não use plástico transparente feio. Use as caixas de papelão biodegradáveis. Cole um selo ou carimbo personalizado simples. Por exemplo: <em>"Ovos Caipiras do Sítio - Criadas Livres & Felizes 🐓❤️"</em>.
                </p>
              </div>
            </div>

            <div className="bg-[#1f2c34] p-4 rounded-xl flex gap-3 items-start border border-white/5">
              <span className="text-xl shrink-0">🥚</span>
              <div>
                <h4 className="text-white font-bold text-xs sm:text-sm">Nunca Lave os Ovos antes de Guardar</h4>
                <p className="text-xs text-gray-300 mt-1">
                  Lavar remove a cutícula natural e permite que bactérias entrem no ovo, reduzindo a validade de 28 dias para apenas 5 dias. Limpe bosta seca ou sujeiras leves apenas com uma bucha seca de cozinha ou uma lixa fofa.
                </p>
              </div>
            </div>

            <div className="bg-[#1f2c34] p-4 rounded-xl flex gap-3 items-start border border-white/5">
              <span className="text-xl shrink-0">📈</span>
              <div>
                <h4 className="text-white font-bold text-xs sm:text-sm">Seja o Canal Direto das Encomendas</h4>
                <p className="text-xs text-gray-300 mt-1">
                  Crie uma lista de transmissão semanal com 20 a 30 famílias das proximidades. Avise toda quarta: "Turma, ovos colhidos ontem fresquinhos. Restam apenas 10 dúzias. Quem vai querer garantir a saúde da semana?". A escassez vende tudo em menos de 1 hora!
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white mt-6">Tabela Prática de Margem de Lucro Real</h3>
          <div className="overflow-x-auto my-3 border border-white/10 rounded-xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#111b21] text-white">
                  <th className="p-3 font-extrabold">Descrição do Custo / Lucro</th>
                  <th className="p-3 text-right font-extrabold text-[#128c7e]">Aves Comuns</th>
                  <th className="p-3 text-right font-extrabold text-whatsapp-green">Aves Embrapa 051</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="p-3 text-white">Postura estimada ao ano</td>
                  <td className="p-3 text-right">~ 100 ovos</td>
                  <td className="p-3 text-right text-whatsapp-green font-bold">~ 300 ovos</td>
                </tr>
                <tr>
                  <td className="p-3 text-white">Custo de ração por ave/ano</td>
                  <td className="p-3 text-right">R$ 54,00</td>
                  <td className="p-3 text-right text-yellow-500">R$ 68,00 (Postura)</td>
                </tr>
                <tr>
                  <td className="p-3 text-white">Preço de venda médio (Dúzia)</td>
                  <td className="p-3 text-right">R$ 15,00</td>
                  <td className="p-3 text-right text-whatsapp-green font-bold">R$ 22,00 (Embalagem Rústica)</td>
                </tr>
                <tr className="bg-[#128c7e]/10 font-bold">
                  <td className="p-3 text-white">Faturamento Bruto / ave / ano</td>
                  <td className="p-3 text-right text-red-400">R$ 125,00</td>
                  <td className="p-3 text-right text-whatsapp-green">R$ 550,00</td>
                </tr>
                <tr className="bg-[#1f2c34] font-extrabold text-sm">
                  <td className="p-3 text-whatsapp-green">Lucro Líquido Real / Ano</td>
                  <td className="p-3 text-right text-red-400">R$ 71,00 por ave</td>
                  <td className="p-3 text-right text-whatsapp-green">R$ 482,00 por ave!</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-whatsapp-green/10 rounded-xl my-4 text-xs sm:text-sm">
            🚀 <strong>Seu Negócio Escalado:</strong> Veja que incrível! Criando um lote de apenas <strong>100 galinhas da Embrapa 051</strong> no quintal com nossa ração caseira planejada, você faz um lucro de mais de <strong>R$ 48.200,00 por ano limpos</strong>, trabalhando menos de 1 hora por dia para alimentar e colher os ovos!
          </div>
        </div>
      )
    }
  ];

  // Structured Content for Book 2
  const chaptersGuide2 = [
    {
      id: 'cover',
      title: 'Capa Oficial',
      shortTitle: 'Início',
      content: (
        <div className="flex flex-col items-center text-center justify-center py-8 px-4 max-w-lg mx-auto">
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
            <Compass className="w-10 h-10 text-amber-500 animate-spin-slow" />
          </div>
          <span className="bg-amber-500/20 text-amber-500 text-xs uppercase px-3 py-1.5 rounded-full font-extrabold tracking-wider mb-3">
            Guia de Apoio • Vol. 2 Completo
          </span>
          <h1 className="text-2xl sm:text-3.5xl font-extrabold text-white tracking-tight leading-tight">
            GALINHEIRO BARATO & MANEJO RÚSTICO
          </h1>
          <p className="text-whatsapp-text-secondary italic text-sm mt-3">
            "Projetos rápidos de galinheiros econômicos, manejo seguro de doenças, controle térmico e higiene sem mistérios"
          </p>
          
          <div className="w-full h-[1px] bg-white/10 my-6"></div>
          
          <div className="bg-[#1f2c34] p-4 rounded-xl border border-white/5 w-full text-left">
            <h4 className="text-white font-bold text-sm flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Principais tópicos cobertos:
            </h4>
            <ul className="text-xs text-whatsapp-text-secondary space-y-2 mt-2">
              <li className="flex items-center gap-2">🧱 <span className="font-semibold text-white/90">Construção Barata</span>: Projetos com pallets, bambu e telas simples.</li>
              <li className="flex items-center gap-2">💡 <span className="font-semibold text-white/90">Luz Artificial</span>: Aumento de 40% na produção em dias frios/invernos.</li>
              <li className="flex items-center gap-2">🏥 <span className="font-semibold text-white/90">Prevenção e Doenças</span>: Segredos para zerar infecções no lote.</li>
              <li className="flex items-center gap-2">📋 <span className="font-semibold text-white/90">Checklist Sanitário</span>: Rotina de limpeza diária rápida.</li>
            </ul>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full">
            <a 
              href={pdf.filename}
              download
              className="flex-1 bg-white/10 hover:bg-white/15 active:scale-95 text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-white/10 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" /> Baixar PDF Original ({(pdf.pages)} págs)
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'cap1',
      title: 'Capítulo 1: Galinheiro Barato e Aconchegante',
      shortTitle: '1. Galinheiro Barato',
      content: (
        <div className="space-y-5 text-whatsapp-text-secondary text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Capítulo 1: Estruturando o Galinheiro sem Gastar</h2>
          
          <p>
            O erro que faz com que novos criadores quebrem é comprar madeira nobre tratada, contratar serralheiros e construir galinheiros luxuosos. As galinhas caipiras adoram o rústico! Elas precisam de apenas quatro coisas no galinheiro para botarem muito: <strong>sombra, ventilação correta, poleiros firmes e ninhos secos regulados do sol.</strong>
          </p>

          <h3 className="text-base sm:text-lg font-bold text-white mt-6">Fórmulas para Construção Econômica</h3>

          <div className="space-y-4 my-4">
            <div className="p-4 bg-[#1f2c34] rounded-xl border border-white/5">
              <h4 className="text-white font-bold text-xs sm:text-sm">📏 Orientação Solar Correta (Leste-Oeste):</h4>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                A frente aberta do galinheiro nunca deve receber sol direto da manhã ou da tarde em excesso, pois isso frita as aves. Posicione o telhado direcionado seguindo o caminho do sol. Isso garante que a sombra seja permanente dentro do galinheiro ao meio dia.
              </p>
            </div>

            <div className="p-4 bg-[#1f2c34] rounded-xl border border-white/5">
              <h4 className="text-white font-bold text-xs sm:text-sm">🎋 Use Bambu e Palas de Madeira (Custo Reduzido):</h4>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                Eucalipto tratado baratinho ou postes rústicos de mato são perfeitos para a estrutura. Use palas de pallet de descarte e amarrações de arame para fazer as divisões internas e os fechamentos inferiores. Cubra com tela de galinheiro hexagonal comum de 2 polegadas.
              </p>
            </div>

            <div className="p-4 bg-[#1f2c34] rounded-xl border border-white/5">
              <h4 className="text-white font-bold text-xs sm:text-sm">🛏️ Poleiros de Galho de Árvore Rústicos:</h4>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                Nunca use ripas de madeira quadradas para as aves dormirem! O atrito liso e reto causa "calos podais" terríveis nas patas, infeccionando as galinhas e cortando a postura. Use galhos de goiabeira, eucalipto ou árvores rústicas da sua região com diâmetro de 3 a 5 centímetros. Elas conseguem agarrar com conforto.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'cap2',
      title: 'Capítulo 2: Prevenção de Doenças e Cama de Maravalha',
      shortTitle: '2. Higiene e Vacinas',
      content: (
        <div className="space-y-5 text-whatsapp-text-secondary text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Capítulo 2: Saúde Absoluta do Lote (Zero Doenças)</h2>
          
          <p>
            Em criações de galinhas caipiras rústicas, a frase <em>"Prevenir é dez vezes mais barato que tentar curar"</em> é a lei número um. Se uma galinha pegar Bouba ou Coriza de verdade, ela para de botar e contamina o bando inteiro.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-white mt-6">A Cama de Maravalha Secreta</h3>
          <p>
            O segredo do galinheiro limpo de verdade é o uso correto da <strong>Cama de Frango</strong>. Trata-se de uma camada de 10 a 15 centímetros de serragem grossa de madeira (maravalha) ou palha de café/arroz seca.
          </p>

          <div className="bg-[#128c7e]/15 border-l-4 border-whatsapp-green p-4 rounded-r-xl my-4">
            <h4 className="text-white font-bold text-xs sm:text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-whatsapp-green shrink-0" /> REGRAS DA CAMA DE SUCESSO:
            </h4>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              • <strong>Nunca use pó de serra fino</strong> (causa cegueira e problemas respiratórios terríveis nas galinhas). Use maravalha de corte médio.<br />
              • Revolva a cama com um ancinho a cada 15 dias para secar as fezes.<br />
              • Adicione um pouco de cal virgem misturado por baixo da maravalha para secar rápido, eliminar cheiro ruim e afastar piolhos de galinha!
            </p>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white mt-6">Controle Nutricional de Doenças</h3>
          <p>
            As galinhas expostas à umidade desenvolvem fungos na garganta e no bico. Toda semana, misture 1 dente de alho amassado e 1 colher de vinagre de maçã para cada 5 litros de água para fortalecer a microbiota das aves, aumentando a imunidade de forma barata e sem antibióticos químicos!
          </p>
        </div>
      )
    },
    {
      id: 'cap3',
      title: 'Capítulo 3: Iluminação Artificial & Estímulo de Ovos',
      shortTitle: '3. Aumento com Luz',
      content: (
        <div className="space-y-5 text-whatsapp-text-secondary text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Capítulo 3: Iluminação Para Produção de Ovos Todo Dia</h2>
          
          <p>
            Você já percebeu que no inverno ou em meses de chuva as galinhas param de botar quase que completamente? O motivo disso não é o frio, mas sim as <strong>horas de luz do dia</strong>! A galinha precisa de 14 a 16 horas de luminosidade contínua captada pela sua retina para ativar os hormônios da ovulação e as glândulas de postura do ovo.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-white mt-6">O Projeto Lâmpada Turbo do Sergio</h3>
          <p>
            Este é um dos grandes segredos dos criadores profissionais que você aprende de graça agora. Para evitar a queda de postura nos meses frios, instale um sistema de luz artificial dentro do galinheiro fechado:
          </p>

          <div className="bg-[#1f2c34] p-4 rounded-xl border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <span className="text-yellow-400">💡</span> Componentes Necessários:
            </div>
            <ul className="text-xs sm:text-sm text-gray-300 list-disc list-inside space-y-2 pl-2">
              <li>1 Lâmpada LED de 9W (luz amarela quente de preferência para acalmar as aves, não branca fria!).</li>
              <li>1 Timer Analógico Tomada simples de R$ 20,00 ou R$ 30,00 reais.</li>
              <li>Instalação no centro do galinheiro a 2.5 metros de altura das aves.</li>
            </ul>
          </div>

          <p>
            Configure o timer analógico para ligar às <strong>04:30 da madrugada</strong> e desligar quando clarear totalmente o dia (aproximadamente às 06:30). Assim, você prolonga a luz da manhã no período em que a galinha começa seu ciclo diário de postura, aumentando a produção em até 40% durante o outono/inverno!
          </p>
        </div>
      )
    },
    {
      id: 'cap4',
      title: 'Capítulo 4: Checklist do Sucesso da Primeira Semana',
      shortTitle: '4. Checklist Diário',
      content: (
        <div className="space-y-5 text-whatsapp-text-secondary text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Capítulo 4: Rotina Diária de 30 Minutos de Sucesso</h2>
          
          <p>
            Para que sua criação de ovos caipiras seja um verdadeiro sucesso rentável, organize sua rotina com o seguinte checklist:
          </p>

          <div className="space-y-3 my-4">
            <div className="p-3 bg-[#1f2c34]/80 rounded-xl flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-whatsapp-green/20 text-whatsapp-green flex items-center justify-center font-bold">✓</div>
                <div>
                  <h5 className="text-white font-bold text-xs sm:text-sm">Manhã Cedo (06:30 - 07:00)</h5>
                  <p className="text-[11px] text-gray-400">Liberar as aves no piquete, fornecer 60g da ração caseira por ave, limpar os bebedouros de poeira.</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#1f2c34]/80 rounded-xl flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-whatsapp-green/20 text-whatsapp-green flex items-center justify-center font-bold">✓</div>
                <div>
                  <h5 className="text-white font-bold text-xs sm:text-sm">Ao Meio Dia (12:00 - 12:15)</h5>
                  <p className="text-[11px] text-gray-400">Primeira coleta de ovos nos ninhos para evitar que as galinhas quebrem ou fiquem bicando os ovos.</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#1f2c34]/80 rounded-xl flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-whatsapp-green/20 text-whatsapp-green flex items-center justify-center font-bold">✓</div>
                <div>
                  <h5 className="text-white font-bold text-xs sm:text-sm">Tarde Final (17:00 - 17:30)</h5>
                  <p className="text-[11px] text-gray-400">Fornecer mais 50g da ração caseira, recolher últimos ovos, recolher as galinhas para a área coberta segura.</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#1f2c34]/80 rounded-xl flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-whatsapp-green/20 text-whatsapp-green flex items-center justify-center font-bold">✓</div>
                <div>
                  <h5 className="text-white font-bold text-xs sm:text-sm">Todo Sábado de Manhã</h5>
                  <p className="text-[11px] text-gray-400">Revolver a maravalha do ninho e do galinheiro, escovar os poleiros lixando imperfeições.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-whatsapp-green/10 p-4 rounded-xl border border-whatsapp-green/20 text-center">
            <h4 className="text-white font-bold text-xs sm:text-sm">🎉 Parabéns! Você concluiu a leitura dos Guias Práticos!</h4>
            <p className="text-xs text-gray-400 mt-1">
              Você agora tem o conhecimento dos maiores avicultores do interior paulista! Comece simples, seja consistente e transforme seu quintal em lucros!
            </p>
          </div>
        </div>
      )
    }
  ];

  const chapters = isGuide1 ? chaptersGuide1 : chaptersGuide2;
  const [currentChapIndex, setCurrentChapIndex] = useState(0);
  const [showToc, setShowToc] = useState(false);

  const handleNext = () => {
    if (currentChapIndex < chapters.length - 1) {
      setCurrentChapIndex(prev => prev + 1);
      // scroll reader container to top
      const scrollContainer = document.getElementById('reader-scroll-container');
      if (scrollContainer) scrollContainer.scrollTop = 0;
    }
  };

  const handlePrev = () => {
    if (currentChapIndex > 0) {
      setCurrentChapIndex(prev => prev - 1);
      const scrollContainer = document.getElementById('reader-scroll-container');
      if (scrollContainer) scrollContainer.scrollTop = 0;
    }
  };

  const handleJumpToChapter = (idx: number) => {
    setCurrentChapIndex(idx);
    setShowToc(false);
    const scrollContainer = document.getElementById('reader-scroll-container');
    if (scrollContainer) scrollContainer.scrollTop = 0;
  };

  const readPercentage = Math.round(((currentChapIndex + 1) / chapters.length) * 100);

  return (
    <div className="flex flex-col h-full bg-[#0b141a] text-white">
      {/* Top Navbar */}
      <div className="bg-[#111b21] px-4 py-3 border-b border-white/10 flex items-center justify-between shrink-0 select-none z-10">
        <div className="flex items-center gap-3 min-w-0">
          <button 
            type="button"
            onClick={() => setShowToc(!showToc)}
            className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors text-whatsapp-text-secondary hover:text-white flex items-center gap-1 cursor-pointer"
            title="Sumário de Capítulos"
            aria-label="Sumário"
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs font-bold hidden sm:inline">Sumário</span>
          </button>
          
          <div className="h-4 w-[1px] bg-white/10 hidden sm:block"></div>
          
          <div className="min-w-0">
            <h3 className="text-white font-bold text-xs sm:text-sm leading-tight truncate">
              {pdf.title}
            </h3>
            <p className="text-[10px] text-whatsapp-text-secondary truncate">
              Leitor Integrado • {currentChapIndex === 0 ? 'Início do Livro' : `Capítulo ${currentChapIndex} de ${chapters.length - 1}`}
            </p>
          </div>
        </div>

        <button 
          type="button"
          onClick={onClose}
          className="p-2 hover:bg-red-500/10 hover:text-red-500 text-whatsapp-text-secondary rounded-full transition-all active:scale-90"
          title="Fechar e Voltar"
          aria-label="Fechar"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Embedded Navigation / Mini Reading Status Bar */}
      <div className="bg-[#202c33] shrink-0 border-b border-white/5 select-none text-[11px] font-bold flex justify-between items-center px-4 py-2 text-whatsapp-text-secondary">
        <div className="flex items-center gap-1 sm:gap-2">
          <BookOpen className="w-3.5 h-3.5 text-whatsapp-green animate-pulse" />
          <span>Progressão da Leitura:</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-24 sm:w-36 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-whatsapp-green transition-all duration-300" style={{ width: `${readPercentage}%` }}></div>
          </div>
          <span className="text-white text-xs">{readPercentage}%</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 relative flex overflow-hidden">
        {/* Toggleable Drawer for Table of Contents (Sumário) */}
        {showToc && (
          <div 
            className="absolute inset-0 bg-black/60 z-20 transition-opacity"
            onClick={() => setShowToc(false)}
          />
        )}
        
        <div className={`absolute top-0 bottom-0 left-0 w-72 max-w-[85vw] bg-[#111b21] border-r border-white/10 z-30 transition-transform duration-300 transform ${showToc ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
          <div className="p-4 bg-[#1f2c34] border-b border-white/10 flex justify-between items-center shrink-0">
            <span className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>📖</span> Sumário do Guia
            </span>
            <button 
              type="button"
              onClick={() => setShowToc(false)}
              className="p-1.5 hover:bg-white/10 rounded"
            >
              <X className="w-4 h-4 text-whatsapp-text-secondary" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1 select-none">
            {chapters.map((ch, idx) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => handleJumpToChapter(idx)}
                className={`w-full text-left p-3.5 rounded-xl transition-all flex items-center justify-between text-xs sm:text-sm font-medium border ${idx === currentChapIndex ? 'bg-[#128c7e]/20 border-whatsapp-green text-white font-extrabold' : 'bg-transparent border-transparent text-whatsapp-text-secondary hover:bg-white/5 hover:text-white'}`}
              >
                <span>{ch.shortTitle}</span>
                {idx === currentChapIndex ? (
                  <Check className="w-4 h-4 text-whatsapp-green shrink-0 ml-2" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0 ml-2" />
                )}
              </button>
            ))}
          </div>
          
          <div className="p-3 bg-[#1f2c34] border-t border-white/10 select-none">
            <a 
              href={pdf.filename}
              download
              className="w-full bg-[#128c7e] hover:bg-[#128c7e]/90 text-white font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all text-center uppercase"
            >
              <Download className="w-3.5 h-3.5" /> Baixar PDF Tradicional
            </a>
          </div>
        </div>

        {/* Scrollable Book Body Page */}
        <div 
          id="reader-scroll-container"
          className="flex-grow overflow-y-auto px-4 py-8 sm:p-12 scroll-smooth bg-[#0b141a]"
        >
          <div className="max-w-2xl mx-auto bg-[#1f2c34]/30 rounded-2xl p-5 sm:p-8 border border-white/5 shadow-xl min-h-[50vh] flex flex-col justify-between">
            {/* Real Page content */}
            <div className="flex-grow">
              {chapters[currentChapIndex].content}
            </div>

            {/* Next / Previous page controls inside page footer */}
            <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between select-none">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentChapIndex === 0}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${currentChapIndex === 0 ? 'opacity-30 border-white/5 text-whatsapp-text-secondary cursor-not-allowed' : 'bg-white/5 hover:bg-white/10 active:scale-95 border-white/10 text-white cursor-pointer'}`}
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>

              <span className="text-xs text-whatsapp-text-secondary font-medium">
                Página {currentChapIndex + 1} de {chapters.length}
              </span>

              {currentChapIndex < chapters.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-whatsapp-green hover:bg-whatsapp-green/90 active:scale-95 text-white py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  Próximo <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-[#128c7e] hover:bg-[#128c7e]/90 active:scale-95 text-white py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  Voltar para Conversa <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Native Navigation helper */}
      <footer className="bg-[#111b21] py-2.5 px-4 text-center text-[10px] sm:text-xs text-whatsapp-text-secondary shrink-0 border-t border-white/5 flex items-center justify-between select-none">
        <button 
          type="button"
          onClick={() => setShowToc(true)}
          className="text-whatsapp-green hover:underline font-semibold cursor-pointer"
        >
          🔍 Ver todos os Capítulos
        </button>
        <span className="text-white/20">•</span>
        <span className="font-semibold">{pdf.title}</span>
        <span className="text-white/20">•</span>
        <a 
          href={pdf.filename} 
          download
          className="text-white hover:underline font-semibold cursor-pointer flex items-center gap-1"
        >
          <Download className="w-3.5 h-3.5" /> Baixar PDF
        </a>
      </footer>
    </div>
  );
};
