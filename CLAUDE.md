# Alua — Claude Code Instructions

Alua is a **men's breathwork and surf retreat brand**. This is a standalone Expo app
(web + native) built on the **Recursiv SDK** — Recursiv is the backend (auth, database,
AI agent, storage, email). There is no separate server in this repo; the app talks to the
Recursiv platform directly through `@recursiv/sdk`.

New here? Read this whole file once. It's the map: what the app is, how it uses Recursiv,
where things live, and how to do the common jobs. The two rules that matter most are the
**Voice** (below) and the **data layer** (raw SQL through the SDK — see "How Alua uses
Recursiv").

## Voice (read before writing ANY copy)

All guest-facing and marketing copy must follow the founder's voice profile at
[docs/voice-profile.md](docs/voice-profile.md). This applies to:

- Landing and marketing pages (`app/(tabs)/*`, `constants/content.ts`)
- Email templates (`constants/content.ts` → `DEFAULT_EMAIL_TEMPLATES`)
- FAQs (`constants/content.ts` → `DEFAULT_FAQS`)
- The concierge agent's replies (the agent prompt lives on the Recursiv platform, not in
  this repo, but it must embody the same voice)

The short version: quiet, not loud. Simple, not performative. Grounded and warm. The cure
is less, not more. Never use "it's not X, it's Y," guru-voice, coach-jargon ("hold space,"
"do the work"), or fear/scarcity. No em-dashes used to break a sentence mid-thought. Read
the full profile before writing.

## Positioning

Alua is a **men's** breathwork and surf retreat brand (confirmed 2026-06-02). Copy,
examples, and audience are framed for men, in the founder's voice. Keep the inclusive
practicalities (all levels, all ages 25-45, no experience needed) but the audience is men.
Avoid the bro / coaching status words the voice profile bans (warrior, alpha, king, elite,
high performance, etc.) — the masculinity here is "the courage to live with an open heart,"
quiet and grounded.

## How Alua uses Recursiv

Recursiv gives Alua four things through one SDK: **auth (API keys)**, a **per-project
Postgres database** (raw SQL), an **AI agent**, and **storage/email**. The wiring:

### Configuration — `lib/recursiv.ts`
The single source of the platform IDs (all overridable via `EXPO_PUBLIC_*` env vars):
- `BASE_URL` — `https://api.recursiv.io/api/v1`
- `ORG_ID` — the Recursiv organization that owns Alua
- `PROJECT_ID` — the Alua project (scopes the database + storage)
- `AGENT_ID` — the concierge AI agent (its system prompt lives in the Recursiv dashboard)

Exports `anonSdk` (anonymous, for public reads) and `createAuthedSdk(apiKey)` (per-user).

### Auth — `contexts/AuthContext.tsx`
Recursiv auth is **API-key based**. `signUp` / `signIn` create/return a scoped API key
(scopes listed in `API_KEY_SCOPES`), which is stored on-device via `lib/storage.ts` and
used to build the authenticated SDK. `signOut` clears it. `AUTH_VERSION` busts stored auth
when the shape changes. Use the `useAuth()` hook for `{ user, sdk, isAuthenticated, signIn,
signOut, ... }`.

### The SDK in React — `contexts/RecursivContext.tsx`
`RecursivProvider` (mounted only when signed in) runs `ensureDatabase(sdk)` then
`seedDatabase(sdk)` once on auth, and exposes the SDK to the tree. Two hooks:
- `useRecursiv()` — returns `{ sdk, orgId }`, **throws** if not signed in (use inside app
  screens that require auth).
- `useRecursivSafe()` — returns `null` when logged out (use on public pages so they fall
  back to bundled content instead of hanging).

### Database — `lib/database.ts` (the core pattern)
Recursiv hosts a Postgres database per project. Alua uses **raw parameterized SQL**, not an
ORM:
```ts
const rows = await dbQuery<Row>(sdk, `SELECT * FROM retreats WHERE status = $1`, ['published']);
```
- `dbQuery(sdk, sql, params)` → `sdk.databases.query({ project_id, database_name:
  'alua_production', sql, params })`, returns `response.data.rows`.
- `ensureDatabase(sdk)` provisions the DB (`sdk.databases.ensure`) and runs the schema
  **migrations** — a list of `CREATE TABLE IF NOT EXISTS ...` statements. Tables include
  `locations`, `retreats`, `experiences`, `bookings`, `faqs`, `email_templates`, and more
  (see the file for the full schema).
- **Always use `$1, $2, ...` placeholders** and pass values in `params` — never string-
  interpolate into SQL.

