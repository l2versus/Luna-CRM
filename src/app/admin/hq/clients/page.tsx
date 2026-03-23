'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/auth-store'

interface Tenant {
  id: string
  name: string
  slug: string
  isActive: boolean
  createdAt: string
  plan: string
  planPrice: number
  subscriptionStatus: string
  leads: number
  conversations: number
  teamMembers: number
}

interface TenantsResponse {
  tenants: Tenant[]
  total: number
  page: number
  totalPages: number
}

export default function HqClientsPage() {
  const { token } = useAuthStore()
  const [data, setData] = useState<TenantsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)

  const fetchTenants = useCallback(async () => {
    if (!token) return
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (search) params.set('search', search)

    const res = await fetch(`/api/hq/tenants?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const json = await res.json()
    setData(json)
    setLoading(false)
  }, [token, page, search])

  useEffect(() => {
    fetchTenants()
  }, [fetchTenants])

  const statusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'var(--luna-success)'
      case 'TRIAL': return 'var(--luna-info)'
      case 'PAST_DUE': return 'var(--luna-warning)'
      case 'SUSPENDED': case 'CANCELLED': return 'var(--luna-error)'
      default: return 'var(--luna-text-dim)'
    }
  }

  const statusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Ativo'
      case 'TRIAL': return 'Trial'
      case 'PAST_DUE': return 'Inadimplente'
      case 'SUSPENDED': return 'Suspenso'
      case 'CANCELLED': return 'Cancelado'
      default: return 'Sem plano'
    }
  }

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-2xl font-display font-semibold"
          style={{ color: 'var(--luna-text)' }}
        >
          Clientes
        </h1>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 text-sm font-medium cursor-pointer border-none"
          style={{
            background: 'var(--luna-gold)',
            color: '#0A0A0B',
            borderRadius: 'var(--luna-radius-md)',
          }}
        >
          + Novo cliente
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nome ou slug..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="w-full max-w-md px-4 py-2.5 text-sm outline-none"
          style={{
            background: 'var(--luna-surface)',
            border: '1px solid var(--luna-border)',
            borderRadius: 'var(--luna-radius-md)',
            color: 'var(--luna-text)',
          }}
        />
      </div>

      {/* Table */}
      <div
        className="overflow-hidden"
        style={{
          background: 'var(--luna-surface)',
          border: '1px solid var(--luna-border)',
          borderRadius: 'var(--luna-radius-lg)',
        }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--luna-border)' }}>
              {['Cliente', 'Plano', 'Status', 'Leads', 'Equipe', 'Criado'].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-xs uppercase tracking-wider font-medium"
                    style={{ color: 'var(--luna-text-dim)' }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} className="px-5 py-3">
                    <div
                      className="h-5 rounded animate-pulse"
                      style={{
                        background: 'var(--luna-surface-2)',
                        width: `${60 + Math.random() * 30}%`,
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : data?.tenants.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center text-sm"
                  style={{ color: 'var(--luna-text-muted)' }}
                >
                  {search ? 'Nenhum resultado' : 'Nenhum cliente cadastrado'}
                </td>
              </tr>
            ) : (
              data?.tenants.map((t, i) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: '1px solid var(--luna-border-subtle)' }}
                  className="hover:bg-[var(--luna-surface-2)] transition-colors"
                >
                  <td className="px-5 py-3">
                    <p className="text-sm" style={{ color: 'var(--luna-text)' }}>
                      {t.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--luna-text-dim)' }}>
                      {t.slug}
                    </p>
                  </td>
                  <td
                    className="px-5 py-3 text-sm"
                    style={{ color: 'var(--luna-text-muted)' }}
                  >
                    {t.plan}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="text-xs px-2 py-0.5 font-medium"
                      style={{
                        color: statusColor(t.subscriptionStatus),
                        background: `color-mix(in srgb, ${statusColor(t.subscriptionStatus)} 12%, transparent)`,
                        borderRadius: 'var(--luna-radius-sm)',
                      }}
                    >
                      {statusLabel(t.subscriptionStatus)}
                    </span>
                  </td>
                  <td
                    className="px-5 py-3 text-sm"
                    style={{ color: 'var(--luna-text-muted)' }}
                  >
                    {t.leads}
                  </td>
                  <td
                    className="px-5 py-3 text-sm"
                    style={{ color: 'var(--luna-text-muted)' }}
                  >
                    {t.teamMembers}
                  </td>
                  <td
                    className="px-5 py-3 text-sm"
                    style={{ color: 'var(--luna-text-dim)' }}
                  >
                    {new Date(t.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 text-xs cursor-pointer border-none disabled:opacity-30"
            style={{
              background: 'var(--luna-surface)',
              color: 'var(--luna-text-muted)',
              borderRadius: 'var(--luna-radius-sm)',
            }}
          >
            Anterior
          </button>
          <span className="text-xs" style={{ color: 'var(--luna-text-dim)' }}>
            {page} / {data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page >= data.totalPages}
            className="px-3 py-1.5 text-xs cursor-pointer border-none disabled:opacity-30"
            style={{
              background: 'var(--luna-surface)',
              color: 'var(--luna-text-muted)',
              borderRadius: 'var(--luna-radius-sm)',
            }}
          >
            Próxima
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <CreateTenantModal
          token={token}
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false)
            fetchTenants()
          }}
        />
      )}
    </div>
  )
}

function CreateTenantModal({
  token,
  onClose,
  onCreated,
}: {
  token: string | null
  onClose: () => void
  onCreated: () => void
}) {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    planName: 'starter',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function updateField(field: string, value: string) {
    setForm((f) => ({
      ...f,
      [field]: value,
      ...(field === 'name'
        ? {
            slug: value
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')
              .slice(0, 50),
          }
        : {}),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const res = await fetch('/api/hq/tenants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg p-6"
        style={{
          background: 'var(--luna-surface)',
          border: '1px solid var(--luna-border)',
          borderRadius: 'var(--luna-radius-lg)',
          boxShadow: 'var(--luna-shadow-hover)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="text-lg font-semibold mb-5"
          style={{ color: 'var(--luna-text)' }}
        >
          Novo cliente
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Nome da clínica"
              value={form.name}
              onChange={(v) => updateField('name', v)}
              required
            />
            <InputField
              label="Slug"
              value={form.slug}
              onChange={(v) => updateField('slug', v)}
              required
            />
          </div>

          <div>
            <label
              className="block text-xs mb-1.5"
              style={{ color: 'var(--luna-text-muted)' }}
            >
              Plano
            </label>
            <select
              value={form.planName}
              onChange={(e) => updateField('planName', e.target.value)}
              className="w-full px-3 py-2 text-sm outline-none cursor-pointer"
              style={{
                background: 'var(--luna-surface-2)',
                border: '1px solid var(--luna-border)',
                borderRadius: 'var(--luna-radius-md)',
                color: 'var(--luna-text)',
              }}
            >
              <option value="starter">Starter — R$ 197/mês</option>
              <option value="pro">Pro — R$ 397/mês</option>
              <option value="enterprise">Enterprise — R$ 797/mês</option>
            </select>
          </div>

          <hr style={{ borderColor: 'var(--luna-border)' }} />

          <p className="text-xs" style={{ color: 'var(--luna-text-dim)' }}>
            Conta do proprietário
          </p>

          <InputField
            label="Nome"
            value={form.ownerName}
            onChange={(v) => updateField('ownerName', v)}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="E-mail"
              value={form.ownerEmail}
              onChange={(v) => updateField('ownerEmail', v)}
              type="email"
              required
            />
            <InputField
              label="Senha"
              value={form.ownerPassword}
              onChange={(v) => updateField('ownerPassword', v)}
              type="password"
              required
            />
          </div>

          {error && (
            <p
              className="text-sm py-2 px-3"
              style={{
                color: 'var(--luna-error)',
                background: 'rgba(255,71,87,0.08)',
                borderRadius: 'var(--luna-radius-sm)',
              }}
            >
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm cursor-pointer border-none"
              style={{
                background: 'var(--luna-surface-2)',
                color: 'var(--luna-text-muted)',
                borderRadius: 'var(--luna-radius-md)',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium cursor-pointer border-none disabled:opacity-50"
              style={{
                background: 'var(--luna-gold)',
                color: '#0A0A0B',
                borderRadius: 'var(--luna-radius-md)',
              }}
            >
              {saving ? 'Criando...' : 'Criar cliente'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function InputField({
  label,
  value,
  onChange,
  type = 'text',
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label
        className="block text-xs mb-1.5"
        style={{ color: 'var(--luna-text-muted)' }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 text-sm outline-none"
        style={{
          background: 'var(--luna-surface-2)',
          border: '1px solid var(--luna-border)',
          borderRadius: 'var(--luna-radius-md)',
          color: 'var(--luna-text)',
        }}
      />
    </div>
  )
}
