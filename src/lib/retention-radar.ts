/**
 * RADAR DE RETENÇÃO BIOLÓGICO — KILLER FEATURE
 *
 * Sabe quando cada procedimento vence e alerta a clínica ANTES
 * da paciente sumir. Único no mercado brasileiro.
 *
 * Risk levels:
 *   SAFE     → dentro do ciclo normal
 *   WATCH    → janela de reativação iniciou
 *   RISK     → metade da janela
 *   CRITICAL → fim da janela
 *   CHURN    → ultrapassou sem retorno
 */

export interface RetentionCycleConfig {
  procedureName: string
  followUpDays: number
  returnDays: number
  reactivationStart: number
  reactivationEnd: number
}

export type RiskLevel = 'SAFE' | 'WATCH' | 'RISK' | 'CRITICAL' | 'CHURN'

export interface RetentionAnalysis {
  procedureName: string
  procedureDate: Date
  returnDueDate: Date
  daysSinceProcedure: number
  daysUntilReturn: number
  riskLevel: RiskLevel
  riskScore: number // 0-100
  shouldFollowUp: boolean
  shouldReactivate: boolean
  reactivationWindow: { start: Date; end: Date }
}

// Ciclos padrão — clínica pode customizar via RetentionCycle model
export const DEFAULT_CYCLES: RetentionCycleConfig[] = [
  { procedureName: 'Botox', followUpDays: 15, returnDays: 120, reactivationStart: 90, reactivationEnd: 135 },
  { procedureName: 'Preenchimento Labial', followUpDays: 7, returnDays: 270, reactivationStart: 240, reactivationEnd: 300 },
  { procedureName: 'Harmonização Facial', followUpDays: 15, returnDays: 180, reactivationStart: 150, reactivationEnd: 210 },
  { procedureName: 'Bioestimuladores', followUpDays: 30, returnDays: 180, reactivationStart: 150, reactivationEnd: 210 },
  { procedureName: 'Skinbooster', followUpDays: 7, returnDays: 90, reactivationStart: 75, reactivationEnd: 105 },
  { procedureName: 'Peeling Químico', followUpDays: 7, returnDays: 90, reactivationStart: 75, reactivationEnd: 105 },
  { procedureName: 'Microagulhamento', followUpDays: 30, returnDays: 90, reactivationStart: 75, reactivationEnd: 105 },
  { procedureName: 'Limpeza de Pele', followUpDays: 3, returnDays: 30, reactivationStart: 25, reactivationEnd: 40 },
  { procedureName: 'Drenagem Linfática', followUpDays: 1, returnDays: 7, reactivationStart: 5, reactivationEnd: 10 },
  { procedureName: 'Criolipólise', followUpDays: 15, returnDays: 180, reactivationStart: 150, reactivationEnd: 210 },
  { procedureName: 'Laser CO2', followUpDays: 30, returnDays: 365, reactivationStart: 300, reactivationEnd: 400 },
  { procedureName: 'Fios de PDO', followUpDays: 7, returnDays: 180, reactivationStart: 150, reactivationEnd: 210 },
  { procedureName: 'Enzimas (Lipólise)', followUpDays: 3, returnDays: 21, reactivationStart: 18, reactivationEnd: 28 },
  { procedureName: 'Sculptra', followUpDays: 30, returnDays: 730, reactivationStart: 670, reactivationEnd: 760 },
]

// Calcula dias entre duas datas
function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

// Adiciona dias a uma data
function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Analisa o risco de retenção para um procedimento
export function analyzeRetention(
  procedureDate: Date,
  cycle: RetentionCycleConfig,
  now: Date = new Date()
): RetentionAnalysis {
  const daysSince = daysBetween(procedureDate, now)
  const returnDueDate = addDays(procedureDate, cycle.returnDays)
  const daysUntilReturn = daysBetween(now, returnDueDate)

  const reactivationWindow = {
    start: addDays(procedureDate, cycle.reactivationStart),
    end: addDays(procedureDate, cycle.reactivationEnd),
  }

  // Calcular risk level
  let riskLevel: RiskLevel
  let riskScore: number

  if (daysSince < cycle.reactivationStart) {
    // Antes da janela de reativação
    riskLevel = 'SAFE'
    riskScore = Math.round((daysSince / cycle.reactivationStart) * 30) // 0-30
  } else if (daysSince < cycle.returnDays) {
    // Dentro da janela, antes do vencimento
    riskLevel = 'WATCH'
    const progress = (daysSince - cycle.reactivationStart) / (cycle.returnDays - cycle.reactivationStart)
    riskScore = 30 + Math.round(progress * 30) // 30-60
  } else if (daysSince < cycle.reactivationEnd) {
    // Após vencimento, mas dentro da janela final
    const progress = (daysSince - cycle.returnDays) / (cycle.reactivationEnd - cycle.returnDays)
    if (progress < 0.5) {
      riskLevel = 'RISK'
      riskScore = 60 + Math.round(progress * 2 * 20) // 60-80
    } else {
      riskLevel = 'CRITICAL'
      riskScore = 80 + Math.round((progress - 0.5) * 2 * 20) // 80-100
    }
  } else {
    // Ultrapassou a janela
    riskLevel = 'CHURN'
    riskScore = 100
  }

  // Follow-up: X dias após procedimento
  const shouldFollowUp =
    daysSince >= cycle.followUpDays && daysSince < cycle.followUpDays + 3

  // Reativação: dentro da janela
  const shouldReactivate =
    daysSince >= cycle.reactivationStart && daysSince <= cycle.reactivationEnd

  return {
    procedureName: cycle.procedureName,
    procedureDate,
    returnDueDate,
    daysSinceProcedure: daysSince,
    daysUntilReturn,
    riskLevel,
    riskScore,
    shouldFollowUp,
    shouldReactivate,
    reactivationWindow,
  }
}

// Calcula valor total em risco de churn para os próximos N dias
export function calculateRevenueAtRisk(
  analyses: Array<RetentionAnalysis & { expectedValue?: number }>
): {
  totalAtRisk: number
  byLevel: Record<RiskLevel, { count: number; value: number }>
} {
  const byLevel: Record<RiskLevel, { count: number; value: number }> = {
    SAFE: { count: 0, value: 0 },
    WATCH: { count: 0, value: 0 },
    RISK: { count: 0, value: 0 },
    CRITICAL: { count: 0, value: 0 },
    CHURN: { count: 0, value: 0 },
  }

  let totalAtRisk = 0
  for (const analysis of analyses) {
    const value = analysis.expectedValue ?? 0
    byLevel[analysis.riskLevel].count++
    byLevel[analysis.riskLevel].value += value
    if (analysis.riskLevel !== 'SAFE') {
      totalAtRisk += value
    }
  }

  return { totalAtRisk, byLevel }
}

// CSS color mapping para usar no frontend
export const RISK_COLORS: Record<RiskLevel, string> = {
  SAFE: 'var(--luna-retention-safe)',
  WATCH: 'var(--luna-retention-watch)',
  RISK: 'var(--luna-retention-risk)',
  CRITICAL: 'var(--luna-retention-critical)',
  CHURN: 'var(--luna-retention-churn)',
}

export const RISK_LABELS: Record<RiskLevel, string> = {
  SAFE: 'Seguro',
  WATCH: 'Atenção',
  RISK: 'Risco',
  CRITICAL: 'Crítico',
  CHURN: 'Churn',
}
