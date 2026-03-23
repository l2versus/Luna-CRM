import { authenticateRequest, type TokenPayload } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export class TenantError extends Error {
  constructor(
    message: string,
    public statusCode: number = 403
  ) {
    super(message)
    this.name = 'TenantError'
  }
}

// Resolver tenantId de uma request autenticada
export function getTenantId(request: Request): string {
  const payload = authenticateRequest(request)
  if (!payload) {
    throw new TenantError('Token inválido ou ausente', 401)
  }
  if (!payload.tenantId) {
    throw new TenantError('Usuário não vinculado a nenhuma clínica', 403)
  }
  return payload.tenantId
}

// Resolver tenantId + payload completo
export function getTenantContext(request: Request): {
  tenantId: string
  payload: TokenPayload
} {
  const payload = authenticateRequest(request)
  if (!payload) {
    throw new TenantError('Token inválido ou ausente', 401)
  }
  if (!payload.tenantId) {
    throw new TenantError('Usuário não vinculado a nenhuma clínica', 403)
  }
  return { tenantId: payload.tenantId, payload }
}

// Resolver tenant por custom domain (Enterprise white-label)
export async function getTenantByDomain(
  domain: string
): Promise<string | null> {
  const tenant = await prisma.crmTenant.findFirst({
    where: { customDomain: domain, isActive: true },
    select: { id: true },
  })
  return tenant?.id ?? null
}

// Resolver tenant por slug (subdomínio)
export async function getTenantBySlug(
  slug: string
): Promise<string | null> {
  const tenant = await prisma.crmTenant.findFirst({
    where: { slug, isActive: true },
    select: { id: true },
  })
  return tenant?.id ?? null
}

// Verificar se tenant está ativo (não suspenso)
export async function verifyTenantActive(tenantId: string): Promise<boolean> {
  const tenant = await prisma.crmTenant.findUnique({
    where: { id: tenantId },
    select: { isActive: true, suspendedAt: true },
  })
  if (!tenant) return false
  return tenant.isActive && !tenant.suspendedAt
}

// Helper para tratamento de erro em API routes
export function handleTenantError(error: unknown): Response {
  if (error instanceof TenantError) {
    return Response.json(
      { error: error.message },
      { status: error.statusCode }
    )
  }
  console.error('Erro inesperado no contexto de tenant:', error)
  return Response.json(
    { error: 'Erro interno do servidor' },
    { status: 500 }
  )
}
