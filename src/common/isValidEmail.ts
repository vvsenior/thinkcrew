
const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Checks if a email is valid.
 * @param email The email to check.
 * @returns True if the email is valid, false otherwise.
 */
export function isValidEmail(email: string): boolean {
  return emailRegEx.test(email)
}