
const nameRegEx = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u // supports international names

/**
 * Checks if a name is valid.
 * @param name The name to check.
 * @returns True if the name is valid, false otherwise.
 */
export function isValidName(name: string): boolean {
  return nameRegEx.test(name)
}