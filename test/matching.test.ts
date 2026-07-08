import { planWeeklyDrops } from "@/lib/matching";
import { MAN_WEEKLY_CAP } from "@/lib/config";
import type { Man, Woman, Impression } from "@/lib/types";

let failures = 0;
function assert(cond: boolean, msg: string) {
  console.log((cond ? "pass" : "FAIL") + ": " + msg);
  if (!cond) failures++;
}

function makeMan(i: number): Man {
  return {
    id: "m" + i, name: "M" + i, age: 42, city: "Utrecht", ig: "@m" + i,
    description: "", openTo: "", places: [], vibes: ["classics", "house"],
    status: "active", lastConfirmedAt: "2026-07-01", addedAt: "2026-07-0" + ((i % 9) + 1),
  };
}
function makeWoman(i: number): Woman {
  return {
    id: "w" + i, name: "W" + i, email: `w${i}@x.com`, age: 40, city: "Utrecht",
    ageMin: 35, ageMax: 55, likedVibes: ["classics", "house"], regions: ["Utrecht"],
    status: "active", joinedAt: "2026-07-01",
  };
}

const men = Array.from({ length: 10 }, (_, i) => makeMan(i + 1));
const women = Array.from({ length: 6 }, (_, i) => makeWoman(i + 1));
let impressions: Impression[] = [];

const wk1 = planWeeklyDrops({ women, men, impressions, seed: 1 });
assert(wk1.every((a) => a.manIds.length === 5), "week 1: every woman gets 5 men");
const c1: Record<string, number> = {};
wk1.forEach((a) => a.manIds.forEach((m) => (c1[m] = (c1[m] || 0) + 1)));
assert(Object.values(c1).every((c) => c <= MAN_WEEKLY_CAP), "week 1: weekly cap respected");
wk1.forEach((a) => a.manIds.forEach((m) => impressions.push({ womanId: a.womanId, manId: m, dropWeek: "w1" })));

const wk2 = planWeeklyDrops({ women, men, impressions, seed: 2 });
let repeat = false;
wk2.forEach((a) => {
  const prev = new Set(impressions.filter((i) => i.womanId === a.womanId).map((i) => i.manId));
  a.manIds.forEach((m) => { if (prev.has(m)) repeat = true; });
});
assert(!repeat, "week 2: no woman sees a man twice");

women.push(makeWoman(99));
const wk3 = planWeeklyDrops({ women, men, impressions, seed: 3 });
const fresh = wk3.find((a) => a.womanId === "w99");
assert(!!fresh && fresh.manIds.length === 5, "new member draws a full drop from the whole pool");

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILED`);
if (failures > 0) process.exit(1);
