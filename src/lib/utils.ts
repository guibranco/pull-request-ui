import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names and applies Tailwind CSS utility classes.
 *
 * This function takes any number of class names as input and merges them into a single string,
 * ensuring that conflicting classes are resolved according to Tailwind CSS's merging rules.
 *
 * @param {...ClassValue[]} inputs - A variable number of class names or class value inputs.
 * Each input can be a string, an array of strings, or an object with conditional class names.
 *
 * @returns {string} The merged class name string.
 *
 * @example
 * const buttonClass = cn('btn', { 'btn-active': isActive }, 'btn-lg');
 * // Returns a string with merged class names based on the inputs.
 *
 * @throws {TypeError} Throws an error if the inputs are not of the expected type.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
