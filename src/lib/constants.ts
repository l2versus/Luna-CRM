/* ═══════════════════════════════════════════════════════
   Luna CRM — Dados Centralizados
   Todos os textos, dados e configurações do site
   ═══════════════════════════════════════════════════════ */

import type { LucideIcon } from "lucide-react";
import {
  Layout,
  MessageSquare,
  Brain,
  Activity,
  Clock,
  Workflow,
  MessageCircle,
  CreditCard,
  Mail,
  Cloud,
  Database,
  Zap,
  Globe,
  Server,
  Radio,
  Palette,
  Shield,
  Lock,
  FileSearch,
  Fingerprint,
  Plug,
  Settings,
  Rocket,
  Check,
  Instagram,
  Linkedin,
} from "lucide-react";

/* ── Site Info ────────────────────────────────────────── */
export const SITE = {
  name: "Luna CRM",
  tagline: "AI CRM para Clínicas de Estética Premium",
  description:
    "O Luna CRM unifica agendamento, WhatsApp, IA e automações em uma plataforma premium. Projetado exclusivamente para clínicas de estética que faturam alto.",
  url: "https://lunacrm.com.br",
  company: "EB Develop",
  whatsapp: "https://wa.me/5585998500344",
  copyright: `© ${new Date().getFullYear()} Luna CRM by EB Develop. Todos os direitos reservados.`,
} as const;

/* ── Navigation ──────────────────────────────────────── */
export const NAV_LINKS = [
  { label: "Funcionalidades", href: "#funcionalidades" },
  { label: "Preços", href: "#precos" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Contato", href: "#contato" },
] as const;

/* ── Hero ────────────────────────────────────────────── */
export const HERO = {
  badge: "✦ AI-Native CRM para Estética Médica",
  headline: "Sua Clínica de Estética Merece um CRM Que Entende de",
  headlineHighlight: "Beleza",
  subheadline:
    "O Luna CRM unifica agendamento, WhatsApp, inteligência artificial e automações em uma plataforma premium. Feito exclusivamente para clínicas que faturam alto.",
  cta1: "Agendar Demonstração",
  cta2: "Ver Funcionalidades",
  dashboardImage: "/imagens/hero/dashboard.png",
  backgroundVideo: "/videos/Dashboard-desktop.mp4",
} as const;

/* ── Logo Bar (techs) ────────────────────────────────── */
export interface Tech {
  name: string;
  icon: LucideIcon;
}

export const TECHS: Tech[] = [
  { name: "WhatsApp", icon: MessageCircle },
  { name: "OpenAI", icon: Brain },
  { name: "PostgreSQL", icon: Database },
  { name: "Redis", icon: Server },
  { name: "Mercado Pago", icon: CreditCard },
  { name: "Evolution API", icon: Radio },
  { name: "Next.js", icon: Layout },
  { name: "Tailwind", icon: Palette },
];

/* ── Metrics ─────────────────────────────────────────── */
export interface Metric {
  numericValue: number;
  prefix: string;
  suffix: string;
  description: string;
}

export const METRICS: Metric[] = [
  {
    numericValue: 47,
    prefix: "",
    suffix: "",
    description: "Modelos no banco de dados",
  },
  {
    numericValue: 133,
    prefix: "",
    suffix: "+",
    description: "APIs integradas",
  },
  {
    numericValue: 99,
    prefix: "",
    suffix: ".9%",
    description: "Uptime SLA garantido",
  },
  {
    numericValue: 200,
    prefix: "< ",
    suffix: "ms",
    description: "Latência do Kanban",
  },
];

/* ── Features ────────────────────────────────────────── */
export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  area: string;
  image: string;
}

