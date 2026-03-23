import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return Response.json(
        { error: 'Nome, e-mail e senha são obrigatórios' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return Response.json(
        { error: 'Senha deve ter no mínimo 8 caracteres' },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (existing) {
      return Response.json(
        { error: 'Este e-mail já está cadastrado' },
        { status: 409 }
      )
    }

    const hashed = await hashPassword(password)

    // Criar user + tenant + membership + subscription (trial) em uma transação
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashed,
          role: 'ADMIN',
        },
      })

      // Criar tenant com slug do nome da clínica
      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 50)

      // Garantir slug único
      const existingSlug = await tx.crmTenant.findUnique({ where: { slug } })
      const finalSlug = existingSlug ? `${slug}-${Date.now().toString(36)}` : slug

      const tenant = await tx.crmTenant.create({
        data: {
          name: name.trim(),
          slug: finalSlug,
        },
      })

      // Vincular user como OWNER
      await tx.crmTeamMember.create({
        data: {
          tenantId: tenant.id,
          userId: user.id,
          role: 'OWNER',
          joinedAt: new Date(),
        },
      })

      // Buscar plano starter para trial
      const starterPlan = await tx.subscriptionPlan.findUnique({
        where: { name: 'starter' },
      })

      if (starterPlan) {
        const trialEnd = new Date()
        trialEnd.setDate(trialEnd.getDate() + 14) // 14 dias de trial

        await tx.subscription.create({
          data: {
            tenantId: tenant.id,
            planId: starterPlan.id,
            status: 'TRIAL',
            trialEndsAt: trialEnd,
            currentPeriodStart: new Date(),
            currentPeriodEnd: trialEnd,
          },
        })
      }

      // Criar pipeline default
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

      for (const stage of stages) {
        await tx.stage.create({
          data: {
            pipelineId: pipeline.id,
            tenantId: tenant.id,
            name: stage.name,
            type: stage.type,
            order: stage.order,
            color: stage.color,
          },
        })
      }

      // AI Config default
      await tx.crmAiConfig.create({
        data: { tenantId: tenant.id },
      })

      return { user, tenant }
    })

    const token = generateToken({
      userId: result.user.id,
      email: result.user.email,
      role: 'ADMIN',
      tenantId: result.tenant.id,
      teamRole: 'OWNER',
    })

    return Response.json(
      {
        token,
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: 'ADMIN',
          tenantId: result.tenant.id,
          teamRole: 'OWNER',
          tenantName: result.tenant.name,
          tenantSlug: result.tenant.slug,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Register error:', error)
    return Response.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
