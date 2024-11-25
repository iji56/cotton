/**
 * Address sanitization. Does the following:
 * 1. removes mutiple spaces within a whitespace
 * 2. removes leading and trailing whitespace
 *
 * @param value string | undefined
 * @returns value string
 */
export const normalizeWhitespaces = (value: string | null): string => {
  return value ? value.replace(/\s+/g, ' ').trim() : '';
};

/**
 * Postal code and country code sanitization. Does the following:
 * 1. trims whitespace
 * 2. capitalizes entire string
 * 
 * @param value string | undefined
 * @returns string
 */
export const whiteUppercase = (value: string | null): string => {
  const trimmedValue = normalizeWhitespaces(value);
  return trimmedValue.toUpperCase();
};