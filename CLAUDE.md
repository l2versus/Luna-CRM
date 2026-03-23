# CLAUDE.md — Luna CRM SaaS Platform
> **LEIA ESTE ARQUIVO INTEIRO ANTES DE ESCREVER QUALQUER LINHA DE CÓDIGO.**
> Você é o Tech Lead Sênior e Engenheiro de Software especialista em SaaS de grande escala.
> **Versão: 1.0** — Março 2026

---

## 1. IDENTIDADE DO PROJETO

| Campo | Valor |
|---|---|
| **Produto** | SaaS: Site + CRM premium para clínicas de estética |
| **Nome** | Luna CRM |
| **Dev/CEO** | EB Develop |
| **Nicho** | Clínicas de estética corporal e harmonização facial |
| **Killer Feature** | Radar de Retenção Biológico (ciclos de procedimento) |
| **Benchmark** | Kommo CRM — superar em 10x |
| **Deploy** | VPS via Coolify (Docker Compose) |
| **Idioma** | Português do Brasil (pt-BR) |
| **Protótipo** | Clínica Mykaele Procópio (projeto separado em site-mykaele) |

**Missão:** O único CRM brasileiro que sabe quando o Botox da paciente vence e avisa a clínica ANTES dela sumir.

---

## 2. STACK TECNOLÓGICA

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16+ (App Router) |
| Linguagem | TypeScript 5 estrito (zero `any`) |
| ORM | Prisma 7+ PostgreSQL (`@prisma/adapter-pg`) |
| Auth | JWT (`jsonwebtoken`) com tenantId |
| Estilo | Tailwind CSS 4 (dark mode obrigatório) |
| Animações | Framer Motion |
| Estado | Zustand |
| Filas | BullMQ + Redis |
| WhatsApp | Evolution API v2 (agora) → Meta Business API (futuro) |
| IA | Cascade multi-provedor (Gemini→Groq→OpenRouter→Together→OpenAI→Claude) |
| Embeddings | Gemini text-embedding-004 (768 dim) + pgvector |
| Billing | Asaas (PIX grátis, boleto, cartão) |
| Email | Resend |
| Tempo Real | SSE + Redis pub/sub |
| Deploy | Coolify (Docker Compose) |

### Alias de Importação
```json
{ "@/*": ["src/*"] }
```

---

## 3. ARQUITETURA MULTI-TENANT

### Princípio Core
```
1 app Next.js → N clientes (tenants)
1 banco PostgreSQL → tenantId em TODA tabela CRM
1 VPS → escala vertical (16GB suporta ~30-40 clientes)
```

### Modelo de Acesso (3 níveis)
```
SUPER_ADMIN (EB Develop) → Luna HQ (painel central)
ADMIN + teamRole:owner   → CRM do seu tenant
ADMIN + teamRole:agent   → CRM do seu tenant (acesso limitado)
```

### JWT Payload
```typescript
{
  userId: string
  email: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'PATIENT'
  tenantId?: string      // null para SUPER_ADMIN no HQ
  teamRole?: 'OWNER' | 'ADMIN' | 'MANAGER' | 'AGENT'
}
```

### Resolução de Tenant
```typescript
// ORDEM DE PRIORIDADE:
// 1. JWT token (rotas API protegidas)
// 2. Cookie 'luna-tenant-id' (SSE sem Bearer)
// 3. Custom domain → CrmTenant.customDomain (Enterprise)
// 4. Subdomínio → CrmTenant.slug (slug.lunacrm.com.br)
// NUNCA: process.env.DEFAULT_TENANT_ID (não existe neste projeto)
```

### Isolamento de Dados
```
PostgreSQL: tenantId em todo WHERE
Redis:      prefixo tenant:{id}:
Evolution:  instanceId por tenant
BullMQ:     job.data.tenantId em todo job
Storage:    subpasta por tenant
SSE:        canal crm:events:{tenantId}
```

---

## 4. RADAR DE RETENÇÃO BIOLÓGICO — KILLER FEATURE

