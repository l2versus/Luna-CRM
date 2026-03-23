import { getTenantContext, handleTenantError } from '@/lib/tenant-context'
import { checkPlanLimit, planLimitResponse } from '@/lib/plan-limits'
import { createAuditLog } from '@/lib/audit'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { tenantId, payload } = getTenantContext(request)

    // Verificar limite do plano
    const limitCheck = await checkPlanLimit(tenantId, 'leads')
    if (!limitCheck.allowed) return planLimitResponse(limitCheck)

    const body = await request.json()
    const { name, phone, email, source, tags, stageId, pipelineId, expectedValue } = body

    if (!name || !phone) {
      return Response.json(
        { error: 'Nome e telefone são obrigatórios' },
        { status: 400 }
      )
    }

    // Resolver pipeline e stage
    let targetPipelineId = pipelineId
    let targetStageId = stageId

    if (!targetPipelineId) {
      const defaultPipeline = await prisma.pipeline.findFirst({
        where: { tenantId, isDefault: true },
      })
      if (!defaultPipeline) {
        return Response.json({ error: 'Pipeline não configurado' }, { status: 400 })
      }
      targetPipelineId = defaultPipeline.id
    }

    if (!targetStageId) {
      const firstStage = await prisma.stage.findFirst({
        where: { pipelineId: targetPipelineId, type: 'OPEN' },
        orderBy: { order: 'asc' },
      })
      if (!firstStage) {
        return Response.json({ error: 'Stage não encontrado' }, { status: 400 })
      }
      targetStageId = firstStage.id
    }

    // Posição: último do estágio + 1
    const lastLead = await prisma.lead.findFirst({
      where: { stageId: targetStageId, tenantId, deletedAt: null },
      orderBy: { position: 'desc' },
      select: { position: true },
    })
    const position = (lastLead?.position ?? 0) + 65536

    const lead = await prisma.$transaction(async (tx) => {
      const created = await tx.lead.create({
        data: {
          tenantId,
          pipelineId: targetPipelineId,
          stageId: targetStageId,
          name: name.trim(),
          phone: phone.trim(),
          email: email?.trim() || null,
          source: source || null,
          tags: tags ?? [],
          position,
          expectedValue: expectedValue ?? null,
          status: 'WARM',
        },
      })

      // Atualizar cache do stage
      await tx.stage.update({
        where: { id: targetStageId },
        data: {
          cachedLeadCount: { increment: 1 },
          cachedTotalValue: { increment: expectedValue ?? 0 },
          cacheUpdatedAt: new Date(),
        },
      })

      // Activity log
      await tx.leadActivity.create({
        data: {
          leadId: created.id,
          type: 'CREATED',
          payload: { source, createdBy: payload.userId },
          createdBy: payload.userId,
        },
      })

      return created
    })

    void createAuditLog({
      tenantId,
      userId: payload.userId,
      action: 'LEAD_CREATED',
      entityId: lead.id,
      details: { name: lead.name, phone: lead.phone, source },
    })

    return Response.json(lead, { status: 201 })
  } catch (error) {
    return handleTenantError(error)
  }
}
