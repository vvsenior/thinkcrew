import jwt from 'jsonwebtoken'

/**
 * Create access token
 * @param _id User id
 * @param roles User roles
 * @returns Access token
 */
export function tokenCreateAccess(_id: string, roles: number[]): string {
  if(!process.env.ACCESS_TOKEN_SECRET) throw new Error('No access token secret found')
  return jwt.sign(
    { userInfo: {
        _id,
        roles,
      }
    }, 
    process.env.ACCESS_TOKEN_SECRET, 
    { expiresIn: '15m' }
  )
}