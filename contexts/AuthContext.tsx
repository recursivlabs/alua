import * as React from 'react';
import { Recursiv } from '@recursiv/sdk';
import { anonSdk, createAuthedSdk, ORG_ID } from '@/lib/recursiv';
import * as storage from '@/lib/storage';

const KEYS = {
  apiKey: 'alua:api_key',
  user: 'alua:user',
  orgId: 'alua:org_id',
  version: 'alua:auth_version',
};

const AUTH_VERSION = '1';

const API_KEY_SCOPES = [
  'posts:read', 'posts:write',
  'users:read',
  'communities:read', 'communities:write',
  'chat:read', 'chat:write',
  'projects:read', 'projects:write',
  'agents:read', 'agents:write',
  'tags:read', 'tags:write',
  'commands:write', 'commands:read',
  'storage:read', 'storage:write',
  'organizations:read', 'organizations:write',
  'databases:read', 'databases:write',
] as const;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  sdk: Recursiv | null;
  orgId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [authedSdk, setAuthedSdk] = React.useState<Recursiv | null>(null);
  const [orgId, setOrgId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const storedVersion = await storage.getItem(KEYS.version);
        if (storedVersion !== AUTH_VERSION) {
          await clearStorage();
          setIsLoading(false);
          return;
        }

        const [storedApiKey, storedUser, storedOrgId] = await Promise.all([
          storage.getItem(KEYS.apiKey),
          storage.getItem(KEYS.user),
          storage.getItem(KEYS.orgId),
        ]);

        if (storedApiKey && storedUser) {
          const sdk = createAuthedSdk(storedApiKey);
          try {
            await sdk.users.me();
            setAuthedSdk(sdk);
            setUser(JSON.parse(storedUser));
            setOrgId(storedOrgId);
          } catch {
            await clearStorage();
          }
        }
      } catch {
        await clearStorage();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  async function clearStorage() {
    await Promise.all([
      storage.removeItem(KEYS.apiKey),
      storage.removeItem(KEYS.user),
      storage.removeItem(KEYS.orgId),
      storage.removeItem(KEYS.version),
    ]).catch(() => {});
  }

  async function persistSession(apiKey: string, authUser: AuthUser) {
    const sdk = createAuthedSdk(apiKey);
    await Promise.all([
      storage.setItem(KEYS.apiKey, apiKey),
      storage.setItem(KEYS.user, JSON.stringify(authUser)),
      storage.setItem(KEYS.orgId, ORG_ID),
      storage.setItem(KEYS.version, AUTH_VERSION),
    ]);
    setAuthedSdk(sdk);
    setUser(authUser);
    setOrgId(ORG_ID);
  }

  const signUp = React.useCallback(async (name: string, email: string, password: string) => {
    const result = await anonSdk.auth.signUpAndCreateKey(
      { name, email, password },
      { name: 'alua-' + Date.now(), scopes: [...API_KEY_SCOPES], organizationId: ORG_ID },
    );
    await persistSession(result.apiKey, {
      id: result.user?.id || '',
      name: result.user?.name || name,
      email: result.user?.email || email,
      image: result.user?.image ?? null,
    });
  }, []);

  const signIn = React.useCallback(async (email: string, password: string) => {
    const result = await anonSdk.auth.signInAndCreateKey(
      { email, password },
      { name: 'alua-' + Date.now(), scopes: [...API_KEY_SCOPES], organizationId: ORG_ID },
    );
    await persistSession(result.apiKey, {
      id: result.user?.id || '',
      name: result.user?.name || '',
      email: result.user?.email || email,
      image: result.user?.image ?? null,
    });
  }, []);

  const signOut = React.useCallback(async () => {
    await clearStorage();
    setAuthedSdk(null);
    setUser(null);
    setOrgId(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        sdk: authedSdk,
        orgId,
        isLoading,
        isAuthenticated: !!authedSdk && !!user,
        signUp,
        signIn,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