export const FEATURES: Feature[] = [
  {
    icon: Layout,
    title: "CRM Kanban com Física Real",
    description:
      "Arraste leads com gravidade, sombra e inclinação. Latência zero com índice fracionário. Atualização em tempo real via SSE.",
    area: "crm",
    image: "/imagens/showcase/kaban.png",
  },
  {
    icon: MessageSquare,
    title: "Inbox WhatsApp Ilimitada",
    description:
      "Toda a equipe em uma caixa de entrada colaborativa. Texto, áudio, vídeo, documentos. Zero custo por mensagem via Evolution API.",
    area: "inbox",
    image: "/imagens/inbox-wpp.png",
  },
  {
    icon: Brain,
    title: "Concierge IA (RAG)",
    description:
      "A IA lê os PDFs e protocolos reais da sua clínica, busca por similaridade vetorial e sugere respostas personalizadas para a recepcionista.",
    area: "rag",
    image: "/imagens/conhecimentoBase.png",
  },
  {
    icon: Activity,
    title: "Radar de Retenção Biológico",
    description:
      "Sabe quando o Botox do paciente vai vencer. Alerta automático baseado em ciclos terapêuticos: 120 dias Botox, 90 dias Peeling, 270 dias Preenchimento.",
    area: "radar",
    image: "/imagens/modelosAprendizado.png",
  },
  {
    icon: Clock,
    title: "Janela de Ouro",
    description:
      "Análise estatística descobre o dia e horário exatos com maior taxa de resposta do lead. A recepcionista sabe QUANDO ligar.",
    area: "janela",
    image: "/imagens/RelatorioCRM.png",
  },
  {
    icon: Workflow,
    title: "Automações Visuais (No-Code)",
    description:
      "Construtor drag & drop com React Flow. Gatilhos por evento: nova mensagem, lead movido, consulta concluída, ociosidade.",
    area: "automacoes",
    image: "/imagens/integrações.png",
  },
];

/* ── How It Works ────────────────────────────────────── */
export interface Step {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export const STEPS: Step[] = [
  {
    number: "01",
    icon: Plug,
    title: "Conecte",
    description:
      "Integre seu WhatsApp em 2 minutos. Sem API oficial cara, sem complicação. Evolution API auto-hospedada.",
  },
  {
    number: "02",
    icon: Settings,
    title: "Configure",
    description:
      "Monte seus pipelines, treine a IA com os protocolos da clínica e crie automações visuais sem código.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Escale",
    description:
      "A recepcionista vira uma máquina de vendas com contexto instantâneo, IA e timing perfeito.",
  },
];

/* ── Comparison ──────────────────────────────────────── */
export interface ComparisonRow {
  feature: string;
  competitor: string;
  luna: string;
}

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: "WhatsApp",
    competitor: "Twilio — R$0,22/msg",
    luna: "Evolution API — ilimitado",
  },
  {
    feature: "IA Treinada",
    competitor: "Bot genérico via add-on",
    luna: "RAG nos protocolos da clínica",
  },
  {
    feature: "Radar Retenção",
    competitor: "Não existe",
    luna: "Ciclo biológico automático",
  },
  {
    feature: "Janela de Ouro",
    competitor: "Não existe",
    luna: "Análise estatística exclusiva",
  },
  {
    feature: "UX / Design",
    competitor: "Interface SaaS genérica",
    luna: "Apple-native dark luxury",
  },
  {
    feature: "Cofre LGPD",
    competitor: "Misturado no chat",
    luna: "Isolado com auditoria",
  },
];

/* ── Integrations ────────────────────────────────────── */
export interface Integration {
  name: string;
  icon: LucideIcon;
  desc: string;
}

export const INTEGRATIONS: Integration[] = [
  { name: "WhatsApp", icon: MessageCircle, desc: "Mensagens ilimitadas" },
  { name: "Mercado Pago", icon: CreditCard, desc: "PIX, cartão e boleto" },
  { name: "OpenAI", icon: Brain, desc: "GPT-4 e embeddings" },
  { name: "Resend", icon: Mail, desc: "E-mails transacionais" },
  { name: "Cloudinary", icon: Cloud, desc: "Mídia otimizada" },
  { name: "PostgreSQL", icon: Database, desc: "Banco relacional" },
  { name: "Redis", icon: Zap, desc: "Cache em tempo real" },
  { name: "Evolution API", icon: Globe, desc: "WhatsApp self-hosted" },
];

