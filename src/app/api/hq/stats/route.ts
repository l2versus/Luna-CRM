import { authenticateRequest, isSuperAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const payload = authenticateRequest(request)
  if (!payload || !isSuperAdmin(payload)) {
    return Response.json({ error: 'Acesso negado' }, { status: 403 })
  }

  const [
    totalTenants,
    activeTenants,
    totalLeads,
    totalConversations,
    subscriptionsByPlan,
    recentTenants,
  ] = await Promise.all([
    prisma.crmTenant.count(),
    prisma.crmTenant.count({ where: { isActive: true, suspendedAt: null } }),
    prisma.lead.count({ where: { deletedAt: null } }),
    prisma.conversation.count(),
    prisma.subscription.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.crmTenant.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        createdAt: true,
        subscription: {
          select: {
            status: true,
            plan: { select: { displayName: true } },
          },
        },
      },
    }),
  ])

  // MRR calc
  const activeSubscriptions = await prisma.subscription.findMany({
    where: { status: { in: ['ACTIVE', 'TRIAL'] } },
    include: { plan: { select: { priceMonthly: true } } },
  })
  const mrr = activeSubscriptions.reduce(
    (sum, sub) => sum + (sub.plan?.priceMonthly ?? 0),
    0
  )

  return Response.json({
    totalTenants,
    activeTenants,
    totalLeads,
    totalConversations,
    mrr,
    subscriptionsByPlan: subscriptionsByPlan.map((s) => ({
      status: s.status,
      count: s._count,
    })),
    recentTenants,
  })
}
