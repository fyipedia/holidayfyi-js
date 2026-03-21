# holidayfyi

[![npm version](https://agentgif.com/badge/npm/holidayfyi/version.svg)](https://www.npmjs.com/package/holidayfyi)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](https://www.npmjs.com/package/holidayfyi)

Pure TypeScript holiday date engine for developers. Calculate [Easter dates](https://holidayfyi.com/) (Western and Orthodox), find [nth weekdays](https://holidayfyi.com/) in a month (e.g., "3rd Monday of January"), count [days until](https://holidayfyi.com/) a target date, find next occurrences of fixed holidays, and check weekend/weekday status -- all with zero dependencies.

> **Try the interactive tools at [holidayfyi.com](https://holidayfyi.com/)** -- holiday calendar, countdown timers, and date calculators.

<p align="center">
  <img src="demo.gif" alt="holidayfyi demo — Easter dates and holiday lookup" width="800">
</p>

## Table of Contents

- [Install](#install)
- [Quick Start](#quick-start)
- [What You Can Do](#what-you-can-do)
  - [Easter Calculation (Computus Algorithm)](#easter-calculation-computus-algorithm)
  - [Finding Nth Weekdays](#finding-nth-weekdays)
  - [Days Until & Next Occurrence](#days-until--next-occurrence)
- [API Reference](#api-reference)
- [TypeScript Types](#typescript-types)
- [Features](#features)
- [Learn More About Holidays](#learn-more-about-holidays)
- [Also Available for Python](#also-available-for-python)
- [Utility FYI Family](#utility-fyi-family)
- [License](#license)

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

## What You Can Do

### Easter Calculation (Computus Algorithm)

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

Easter determines the dates of many other moveable feasts in the Christian calendar:

| Holiday | Rule | 2026 Date |
|---------|------|----------|
| **Shrove Tuesday** | 47 days before Easter | Feb 17 |
| **Ash Wednesday** | 46 days before Easter | Feb 18 |
| **Palm Sunday** | 7 days before Easter | Mar 29 |
| **Good Friday** | 2 days before Easter | Apr 3 |
| **Easter Sunday** | First Sunday after Paschal full moon | Apr 5 |
| **Ascension Day** | 39 days after Easter | May 14 |
| **Whit Sunday (Pentecost)** | 49 days after Easter | May 24 |

```typescript
import { easterWestern, easterOrthodox } from "holidayfyi";

// Western Easter dates for the next several years
for (const year of [2026, 2027, 2028, 2029, 2030]) {
  const date = easterWestern(year);
  console.log(`${year}: ${date.toISOString().slice(0, 10)}`);
}

// Orthodox Easter -- typically 1-5 weeks after Western Easter
const western = easterWestern(2026);
const orthodox = easterOrthodox(2026);
const diffDays = Math.round((orthodox.getTime() - western.getTime()) / 86400000);
console.log(`Difference: ${diffDays} days`);  // 7
```

Learn more: [Computus Algorithm](https://en.wikipedia.org/wiki/Date_of_Easter) · [Holiday Calendar](https://holidayfyi.com/)

### Finding Nth Weekdays

Many public holidays are defined as the "nth weekday of a month" rather than a fixed date. This pattern is especially common in the United States, Canada, and Australia.

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

Learn more: [Holiday Calendar](https://holidayfyi.com/) · ### Days Until & Next Occurrence

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

Learn more: [Countdown Timers](https://holidayfyi.com/today/) · [Country Holiday Calendars](https://holidayfyi.com/country/) · [REST API Docs](https://holidayfyi.com/developers/)

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

## Learn More About Holidays

- **Browse**: [Holiday Calendar](https://holidayfyi.com/) · [Countries](https://holidayfyi.com/country/) · [Today](https://holidayfyi.com/today/)
- **Tools**: - **API**: [REST API Docs](https://holidayfyi.com/developers/) · - **Python**: [PyPI Package](https://pypi.org/project/holidayfyi/)

## Also Available for Python

```bash
pip install holidayfyi
```

See the [Python package on PyPI](https://pypi.org/project/holidayfyi/).

## Utility FYI Family

Part of the [FYIPedia](https://fyipedia.com) open-source developer tools ecosystem — everyday developer reference and conversion tools.

| Package | PyPI | npm | Description |
|---------|------|-----|-------------|
| unitfyi | [PyPI](https://pypi.org/project/unitfyi/) | [npm](https://www.npmjs.com/package/unitfyi) | Unit conversion, 220 units -- [unitfyi.com](https://unitfyi.com/) |
| timefyi | [PyPI](https://pypi.org/project/timefyi/) | [npm](https://www.npmjs.com/package/timefyi) | Timezone ops & business hours -- [timefyi.com](https://timefyi.com/) |
| **holidayfyi** | [PyPI](https://pypi.org/project/holidayfyi/) | [npm](https://www.npmjs.com/package/holidayfyi) | Holiday dates & Easter calculation -- [holidayfyi.com](https://holidayfyi.com/) |
| namefyi | [PyPI](https://pypi.org/project/namefyi/) | [npm](https://www.npmjs.com/package/namefyi) | Korean romanization & Five Elements -- [namefyi.com](https://namefyi.com/) |
| distancefyi | [PyPI](https://pypi.org/project/distancefyi/) | [npm](https://www.npmjs.com/package/distancefyi) | Haversine distance & travel times -- [distancefyi.com](https://distancefyi.com/) |

## License

MIT
