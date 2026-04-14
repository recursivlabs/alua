import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recursiv } from '@recursiv/sdk';
import { anonSdk, createAuthedSdk, ORG_ID } from '@/lib/recursiv';

const secureStorage = {
  getItemAsync: (key: string): Promise<string | null> =>
    Platform.OS === 'web' ? AsyncStorage.getItem(key) : SecureStore.getItemAsync(key),
  setItemAsync: (key: string, value: string): Promise<void> =>
    Platform.OS === 'web' ? AsyncStorage.setItem(key, value) : SecureStore.setItemAsync(key, value),
  deleteItemAsync: (key: string): Promise<void> =>
    Platform.OS === 'web' ? AsyncStorage.removeItem(key) : SecureStore.deleteItemAsync(key),
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

const KEYS = {
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
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const storedVersion = await secureStorage.getItemAsync(KEYS.version);
      if (storedVersion !== AUTH_VERSION) {
        await clearStorage();
        await secureStorage.setItemAsync(KEYS.version, AUTH_VERSION);
        setIsLoading(false);
        return;
      }

      const [storedApiKey, storedUser] = await Promise.all([
        secureStorage.getItemAsync(KEYS.apiKey),
        secureStorage.getItemAsync(KEYS.user),
      ]);
      const storedOrgId = await secureStorage.getItemAsync(KEYS.orgId);

      if (storedApiKey && storedUser) {
        const authedSdk = createAuthedSdk(storedApiKey);
        try {
          await authedSdk.users.me();
          setSdk(authedSdk);
          setUser(JSON.parse(storedUser));
          setOrgId(storedOrgId);
        } catch {
          await clearStorage();
        }
      }
    } catch (err) {
      console.error('[Auth] restore error:', err);
      await clearStorage();
    } finally {
      setIsLoading(false);
    }
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

    await Promise.all([
      secureStorage.setItemAsync(KEYS.apiKey, result.apiKey),
      secureStorage.setItemAsync(KEYS.user, JSON.stringify(authUser)),
      secureStorage.setItemAsync(KEYS.version, AUTH_VERSION),
      secureStorage.setItemAsync(KEYS.orgId, ORG_ID),
    ]);

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

    await Promise.all([
      secureStorage.setItemAsync(KEYS.apiKey, result.apiKey),
      secureStorage.setItemAsync(KEYS.user, JSON.stringify(authUser)),
      secureStorage.setItemAsync(KEYS.version, AUTH_VERSION),
      secureStorage.setItemAsync(KEYS.orgId, ORG_ID),
    ]);

    setSdk(authedSdk);
    setUser(authUser);
    setOrgId(ORG_ID);
  }, []);

  const signOut = useCallback(async () => {
    await clearStorage();
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

async function clearStorage() {
  await Promise.all([
    secureStorage.deleteItemAsync(KEYS.apiKey),
    secureStorage.deleteItemAsync(KEYS.user),
    secureStorage.deleteItemAsync(KEYS.orgId),
  ]);
}
