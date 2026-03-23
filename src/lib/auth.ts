import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = '7d'

// Payload do JWT — multi-tenant
export interface TokenPayload {
  userId: string
  email: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'PATIENT'
  tenantId?: string
  teamRole?: 'OWNER' | 'ADMIN' | 'MANAGER' | 'AGENT'
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Extrair token do header Authorization
export function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  return authHeader.slice(7)
}

// Verificar autenticação de uma request
export function authenticateRequest(request: Request): TokenPayload | null {
  const token = extractToken(request)
  if (!token) return null
  return verifyToken(token)
}

// Verificar se é SUPER_ADMIN
export function isSuperAdmin(payload: TokenPayload): boolean {
  return payload.role === 'SUPER_ADMIN'
}

// Verificar se é admin do tenant (qualquer teamRole)
export function isTenantAdmin(payload: TokenPayload): boolean {
  return payload.role === 'ADMIN' && !!payload.tenantId
}

// Verificar se é owner do tenant
export function isTenantOwner(payload: TokenPayload): boolean {
  return payload.role === 'ADMIN' && payload.teamRole === 'OWNER'
}
