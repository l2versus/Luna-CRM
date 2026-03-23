'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/stores/auth-store'

const NAV_ITEMS = [
  { href: '/admin/hq', label: 'Dashboard', icon: '◆' },
  { href: '/admin/hq/clients', label: 'Clientes', icon: '◈' },
  { href: '/admin/hq/billing', label: 'Financeiro', icon: '◇' },
  { href: '/admin/hq/settings', label: 'Configurações', icon: '◎' },
]

export default function HqLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, loadSession } = useAuthStore()

  useEffect(() => {
    loadSession()
  }, [loadSession])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'SUPER_ADMIN')) {
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

  if (!user || user.role !== 'SUPER_ADMIN') return null

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--luna-bg)' }}>
      {/* Sidebar */}
      <aside
        className="w-60 shrink-0 flex flex-col h-screen sticky top-0"
        style={{
          background: 'var(--luna-surface)',
          borderRight: '1px solid var(--luna-border)',
        }}
      >
        {/* Logo */}
        <div className="p-5 flex items-center gap-3">
          <span
            className="text-2xl font-display font-bold"
            style={{ color: 'var(--luna-gold)' }}
          >
            Luna
          </span>
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 uppercase tracking-wider"
            style={{
              color: 'var(--luna-gold)',
              background: 'var(--luna-gold-subtle)',
              borderRadius: 'var(--luna-radius-sm)',
            }}
          >
            HQ
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/admin/hq'
                ? pathname === '/admin/hq'
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-sm transition-colors no-underline"
                style={{
                  color: isActive ? 'var(--luna-text)' : 'var(--luna-text-muted)',
                  background: isActive ? 'var(--luna-surface-2)' : 'transparent',
                  borderRadius: 'var(--luna-radius-md)',
                }}
              >
                <span className="text-xs">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div
          className="p-4 flex items-center gap-3"
          style={{ borderTop: '1px solid var(--luna-border)' }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
            style={{
              background: 'var(--luna-gold-subtle)',
              color: 'var(--luna-gold)',
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-sm truncate"
              style={{ color: 'var(--luna-text)' }}
            >
              {user.name}
            </p>
            <p
              className="text-xs truncate"
              style={{ color: 'var(--luna-text-dim)' }}
            >
              Super Admin
            </p>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0 overflow-auto">{children}</main>
    </div>
  )
}
