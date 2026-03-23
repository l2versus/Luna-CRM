import { getTenantContext, handleTenantError } from '@/lib/tenant-context'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { tenantId } = getTenantContext(request)

    const { searchParams } = new URL(request.url)
    const pipelineId = searchParams.get('pipelineId')

    // Se não especificou, pega o default
    let pipeline
    if (pipelineId) {
      pipeline = await prisma.pipeline.findFirst({
        where: { id: pipelineId, tenantId },
      })
    } else {
      pipeline = await prisma.pipeline.findFirst({
        where: { tenantId, isDefault: true },
      })
    }

    if (!pipeline) {
      return Response.json({ error: 'Pipeline não encontrado' }, { status: 404 })
    }

    // Buscar stages com leads (sem N+1: 2 queries)
    const [stages, leads] = await Promise.all([
      prisma.stage.findMany({
        where: { pipelineId: pipeline.id },
        orderBy: { order: 'asc' },
      }),
      prisma.lead.findMany({
        where: {
          pipelineId: pipeline.id,
          tenantId,
          deletedAt: null,
        },
        orderBy: { position: 'asc' },
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          status: true,
          stageId: true,
          position: true,
          expectedValue: true,
          aiScore: true,
          aiScoreLabel: true,
          churnRisk: true,
          bestContactDays: true,
          bestContactHours: true,
          bestContactBasis: true,
          source: true,
          tags: true,
          lastInteractionAt: true,
          createdAt: true,
        },
      }),
    ])

    // Agrupar leads por estágio
    const leadsByStage: Record<string, typeof leads> = {}
    for (const lead of leads) {
      if (!leadsByStage[lead.stageId]) leadsByStage[lead.stageId] = []
      leadsByStage[lead.stageId].push(lead)
    }

    // Buscar todos os pipelines do tenant (para o seletor)
    const allPipelines = await prisma.pipeline.findMany({
      where: { tenantId },
      select: { id: true, name: true, isDefault: true },
      orderBy: { createdAt: 'asc' },
    })

    return Response.json({
      pipeline: {
        id: pipeline.id,
        name: pipeline.name,
        isDefault: pipeline.isDefault,
      },
      pipelines: allPipelines,
      stages: stages.map((s) => ({
        id: s.id,
        name: s.name,
        type: s.type,
        order: s.order,
        color: s.color,
        cachedLeadCount: s.cachedLeadCount,
        cachedTotalValue: s.cachedTotalValue,
        leads: leadsByStage[s.id] ?? [],
      })),
    })
  } catch (error) {
    return handleTenantError(error)
  }
}
