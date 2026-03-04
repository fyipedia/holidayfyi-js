/**
 * Holiday computation engine -- pure TypeScript, zero dependencies, <1ms.
 *
 * Provides Easter date calculation, nth weekday finder, days-until counting,
 * next occurrence lookup, and weekend/weekday helpers. All functions are
 * stateless and thread-safe.
 *
 * Ported from the Python `holidayfyi` package.
 */

// -- Internal helpers --------------------------------------------------------

const WEEKDAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

/**
 * Convert JavaScript Date.getDay() (0=Sunday) to Python weekday (0=Monday).
 */
function jsDayToPythonWeekday(jsDay: number): number {
  return (jsDay + 6) % 7;
}

/**
 * Get the number of days in a given month (1-indexed).
 */
function daysInMonth(year: number, month: number): number {
  // Day 0 of the *next* month gives the last day of *this* month
  return new Date(year, month, 0).getDate();
}

/**
 * Create a Date for a given year/month/day (all 1-indexed for month).
 * Returns a date at midnight UTC to avoid timezone issues.
 */
function makeDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Add `days` to a Date (returns a new Date).
 */
function addDays(d: Date, days: number): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + days));
}

/**
 * Get the Python-style weekday (0=Monday) from a UTC Date.
 */
function weekday(d: Date): number {
  return jsDayToPythonWeekday(d.getUTCDay());
}

/**
 * Strip time and return midnight UTC for a local Date.
 */
function toUTCDate(d: Date): Date {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

// -- Easter Dates ------------------------------------------------------------

/**
 * Calculate Western (Gregorian) Easter date using the Anonymous Gregorian algorithm.
 *
 * Reference: https://en.wikipedia.org/wiki/Date_of_Easter#Anonymous_Gregorian_algorithm
 *
 * @param year - Calendar year.
 * @returns Date of Western Easter Sunday (UTC midnight).
 */
export function easterWestern(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const el = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * el) / 451);
  const month = Math.floor((h + el - 7 * m + 114) / 31);
  const day = ((h + el - 7 * m + 114) % 31) + 1;
  return makeDate(year, month, day);
}

/**
 * Calculate Orthodox Easter date (Julian Easter + 13-day offset).
 *
 * Uses the Meeus Julian algorithm, then adds 13 days to convert
 * from Julian to Gregorian calendar.
 *
 * @param year - Calendar year.
 * @returns Date of Orthodox Easter Sunday (Gregorian calendar, UTC midnight).
 */
export function easterOrthodox(year: number): Date {
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31);
  const day = ((d + e + 114) % 31) + 1;
  // Julian to Gregorian: add 13 days
  const julianDate = makeDate(year, month, day);
  return addDays(julianDate, 13);
}

// -- Nth Weekday -------------------------------------------------------------

/**
 * Find the nth occurrence of a weekday in a given month.
 *
 * @param year - Calendar year.
 * @param month - Month (1-12).
 * @param wd - Day of week using Python convention (0=Monday, 6=Sunday).
 * @param n - 1-indexed occurrence (1=first, 2=second, ...) or -1 for last.
 * @returns Date of the nth weekday in the given month (UTC midnight).
 * @throws {Error} If the requested occurrence does not exist.
 */
export function nthWeekdayOfMonth(
  year: number,
  month: number,
  wd: number,
  n: number,
): Date {
  if (n === -1) {
    // Last occurrence: start from last day of month, go backwards
    const lastDay = daysInMonth(year, month);
    let d = makeDate(year, month, lastDay);
    while (weekday(d) !== wd) {
      d = addDays(d, -1);
    }
    return d;
  }

  if (n < 1) {
    throw new Error(`n must be >= 1 or -1 for last, got ${n}`);
  }

  // Find the first occurrence of the weekday in the month
  const firstDay = makeDate(year, month, 1);
  let daysAhead = wd - weekday(firstDay);
  if (daysAhead < 0) {
    daysAhead += 7;
  }
  const firstOccurrence = addDays(firstDay, daysAhead);

  // Add (n-1) weeks
  const result = addDays(firstOccurrence, 7 * (n - 1));
  if (result.getUTCMonth() !== month - 1) {
    const monthStr = String(month).padStart(2, "0");
    throw new Error(
      `No ${n}th occurrence of weekday ${wd} in ${year}-${monthStr}`,
    );
  }
  return result;
}

// -- Days Until & Next Occurrence --------------------------------------------

/**
 * Calculate the number of days until a target date.
 *
 * @param targetDate - The future date to count towards.
 * @param fromDate - The starting date (defaults to today).
 * @returns Number of days (negative if targetDate is in the past).
 */
export function daysUntil(targetDate: Date, fromDate?: Date): number {
  const from = fromDate ? toUTCDate(fromDate) : toUTCDate(new Date());
  const target = toUTCDate(targetDate);
  return Math.round((target.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Find the next occurrence of a fixed-date holiday.
 *
 * @param fixedMonth - Month of the holiday (1-12).
 * @param fixedDay - Day of the holiday (1-31).
 * @param fromDate - Reference date (defaults to today).
 * @returns The next occurrence of the given month/day (this year or next).
 */
export function nextOccurrence(
  fixedMonth: number,
  fixedDay: number,
  fromDate?: Date,
): Date {
  const from = fromDate ? toUTCDate(fromDate) : toUTCDate(new Date());
  const fromYear = from.getUTCFullYear();
  const thisYear = makeDate(fromYear, fixedMonth, fixedDay);
  if (thisYear.getTime() >= from.getTime()) {
    return thisYear;
  }
  return makeDate(fromYear + 1, fixedMonth, fixedDay);
}

// -- Weekend & Weekday -------------------------------------------------------

/**
 * Check if a date falls on a weekend (Saturday or Sunday).
 *
 * @param d - The date to check.
 * @returns True if Saturday or Sunday.
 */
export function isWeekend(d: Date): boolean {
  return weekday(d) >= 5;
}

/**
 * Get the English name of the day of the week.
 *
 * @param d - The date to get the weekday name for.
 * @returns English weekday name (e.g., "Monday", "Friday").
 */
export function getWeekdayName(d: Date): string {
  return WEEKDAY_NAMES[weekday(d)];
}
