import { prisma } from '@/lib/prisma'
import { comparePassword, generateToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json(
        { error: 'E-mail e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        teamMemberships: {
          where: { isActive: true },
          include: { tenant: { select: { id: true, name: true, slug: true, isActive: true } } },
          take: 1,
        },
      },
    })

    if (!user || !user.isActive) {
      return Response.json(
        { error: 'E-mail ou senha inválidos' },
        { status: 401 }
      )
    }

    const valid = await comparePassword(password, user.password)
    if (!valid) {
      return Response.json(
        { error: 'E-mail ou senha inválidos' },
        { status: 401 }
      )
    }

    // Resolver tenantId e teamRole
    const membership = user.teamMemberships[0]
    const tenantId = membership?.tenant?.isActive ? membership.tenant.id : undefined
    const teamRole = membership?.role

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId,
      teamRole,
    })

    return Response.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        tenantId,
        teamRole,
        tenantName: membership?.tenant?.name,
        tenantSlug: membership?.tenant?.slug,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return Response.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