### Ciclos de Procedimento (defaults)
```
Botox                → follow-up: 15d  | retorno: 120d | reativação: 90-135d
Preenchimento Labial → follow-up: 7d   | retorno: 270d | reativação: 240-300d
Harmonização Facial  → follow-up: 15d  | retorno: 180d | reativação: 150-210d
Bioestimuladores     → follow-up: 30d  | retorno: 180d | reativação: 150-210d
Skinbooster          → follow-up: 7d   | retorno: 90d  | reativação: 75-105d
Peeling Químico      → follow-up: 7d   | retorno: 90d  | reativação: 75-105d
Microagulhamento     → follow-up: 30d  | retorno: 90d  | reativação: 75-105d
Limpeza de Pele      → follow-up: 3d   | retorno: 30d  | reativação: 25-40d
Drenagem Linfática   → follow-up: 1d   | retorno: 7d   | reativação: 5-10d
Criolipólise         → follow-up: 15d  | retorno: 180d | reativação: 150-210d
Laser CO2            → follow-up: 30d  | retorno: 365d | reativação: 300-400d
Fios de PDO          → follow-up: 7d   | retorno: 180d | reativação: 150-210d
Enzimas (Lipólise)   → follow-up: 3d   | retorno: 21d  | reativação: 18-28d
Sculptra             → follow-up: 30d  | retorno: 730d | reativação: 670-760d
```

### Risk Levels
```
SAFE     → dentro do ciclo normal (verde)
WATCH    → janela de reativação iniciou (amarelo)
RISK     → metade da janela de reativação (laranja)
CRITICAL → fim da janela de reativação (vermelho)
CHURN    → ultrapassou janela sem retorno (vermelho escuro)
```

### Automações do Radar
```
1. Follow-up automático X dias após procedimento
2. Mensagem de reativação quando entrar na janela
3. Alerta para equipe quando risco sobe para RISK
4. Notificação urgente quando CRITICAL
5. Lead marcado como CHURN se não reagendar
```

---

## 5. PRODUTO: SITE + CRM

### O cliente compra um pacote com duas coisas:

```
SITE (template customizável):
  ├── Landing page da clínica
  ├── Vitrine de procedimentos
  ├── Galeria antes/depois
  ├── Agendamento online
  ├── Portal do paciente
  └── Domínio: slug.lunacrm.com.br ou domínio próprio (Enterprise)

CRM:
  ├── Pipeline Kanban
  ├── Inbox WhatsApp
  ├── IA Cascade + RAG + Concierge
  ├── Radar de Retenção Biológico
  ├── Janela de Ouro
  ├── Automações + Bot visual
  ├── Relatórios + NPS
  └── Propostas + Broadcast
```

### Planos
```
Starter  R$ 197/mês: 1 pipeline, 500 leads, 1 WA, 2 users, radar básico (3 procs)
Pro      R$ 397/mês: 3 pipelines, 5k leads, 2 WA, 5 users, IA completa, radar completo
Enterprise R$ 797/mês: ilimitado, white-label, domínio próprio, API, Meta API
```

---

## 6. ESTRUTURA DO PROJETO

```
LUNA-CRM/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing page de vendas (lunacrm.com.br)
│   │   ├── globals.css             # Design system Luna
│   │   ├── demo/                   # Ambiente demo
│   │   ├── landing/                # Landing page alternativa
│   │   ├── admin/
│   │   │   ├── hq/                 # Luna HQ (SUPER_ADMIN only)
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx        # Dashboard master
│   │   │   │   ├── clients/        # Gerenciar tenants
│   │   │   │   ├── billing/        # Dashboard financeiro
│   │   │   │   └── settings/       # Config global
│   │   │   └── crm/                # CRM do tenant
│   │   │       ├── layout.tsx
│   │   │       ├── pipeline/       # Kanban
│   │   │       ├── inbox/          # WhatsApp
│   │   │       ├── contacts/       # Contatos
│   │   │       ├── intelligence/   # IA + Radar
│   │   │       ├── automations/    # Automações + Bot
│   │   │       ├── reports/        # Relatórios
│   │   │       ├── settings/       # Config do tenant
│   │   │       └── system/         # DLQ + Admin
│   │   └── api/
│   │       ├── auth/               # Login, register, refresh
│   │       ├── hq/                 # APIs do Luna HQ
│   │       ├── crm/                # APIs do CRM
│   │       ├── webhooks/           # Webhooks (Evolution, Asaas)
│   │       └── public/             # APIs públicas (propostas, NPS)
│   ├── lib/
│   │   ├── prisma.ts               # Cliente Prisma
│   │   ├── auth.ts                 # JWT com tenantId
│   │   ├── tenant-context.ts       # Resolver tenant de request
│   │   ├── plan-limits.ts          # Verificar limites do plano
│   │   ├── crypto.ts               # AES-256-GCM
│   │   ├── evolution-api.ts        # Cliente Evolution API
│   │   ├── gemini.ts               # IA cascade multi-provedor
│   │   ├── rag.ts                  # Embeddings + pgvector
│   │   ├── audit.ts                # Log de auditoria LGPD
│   │   ├── lgpd.ts                 # Anonimização
│   │   ├── retention-radar.ts      # Radar de Retenção Biológico
│   │   ├── queues/                 # BullMQ config
│   │   └── demo-simulator.ts       # Simulador WA para demo
│   ├── components/
│   │   ├── crm/                    # Componentes do CRM
│   │   ├── hq/                     # Componentes do HQ
│   │   └── ui/                     # Componentes base
│   ├── hooks/
│   ├── stores/
│   └── types/
├── workers/crm/                    # Workers BullMQ
├── actions/crm/                    # Server Actions
├── prisma/
│   ├── schema.prisma               # Schema multi-tenant completo
│   └── seeds/                      # Seeds (planos, demo, ciclos)
├── CLAUDE.md                       # Este arquivo
└── SAAS-SCOPE.md                   # Escopo completo do SaaS
```

