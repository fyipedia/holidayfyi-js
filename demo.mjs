import { easterWestern, easterOrthodox, nthWeekdayOfMonth, daysUntil, nextOccurrence } from './dist/index.js'

const C = { r: '\x1b[0m', b: '\x1b[1m', d: '\x1b[2m', y: '\x1b[33m', g: '\x1b[32m', c: '\x1b[36m' }

// 1. Easter dates
const western = easterWestern(2026)
const orthodox = easterOrthodox(2026)
console.log(`${C.b}${C.y}Easter 2026${C.r}`)
console.log(`  ${C.c}Western ${C.r} ${C.g}${western.toISOString().slice(0, 10)}${C.r}`)
console.log(`  ${C.c}Orthodox${C.r} ${C.g}${orthodox.toISOString().slice(0, 10)}${C.r}`)

console.log()

// 2. US Thanksgiving (4th Thursday of November)
const tg = nthWeekdayOfMonth(2026, 11, 4, 4)
console.log(`${C.b}${C.y}US Thanksgiving 2026${C.r}`)
console.log(`  ${C.c}Date${C.r} ${C.g}${tg.toISOString().slice(0, 10)}${C.r}`)

console.log()

// 3. Christmas countdown
const xmas = nextOccurrence(12, 25)
const days = daysUntil(xmas)
console.log(`${C.b}${C.y}Christmas Countdown${C.r}`)
console.log(`  ${C.c}Next date${C.r} ${C.g}${xmas.toISOString().slice(0, 10)}${C.r}`)
console.log(`  ${C.c}Days left${C.r} ${C.b}${C.g}${days}${C.r}`)
