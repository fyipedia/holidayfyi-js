import { describe, it, expect } from "vitest";
import {
  easterWestern,
  easterOrthodox,
  nthWeekdayOfMonth,
  daysUntil,
  nextOccurrence,
  isWeekend,
  getWeekdayName,
  WEEKDAY,
} from "../src/index.js";

// ---------------------------------------------------------------------------
// Helper: create UTC Date for assertions
// ---------------------------------------------------------------------------

function utc(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

// ---------------------------------------------------------------------------
// Easter Western
// ---------------------------------------------------------------------------

describe("easterWestern", () => {
  it("returns April 20, 2025", () => {
    expect(easterWestern(2025)).toEqual(utc(2025, 4, 20));
  });

  it("returns April 5, 2026", () => {
    expect(easterWestern(2026)).toEqual(utc(2026, 4, 5));
  });

  it("returns April 12, 2020", () => {
    expect(easterWestern(2020)).toEqual(utc(2020, 4, 12));
  });

  it("returns April 4, 2021", () => {
    expect(easterWestern(2021)).toEqual(utc(2021, 4, 4));
  });

  it("returns April 17, 2022", () => {
    expect(easterWestern(2022)).toEqual(utc(2022, 4, 17));
  });

  it("returns April 9, 2023", () => {
    expect(easterWestern(2023)).toEqual(utc(2023, 4, 9));
  });

  it("returns March 31, 2024", () => {
    expect(easterWestern(2024)).toEqual(utc(2024, 3, 31));
  });

  it("returns March 28, 2027", () => {
    expect(easterWestern(2027)).toEqual(utc(2027, 3, 28));
  });
});

// ---------------------------------------------------------------------------
// Easter Orthodox
// ---------------------------------------------------------------------------

describe("easterOrthodox", () => {
  it("returns April 20, 2025", () => {
    expect(easterOrthodox(2025)).toEqual(utc(2025, 4, 20));
  });

  it("returns April 12, 2026", () => {
    expect(easterOrthodox(2026)).toEqual(utc(2026, 4, 12));
  });

  it("returns April 19, 2020", () => {
    expect(easterOrthodox(2020)).toEqual(utc(2020, 4, 19));
  });

  it("returns May 2, 2021", () => {
    expect(easterOrthodox(2021)).toEqual(utc(2021, 5, 2));
  });

  it("returns April 24, 2022", () => {
    expect(easterOrthodox(2022)).toEqual(utc(2022, 4, 24));
  });

  it("returns April 16, 2023", () => {
    expect(easterOrthodox(2023)).toEqual(utc(2023, 4, 16));
  });

  it("returns May 5, 2024", () => {
    expect(easterOrthodox(2024)).toEqual(utc(2024, 5, 5));
  });

  it("returns April 16, 2028 (coincides with Western Easter)", () => {
    expect(easterOrthodox(2028)).toEqual(utc(2028, 4, 16));
  });

  it("returns May 2, 2027", () => {
    expect(easterOrthodox(2027)).toEqual(utc(2027, 5, 2));
  });
});

// ---------------------------------------------------------------------------
// Nth Weekday of Month
// ---------------------------------------------------------------------------

describe("nthWeekdayOfMonth", () => {
  it("3rd Monday of January 2026 = January 19", () => {
    expect(nthWeekdayOfMonth(2026, 1, WEEKDAY.MONDAY, 3)).toEqual(
      utc(2026, 1, 19),
    );
  });

  it("1st Monday of September 2026 (Labor Day) = September 7", () => {
    expect(nthWeekdayOfMonth(2026, 9, WEEKDAY.MONDAY, 1)).toEqual(
      utc(2026, 9, 7),
    );
  });

  it("4th Thursday of November 2026 (Thanksgiving) = November 26", () => {
    expect(nthWeekdayOfMonth(2026, 11, WEEKDAY.THURSDAY, 4)).toEqual(
      utc(2026, 11, 26),
    );
  });

  it("2nd Monday of October 2026 (Columbus Day) = October 12", () => {
    expect(nthWeekdayOfMonth(2026, 10, WEEKDAY.MONDAY, 2)).toEqual(
      utc(2026, 10, 12),
    );
  });

  it("last Monday of May 2026 (Memorial Day) = May 25", () => {
    expect(nthWeekdayOfMonth(2026, 5, WEEKDAY.MONDAY, -1)).toEqual(
      utc(2026, 5, 25),
    );
  });

  it("last Friday of March 2026 = March 27", () => {
    expect(nthWeekdayOfMonth(2026, 3, WEEKDAY.FRIDAY, -1)).toEqual(
      utc(2026, 3, 27),
    );
  });

  it("1st Sunday of a month where the 1st is Sunday", () => {
    // March 2026: March 1 is a Sunday
    expect(nthWeekdayOfMonth(2026, 3, WEEKDAY.SUNDAY, 1)).toEqual(
      utc(2026, 3, 1),
    );
  });

  it("throws for n=0", () => {
    expect(() => nthWeekdayOfMonth(2026, 1, WEEKDAY.MONDAY, 0)).toThrow();
  });

  it("throws for 5th Monday in a month that doesn't have one", () => {
    // February 2026 has 4 Mondays at most
    expect(() => nthWeekdayOfMonth(2026, 2, WEEKDAY.MONDAY, 5)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// Days Until
// ---------------------------------------------------------------------------

describe("daysUntil", () => {
  it("returns 0 for same day", () => {
    const d = utc(2026, 6, 15);
    expect(daysUntil(d, d)).toBe(0);
  });

  it("returns positive for future date", () => {
    expect(daysUntil(utc(2026, 1, 10), utc(2026, 1, 1))).toBe(9);
  });

  it("returns negative for past date", () => {
    expect(daysUntil(utc(2026, 1, 1), utc(2026, 1, 10))).toBe(-9);
  });

  it("counts across month boundaries", () => {
    expect(daysUntil(utc(2026, 2, 1), utc(2026, 1, 31))).toBe(1);
  });

  it("counts across year boundaries", () => {
    expect(daysUntil(utc(2027, 1, 1), utc(2026, 12, 31))).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Next Occurrence
// ---------------------------------------------------------------------------

describe("nextOccurrence", () => {
  it("returns this year if date hasn't passed", () => {
    // Christmas from Jan 1
    expect(nextOccurrence(12, 25, utc(2026, 1, 1))).toEqual(utc(2026, 12, 25));
  });

  it("returns next year if date has passed", () => {
    // New Year's Day from Feb 1
    expect(nextOccurrence(1, 1, utc(2026, 2, 1))).toEqual(utc(2027, 1, 1));
  });

  it("returns today if target is today", () => {
    expect(nextOccurrence(7, 4, utc(2026, 7, 4))).toEqual(utc(2026, 7, 4));
  });

  it("returns next year for yesterday's date", () => {
    expect(nextOccurrence(3, 3, utc(2026, 3, 4))).toEqual(utc(2027, 3, 3));
  });
});

// ---------------------------------------------------------------------------
// Is Weekend
// ---------------------------------------------------------------------------

describe("isWeekend", () => {
  it("Saturday is weekend", () => {
    // 2026-01-03 is Saturday
    expect(isWeekend(utc(2026, 1, 3))).toBe(true);
  });

  it("Sunday is weekend", () => {
    // 2026-01-04 is Sunday
    expect(isWeekend(utc(2026, 1, 4))).toBe(true);
  });

  it("Monday is not weekend", () => {
    // 2026-01-05 is Monday
    expect(isWeekend(utc(2026, 1, 5))).toBe(false);
  });

  it("Friday is not weekend", () => {
    // 2026-01-02 is Friday
    expect(isWeekend(utc(2026, 1, 2))).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Get Weekday Name
// ---------------------------------------------------------------------------

describe("getWeekdayName", () => {
  it("Monday", () => {
    expect(getWeekdayName(utc(2026, 1, 5))).toBe("Monday");
  });

  it("Friday", () => {
    expect(getWeekdayName(utc(2026, 1, 2))).toBe("Friday");
  });

  it("Saturday", () => {
    expect(getWeekdayName(utc(2026, 1, 3))).toBe("Saturday");
  });

  it("Sunday", () => {
    expect(getWeekdayName(utc(2026, 1, 4))).toBe("Sunday");
  });

  it("Wednesday", () => {
    expect(getWeekdayName(utc(2026, 1, 7))).toBe("Wednesday");
  });
});

// ---------------------------------------------------------------------------
// WEEKDAY constants
// ---------------------------------------------------------------------------

describe("WEEKDAY", () => {
  it("has correct Python-style values", () => {
    expect(WEEKDAY.MONDAY).toBe(0);
    expect(WEEKDAY.TUESDAY).toBe(1);
    expect(WEEKDAY.WEDNESDAY).toBe(2);
    expect(WEEKDAY.THURSDAY).toBe(3);
    expect(WEEKDAY.FRIDAY).toBe(4);
    expect(WEEKDAY.SATURDAY).toBe(5);
    expect(WEEKDAY.SUNDAY).toBe(6);
  });
});

// ---------------------------------------------------------------------------
// Cross-validation: Easter dates are on Sunday
// ---------------------------------------------------------------------------

describe("Easter dates are on Sunday", () => {
  const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

  for (const year of years) {
    it(`Western Easter ${year} is Sunday`, () => {
      expect(getWeekdayName(easterWestern(year))).toBe("Sunday");
    });

    it(`Orthodox Easter ${year} is Sunday`, () => {
      expect(getWeekdayName(easterOrthodox(year))).toBe("Sunday");
    });
  }
});
