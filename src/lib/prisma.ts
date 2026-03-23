import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Helper pgvector — busca por similaridade semântica
export async function findSimilarChunks(
  tenantId: string,
  embedding: number[],
  limit = 5,
  threshold = 0.75
) {
  return prisma.$queryRaw<
    Array<{ id: string; title: string; content: string; similarity: number }>
  >`
    SELECT id, title, content,
           1 - (embedding <=> ${embedding}::vector) AS similarity
    FROM   "CrmKnowledgeBase"
    WHERE  "tenantId" = ${tenantId}
      AND  "isActive" = true
      AND  embedding IS NOT NULL
      AND  1 - (embedding <=> ${embedding}::vector) > ${threshold}
    ORDER  BY similarity DESC
    LIMIT  ${limit}
  `
}
