/**
 * Server-side input validation helpers for Convex handlers.
 */

export function assertStringLength(
  value: string,
  field: string,
  min: number,
  max: number,
): void {
  if (value.length < min || value.length > max) {
    throw new Error(`${field} must be between ${min} and ${max} characters`)
  }
}

export function assertOptionalStringLength(
  value: string | undefined,
  field: string,
  max: number,
): void {
  if (value !== undefined && value.length > max) {
    throw new Error(`${field} cannot exceed ${max} characters`)
  }
}

export function assertNonNegative(value: number, field: string): void {
  if (value < 0) {
    throw new Error(`${field} cannot be negative`)
  }
}

export function assertEmailFormat(value: string, field: string): void {
  if (value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new Error(`${field} must be a valid email address`)
  }
}
