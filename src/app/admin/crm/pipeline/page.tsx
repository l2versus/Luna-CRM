'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/auth-store'
import { useCrmStore } from '@/stores/crm-store'
import StageColumn from '@/components/crm/StageColumn'
import NewLeadModal from '@/components/crm/NewLeadModal'
import { moveLead } from '@/../actions/crm/move-lead'

export default function PipelinePage() {
  const { token, user } = useAuthStore()
  const { pipeline, pipelines, stages, isLoading, error, fetchPipeline, moveLeadOptimistic } =
    useCrmStore()
  const [showNewLead, setShowNewLead] = useState(false)
  const [selectedPipelineId, setSelectedPipelineId] = useState<string | undefined>()

  // Drag state
  const dragRef = useRef<{ leadId: string; sourceStageId: string } | null>(null)

  useEffect(() => {
    if (token) fetchPipeline(token, selectedPipelineId)
  }, [token, selectedPipelineId, fetchPipeline])

  const handleDragStart = useCallback((leadId: string, stageId: string) => {
    dragRef.current = { leadId, sourceStageId: stageId }
  }, [])

  const handleDrop = useCallback(
    async (targetStageId: string) => {
      if (!dragRef.current || !user?.tenantId || !user?.id) return
      const { leadId, sourceStageId } = dragRef.current
      dragRef.current = null

      if (sourceStageId === targetStageId) return

      // Calcular posição: último do target + 65536
      const targetStage = stages.find((s) => s.id === targetStageId)
      const lastPos = targetStage?.leads.at(-1)?.position ?? 0
      const newPosition = lastPos + 65536

      // Optimistic update
      moveLeadOptimistic(leadId, sourceStageId, targetStageId, newPosition)

      // Server action
      try {
        await moveLead({
          leadId,
          targetStageId,
          position: newPosition,
          tenantId: user.tenantId,
          userId: user.id,
        })
      } catch (err) {
        console.error('Move failed:', err)
        // Refetch on error
        if (token) fetchPipeline(token, selectedPipelineId)
      }
    },
    [stages, user, token, selectedPipelineId, moveLeadOptimistic, fetchPipeline]
  )

  // Total pipeline value
  const totalValue = stages.reduce(
    (sum, s) => sum + s.leads.reduce((ssum, l) => ssum + (l.expectedValue ?? 0), 0),
    0
  )
  const totalLeads = stages.reduce((sum, s) => sum + s.leads.length, 0)

  if (isLoading) {
    return (
      <div className="p-6">
        {/* Skeleton header */}
        <div className="flex items-center justify-between mb-6">
          <div
            className="h-8 w-48 rounded animate-pulse"
            style={{ background: 'var(--luna-surface-2)' }}
          />
          <div
            className="h-9 w-28 rounded animate-pulse"
            style={{ background: 'var(--luna-surface-2)' }}
          />
        </div>
        {/* Skeleton columns */}
        <div className="flex gap-3 overflow-x-auto">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[280px] w-[280px] shrink-0">
              <div
                className="h-5 w-24 mb-3 rounded animate-pulse"
                style={{ background: 'var(--luna-surface-2)' }}
              />
              {[0, 1, 2].map((j) => (
                <div
                  key={j}
                  className="h-24 mb-2 rounded-xl animate-pulse"
                  style={{ background: 'var(--luna-surface)' }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-sm mb-3" style={{ color: 'var(--luna-error)' }}>
            {error}
          </p>
          <button
            onClick={() => token && fetchPipeline(token, selectedPipelineId)}
            className="text-sm px-4 py-2 cursor-pointer border-none"
            style={{
              background: 'var(--luna-surface)',
              color: 'var(--luna-text-muted)',
              borderRadius: 'var(--luna-radius-md)',
            }}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-4 flex items-center justify-between shrink-0"
        style={{ borderBottom: '1px solid var(--luna-border)' }}
      >
        <div className="flex items-center gap-4">
          {/* Pipeline selector */}
          {pipelines.length > 1 ? (
            <select
              value={pipeline?.id}
              onChange={(e) => setSelectedPipelineId(e.target.value)}
              className="text-lg font-display font-semibold outline-none cursor-pointer bg-transparent border-none"
              style={{ color: 'var(--luna-text)' }}
            >
              {pipelines.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          ) : (
            <h1
              className="text-lg font-display font-semibold"
              style={{ color: 'var(--luna-text)' }}
            >
              {pipeline?.name ?? 'Pipeline'}
            </h1>
          )}

          {/* Stats */}
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: 'var(--luna-text-dim)' }}>
              {totalLeads} leads
            </span>
            {totalValue > 0 && (
              <span className="text-xs" style={{ color: 'var(--luna-gold)' }}>
                R$ {totalValue.toLocaleString('pt-BR')}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowNewLead(true)}
          className="px-4 py-2 text-sm font-medium cursor-pointer border-none"
          style={{
            background: 'var(--luna-gold)',
            color: '#0A0A0B',
            borderRadius: 'var(--luna-radius-md)',
          }}
        >
          + Novo lead
        </button>
      </motion.div>

      {/* Kanban board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-1 p-4 h-full min-w-max">
          {stages.map((stage, i) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="h-full"
            >
              <StageColumn
                stage={stage}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* New lead modal */}
      {showNewLead && (
        <NewLeadModal
          stages={stages}
          onClose={() => setShowNewLead(false)}
        />
      )}
    </div>
  )
}
