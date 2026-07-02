# Wedding OS — Phase 1

A shared, mobile-first wedding planning app: Kanban board, budget tracker,
vendor CRM, and guest list with real headcount logic. Vite + React + Supabase,
deploys to Vercel. Real-time sync so you and your fiancée edit the same data live.

Runs in **demo mode out of the box** — no backend needed to look around.

---

## 1. Run locally (demo mode)

```bash
npm install
npm run dev
```

Open the printed URL (usually http://localhost:5173). You'll land on the board
with seed data. Click through Board / Budget / Vendors / Guests / Settings using
the bottom nav. Everything works, but changes live only in your browser and
reset on reload. Nothing is shared yet.

## 2. Make it real & shared (Supabase)

### a. Create the project
- supabase.com → New project (free tier is fine).
- **SQL Editor → New query** → paste all of `supabase/schema.sql` → Run.
  This creates the tables, turns on realtime, sets access, and seeds two people
  (Groom, Bride) plus the €15,000 default budget.

### b. Turn on email login
- Supabase → **Authentication → Providers → Email** → make sure it's enabled.
  Magic links work with the default setup. (You can style/limit senders later.)

### c. Add your keys
- Supabase → **Project Settings → API**. Copy the **Project URL** and the
  **anon public** key.
- Copy `.env.example` to `.env`:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

Restart `npm run dev`. Now you'll get a sign-in screen. Enter your email, click
the link it sends, and you're in — saving to Supabase and syncing live.

## 3. Deploy to Vercel

- Push this folder to a new GitHub repo.
- Vercel → **Add New → Project** → import the repo.
- Add the two environment variables (`VITE_SUPABASE_URL`,
  `VITE_SUPABASE_ANON_KEY`) under the project's settings.
- Deploy. Share the URL with your fiancée — she signs in with her own email and
  sees the same board.

> One deploy note: this is a single-page app. Vercel handles Vite SPA routing
> automatically, so `/guests`, `/budget` etc. work on refresh with no extra
> config. If you ever host somewhere that 404s on refresh, add a catch-all
> rewrite to `/index.html`.

---

## Test with two accounts before you trust it

This matters because the app holds vendor payment info. Do this once after deploy:

1. **Sign in on two devices** (or one browser + one incognito) with two
   different emails. Both should reach the board.
2. **Realtime:** add a task on device A → it should appear on device B within a
   second or two, no refresh. Repeat for a guest and a budget item.
3. **Guest math:** on device A, mark a guest **Confirmed** with 1 plus-one and
   1 kid-with-chair. Confirm the **paid headcount** on device B jumps by 3. Add
   a lap kid → **total bodies** rises but **paid headcount** does not.
4. **Delete safety:** delete a task on A → gone on B too.
5. If any of that fails, the usual cause is the realtime step in the SQL not
   running — re-run `schema.sql`.

---

## Where things live

- Columns, categories, pipeline stages, colors → `src/lib/constants.js`
- Demo/seed data → `src/lib/demoData.js`
- Data + auth + realtime + CRUD → `src/context/DataContext.jsx`
- Modules → `src/modules/` (Kanban, Budget, Vendors, Guests, Settings)
- Database → `supabase/schema.sql`

## Guest headcount logic (so you can trust the number)

Only **Confirmed** guests count toward money.

- **Paid headcount** = confirmed guests + their confirmed plus-ones + kids-with-chair (5yo+)
- **Lap kids** (under 5) are tracked but never billed
- **Total bodies** = paid headcount + lap kids

The tally header shows both numbers plus a per-side breakdown
(Serbian / Kazakh / Czech).

## Deliberately not in Phase 1

Dashboard rollup, venue comparison, timeline view → Phase 2. Permissions,
document storage, seating plan, and the rest → cut or deferred (see the spec).

## Security note

Login is the lock on the door: any signed-in user has full read/write. There
are no per-user roles in Phase 1 by design. Fine for a private board shared with
family. If the URL ever goes public, add role-based policies before trusting it.
