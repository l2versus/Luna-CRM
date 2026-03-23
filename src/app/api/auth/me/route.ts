import { authenticateRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const payload = authenticateRequest(request)
  if (!payload) {
    return Response.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      teamMemberships: {
        where: { isActive: true },
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              slug: true,
              isActive: true,
              subscription: { include: { plan: true } },
            },
          },
        },
      },
    },
  })

  if (!user || !user) {
    return Response.json({ error: 'Usuário não encontrado' }, { status: 404 })
  }

  const membership = user.teamMemberships[0]

  return Response.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      tenantId: membership?.tenant?.id,
      teamRole: membership?.role,
      tenantName: membership?.tenant?.name,
      tenantSlug: membership?.tenant?.slug,
      plan: membership?.tenant?.subscription?.plan?.displayName,
      planStatus: membership?.tenant?.subscription?.status,
    },
  })
}
