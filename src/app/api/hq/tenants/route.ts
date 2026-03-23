import { authenticateRequest, isSuperAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const payload = authenticateRequest(request)
  if (!payload || !isSuperAdmin(payload)) {
    return Response.json({ error: 'Acesso negado' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50)
  const search = searchParams.get('search')?.trim()

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { slug: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {}

  const [tenants, total] = await Promise.all([
    prisma.crmTenant.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        subscription: {
          include: { plan: { select: { displayName: true, priceMonthly: true } } },
        },
        _count: {
          select: {
            leads: true,
            conversations: true,
            teamMembers: true,
          },
        },
      },
    }),
    prisma.crmTenant.count({ where }),
  ])

  return Response.json({
    tenants: tenants.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      isActive: t.isActive,
      suspendedAt: t.suspendedAt,
      createdAt: t.createdAt,
      plan: t.subscription?.plan?.displayName ?? 'Sem plano',
      planPrice: t.subscription?.plan?.priceMonthly ?? 0,
      subscriptionStatus: t.subscription?.status ?? 'NONE',
      leads: t._count.leads,
      conversations: t._count.conversations,
      teamMembers: t._count.teamMembers,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}

export async function POST(request: Request) {
  const payload = authenticateRequest(request)
  if (!payload || !isSuperAdmin(payload)) {
    return Response.json({ error: 'Acesso negado' }, { status: 403 })
  }

  try {
    const { name, slug, planName, ownerEmail, ownerName, ownerPassword } =
      await request.json()

    if (!name || !slug || !ownerEmail || !ownerName || !ownerPassword) {
      return Response.json(
        { error: 'Campos obrigatórios: name, slug, ownerEmail, ownerName, ownerPassword' },
        { status: 400 }
      )
    }

    // Import dinamico para evitar circular dependency
    const { hashPassword, generateToken } = await import('@/lib/auth')

    const result = await prisma.$transaction(async (tx) => {
      const tenant = await tx.crmTenant.create({
        data: { name, slug },
      })

      const hashed = await hashPassword(ownerPassword)
      const user = await tx.user.create({
        data: {
          name: ownerName,
          email: ownerEmail.toLowerCase().trim(),
          password: hashed,
          role: 'ADMIN',
        },
      })

      await tx.crmTeamMember.create({
        data: {
          tenantId: tenant.id,
          userId: user.id,
          role: 'OWNER',
          joinedAt: new Date(),
        },
      })

      // Vincular plano se especificado
      if (planName) {
        const plan = await tx.subscriptionPlan.findUnique({
          where: { name: planName },
        })
        if (plan) {
          await tx.subscription.create({
            data: {
              tenantId: tenant.id,
              planId: plan.id,
              status: 'ACTIVE',
              currentPeriodStart: new Date(),
            },
          })
        }
      }

      // Pipeline default
      const pipeline = await tx.pipeline.create({
        data: {
          tenantId: tenant.id,
          name: 'Vendas',
          isDefault: true,
        },
      })

      const stages = [
        { name: 'Novo Lead', type: 'OPEN' as const, order: 0, color: '#4A7BFF' },
        { name: 'Qualificação', type: 'OPEN' as const, order: 1, color: '#F0A500' },
        { name: 'Proposta', type: 'OPEN' as const, order: 2, color: '#FF6B4A' },
        { name: 'Negociação', type: 'OPEN' as const, order: 3, color: '#D4AF37' },
        { name: 'Ganho', type: 'WON' as const, order: 4, color: '#2ECC8A' },
        { name: 'Perdido', type: 'LOST' as const, order: 5, color: '#FF4757' },
      ]
      for (const s of stages) {
        await tx.stage.create({
          data: { pipelineId: pipeline.id, tenantId: tenant.id, ...s },
        })
      }

      await tx.crmAiConfig.create({ data: { tenantId: tenant.id } })

      return { tenant, user }
    })

    return Response.json(
      { tenant: result.tenant, userId: result.user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create tenant error:', error)
    const message =
      error instanceof Error && error.message.includes('Unique')
        ? 'Slug ou e-mail já existem'
        : 'Erro ao criar tenant'
    return Response.json({ error: message }, { status: 400 })
  }
}
