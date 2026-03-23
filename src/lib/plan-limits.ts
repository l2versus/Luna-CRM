import { prisma } from '@/lib/prisma'

type LimitableResource =
  | 'pipelines'
  | 'leads'
  | 'channels'
  | 'teamMembers'
  | 'automations'
  | 'knowledgeDocs'
  | 'botFlows'

// Mapeia recurso → campo de limite no plano + tabela de contagem
const RESOURCE_MAP: Record<
  LimitableResource,
  { planField: string; countQuery: (tenantId: string) => Promise<number> }
> = {
  pipelines: {
    planField: 'maxPipelines',
    countQuery: (tenantId) =>
      prisma.pipeline.count({ where: { tenantId } }),
  },
  leads: {
    planField: 'maxLeads',
    countQuery: (tenantId) =>
      prisma.lead.count({ where: { tenantId, deletedAt: null } }),
  },
  channels: {
    planField: 'maxChannels',
    countQuery: (tenantId) =>
      prisma.crmChannel.count({ where: { tenantId, isActive: true } }),
  },
  teamMembers: {
    planField: 'maxTeamMembers',
    countQuery: (tenantId) =>
      prisma.crmTeamMember.count({ where: { tenantId, isActive: true } }),
  },
  automations: {
    planField: 'maxAutomations',
    countQuery: (tenantId) =>
      prisma.crmAutomation.count({ where: { tenantId } }),
  },
  knowledgeDocs: {
    planField: 'maxKnowledgeDocs',
    countQuery: (tenantId) =>
      prisma.crmKnowledgeBase.count({
        where: { tenantId, isActive: true, chunkIndex: 0 },
      }),
  },
  botFlows: {
    planField: 'maxBotFlows',
    countQuery: (tenantId) =>
      prisma.crmBotFlow.count({ where: { tenantId } }),
  },
}

export interface PlanCheckResult {
  allowed: boolean
  current: number
  limit: number
  resource: string
}

// Verifica se o tenant pode criar mais do recurso
export async function checkPlanLimit(
  tenantId: string,
  resource: LimitableResource
): Promise<PlanCheckResult> {
  const subscription = await prisma.subscription.findUnique({
    where: { tenantId },
    include: { plan: true },
  })

  // Sem subscription = sem limites (fallback para trial/dev)
  if (!subscription || !subscription.plan) {
    return { allowed: true, current: 0, limit: Infinity, resource }
  }

  // Verificar status da subscription
  if (
    subscription.status === 'SUSPENDED' ||
    subscription.status === 'CANCELLED'
  ) {
    return { allowed: false, current: 0, limit: 0, resource }
  }

  const config = RESOURCE_MAP[resource]
  const plan = subscription.plan as Record<string, unknown>
  const limit = (plan[config.planField] as number) ?? Infinity
  const current = await config.countQuery(tenantId)

  return {
    allowed: current < limit,
    current,
    limit,
    resource,
  }
}

// Verifica se uma feature está habilitada no plano
export async function checkPlanFeature(
  tenantId: string,
  feature: string
): Promise<boolean> {
  const subscription = await prisma.subscription.findUnique({
    where: { tenantId },
    include: { plan: true },
  })

  if (!subscription || !subscription.plan) return false

  const plan = subscription.plan as Record<string, unknown>
  return (plan[feature] as boolean) ?? false
}

// Response helper para limite atingido
export function planLimitResponse(result: PlanCheckResult): Response {
  return Response.json(
    {
      error: `Limite do plano atingido para ${result.resource}`,
      current: result.current,
      limit: result.limit,
      upgrade: true,
    },
    { status: 403 }
  )
}
