import { prisma } from '@/lib/prisma'

interface AuditParams {
  tenantId: string
  userId: string
  action: string
  entityId?: string
  details?: Record<string, unknown>
  ipAddress?: string
}

export async function createAuditLog(params: AuditParams) {
  void prisma.crmAuditLog
    .create({
      data: {
        tenantId: params.tenantId,
        userId: params.userId,
        action: params.action,
        entityId: params.entityId,
        details: params.details ?? undefined,
        ipAddress: params.ipAddress,
      },
    })
    .catch(console.error)
}

// Helper para extrair IP da request
export function getClientIp(request: Request): string | undefined {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    undefined
  )
}
