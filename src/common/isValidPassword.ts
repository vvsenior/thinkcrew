
const passwordRegEx = /^[A-Za-z0-9`~!@#$%^&*()-_=+|[\]{}<.>?]*$/

/**
 * Checks if a password is valid.
 * @param password The password to check.
 * @returns True if the password is valid, false otherwise.
 */
export function isValidPassword(password: string): boolean {
  return passwordRegEx.test(password)
}