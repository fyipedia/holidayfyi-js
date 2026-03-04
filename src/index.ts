/**
 * holidayfyi -- Pure TypeScript holiday date engine.
 *
 * Calculate Easter dates (Western & Orthodox), find nth weekdays in a month,
 * count days until a target date, find next occurrences of fixed holidays,
 * and check weekend/weekday status.
 *
 * Zero dependencies. Works in Node.js, Deno, Bun, and browsers.
 *
 * @example
 * ```ts
 * import { easterWestern, nthWeekdayOfMonth, daysUntil, WEEKDAY } from "holidayfyi";
 *
 * const easter2026 = easterWestern(2026);
 * console.log(easter2026);  // 2026-04-05
 *
 * // MLK Day 2026: 3rd Monday of January
 * const mlk = nthWeekdayOfMonth(2026, 1, WEEKDAY.MONDAY, 3);
 * console.log(mlk);  // 2026-01-19
 *
 * const days = daysUntil(easter2026);
 * console.log(days);  // days until Easter 2026
 * ```
 *
 * @packageDocumentation
 */

// Types
export { WEEKDAY } from "./types.js";
export type { Weekday } from "./types.js";

// Engine -- date calculations
export {
  easterWestern,
  easterOrthodox,
  nthWeekdayOfMonth,
  daysUntil,
  nextOccurrence,
  isWeekend,
  getWeekdayName,
} from "./engine.js";
