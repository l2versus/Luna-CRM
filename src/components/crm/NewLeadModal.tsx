'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/auth-store'
import { useCrmStore, type StageColumn } from '@/stores/crm-store'

export default function NewLeadModal({
  stages,
  onClose,
}: {
  stages: StageColumn[]
  onClose: () => void
}) {
  const { token } = useAuthStore()
  const { addLeadOptimistic } = useCrmStore()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    source: '',
    expectedValue: '',
    tags: '',
    stageId: stages.find((s) => s.type === 'OPEN')?.id ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          source: form.source.trim() || undefined,
          expectedValue: form.expectedValue ? parseFloat(form.expectedValue) : undefined,
          tags: form.tags
            ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
            : [],
          stageId: form.stageId || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      addLeadOptimistic({
        ...data,
        createdAt: data.createdAt ?? new Date().toISOString(),
        tags: data.tags ?? [],
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar lead')
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
          Novo lead
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Nome *"
              value={form.name}
              onChange={(v) => update('name', v)}
              required
            />
            <Field
              label="Telefone *"
              value={form.phone}
              onChange={(v) => update('phone', v)}
              required
              placeholder="5511999999999"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="E-mail"
              value={form.email}
              onChange={(v) => update('email', v)}
              type="email"
            />
            <Field
              label="Valor esperado (R$)"
              value={form.expectedValue}
              onChange={(v) => update('expectedValue', v)}
              type="number"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Origem"
              value={form.source}
              onChange={(v) => update('source', v)}
              placeholder="Instagram, Google, Indicação..."
            />
            <Field
              label="Tags (separar por vírgula)"
              value={form.tags}
              onChange={(v) => update('tags', v)}
              placeholder="botox, harmonização"
            />
          </div>

          <div>
            <label
              className="block text-xs mb-1.5"
              style={{ color: 'var(--luna-text-muted)' }}
            >
              Estágio
            </label>
            <select
              value={form.stageId}
              onChange={(e) => update('stageId', e.target.value)}
              className="w-full px-3 py-2 text-sm outline-none cursor-pointer"
              style={{
                background: 'var(--luna-surface-2)',
                border: '1px solid var(--luna-border)',
                borderRadius: 'var(--luna-radius-md)',
                color: 'var(--luna-text)',
              }}
            >
              {stages
                .filter((s) => s.type === 'OPEN')
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
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
              {saving ? 'Criando...' : 'Criar lead'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  placeholder?: string
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
        placeholder={placeholder}
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
