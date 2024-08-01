
import { permissionsList } from '../config/permissionsList'

/**
 * This function compares two permission levels and returns true if the userLevel is greater than or equal to the minimumLevel
 * @param userLevels The level of the user making the request.
 * @param minimumLevel The minimum level required to view this resource.
 * @returns true or false
 * Example: comparePermissionLevels('creator', 'view') returns true
 * Example: comparePermissionLevels('view', 'creator') returns false
 */
export function comparePermissionLevels(userLevel: string, minimumLevel: string): boolean {
  const minimumLevelIndex = permissionsList.findIndex(item=>item===minimumLevel)
  const userLevelIndex = permissionsList.findIndex(item=>item===userLevel)
  return userLevelIndex >= minimumLevelIndex
}