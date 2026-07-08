# Matchmaker — notes for Claude Code

Read `README.md` first for the full picture. This file is the short orientation and the finishing
tasks. The core logic and structure are already in place and the matching engine is tested; your
job is wiring, polish, and the last mile, not a rewrite.

## The one rule the system exists to enforce

- A woman never sees the same man twice. Enforced by the unique `(man_id, woman_id)` constraint on
  `impressions`, and by the pool filter in `src/lib/matching.ts`.
- A man stays available to every other woman, including new members, because exposure is tracked
  per (man, woman), not with a global flag.
- No man is sent to more than `MAN_WEEKLY_CAP` women in one week.

Do not add a `sent` boolean to the man. Do not add like/dislike, mutual matching, or a chat inbox.
The wedge is "no swiping" and a one-sided private letter. Keep it that way.

## Build order if starting fresh

1. Confirm the schema runs in Supabase (`supabase/schema.sql`).
2. `npm install`, then `npm run test` to confirm the matching engine passes.
3. Wire env vars, deploy, trigger `/api/cron/drop` manually with the Bearer token.
4. Then polish (below).

## Finishing tasks, in priority order

1. Env and deploy per README. Get one manual cron run to actually send a letter to a test address.
2. A minimal admin surface (even a protected page or a couple of SQL snippets in the README) to
   move people from `pending` to `active` and to fill in a man's profile fields after vetting.
3. Port `public/landing.html` into `src/app/page.tsx` as a real page if you want it on the root
   instead of a redirect. The form already posts to `/api/signup`; keep that contract.
4. Wire the re-confirmation send: a scheduled check that emails men whose `last_confirmed_at` is
   near the window edge, using `src/emails/Confirm.tsx` and a link to `/api/confirm?m=<id>`.
5. Sign the confirm token instead of using the raw man id.

## Gotchas

- `src/lib/supabase.ts` uses the service-role key and must stay server-only.
- The cron auth check compares `Authorization` to `Bearer ${CRON_SECRET}`. Vercel sends this
  automatically when `CRON_SECRET` is set as an env var.
- DB columns are snake_case; the app types are camelCase. Mapping happens in the cron route.
- Matching only ever runs on active women and men who are active and confirmed within the window.
  Impression rows are written only for letters that actually sent.

## Where the decisions are written down

- Matching and distribution logic, including the once-forever vs cooldown lever: see the matching
  spec doc that came with this project.
- Tunable numbers: `src/lib/config.ts`.
