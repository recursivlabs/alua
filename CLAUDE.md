# Alua — Claude Code Instructions

Alua is a breathwork and surf retreat brand. Standalone Expo app (web + native), built on
the Recursiv SDK.

## Voice (read before writing any copy)

All guest-facing and marketing copy must follow the founder's voice profile at
[docs/voice-profile.md](docs/voice-profile.md). This applies to:

- Landing and marketing pages (`app/(tabs)/*`, `constants/content.ts`)
- Email templates (`constants/content.ts` → `DEFAULT_EMAIL_TEMPLATES`)
- FAQs (`constants/content.ts` → `DEFAULT_FAQS`)
- The concierge agent's replies (agent prompt lives on the Recursiv platform, not in this
  repo, but it must embody the same voice)

The short version: quiet, not loud. Simple, not performative. Grounded and warm. The cure
is less, not more. Never use "it's not X, it's Y," guru-voice, coach-jargon ("hold space,"
"do the work"), or fear/scarcity. No em-dashes used to break a
sentence mid-thought. Read the full profile before writing.

## Architecture

- API via `@recursiv/sdk` (see `lib/recursiv.ts` for `PROJECT_ID`, `ORG_ID`, `AGENT_ID`).
- Concierge AI: `lib/ai.ts` calls the platform agent by `AGENT_ID`; the system prompt is
  configured in the Recursiv platform UI, not here.
- Styling: inline `StyleSheet` per screen.
- Stripe: stubbed in `lib/stripe.ts`, gated behind `EXPO_PUBLIC_STRIPE_CONFIGURED`.

## Open product question

The founder's persona frames Alua as a men's breathwork and surf brand, but the app and
original brand brief were built gender-neutral (ideal audience 25-45). Do not narrow copy or
imagery to men's-only until this is explicitly confirmed.
