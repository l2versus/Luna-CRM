import { create } from 'zustand'

export interface LeadCard {
  id: string
  name: string
  phone: string
  email?: string | null
  status: string
  stageId: string
  position: number
  expectedValue?: number | null
  aiScore?: number | null
  aiScoreLabel?: string | null
  churnRisk?: number | null
  bestContactDays?: string | null
  bestContactHours?: string | null
  bestContactBasis?: number | null
  source?: string | null
  tags: string[]
  lastInteractionAt?: string | null
  createdAt: string
}

export interface StageColumn {
  id: string
  name: string
  type: string
  order: number
  color?: string | null
  cachedLeadCount: number
  cachedTotalValue: number
  leads: LeadCard[]
}

export interface PipelineInfo {
  id: string
  name: string
  isDefault: boolean
}

interface CrmState {
  pipeline: PipelineInfo | null
  pipelines: PipelineInfo[]
  stages: StageColumn[]
  isLoading: boolean
  error: string | null

  fetchPipeline: (token: string, pipelineId?: string) => Promise<void>
  moveLeadOptimistic: (
    leadId: string,
    sourceStageId: string,
    targetStageId: string,
    newPosition: number
  ) => void
  addLeadOptimistic: (lead: LeadCard) => void
}

export const useCrmStore = create<CrmState>((set, get) => ({
  pipeline: null,
  pipelines: [],
  stages: [],
  isLoading: true,
  error: null,

  fetchPipeline: async (token, pipelineId) => {
    set({ isLoading: true, error: null })
    try {
      const params = pipelineId ? `?pipelineId=${pipelineId}` : ''
      const res = await fetch(`/api/crm/pipeline${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Erro ao carregar pipeline')
      const data = await res.json()
      set({
        pipeline: data.pipeline,
        pipelines: data.pipelines,
        stages: data.stages,
        isLoading: false,
      })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Erro desconhecido',
        isLoading: false,
      })
    }
  },

  moveLeadOptimistic: (leadId, sourceStageId, targetStageId, newPosition) => {
    set((state) => {
      const stages = state.stages.map((s) => ({ ...s, leads: [...s.leads] }))

      // Encontrar e remover lead do source
      const sourceStage = stages.find((s) => s.id === sourceStageId)
      if (!sourceStage) return state

      const leadIndex = sourceStage.leads.findIndex((l) => l.id === leadId)
      if (leadIndex === -1) return state

      const lead = { ...sourceStage.leads[leadIndex], stageId: targetStageId, position: newPosition }
      sourceStage.leads.splice(leadIndex, 1)

      // Atualizar contadores do source
      sourceStage.cachedLeadCount = sourceStage.leads.length
      sourceStage.cachedTotalValue = sourceStage.leads.reduce(
        (sum, l) => sum + (l.expectedValue ?? 0),
        0
      )

      // Adicionar no target
      const targetStage = stages.find((s) => s.id === targetStageId)
      if (!targetStage) return state

      targetStage.leads.push(lead)
      targetStage.leads.sort((a, b) => a.position - b.position)

      // Atualizar contadores do target
      targetStage.cachedLeadCount = targetStage.leads.length
      targetStage.cachedTotalValue = targetStage.leads.reduce(
        (sum, l) => sum + (l.expectedValue ?? 0),
        0
      )

      return { stages }
    })
  },

  addLeadOptimistic: (lead) => {
    set((state) => {
      const stages = state.stages.map((s) =>
        s.id === lead.stageId
          ? {
              ...s,
              leads: [...s.leads, lead].sort((a, b) => a.position - b.position),
              cachedLeadCount: s.cachedLeadCount + 1,
              cachedTotalValue: s.cachedTotalValue + (lead.expectedValue ?? 0),
            }
          : s
      )
      return { stages }
    })
  },
}))
