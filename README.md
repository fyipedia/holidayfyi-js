# holidayfyi

[![npm](https://img.shields.io/npm/v/holidayfyi)](https://www.npmjs.com/package/holidayfyi)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](https://www.npmjs.com/package/holidayfyi)

Pure TypeScript holiday date engine for developers. Calculate [Easter dates](https://holidayfyi.com/) (Western and Orthodox), find [nth weekdays](https://holidayfyi.com/) in a month (e.g., "3rd Monday of January"), count [days until](https://holidayfyi.com/) a target date, find next occurrences of fixed holidays, and check weekend/weekday status -- all with zero dependencies.

> **Try the interactive tools at [holidayfyi.com](https://holidayfyi.com/)** -- holiday calendar, countdown timers, and date calculators.

## Install

```bash
npm install holidayfyi
```

Works in Node.js, Deno, Bun, and browsers (ESM).

## Quick Start

```typescript
import { easterWestern, easterOrthodox, nthWeekdayOfMonth, daysUntil, WEEKDAY } from "holidayfyi";

// Easter 2026
const easter = easterWestern(2026);
console.log(easter.toISOString().slice(0, 10));  // "2026-04-05"

const orthodox = easterOrthodox(2026);
console.log(orthodox.toISOString().slice(0, 10)); // "2026-04-12"

// MLK Day 2026: 3rd Monday of January
const mlk = nthWeekdayOfMonth(2026, 1, WEEKDAY.MONDAY, 3);
console.log(mlk.toISOString().slice(0, 10));  // "2026-01-19"

// Thanksgiving 2026: 4th Thursday of November
const thanksgiving = nthWeekdayOfMonth(2026, 11, WEEKDAY.THURSDAY, 4);
console.log(thanksgiving.toISOString().slice(0, 10));  // "2026-11-26"

// Days until Easter
const days = daysUntil(easter);
console.log(days);  // days remaining
```

## The Computus Algorithm

Computing Easter's date is one of the oldest algorithms still in use. The Anonymous Gregorian algorithm (used since 1582) uses modular arithmetic to find the first Sunday after the first ecclesiastical full moon after March 21.

The algorithm involves 10 intermediate variables computed entirely through integer division and modulo operations:

```
a = year % 19                    (Metonic cycle position)
b = year / 100, c = year % 100   (Century)
d = b / 4, e = b % 4             (Leap century correction)
f = (b + 8) / 25                 (Synchronization correction)
g = (b - f + 1) / 3              (Epact correction)
h = (19a + b - d - g + 15) % 30  (Paschal full moon)
i = c / 4, k = c % 4             (Leap year correction)
el = (32 + 2e + 2i - h - k) % 7  (Sunday correction)
m = (a + 11h + 22*el) / 451      (Lunar/solar correction)
month = (h + el - 7m + 114) / 31
day = (h + el - 7m + 114) % 31 + 1
```

For Orthodox Easter, the Meeus Julian algorithm is used instead, and 13 days are added to convert from the Julian to the Gregorian calendar. This offset accounts for the accumulated drift between the two calendars.

## Finding Nth Weekdays

```typescript
import { nthWeekdayOfMonth, WEEKDAY } from "holidayfyi";

// US Federal holidays that use "nth weekday of month" rules:
const mlkDay = nthWeekdayOfMonth(2026, 1, WEEKDAY.MONDAY, 3);        // MLK Day
const presidentsDay = nthWeekdayOfMonth(2026, 2, WEEKDAY.MONDAY, 3);  // Presidents' Day
const memorialDay = nthWeekdayOfMonth(2026, 5, WEEKDAY.MONDAY, -1);   // Last Monday of May
const laborDay = nthWeekdayOfMonth(2026, 9, WEEKDAY.MONDAY, 1);       // Labor Day
const columbusDay = nthWeekdayOfMonth(2026, 10, WEEKDAY.MONDAY, 2);   // Columbus Day
const thanksgiving = nthWeekdayOfMonth(2026, 11, WEEKDAY.THURSDAY, 4); // Thanksgiving

// Use -1 for "last occurrence"
const lastFriday = nthWeekdayOfMonth(2026, 3, WEEKDAY.FRIDAY, -1);
```

## Days Until & Next Occurrence

```typescript
import { daysUntil, nextOccurrence, isWeekend, getWeekdayName } from "holidayfyi";

// Count days until a specific date
const christmas = new Date(Date.UTC(2026, 11, 25));
console.log(daysUntil(christmas));  // days until Christmas 2026

// Find the next occurrence of a fixed-date holiday
const nextChristmas = nextOccurrence(12, 25);
console.log(nextChristmas.toISOString().slice(0, 10));  // "2026-12-25" or "2027-12-25"

const nextNewYear = nextOccurrence(1, 1);
console.log(nextNewYear.toISOString().slice(0, 10));

// Weekend and weekday checks
console.log(isWeekend(christmas));          // true or false
console.log(getWeekdayName(christmas));     // "Friday"
```

## API Reference

### Easter Dates

| Function | Description |
|----------|-------------|
| `easterWestern(year) -> Date` | Western (Gregorian) Easter date using the Anonymous Gregorian algorithm |
| `easterOrthodox(year) -> Date` | Orthodox Easter date (Julian algorithm + 13-day Gregorian offset) |

### Nth Weekday

| Function | Description |
|----------|-------------|
| `nthWeekdayOfMonth(year, month, wd, n) -> Date` | Find the nth occurrence of a weekday in a month (n=-1 for last) |

### Days Until & Next Occurrence

| Function | Description |
|----------|-------------|
| `daysUntil(targetDate, fromDate?) -> number` | Count days until a target date |
| `nextOccurrence(fixedMonth, fixedDay, fromDate?) -> Date` | Next occurrence of a fixed-date holiday (this year or next) |

### Weekend & Weekday

| Function | Description |
|----------|-------------|
| `isWeekend(date) -> boolean` | Check if a date falls on Saturday or Sunday |
| `getWeekdayName(date) -> string` | English weekday name (e.g., "Monday", "Friday") |

### Constants

| Export | Description |
|--------|-------------|
| `WEEKDAY` | Weekday constants: `MONDAY` (0), `TUESDAY` (1), ..., `SUNDAY` (6) |

## TypeScript Types

```typescript
import { WEEKDAY } from "holidayfyi";
import type { Weekday } from "holidayfyi";
```

## Features

- **Easter calculation**: Western (Anonymous Gregorian) and Orthodox (Meeus Julian + 13-day offset)
- **Nth weekday finder**: "3rd Monday of January", "last Friday of March", etc.
- **Days-until counting**: Countdown to any target date
- **Next occurrence**: Find the next time a fixed-date holiday occurs
- **Weekend/weekday checks**: Simple boolean check and English weekday names
- **Python weekday convention**: 0=Monday, 6=Sunday (matches Python's `datetime.weekday()`)
- **UTC-based**: All dates at midnight UTC to avoid timezone issues
- **Zero dependencies**: Pure TypeScript, no runtime deps
- **Type-safe**: Full TypeScript with strict mode
- **Tree-shakeable**: ESM with named exports
- **Fast**: All computations under 1ms

## Also Available for Python

```bash
pip install holidayfyi
```

See the [Python package on PyPI](https://pypi.org/project/holidayfyi/).

## FYIPedia Developer Tools

Part of the [FYIPedia](https://github.com/fyipedia) open-source developer tools ecosystem:

| Package | Description |
|---------|-------------|
| [colorfyi](https://www.npmjs.com/package/colorfyi) | Color conversion, WCAG contrast, harmonies -- [colorfyi.com](https://colorfyi.com/) |
| [emojifyi](https://www.npmjs.com/package/emojifyi) | Emoji lookup, search, encoding -- [emojifyi.com](https://emojifyi.com/) |
| [symbolfyi](https://www.npmjs.com/package/symbolfyi) | Symbol encoding, Unicode properties -- [symbolfyi.com](https://symbolfyi.com/) |
| [unicodefyi](https://www.npmjs.com/package/unicodefyi) | Unicode character info, encodings -- [unicodefyi.com](https://unicodefyi.com/) |
| [fontfyi](https://www.npmjs.com/package/fontfyi) | Google Fonts metadata, CSS -- [fontfyi.com](https://fontfyi.com/) |
| [distancefyi](https://www.npmjs.com/package/distancefyi) | Distance, bearing, travel times -- [distancefyi.com](https://distancefyi.com/) |
| [timefyi](https://www.npmjs.com/package/timefyi) | Timezone ops, time differences -- [timefyi.com](https://timefyi.com/) |
| [namefyi](https://www.npmjs.com/package/namefyi) | Korean romanization, Five Elements -- [namefyi.com](https://namefyi.com/) |
| [unitfyi](https://www.npmjs.com/package/unitfyi) | Unit conversion, 200 units -- [unitfyi.com](https://unitfyi.com/) |
| **[holidayfyi](https://www.npmjs.com/package/holidayfyi)** | **Holiday dates, Easter calculation -- [holidayfyi.com](https://holidayfyi.com/)** |

## Links

- [Interactive Holiday Calendar](https://holidayfyi.com/) -- Holiday dates for every country
- [Python Package](https://pypi.org/project/holidayfyi/) -- Same engine, Python version
- [Source Code](https://github.com/fyipedia/holidayfyi-js) -- MIT licensed

## License

MIT