### Data hooks — `hooks/*` + `lib/cache.ts`
Screens never call `dbQuery` directly; they use a hook (`useRetreats`, `useExperiences`,
`useFaqs`, `useBookings`, `useGuestProfile`, `useLocations`, `useStudioContent`). The generic
one is `useDbQuery(cacheKey, sql, params)` — **stale-while-revalidate**: it paints from
`lib/cache.ts` synchronously, shows a skeleton only on a true first load, and revalidates in
the background. Logged-out visitors get bundled fallback content (from `constants/`) instead
of a spinner.

### Seed data — `lib/seed.ts` + `constants/`
`seedDatabase` is idempotent (it checks the `faqs` count as the "already seeded" marker) and
inserts defaults from `constants/content.ts`, `constants/locations.ts`, `constants/pricing.ts`.
Editing those constants changes what a fresh database is seeded with (existing DBs keep their
rows — seed only runs when the DB is empty).

### Concierge AI — `lib/ai.ts` + `hooks/useAiChat.ts` + `components/ai/ChatWidget`
`callAI(sdk, AGENT_ID, prompt, conversationId?)` calls
`sdk.agents.chatStreamText(agentId, { message, conversation_id })` and returns
`{ content, conversationId }` (with a small retry on empty responses). **The agent's system
prompt / knowledge is configured in the Recursiv dashboard, not in this repo** — to change
how the concierge behaves, edit the agent on the platform (it must follow the same Voice).

### Email — `lib/email.ts`
Transactional emails read a template from the `email_templates` DB table, interpolate
`{{var}}` placeholders, and send through the SDK. Template copy is seeded from
`DEFAULT_EMAIL_TEMPLATES` in `constants/content.ts` (Voice applies).

### Storage & Stripe
`lib/storage.ts` = on-device key/value (expo-secure-store / async-storage) for auth. Payments
(`lib/stripe.ts`) are **stubbed**, gated behind `EXPO_PUBLIC_STRIPE_CONFIGURED` — booking
flows work end-to-end without real charges until Stripe is wired.

## Project map

- `app/` — screens + routing (expo-router). `app/_layout.tsx` wires providers
  (`AuthProvider` → `RecursivProvider`) and the auth-gated navigator. Route groups:
  `(tabs)` (main app), `auth/`, `retreat/[id]`, `experience/[id]`, `booking/*`, `studio/[id]`.
- `contexts/` — `AuthContext` (API-key auth), `RecursivContext` (SDK provider + DB bootstrap).
- `lib/` — platform glue: `recursiv.ts` (IDs/SDK), `database.ts` (SQL + migrations),
  `seed.ts`, `ai.ts`, `email.ts`, `storage.ts`, `cache.ts`, `stripe.ts`, `waitlist.ts`.
- `hooks/` — one data hook per domain, all built on `dbQuery` + cache.
- `constants/` — `content.ts` (copy, FAQs, email templates), `locations.ts`, `pricing.ts`,
  `theme.ts` (`Brand` colors).
- `docs/voice-profile.md` — the writing bible.

## Dev workflow

```bash
npm install
npm run dev      # expo start (press w for web, i/a for simulators)
npm run web      # web only
npm run build    # expo export --platform web  -> dist/
npm start        # serve the built dist/ locally
```
Deploy: this repo is deployed as a Recursiv app (Coolify builds `npm run build` and serves
`dist/`). You don't deploy by hand — pushing to `main` is the trigger, or ask Jack.

## Common tasks

- **Add/edit guest copy, FAQs, or an email template** → `constants/content.ts` (follow the
  Voice). For copy already stored in the DB, also update the row (seed only fills an empty DB).
- **Add a database table** → add a `CREATE TABLE IF NOT EXISTS` to the migrations array in
  `lib/database.ts`, add matching seed rows in `lib/seed.ts` if needed, then add a typed
  `hooks/useThing.ts` that calls `useDbQuery`/`dbQuery`. Migrations run on next app load.
- **Read/write data on a screen** → use the matching hook (or `useDbQuery`); never inline
  SQL string-interpolation — always parameterize with `$1, $2`.
- **Change how the concierge AI answers** → edit the agent's prompt in the Recursiv
  dashboard (the `AGENT_ID` in `lib/recursiv.ts`), not in code. Keep it in Voice.
- **Point at a different Recursiv project/agent** → set the `EXPO_PUBLIC_RECURSIV_*` env
  vars (don't hardcode over the defaults in `lib/recursiv.ts`).

## Conventions & gotchas

- **Parameterize all SQL.** `$1, $2, …` + a `params` array. No string interpolation.
- **Public pages must use `useRecursivSafe()`** (or a bundled fallback) — the authed SDK
  doesn't exist when logged out, and `useRecursiv()` throws.
- **Seed is one-shot per empty DB.** Editing `constants/` won't rewrite existing rows.
- **The AI's brain is on the platform**, not in the repo — code only sends the message.
- **Styling** is per-screen `StyleSheet`; brand colors live in `constants/theme.ts`.
- **Everything guest-facing goes through the Voice.** When in doubt, quieter and simpler.
