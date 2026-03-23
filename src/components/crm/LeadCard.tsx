'use client'

import { motion } from 'framer-motion'
import type { LeadCard as LeadCardType } from '@/stores/crm-store'

const STATUS_COLORS: Record<string, string> = {
  COLD: 'var(--luna-cold)',
  WARM: 'var(--luna-warm)',
  HOT: 'var(--luna-hot)',
  WON: 'var(--luna-won)',
  LOST: 'var(--luna-lost)',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Hoje'
  if (days === 1) return 'Ontem'
  if (days < 30) return `${days}d atrás`
  if (days < 365) return `${Math.floor(days / 30)}m atrás`
  return `${Math.floor(days / 365)}a atrás`
}

export default function LeadCard({
  lead,
  onClick,
}: {
  lead: LeadCardType
  onClick?: () => void
}) {
  const statusColor = STATUS_COLORS[lead.status] ?? 'var(--luna-text-dim)'

  return (
    <motion.div
      layout
      layoutId={lead.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: 'var(--luna-shadow-hover)' }}
      whileTap={{ scale: 0.98, rotate: 1.5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 1.2 }}
      onClick={onClick}
      className="cursor-pointer p-3.5 select-none"
      style={{
        background: 'var(--luna-surface)',
        border: '1px solid var(--luna-border)',
        borderRadius: 'var(--luna-radius-lg)',
        boxShadow: 'var(--luna-shadow)',
      }}
    >
      {/* Header: status dot + name + badge */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: statusColor }}
        />
        <p
          className="text-sm font-medium truncate flex-1"
          style={{ color: 'var(--luna-text)' }}
        >
          {lead.name}
        </p>
        {lead.status === 'HOT' && (
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 uppercase"
            style={{
              color: 'var(--luna-hot)',
              background: 'rgba(255,107,74,0.12)',
              borderRadius: 'var(--luna-radius-sm)',
            }}
          >
            HOT
          </span>
        )}
      </div>

      {/* Tags */}
      {lead.tags.length > 0 && (
        <div className="flex gap-1 flex-wrap mb-2">
          {lead.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5"
              style={{
                background: 'var(--luna-surface-2)',
                color: 'var(--luna-text-muted)',
                borderRadius: 'var(--luna-radius-sm)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Value + AI Score */}
      <div className="flex items-center gap-3 mb-2">
        {lead.expectedValue != null && lead.expectedValue > 0 && (
          <span className="text-xs" style={{ color: 'var(--luna-gold)' }}>
            R$ {lead.expectedValue.toLocaleString('pt-BR')}
          </span>
        )}
        {lead.aiScore != null && (
          <span className="text-xs" style={{ color: 'var(--luna-text-muted)' }}>
            Score {Math.round(lead.aiScore)}
          </span>
        )}
      </div>

      {/* Golden Window */}
      {lead.bestContactDays && lead.bestContactHours && (
        <div
          className="text-[10px] px-2 py-1 mb-2"
          style={{
            background: 'var(--luna-gold-subtle)',
            color: 'var(--luna-gold)',
            borderRadius: 'var(--luna-radius-sm)',
          }}
        >
          Janela: {lead.bestContactDays} · {lead.bestContactHours}
          {lead.bestContactBasis != null && (
            <span style={{ color: 'var(--luna-text-dim)' }}>
              {' '}
              ({lead.bestContactBasis} conversões)
            </span>
          )}
        </div>
      )}

      {/* Footer: time + source */}
      <div className="flex items-center justify-between">
        <span className="text-[10px]" style={{ color: 'var(--luna-text-dim)' }}>
          {timeAgo(lead.createdAt)}
        </span>
        {lead.source && (
          <span className="text-[10px]" style={{ color: 'var(--luna-text-dim)' }}>
            {lead.source}
          </span>
        )}
      </div>
    </motion.div>
  )
}
