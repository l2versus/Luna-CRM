'use client'

import { AnimatePresence } from 'framer-motion'
import type { StageColumn as StageColumnType } from '@/stores/crm-store'
import LeadCard from './LeadCard'

export default function StageColumn({
  stage,
  onLeadClick,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  stage: StageColumnType
  onLeadClick?: (leadId: string) => void
  onDragStart?: (leadId: string, stageId: string) => void
  onDragOver?: (e: React.DragEvent) => void
  onDrop?: (stageId: string) => void
}) {
  const totalValue = stage.leads.reduce(
    (sum, l) => sum + (l.expectedValue ?? 0),
    0
  )

  return (
    <div
      className="flex flex-col h-full min-w-[280px] w-[280px] shrink-0"
      onDragOver={(e) => {
        e.preventDefault()
        onDragOver?.(e)
      }}
      onDrop={() => onDrop?.(stage.id)}
    >
      {/* Header */}
      <div className="px-3 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: stage.color ?? 'var(--luna-text-dim)' }}
          />
          <span
            className="text-[13px] font-medium"
            style={{ color: 'var(--luna-text)' }}
          >
            {stage.name}
          </span>
          <span
            className="text-[11px] px-1.5 py-0.5"
            style={{
              background: 'var(--luna-surface-2)',
              color: 'var(--luna-text-dim)',
              borderRadius: 'var(--luna-radius-sm)',
            }}
          >
            {stage.leads.length}
          </span>
        </div>
        {totalValue > 0 && (
          <span className="text-[11px]" style={{ color: 'var(--luna-text-dim)' }}>
            R$ {totalValue.toLocaleString('pt-BR')}
          </span>
        )}
      </div>

      {/* Cards */}
      <div
        className="flex-1 overflow-y-auto px-2 pb-2 space-y-2"
        style={{
          minHeight: 100,
        }}
      >
        <AnimatePresence mode="popLayout">
          {stage.leads.map((lead) => (
            <div
              key={lead.id}
              draggable
              onDragStart={() => onDragStart?.(lead.id, stage.id)}
            >
              <LeadCard
                lead={lead}
                onClick={() => onLeadClick?.(lead.id)}
              />
            </div>
          ))}
        </AnimatePresence>

        {stage.leads.length === 0 && (
          <div
            className="flex items-center justify-center py-8 text-xs"
            style={{
              color: 'var(--luna-text-dim)',
              border: '1px dashed var(--luna-border)',
              borderRadius: 'var(--luna-radius-md)',
            }}
          >
            Arraste leads aqui
          </div>
        )}
      </div>
    </div>
  )
}
