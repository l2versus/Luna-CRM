'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/auth-store'

interface HqStats {
  totalTenants: number
  activeTenants: number
  totalLeads: number
  totalConversations: number
  mrr: number
  recentTenants: Array<{
    id: string
    name: string
    slug: string
    isActive: boolean
    createdAt: string
    subscription?: {
      status: string
      plan?: { displayName: string }
    }
  }>
}

function StatCard({
  label,
  value,
  prefix,
  delay,
}: {
  label: string
  value: string | number
  prefix?: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="p-5"
      style={{
        background: 'var(--luna-surface)',
        border: '1px solid var(--luna-border)',
        borderRadius: 'var(--luna-radius-lg)',
      }}
    >
      <p
        className="text-xs uppercase tracking-wider mb-2"
        style={{ color: 'var(--luna-text-muted)' }}
      >
        {label}
      </p>
      <p className="text-2xl font-semibold" style={{ color: 'var(--luna-text)' }}>
        {prefix}
        {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
      </p>
    </motion.div>
  )
}

export default function HqDashboard() {
  const { token } = useAuthStore()
  const [stats, setStats] = useState<HqStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    fetch('/api/hq/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [token])

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div
          className="h-8 w-48 rounded animate-pulse"
          style={{ background: 'var(--luna-surface-2)' }}
        />
        <div className="grid grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-xl animate-pulse"
              style={{ background: 'var(--luna-surface)' }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="p-8 max-w-7xl">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-display font-semibold mb-8"
        style={{ color: 'var(--luna-text)' }}
      >
        Luna HQ
      </motion.h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="MRR" value={stats.mrr} prefix="R$ " delay={0.05} />
        <StatCard label="Clientes ativos" value={stats.activeTenants} delay={0.1} />
        <StatCard label="Leads totais" value={stats.totalLeads} delay={0.15} />
        <StatCard label="Conversas" value={stats.totalConversations} delay={0.2} />
      </div>

      {/* Recent tenants */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        style={{
          background: 'var(--luna-surface)',
          border: '1px solid var(--luna-border)',
          borderRadius: 'var(--luna-radius-lg)',
        }}
      >
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--luna-border)' }}
        >
          <h2
            className="text-sm font-medium"
            style={{ color: 'var(--luna-text)' }}
          >
            Clientes recentes
          </h2>
          <span className="text-xs" style={{ color: 'var(--luna-text-dim)' }}>
            {stats.totalTenants} total
          </span>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--luna-border-subtle)' }}>
          {stats.recentTenants.map((tenant) => (
            <div key={tenant.id} className="px-5 py-3 flex items-center gap-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium shrink-0"
                style={{
                  background: 'var(--luna-gold-subtle)',
                  color: 'var(--luna-gold)',
                }}
              >
                {tenant.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm truncate"
                  style={{ color: 'var(--luna-text)' }}
                >
                  {tenant.name}
                </p>
                <p
                  className="text-xs truncate"
                  style={{ color: 'var(--luna-text-dim)' }}
                >
                  {tenant.slug}.lunacrm.com.br
                </p>
              </div>
              <span
                className="text-xs px-2 py-0.5 shrink-0"
                style={{
                  background: tenant.isActive
                    ? 'rgba(46,204,138,0.1)'
                    : 'rgba(255,71,87,0.1)',
                  color: tenant.isActive
                    ? 'var(--luna-success)'
                    : 'var(--luna-error)',
                  borderRadius: 'var(--luna-radius-sm)',
                }}
              >
                {tenant.subscription?.plan?.displayName ?? 'Sem plano'}
              </span>
              <span
                className="text-xs shrink-0"
                style={{ color: 'var(--luna-text-dim)' }}
              >
                {new Date(tenant.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          ))}

          {stats.recentTenants.length === 0 && (
            <div className="px-5 py-12 text-center">
              <p
                className="text-sm mb-1"
                style={{ color: 'var(--luna-text-muted)' }}
              >
                Nenhum cliente ainda
              </p>
              <p className="text-xs" style={{ color: 'var(--luna-text-dim)' }}>
                Os primeiros cadastros aparecerão aqui
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
