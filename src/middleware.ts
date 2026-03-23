import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas totalmente públicas (sem autenticação)
const PUBLIC_PATHS = [
  '/',
  '/api/auth/login',
  '/api/auth/register',
  '/api/webhooks/evolution',
  '/api/webhooks/asaas',
]

// Prefixos públicos (startsWith)
const PUBLIC_PREFIXES = [
  '/api/webhooks/evolution/',
  '/api/webhooks/asaas/',
  '/api/crm/stream',
  '/api/public/',
  '/proposta/',
  '/convite/',
  '/demo',
  '/landing',
  '/login',
  '/_next',
  '/favicon',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas públicas exatas
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  // Prefixos públicos
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // Assets estáticos
  if (
    pathname.includes('.') &&
    !pathname.startsWith('/api/')
  ) {
    return NextResponse.next()
  }

  // Rotas protegidas — verificar token
  const token =
    request.headers.get('authorization')?.replace('Bearer ', '') ??
    request.cookies.get('luna-token')?.value

  if (!token) {
    // API: retorna 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Token de autenticação ausente' },
        { status: 401 }
      )
    }
    // Página: redireciona para login
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
