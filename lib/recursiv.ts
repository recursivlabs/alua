import { Recursiv } from '@recursiv/sdk';

export const BASE_URL =
  process.env.EXPO_PUBLIC_RECURSIV_BASE_URL || 'https://api.recursiv.io/api/v1';

export const ORG_ID =
  process.env.EXPO_PUBLIC_RECURSIV_ORG_ID || '019d8c90-8bde-72cd-b672-200dc16b284e';

export const PROJECT_ID =
  process.env.EXPO_PUBLIC_RECURSIV_PROJECT_ID || '019d8ca4-18f1-742b-95b6-b886af9da3b0';

export const AGENT_ID =
  process.env.EXPO_PUBLIC_RECURSIV_AGENT_ID || 'b906697d-9617-4a02-b49a-1f7fd1bdfacf';

export const anonSdk = new Recursiv({
  baseUrl: BASE_URL,
  anonymous: true,
});

export function createAuthedSdk(apiKey: string): Recursiv {
  return new Recursiv({
    apiKey,
    baseUrl: BASE_URL,
    timeout: 300_000,
  });
}