/* ── Testimonials ────────────────────────────────────── */
export interface Testimonial {
  name: string;
  role: string;
  initials: string;
  text: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Dra. Camila Reis",
    role: "Dermatologista, São Paulo",
    initials: "CR",
    text: "O Radar de Retenção recuperou pacientes que eu nem sabia que estavam sumindo. Já voltaram 23 pacientes no primeiro mês.",
  },
  {
    name: "Mykaele Procópio",
    role: "Clínica Mykaele, Fortaleza",
    initials: "MP",
    text: "O Luna transformou minha recepção. Agendamos 3x mais usando a Janela de Ouro para ligar na hora certa.",
  },
  {
    name: "Dr. Ricardo Almeida",
    role: "MedSpa Premium, Rio de Janeiro",
    initials: "RA",
    text: "Finalmente um CRM que entende estética. A IA RAG fala a língua dos meus protocolos.",
  },
  {
    name: "Dra. Fernanda Costa",
    role: "Estética Avançada, Brasília",
    initials: "FC",
    text: "Saímos do Kommo e nunca olhamos para trás. O inbox unificado do Luna é outro nível.",
  },
  {
    name: "Dr. Bruno Santos",
    role: "Clínica BS, Belo Horizonte",
    initials: "BS",
    text: "O construtor de bots visual economiza 15 horas por semana da minha equipe.",
  },
  {
    name: "Dra. Ana Luíza",
    role: "Espaço Luxe, Curitiba",
    initials: "AL",
    text: "O cofre de mídia LGPD me convenceu. Segurança de dados com fotos de pacientes é inegociável.",
  },
];

/* ── Pricing ─────────────────────────────────────────── */
export interface Plan {
  name: string;
  subtitle: string;
  monthly: number;
  annual: number;
  popular?: boolean;
  executive?: boolean;
  features: string[];
  excluded?: string[];
  cta: string;
}

export const PLANS: Plan[] = [
  {
    name: "Essential Suite",
    subtitle: "Para clínicas em digitalização",
    monthly: 399,
    annual: 319,
    features: [
      "Agendamento dinâmico + Portal Paciente",
      "Gestão financeira + comissões",
      "Ficha de anamnese + evolução fotográfica",
      "Integração Mercado Pago (PIX, cartão, boleto)",
      "Programa de fidelidade + indicações",
      "Até 5 usuários",
    ],
    excluded: ["Sem CRM Kanban avançado", "Sem IA ou automação"],
    cta: "Começar Agora",
  },
  {
    name: "Growth Engine",
    subtitle: "Para clínicas em crescimento acelerado",
    monthly: 799,
    annual: 639,
    popular: true,
    features: [
      "Tudo do Essential Suite",
      "CRM Kanban completo com física real",
      "Inbox WhatsApp colaborativa (ilimitada)",
      "Construtor visual de Bots e automações",
      "Campanhas broadcast em massa",
      "NPS automático pós-atendimento",
      "Propostas com link público + tracking",
      "Usuários ilimitados",
    ],
    cta: "Assinar Growth",
  },
  {
    name: "Executive AI",
    subtitle: "Para clínicas que dominam o mercado",
    monthly: 1599,
    annual: 1279,
    executive: true,
    features: [
      "Tudo do Growth Engine",
      "Concierge RAG (protocolos clínicos via pgvector)",
      "Janela de Ouro (timing ótimo de contato)",
      "Radar de Retenção biológico (alerta automático)",
      "Cofre de Mídia LGPD com auditoria",
      "Analytics ROI por fonte de marketing",
      "API aberta + Webhooks (entrada/saída)",
      "Suporte dedicado 24/7",
    ],
    cta: "Falar com Consultor",
  },
];

