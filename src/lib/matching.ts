import type { Man, Woman, Impression, Assignment } from "./types";
import { DROP_SIZE, MAN_WEEKLY_CAP } from "./config";

// Deterministic PRNG so a given week + seed always produces the same plan.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const rng = mulberry32(seed);
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Returns a fit score, or null if the man is not a fit for this woman at all.
function fitScore(man: Man, woman: Woman): number | null {
  if (man.age < woman.ageMin || man.age > woman.ageMax) return null;
  if (woman.regions.length > 0 && !woman.regions.includes(man.city)) return null;
  const overlap = man.vibes.filter((v) => woman.likedVibes.includes(v)).length;
  if (overlap === 0) return null;
  return overlap;
}

interface PlanInput {
  women: Woman[];
  men: Man[];            // pass only ELIGIBLE men (active + confirmed within window)
  impressions: Impression[];
  seed: number;          // e.g. the week number, so plans are stable and testable
}

// Core rule:
//  - a woman never sees the same man twice  (per-woman dedupe via the impressions ledger)
//  - a man stays available to every other woman, including new members
//  - no man is sent to more than MAN_WEEKLY_CAP women in one week
export function planWeeklyDrops({ women, men, impressions, seed }: PlanInput): Assignment[] {
  const seenByWoman = new Map<string, Set<string>>();
  const totalImpressions = new Map<string, number>();
  for (const imp of impressions) {
    if (!seenByWoman.has(imp.womanId)) seenByWoman.set(imp.womanId, new Set());
    seenByWoman.get(imp.womanId)!.add(imp.manId);
    totalImpressions.set(imp.manId, (totalImpressions.get(imp.manId) ?? 0) + 1);
  }

  const manWeekCount = new Map<string, number>();
  const activeWomen = women.filter((w) => w.status === "active");
  const orderedWomen = seededShuffle(activeWomen, seed); // fair first-pick rotation

  const assignments: Assignment[] = [];

  for (const w of orderedWomen) {
    const seen = seenByWoman.get(w.id) ?? new Set<string>();

    const candidates = men
      .filter((m) => !seen.has(m.id))
      .filter((m) => (manWeekCount.get(m.id) ?? 0) < MAN_WEEKLY_CAP)
      .map((m) => ({ m, fit: fitScore(m, w) }))
      .filter((c): c is { m: Man; fit: number } => c.fit !== null)
      .sort((a, b) => {
        if (b.fit !== a.fit) return b.fit - a.fit;                     // best fit first
        const ia = totalImpressions.get(a.m.id) ?? 0;
        const ib = totalImpressions.get(b.m.id) ?? 0;
        if (ia !== ib) return ia - ib;                                 // less-shown first
        return b.m.addedAt.localeCompare(a.m.addedAt);                 // newer first
      });

    const picks = candidates.slice(0, DROP_SIZE).map((c) => c.m);
    for (const m of picks) manWeekCount.set(m.id, (manWeekCount.get(m.id) ?? 0) + 1);
    assignments.push({ womanId: w.id, manIds: picks.map((m) => m.id) });
  }

  return assignments;
}
