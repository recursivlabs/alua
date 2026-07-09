import { Linking, Platform } from 'react-native';

/**
 * Alua is pre-launch (Fall 2026). Every "join the waitlist" CTA points at
 * Tim's existing Kit (ConvertKit) list, the same one the Instagram bio links
 * to, so the whole audience lives in one place he already emails from.
 */
export const WAITLIST_URL =
  'https://tim-krause-coaching.kit.com/25019947f6?utm_source=alua_site&utm_medium=web&utm_content=waitlist';

export function openWaitlist(): void {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.open(WAITLIST_URL, '_blank', 'noopener,noreferrer');
  } else {
    Linking.openURL(WAITLIST_URL);
  }
}
