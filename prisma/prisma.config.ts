import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { PrismaConfig } from 'prisma'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default {
  earlyAccess: true,
  schema: path.join(__dirname, 'schema.prisma'),
} satisfies PrismaConfig
