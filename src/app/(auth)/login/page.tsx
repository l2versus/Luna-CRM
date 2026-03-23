'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/auth-store'

export default function LoginPage() {
  const router = useRouter()
  const { login, register } = useAuthStore()
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isRegister) {
        await register(name, email, password)
      } else {
        await login(email, password)
      }
      router.push('/admin/crm/pipeline')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--luna-bg)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <h1
            className="text-5xl font-display mb-2"
            style={{ color: 'var(--luna-gold)' }}
          >
            Luna
          </h1>
          <p style={{ color: 'var(--luna-text-muted)', fontSize: '0.95rem' }}>
            CRM premium para clínicas de estética
          </p>
        </div>

        {/* Card */}
        <div
          className="p-8"
          style={{
            background: 'var(--luna-surface)',
            borderRadius: 'var(--luna-radius-lg)',
            border: '1px solid var(--luna-border)',
            boxShadow: 'var(--luna-shadow)',
          }}
        >
          <h2
            className="text-xl font-semibold mb-6"
            style={{ color: 'var(--luna-text)' }}
          >
            {isRegister ? 'Criar conta' : 'Entrar'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label
                  className="block text-sm mb-1.5"
                  style={{ color: 'var(--luna-text-muted)' }}
                >
                  Nome da clínica
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Clínica Exemplo"
                  required
                  className="w-full px-4 py-2.5 text-sm outline-none transition-colors"
                  style={{
                    background: 'var(--luna-surface-2)',
                    border: '1px solid var(--luna-border)',
                    borderRadius: 'var(--luna-radius-md)',
                    color: 'var(--luna-text)',
                  }}
                />
              </div>
            )}

            <div>
              <label
                className="block text-sm mb-1.5"
                style={{ color: 'var(--luna-text-muted)' }}
              >
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@clinica.com"
                required
                className="w-full px-4 py-2.5 text-sm outline-none transition-colors"
                style={{
                  background: 'var(--luna-surface-2)',
                  border: '1px solid var(--luna-border)',
                  borderRadius: 'var(--luna-radius-md)',
                  color: 'var(--luna-text)',
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm mb-1.5"
                style={{ color: 'var(--luna-text-muted)' }}
              >
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRegister ? 'Mínimo 8 caracteres' : '••••••••'}
                required
                minLength={isRegister ? 8 : undefined}
                className="w-full px-4 py-2.5 text-sm outline-none transition-colors"
                style={{
                  background: 'var(--luna-surface-2)',
                  border: '1px solid var(--luna-border)',
                  borderRadius: 'var(--luna-radius-md)',
                  color: 'var(--luna-text)',
                }}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-medium transition-all cursor-pointer disabled:opacity-50"
              style={{
                background: 'var(--luna-gold)',
                color: '#0A0A0B',
                borderRadius: 'var(--luna-radius-md)',
                border: 'none',
              }}
            >
              {loading
                ? 'Aguarde...'
                : isRegister
                  ? 'Criar conta grátis'
                  : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister)
                setError('')
              }}
              className="text-sm cursor-pointer bg-transparent border-none"
              style={{ color: 'var(--luna-gold)' }}
            >
              {isRegister
                ? 'Já tem conta? Entrar'
                : 'Não tem conta? Criar grátis'}
            </button>
          </div>
        </div>

        <p
          className="text-center mt-6 text-xs"
          style={{ color: 'var(--luna-text-dim)' }}
        >
          14 dias grátis · Sem cartão de crédito
        </p>
      </motion.div>
    </main>
  )
}
