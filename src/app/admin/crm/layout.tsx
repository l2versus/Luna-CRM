'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/stores/auth-store'

const CRM_NAV = [
  { href: '/admin/crm/pipeline', label: 'Pipeline', icon: '▦' },
  { href: '/admin/crm/inbox', label: 'Inbox', icon: '◉' },
  { href: '/admin/crm/contacts', label: 'Contatos', icon: '◎' },
  { href: '/admin/crm/intelligence', label: 'Inteligência', icon: '◆' },
  { href: '/admin/crm/automations', label: 'Automações', icon: '⬡' },
  { href: '/admin/crm/reports', label: 'Relatórios', icon: '▤' },
  { href: '/admin/crm/settings', label: 'Configurações', icon: '⚙' },
]

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, loadSession, logout } = useAuthStore()

  useEffect(() => {
    loadSession()
  }, [loadSession])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--luna-bg)' }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{
            borderColor: 'var(--luna-border)',
            borderTopColor: 'var(--luna-gold)',
          }}
        />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--luna-bg)' }}>
      {/* Sidebar */}
      <aside
        className="w-56 shrink-0 flex flex-col h-screen sticky top-0"
        style={{
          background: 'var(--luna-surface)',
          borderRight: '1px solid var(--luna-border)',
        }}
      >
        {/* Logo + tenant */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xl font-display font-bold"
              style={{ color: 'var(--luna-gold)' }}
            >
              Luna
            </span>
            <span
              className="text-[9px] font-medium px-1.5 py-0.5 uppercase tracking-wider"
              style={{
                color: 'var(--luna-text-dim)',
                background: 'var(--luna-surface-2)',
                borderRadius: 'var(--luna-radius-sm)',
              }}
            >
              CRM
            </span>
          </div>
          <p
            className="text-xs truncate"
            style={{ color: 'var(--luna-text-dim)' }}
          >
            {user.tenantName ?? 'Minha clínica'}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-1 space-y-0.5">
          {CRM_NAV.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors no-underline"
                style={{
                  color: isActive ? 'var(--luna-text)' : 'var(--luna-text-muted)',
                  background: isActive ? 'var(--luna-surface-2)' : 'transparent',
                  borderRadius: 'var(--luna-radius-md)',
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                <span className="text-xs opacity-70">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Plan badge */}
        {user.plan && (
          <div
            className="mx-3 mb-3 px-3 py-2"
            style={{
              background: 'var(--luna-gold-subtle)',
              borderRadius: 'var(--luna-radius-md)',
            }}
          >
            <p
              className="text-xs font-medium"
              style={{ color: 'var(--luna-gold)' }}
            >
              Plano {user.plan}
            </p>
            <p
              className="text-[10px] mt-0.5"
              style={{ color: 'var(--luna-text-dim)' }}
            >
              {user.planStatus === 'TRIAL' ? 'Trial ativo' : 'Ativo'}
            </p>
          </div>
        )}

        {/* User */}
        <div
          className="p-3 flex items-center gap-2.5"
          style={{ borderTop: '1px solid var(--luna-border)' }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0"
            style={{
              background: 'var(--luna-gold-subtle)',
              color: 'var(--luna-gold)',
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-[13px] truncate"
              style={{ color: 'var(--luna-text)' }}
            >
              {user.name}
            </p>
          </div>
          <button
            onClick={logout}
            className="text-xs cursor-pointer bg-transparent border-none"
            style={{ color: 'var(--luna-text-dim)' }}
            title="Sair"
          >
            ✕
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0 overflow-auto">{children}</main>
    </div>
  )
}
