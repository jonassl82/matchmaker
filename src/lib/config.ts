// Central knobs. Change these in one place; the whole system follows.

// How many men each woman gets per weekly letter.
export const DROP_SIZE = 5;

// Max number of women a single man can appear for in one week.
// Stops your best man being sent to everyone at once (the "twelve DMs" problem).
export const MAN_WEEKLY_CAP = 4;

// A man is only eligible to be sent if he confirmed "still single, still in"
// within this many weeks. Keeps stale profiles out without deleting anyone.
export const CONFIRM_WINDOW_WEEKS = 8;

// The taste vocabulary. Men are tagged with these; women pick which they like.
export const VIBES = [
  "classics",   // disco, 70s/80s/90s/00s
  "house",      // melodic, house, festival
  "beach",      // open air, beach, day parties
  "borrel",     // social, drinks, low-key
  "dinner",     // dinner, restaurants
  "culture",    // museums, live music
  "outdoors",   // walks, active, nature
] as const;

export type Vibe = (typeof VIBES)[number];