/* ── Security ────────────────────────────────────────── */
export interface SecurityCard {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export const SECURITY_CARDS: SecurityCard[] = [
  {
    icon: Shield,
    title: "Criptografia AES-256-GCM",
    desc: "Credenciais de integração e tokens armazenados com criptografia militar.",
  },
  {
    icon: Lock,
    title: "Cofre de Mídia LGPD",
    desc: "Fotos de antes/depois isoladas com acesso auditado e compliance total.",
  },
  {
    icon: FileSearch,
    title: "Audit Log Completo",
    desc: "Cada ação sensível registrada. Quem fez, quando, o quê. Art. 18 LGPD.",
  },
  {
    icon: Fingerprint,
    title: "WebAuthn / Passkeys",
    desc: "Login biométrico nativo. Sem senhas vulneráveis, sem SMS.",
  },
];

/* ── FAQ ─────────────────────────────────────────────── */
export interface FAQItem {
  q: string;
  a: string;
}

export const FAQS: FAQItem[] = [
  {
    q: "Preciso da API oficial do WhatsApp?",
    a: "Não. O Luna usa a Evolution API, auto-hospedada no seu servidor via Docker. Você tem controle total das instâncias sem pagar tarifas por mensagem para a Meta. Isso significa mensagens ilimitadas no seu plano.",
  },
  {
    q: "Minha clínica já usa outro CRM. Como faço a migração?",
    a: "Oferecemos importação em massa de leads via CSV e migração assistida. Nosso time configura os pipelines e transfere o histórico para você começar sem perder dados.",
  },
  {
    q: "A IA vai responder automaticamente meus pacientes?",
    a: "Não. O Concierge RAG sugere respostas para a recepcionista aprovar antes do envio. A IA é uma copiloto, não substitui o toque humano que seus pacientes esperam.",
  },
  {
    q: "Quantos usuários posso ter?",
    a: "No plano Essential: até 5. No Growth e Executive: ilimitados. Cada membro da equipe tem role configurável (admin, gerente, agente).",
  },
  {
    q: "Os dados estão seguros conforme a LGPD?",
    a: "Sim. Usamos criptografia AES-256-GCM para credenciais, exclusão lógica de dados, audit logs completos, cofre de mídia isolado e anonimização de leads conforme Art. 18 da LGPD.",
  },
  {
    q: "Como funciona o Radar de Retenção?",
    a: "O sistema conhece os ciclos biológicos de cada procedimento estético (ex: Botox retorna em 120 dias, Peeling em 90 dias). Quando o paciente se aproxima ou ultrapassa o ciclo, o Luna gera um alerta automático com score de risco de churn.",
  },
  {
    q: "Posso testar antes de assinar?",
    a: "Sim. Oferecemos uma demonstração guiada personalizada onde mostramos o sistema configurado para o perfil da sua clínica. Agende pelo botão no topo.",
  },
  {
    q: "Vocês oferecem suporte?",
    a: "Sim. Essential: chat em horário comercial. Growth: suporte prioritário. Executive: suporte dedicado 24/7 com SLA 99.9%.",
  },
];

/* ── Footer ──────────────────────────────────────────── */
export const FOOTER_LINKS = {
  product: [
    { label: "Funcionalidades", href: "/#funcionalidades" },
    { label: "Preços", href: "/#precos" },
    { label: "Integrações", href: "/#integracoes" },
    { label: "Changelog", href: "#" },
    { label: "Status", href: "#" },
  ],
  company: [
    { label: "Sobre", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Carreiras", href: "#" },
    { label: "Contato", href: "#contato" },
  ],
  legal: [
    { label: "Política de Privacidade", href: "#" },
    { label: "Termos de Uso", href: "#" },
    { label: "Compliance LGPD", href: "#" },
  ],
  social: [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: MessageCircle, href: SITE.whatsapp, label: "WhatsApp" },
  ],
} as const;
