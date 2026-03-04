/**
 * Weekday constants matching Python's convention.
 *
 * 0 = Monday, 1 = Tuesday, ..., 6 = Sunday.
 * Note: JavaScript's Date.getDay() uses 0 = Sunday, 1 = Monday, ..., 6 = Saturday.
 */
export const WEEKDAY = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
  SATURDAY: 5,
  SUNDAY: 6,
} as const;

/** Python-style weekday (0=Monday, 6=Sunday). */
export type Weekday = (typeof WEEKDAY)[keyof typeof WEEKDAY];
