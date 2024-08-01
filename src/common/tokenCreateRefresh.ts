import jwt from 'jsonwebtoken'

/**
 * Create refresh token
 * @param _id User id
 * @param roles User roles
 * @returns Refresh token
 */
export function tokenCreateRefresh(_id: string, roles: number[]): string {
  if(!process.env.REFRESH_TOKEN_SECRET) throw new Error('No refresh token secret found')
  return jwt.sign(
    { userInfo: {
        _id,
        roles,
      }
    }, 
    process.env.REFRESH_TOKEN_SECRET, 
    { expiresIn: '1d' }
  )
}