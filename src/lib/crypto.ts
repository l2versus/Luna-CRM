import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY
  if (!key) throw new Error('ENCRYPTION_KEY env var is required')
  return Buffer.from(key, 'hex')
}

export function encryptCredentials(data: Record<string, unknown>): string {
  const KEY = getKey()
  const iv = randomBytes(16)
  const cipher = createCipheriv(ALGORITHM, KEY, iv)
  const json = JSON.stringify(data)
  const encrypted = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return [
    iv.toString('hex'),
    authTag.toString('hex'),
    encrypted.toString('hex'),
  ].join(':')
}

export function decryptCredentials(
  ciphertext: string
): Record<string, unknown> {
  const KEY = getKey()
  const [ivHex, authTagHex, dataHex] = ciphertext.split(':')
  const decipher = createDecipheriv(
    ALGORITHM,
    KEY,
    Buffer.from(ivHex, 'hex')
  )
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'))
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataHex, 'hex')),
    decipher.final(),
  ])
  return JSON.parse(decrypted.toString('utf8'))
}
