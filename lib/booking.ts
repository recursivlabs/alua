import { Platform, Linking } from 'react-native';
import * as storage from './storage';
import { BASE_URL } from './recursiv';

/**
 * Live booking + membership via the platform's BYOK Stripe (the org's own
 * Stripe key, set in Recursiv org settings). These call the app-subscription
 * REST routes directly with the signed-in user's API key:
 *
 *   POST /app-subscriptions/checkout-booking   one-time retreat/experience payment
 *   GET  /app-subscriptions/booking-session/:id verify a returned checkout
 *   POST /app-subscriptions/checkout            Studio membership (subscription)
 *   GET  /app-subscriptions/status              current membership
 *   POST /app-subscriptions/portal              manage/cancel membership
 *
 * Everything is gated behind BOOKING_ENABLED so the site stays a waitlist until
 * the org's Stripe key is set and we flip the flag on.
 */

/** Master switch. Off until Tim's Stripe key is set in the Alua org settings. */
export const BOOKING_ENABLED = process.env.EXPO_PUBLIC_BOOKING_ENABLED === 'true';

/** Public site origin, used to build Stripe return URLs on native. */
const SITE_URL = process.env.EXPO_PUBLIC_SITE_URL || 'https://alua.on.recursiv.io';

const API_KEY_STORAGE = 'alua:api_key';

async function getApiKey(): Promise<string | null> {
  return storage.getItem(API_KEY_STORAGE);
}

/** Absolute URL for a return path, so Stripe can redirect back to the app. */
export function absoluteUrl(path: string): string {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return `${window.location.origin}${path}`;
  }
  return `${SITE_URL}${path}`;
}

/** Send the browser to a Stripe-hosted URL. */
async function redirectTo(url: string): Promise<void> {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.location.href = url;
  } else {
    await Linking.openURL(url);
  }
}

type Result = { ok: true } | { ok: false; error: string };

async function postJson(path: string, body: unknown): Promise<{ ok: boolean; status: number; json: any }> {
  const apiKey = await getApiKey();
  if (!apiKey) return { ok: false, status: 401, json: { message: 'not_authenticated' } };
  const resp = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await resp.json().catch(() => ({}));
  return { ok: resp.ok, status: resp.status, json };
}

function errMessage(json: any, fallback: string): string {
  return json?.message || json?.error || fallback;
}

/**
 * Start a one-time checkout for a retreat/experience, then redirect to Stripe.
 * Returns before the redirect completes on web (page navigates away).
 */
export async function startBooking(item: {
  name: string;
  amountCents: number;
  itemType: 'retreat' | 'experience';
  itemId: string;
  quantity?: number;
  returnPath?: string;
}): Promise<Result> {
  if (!BOOKING_ENABLED) return { ok: false, error: 'booking_disabled' };
  const returnUrl = absoluteUrl(item.returnPath || '/booking/confirmation');
  const { ok, json } = await postJson('/app-subscriptions/checkout-booking', {
    name: item.name,
    amount_cents: item.amountCents,
    item_type: item.itemType,
    item_id: item.itemId,
    quantity: item.quantity,
    return_url: returnUrl,
  });
  if (!ok) return { ok: false, error: errMessage(json, 'checkout_failed') };
  const url = json?.data?.url;
  if (!url) return { ok: false, error: 'no_checkout_url' };
  await redirectTo(url);
  return { ok: true };
}

export interface BookingSession {
  paid: boolean;
  amountTotal: number | null;
  currency: string | null;
  itemType: string;
  itemId: string;
}

/** Verify a returned checkout session against the org's Stripe. */
export async function verifyBookingSession(sessionId: string): Promise<BookingSession | null> {
  const apiKey = await getApiKey();
  if (!apiKey) return null;
  try {
    const resp = await fetch(
      `${BASE_URL}/app-subscriptions/booking-session/${encodeURIComponent(sessionId)}`,
      { headers: { Authorization: `Bearer ${apiKey}` } },
    );
    if (!resp.ok) return null;
    const json = await resp.json().catch(() => ({}));
    const d = json?.data;
    if (!d) return null;
    return {
      paid: !!d.paid,
      amountTotal: d.amountTotal ?? null,
      currency: d.currency ?? null,
      itemType: d.itemType ?? '',
      itemId: d.itemId ?? '',
    };
  } catch {
    return null;
  }
}

/** Start a Studio membership subscription checkout, then redirect to Stripe. */
export async function startSubscription(opts: {
  tier: 'monthly' | 'annual';
  returnPath?: string;
}): Promise<Result> {
  if (!BOOKING_ENABLED) return { ok: false, error: 'booking_disabled' };
  // Web strips the (tabs) route group, so Stripe return URLs use the bare path.
  const returnUrl = absoluteUrl(opts.returnPath || '/studio');
  const { ok, json } = await postJson('/app-subscriptions/checkout', {
    tier: opts.tier,
    return_url: returnUrl,
  });
  if (!ok) return { ok: false, error: errMessage(json, 'subscription_failed') };
  const url = json?.data?.url;
  if (!url) return { ok: false, error: 'no_checkout_url' };
  await redirectTo(url);
  return { ok: true };
}

export interface SubscriptionStatus {
  tier: string;
  status: 'active' | 'past_due' | 'canceled' | 'none';
  active: boolean;
  currentPeriodEnd: string | null;
}

/** Read the current membership status for the signed-in user. */
export async function getSubscriptionStatus(): Promise<SubscriptionStatus | null> {
  const apiKey = await getApiKey();
  if (!apiKey) return null;
  try {
    const resp = await fetch(`${BASE_URL}/app-subscriptions/status`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!resp.ok) return null;
    const json = await resp.json().catch(() => ({}));
    return (json?.data as SubscriptionStatus) ?? null;
  } catch {
    return null;
  }
}

/** Open the Stripe billing portal to manage/cancel the membership. */
export async function openBillingPortal(returnPath = '/studio'): Promise<Result> {
  if (!BOOKING_ENABLED) return { ok: false, error: 'booking_disabled' };
  const { ok, json } = await postJson('/app-subscriptions/portal', {
    return_url: absoluteUrl(returnPath),
  });
  if (!ok) return { ok: false, error: errMessage(json, 'portal_failed') };
  const url = json?.data?.url;
  if (!url) return { ok: false, error: 'no_portal_url' };
  await redirectTo(url);
  return { ok: true };
}
