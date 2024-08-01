import crypto from 'crypto'

export function createUUID() {
  return crypto.randomBytes(16).toString('hex')
}