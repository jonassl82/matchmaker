# Matchmaker

A private weekly introduction letter. Each woman gets a small, hand-vetted set of men and the
real places to meet them. She stays invisible. A man is never sent to the same woman twice, but
stays available to every other woman, including new members.

## Stack

- Next.js (App Router) on Vercel
- Supabase (Postgres) holds everyone and the impressions ledger, and is the source of truth for matching
- Resend + React Email sends each woman her own letter
- A weekly Vercel cron composes and sends the drop

No scraper, no matching service, no chat. The men come from your vetting, not a website.

## What's already built

- `supabase/schema.sql` — the three tables. The `impressions` unique constraint is what enforces "seen once".
- `src/lib/matching.ts` — the selection engine (per-woman dedupe, per-man weekly cap, fit and rotation). Tested.
- `src/lib/config.ts` — the knobs: drop size, weekly cap, confirmation window, vibe list.
- `src/emails/Drop.tsx` — the weekly letter. `Confirm.tsx` — the man re-confirmation email.
- `src/app/api/cron/drop` — the weekly job. `signup` — landing form intake. `confirm` — man re-confirm link.
- `public/landing.html` — the landing page, forms already wired to `/api/signup`.

## What you finish

- Create the Supabase and Resend accounts and paste the keys (steps below).
- Verify a sending domain in Resend so `EMAIL_FROM` works.
- Optional polish Claude Code can do: port `landing.html` into a real Next page, sign the confirm
  token instead of using the raw man id, add a tiny admin view to flip people from pending to active.

## Ship it

You already have GitHub and Vercel connected, so this is mostly pasting keys.

1. Push this folder to a new GitHub repo.

2. Supabase. Create a project. Open the SQL editor, paste `supabase/schema.sql`, run it. Then
   (optional, for a test send) edit the email in `supabase/seed.sql` to your own address and run it.
   In Project settings, API, copy the Project URL and the service_role key.

3. Resend. Create an account and an API key. Add your sending domain and complete the DNS records
   it gives you, so email can come from something like `hello@yourdomain.com`. Set `EMAIL_FROM` to
   that address. (While testing you can use Resend's onboarding sender, but a verified domain lands better.)

4. Vercel. Import the repo. Add these environment variables (see `.env.example`):
   `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`, `CRON_SECRET`
   (any long random string), `APP_URL`. Deploy.

5. The cron. `vercel.json` runs `/api/cron/drop` every Wednesday at 07:00 UTC. Vercel automatically
   sends your `CRON_SECRET` as a Bearer token, which the route checks. To fire it manually now:

   ```
   curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-app.vercel.app/api/cron/drop
   ```

   It returns how many women were active, how many men were eligible, and how many letters sent.

## Running the first real test

1. Recruit a small seed group of women and hand-pick a few good men.
2. Add them to Supabase (Table editor, or a quick SQL insert like `seed.sql`). Fill the men fully:
   name, age, city, ig, description, open_to, places, vibes. Set everyone you approve to `status = active`.
3. Make sure each active man's `last_confirmed_at` is recent (inside the 8-week window).
4. Trigger the cron manually (above) or wait for Wednesday.
5. Watch the one thing that matters: do women reply asking for next week, or forward it to a friend.

## The knobs

All in `src/lib/config.ts`:

- `DROP_SIZE` — men per letter (5).
- `MAN_WEEKLY_CAP` — max women one man reaches in a week (4). This is the "don't blast your best guy to everyone" guard.
- `CONFIRM_WINDOW_WEEKS` — how long a man stays eligible after confirming (8). Past that he pauses until he re-confirms.
- `VIBES` — the taste vocabulary. Men are tagged; women pick what they like.

To switch the dedupe from "never again" to a cooldown, change the impressions read in the cron so
it only excludes impressions newer than N weeks. One line, nothing else moves.

## Local dev

```
npm install
npm run test        # runs the matching engine tests
npm run email       # preview the email templates locally
cp .env.example .env.local   # fill in for local runs
npm run dev
```

## Security notes

- `SUPABASE_SERVICE_ROLE_KEY` is server-only. It's used in route handlers, never shipped to the browser. Don't import `src/lib/supabase.ts` into a client component.
- RLS is on for all tables with no policies, so the public anon key can read and write nothing. Only the server (service role) touches data.
- The confirm link currently uses the man's id as the token. Fine for a closed test. Before wider use, swap it for a signed token.
