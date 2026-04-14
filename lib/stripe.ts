import type { Recursiv } from '@recursiv/sdk';
import { PROJECT_ID } from './recursiv';

/**
 * Stripe integration via Recursiv SDK billing module.
 *
 * To activate:
 * 1. Friend creates a Stripe account at stripe.com
 * 2. Get the Stripe secret key from Stripe Dashboard > Developers > API Keys
 * 3. Add it to the Recursiv project settings (or contact Jack)
 * 4. Set STRIPE_CONFIGURED=true in env
 *
 * Once configured, all checkout/subscription flows will use real Stripe payments.
 */

export const STRIPE_CONFIGURED = !!process.env.EXPO_PUBLIC_STRIPE_CONFIGURED;

/** Create a one-time checkout session for a retreat or experience */
export async function createCheckoutSession(
  sdk: Recursiv,
  opts: {
    itemType: 'retreat' | 'experience';
    itemTitle: string;
    priceCents: number;
    successUrl: string;
    cancelUrl: string;
  }
): Promise<{ url: string } | null> {
  if (!STRIPE_CONFIGURED) return null;

  try {
    const result = await sdk.billing.createCheckoutSession({
      project_id: PROJECT_ID,
      mode: 'payment',
      line_items: [{
        name: opts.itemTitle,
        amount: opts.priceCents,
        currency: 'usd',
        quantity: 1,
      }],
      success_url: opts.successUrl,
      cancel_url: opts.cancelUrl,
    });
    return { url: result.data?.url || '' };
  } catch (err: any) {
    console.error('[stripe] Checkout session failed:', err.message);
    return null;
  }
}

/** Create a subscription checkout for the online studio */
export async function createStudioSubscription(
  sdk: Recursiv,
  opts: {
    plan: 'monthly' | 'annual';
    successUrl: string;
    cancelUrl: string;
  }
): Promise<{ url: string } | null> {
  if (!STRIPE_CONFIGURED) return null;

  const priceMap = {
    monthly: 2200,  // $22/mo
    annual: 17900,  // $179/yr
  };

  try {
    const result = await sdk.billing.createCheckoutSession({
      project_id: PROJECT_ID,
      mode: 'subscription',
      line_items: [{
        name: `Alua Online Studio (${opts.plan})`,
        amount: priceMap[opts.plan],
        currency: 'usd',
        quantity: 1,
        recurring: opts.plan === 'monthly' ? { interval: 'month' } : { interval: 'year' },
      }],
      success_url: opts.successUrl,
      cancel_url: opts.cancelUrl,
    });
    return { url: result.data?.url || '' };
  } catch (err: any) {
    console.error('[stripe] Studio subscription failed:', err.message);
    return null;
  }
}

/** Open Stripe billing portal for subscription management */
export async function openBillingPortal(
  sdk: Recursiv,
  returnUrl: string
): Promise<{ url: string } | null> {
  if (!STRIPE_CONFIGURED) return null;

  try {
    const result = await sdk.billing.createPortalSession({
      project_id: PROJECT_ID,
      return_url: returnUrl,
    });
    return { url: result.data?.url || '' };
  } catch (err: any) {
    console.error('[stripe] Portal session failed:', err.message);
    return null;
  }
}
