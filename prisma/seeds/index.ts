import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { DEFAULT_CYCLES } from '../../src/lib/retention-radar'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding Luna CRM...')

  // 1. Criar planos
  const starter = await prisma.subscriptionPlan.upsert({
    where: { name: 'starter' },
    update: {},
    create: {
      name: 'starter',
      displayName: 'Starter',
      priceMonthly: 197,
      priceYearly: 1970,
      maxPipelines: 1,
      maxLeads: 500,
      maxChannels: 1,
      maxTeamMembers: 2,
      maxAutomations: 3,
      maxKnowledgeDocs: 1,
      maxBotFlows: 0,
      hasSite: true,
      siteTemplateOptions: 1,
      hasCustomDomain: false,
      hasPatientPortal: false,
      maxGalleryPhotos: 20,
      hasAiScore: false,
      hasGoldenWindow: false,
      hasRetentionRadar: true,
      retentionMaxProcs: 3,
      hasConcierge: false,
      hasBotBuilder: false,
      hasAdvancedReports: false,
      hasWhiteLabel: false,
      hasApiAccess: false,
      hasBroadcast: false,
      hasNps: false,
      hasProposals: false,
    },
  })

  const pro = await prisma.subscriptionPlan.upsert({
    where: { name: 'pro' },
    update: {},
    create: {
      name: 'pro',
      displayName: 'Pro',
      priceMonthly: 397,
      priceYearly: 3970,
      maxPipelines: 3,
      maxLeads: 5000,
      maxChannels: 2,
      maxTeamMembers: 5,
      maxAutomations: 999,
      maxKnowledgeDocs: 10,
      maxBotFlows: 5,
      hasSite: true,
      siteTemplateOptions: 3,
      hasCustomDomain: false,
      hasPatientPortal: true,
      maxGalleryPhotos: 100,
      hasAiScore: true,
      hasGoldenWindow: true,
      hasRetentionRadar: true,
      retentionMaxProcs: 999,
      hasConcierge: true,
      hasBotBuilder: true,
      hasAdvancedReports: true,
      hasWhiteLabel: false,
      hasApiAccess: false,
      hasBroadcast: true,
      hasNps: true,
      hasProposals: true,
    },
  })

  const enterprise = await prisma.subscriptionPlan.upsert({
    where: { name: 'enterprise' },
    update: {},
    create: {
      name: 'enterprise',
      displayName: 'Enterprise',
      priceMonthly: 797,
      priceYearly: 7970,
      maxPipelines: 999,
      maxLeads: 999999,
      maxChannels: 5,
      maxTeamMembers: 999,
      maxAutomations: 999,
      maxKnowledgeDocs: 999,
      maxBotFlows: 999,
      hasSite: true,
      siteTemplateOptions: 999,
      hasCustomDomain: true,
      hasPatientPortal: true,
      maxGalleryPhotos: 999999,
      hasAiScore: true,
      hasGoldenWindow: true,
      hasRetentionRadar: true,
      retentionMaxProcs: 999,
      hasConcierge: true,
      hasBotBuilder: true,
      hasAdvancedReports: true,
      hasWhiteLabel: true,
      hasApiAccess: true,
      hasBroadcast: true,
      hasNps: true,
      hasProposals: true,
    },
  })

  console.log(`Planos criados: ${starter.displayName}, ${pro.displayName}, ${enterprise.displayName}`)

  // 2. Criar tenant demo
  const demoTenant = await prisma.crmTenant.upsert({
    where: { slug: 'demo-luna' },
    update: {},
    create: {
      name: 'Clínica Demo Luna',
      slug: 'demo-luna',
    },
  })

  // 3. Criar subscription trial para demo
  await prisma.subscription.upsert({
    where: { tenantId: demoTenant.id },
    update: {},
    create: {
      tenantId: demoTenant.id,
      planId: pro.id,
      status: 'ACTIVE',
    },
  })

  // 4. Criar ciclos de retenção default para demo
  for (const cycle of DEFAULT_CYCLES) {
    await prisma.retentionCycle.upsert({
      where: {
        tenantId_procedureName: {
          tenantId: demoTenant.id,
          procedureName: cycle.procedureName,
        },
      },
      update: {},
      create: {
        tenantId: demoTenant.id,
        procedureName: cycle.procedureName,
        followUpDays: cycle.followUpDays,
        returnDays: cycle.returnDays,
        reactivationStart: cycle.reactivationStart,
        reactivationEnd: cycle.reactivationEnd,
        isDefault: true,
      },
    })
  }

  console.log(`${DEFAULT_CYCLES.length} ciclos de retenção criados para demo`)

  // 5. Criar pipeline default para demo
  const pipeline = await prisma.pipeline.upsert({
    where: { id: 'demo-pipeline' },
    update: {},
    create: {
      id: 'demo-pipeline',
      tenantId: demoTenant.id,
      name: 'Vendas',
      isDefault: true,
    },
  })

  const stages = [
    { name: 'Novo Lead', type: 'OPEN' as const, order: 0, color: '#4A7BFF' },
    { name: 'Qualificação', type: 'OPEN' as const, order: 1, color: '#F0A500' },
    { name: 'Proposta Enviada', type: 'OPEN' as const, order: 2, color: '#FF6B4A' },
    { name: 'Negociação', type: 'OPEN' as const, order: 3, color: '#D4AF37' },
    { name: 'Ganho', type: 'WON' as const, order: 4, color: '#2ECC8A' },
    { name: 'Perdido', type: 'LOST' as const, order: 5, color: '#FF4757' },
  ]

  for (const stage of stages) {
    await prisma.stage.upsert({
      where: { id: `demo-stage-${stage.order}` },
      update: {},
      create: {
        id: `demo-stage-${stage.order}`,
        pipelineId: pipeline.id,
        tenantId: demoTenant.id,
        name: stage.name,
        type: stage.type,
        order: stage.order,
        color: stage.color,
      },
    })
  }

  console.log(`Pipeline "${pipeline.name}" com ${stages.length} estágios criado`)

  // 6. Criar AI config default
  await prisma.crmAiConfig.upsert({
    where: { tenantId: demoTenant.id },
    update: {},
    create: {
      tenantId: demoTenant.id,
      temperature: 0.7,
      maxTokens: 1024,
      autoReplyEnabled: false,
    },
  })

  console.log('Seed completo!')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
