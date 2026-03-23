'use server'

import { prisma } from '@/lib/prisma'
import { createAuditLog } from '@/lib/audit'

interface MoveLeadInput {
  leadId: string
  targetStageId: string
  position: number
  tenantId: string
  userId: string
}

export async function moveLead(input: MoveLeadInput) {
  const { leadId, targetStageId, position, tenantId, userId } = input

  const lead = await prisma.lead.findFirst({
    where: { id: leadId, tenantId, deletedAt: null },
    select: { stageId: true, expectedValue: true },
  })

  if (!lead) throw new Error('Lead não encontrado')

  const sourceStageId = lead.stageId
  const isSameStage = sourceStageId === targetStageId

  // Verificar se o stage de destino pertence ao tenant
  const targetStage = await prisma.stage.findFirst({
    where: { id: targetStageId, tenantId },
    select: { type: true },
  })

  if (!targetStage) throw new Error('Estágio não encontrado')

  // Determinar novo status baseado no tipo do stage
  const newStatus =
    targetStage.type === 'WON'
      ? 'WON'
      : targetStage.type === 'LOST'
        ? 'LOST'
        : undefined

  await prisma.$transaction(async (tx) => {
    // Mover o lead
    await tx.lead.update({
      where: { id: leadId },
      data: {
        stageId: targetStageId,
        position,
        ...(newStatus ? { status: newStatus as 'WON' | 'LOST', closedAt: new Date() } : {}),
      },
    })

    // Atualizar caches dos stages (apenas se mudou de stage)
    if (!isSameStage) {
      const value = lead.expectedValue ?? 0

      await tx.stage.update({
        where: { id: sourceStageId },
        data: {
          cachedLeadCount: { decrement: 1 },
          cachedTotalValue: { decrement: value },
          cacheUpdatedAt: new Date(),
        },
      })

      await tx.stage.update({
        where: { id: targetStageId },
        data: {
          cachedLeadCount: { increment: 1 },
          cachedTotalValue: { increment: value },
          cacheUpdatedAt: new Date(),
        },
      })

      // Activity log
      await tx.leadActivity.create({
        data: {
          leadId,
          type: 'STAGE_CHANGED',
          payload: {
            from: sourceStageId,
            to: targetStageId,
            movedBy: userId,
          },
          createdBy: userId,
        },
      })
    }
  })

  void createAuditLog({
    tenantId,
    userId,
    action: 'LEAD_MOVED',
    entityId: leadId,
    details: { from: sourceStageId, to: targetStageId, position },
  })

  return { success: true }
}
