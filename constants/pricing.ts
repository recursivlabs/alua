export const RETREAT_PRICING: Record<string, number> = {
  'sri-lanka': 180000,   // $1,800
  'lombok': 220000,      // $2,200
  'costa-rica': 250000,  // $2,500
};

export const EXPERIENCE_PRICING: Record<string, number> = {
  'sri-lanka': 9500,     // $95
  'lombok': 12000,       // $120
  'costa-rica': 16500,   // $165
};

export const STUDIO_PRICING = {
  monthly: 2200,  // $22/mo
  annual: 17900,  // $179/yr ($14.92/mo effective)
};

export const CANCELLATION_POLICY = [
  { daysBefore: 60, refundPercent: 100 },
  { daysBefore: 30, refundPercent: 50 },
  { daysBefore: 0, refundPercent: 0 },
];

export function formatPrice(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
