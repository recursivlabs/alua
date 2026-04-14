import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { Platform } from 'react-native';
import { Recursiv } from '@recursiv/sdk';
import { anonSdk, createAuthedSdk, ORG_ID } from '@/lib/recursiv';

// Direct localStorage on web, SecureStore on native
const storage = {
  async get(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
    }
    const SecureStore = require('expo-secure-store');
    return SecureStore.getItemAsync(key);
  },
  async set(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
      return;
    }
    const SecureStore = require('expo-secure-store');
    await SecureStore.setItemAsync(key, value);
  },
  async remove(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') window.localStorage.removeItem(key);
      return;
    }
    const SecureStore = require('expo-secure-store');
    await SecureStore.deleteItemAsync(key);
  },
};

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

const AuthContext = createContext<AuthContextValue | null>(null);

const K = {
  apiKey: 'alua_api_key',
  user: 'alua_user',
  orgId: 'alua_org_id',
  version: 'alua_auth_version',
};

const AUTH_VERSION = '1';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sdk, setSdk] = useState<Recursiv | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restore();
  }, []);

  const restore = async () => {
    try {
      const ver = await storage.get(K.version);
      if (ver !== AUTH_VERSION) {
        await clear();
        await storage.set(K.version, AUTH_VERSION);
        setIsLoading(false);
        return;
      }

      const [storedKey, storedUser, storedOrg] = await Promise.all([
        storage.get(K.apiKey),
        storage.get(K.user),
        storage.get(K.orgId),
      ]);

      if (storedKey && storedUser) {
        const authedSdk = createAuthedSdk(storedKey);
        try {
          await authedSdk.users.me();
          setSdk(authedSdk);
          setUser(JSON.parse(storedUser));
          setOrgId(storedOrg);
        } catch {
          await clear();
        }
      }
    } catch (err) {
      console.error('[Auth] restore error:', err);
      await clear();
    } finally {
      setIsLoading(false);
    }
  };

  const persist = async (apiKey: string, authUser: AuthUser) => {
    await Promise.all([
      storage.set(K.apiKey, apiKey),
      storage.set(K.user, JSON.stringify(authUser)),
      storage.set(K.version, AUTH_VERSION),
      storage.set(K.orgId, ORG_ID),
    ]);
  };

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const result = await anonSdk.auth.signUpAndCreateKey(
      { name, email, password },
      { name: 'alua-' + Date.now(), scopes: [...API_KEY_SCOPES], organizationId: ORG_ID },
    );
    const authedSdk = createAuthedSdk(result.apiKey);
    const authUser: AuthUser = {
      id: result.user?.id || '',
      name: result.user?.name || name,
      email: result.user?.email || email,
      image: result.user?.image ?? null,
    };
    await persist(result.apiKey, authUser);
    setSdk(authedSdk);
    setUser(authUser);
    setOrgId(ORG_ID);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await anonSdk.auth.signInAndCreateKey(
      { email, password },
      { name: 'alua-' + Date.now(), scopes: [...API_KEY_SCOPES], organizationId: ORG_ID },
    );
    const authedSdk = createAuthedSdk(result.apiKey);
    const authUser: AuthUser = {
      id: result.user?.id || '',
      name: result.user?.name || '',
      email: result.user?.email || email,
      image: result.user?.image ?? null,
    };
    await persist(result.apiKey, authUser);
    setSdk(authedSdk);
    setUser(authUser);
    setOrgId(ORG_ID);
  }, []);

  const signOut = useCallback(async () => {
    await clear();
    setSdk(null);
    setUser(null);
    setOrgId(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, sdk, orgId, isLoading, isAuthenticated: !!sdk && !!user, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

async function clear() {
  await Promise.all([
    storage.remove(K.apiKey),
    storage.remove(K.user),
    storage.remove(K.orgId),
  ]);
}