---

## 7. PADRÕES DE CÓDIGO OBRIGATÓRIOS

```typescript
// ✅ SEMPRE FAZER:
// - Server Components por padrão — "use client" apenas nas folhas
// - Server Actions para mutações
// - getTenantId(request) para resolver tenant — NUNCA hardcoded
// - checkPlanLimit(tenantId, 'resource') antes de criar recursos
// - where: { tenantId, deletedAt: null } em TODA consulta de Lead
// - prisma.$transaction para operações multi-tabela
// - criarLogAuditoria() em ações sensíveis
// - encryptCredentials() para credenciais de integração
// - Zod em toda entrada externa
// - TypeScript estrito: zero any, zero as unknown

// ❌ NUNCA FAZER:
// - NUNCA hardcodar tenantId
// - NUNCA permitir acesso cross-tenant (tenant A vê dados de B)
// - NUNCA COUNT/SUM no carregamento do Kanban — usar cache
// - NUNCA credenciais em texto puro
// - NUNCA console.log em produção — apenas console.error em catch
// - NUNCA criar recursos sem verificar limite do plano
// - NUNCA DELETE definitivo de Lead — usar anonymizeLead()
```

---

## 8. DESIGN SYSTEM

```
Cores: vars em globals.css (--luna-*)
Tipografia: Cormorant Garamond (títulos) + DM Sans (interface)
Bordas: 12px cards, 8px inputs, 6px badges
Sombras: 0 4px 24px rgba(0,0,0,0.4)
Transições: Framer Motion spring (stiffness: 400, damping: 25)
Dark mode: OBRIGATÓRIO (fundo #0A0A0B)
Carregamento: Skeleton animado — nunca spinner
Estado vazio: Ilustração contextual
```

---

## 9. ROADMAP — ONDE ESTAMOS

```
[✅] Projeto criado e configurado
[✅] Schema Prisma multi-tenant (45+ models)
[✅] Design system (CSS vars, fontes, globals.css)
[✅] SAAS-SCOPE.md com escopo completo
[✅] Libs core (prisma.ts, auth.ts, tenant-context.ts, plan-limits.ts, crypto.ts, audit.ts, retention-radar.ts)
[✅] Middleware de autenticação + tenant
[✅] Seeds (planos, ciclos de retenção, tenant demo)
[✅] Auth API (login, register, me) + Login page + Auth store
[✅] Luna HQ — Layout + Dashboard master (KPIs, MRR, recent tenants)
[✅] Luna HQ — Provisioning de tenant (CRUD + create modal)
[✅] CRM — Layout + Navegação (sidebar, 7 nav items)
[✅] CRM — Pipeline Kanban (drag & drop, optimistic, server action)
[✅] CRM — API routes (leads POST, pipeline GET, HQ stats/tenants)
[ ] CRM — Inbox WhatsApp
[ ] CRM — Radar de Retenção Biológico
[ ] CRM — IA Cascade
[ ] Demo — Ambiente + Tour guiado
[ ] Landing — Página de vendas
[ ] Billing — Integração Asaas
```

---

## 10. REFERÊNCIA DO PROTÓTIPO

O projeto protótipo está em `c:\Users\admin\Desktop\site myka\site-mykaele`.
Pode ser consultado para referência de implementação, mas NUNCA alterar.
Este projeto (LUNA-CRM) é independente e limpo.

---

## 11. VARIÁVEIS DE AMBIENTE

Ver `.env.example` na raiz do projeto.

---

*CLAUDE.md v1.0 — Luna CRM SaaS Platform — Março 2026*
