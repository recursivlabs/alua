import React, { createContext, useContext, useEffect, type ReactNode } from 'react';
import type { Recursiv } from '@recursiv/sdk';
import { useAuth } from './AuthContext';
import { ensureDatabase } from '@/lib/database';
import { seedDatabase } from '@/lib/seed';

interface RecursivContextValue {
  sdk: Recursiv;
  orgId: string;
}

const RecursivContext = createContext<RecursivContextValue | null>(null);

export function RecursivProvider({ children }: { children: ReactNode }) {
  const { sdk, orgId } = useAuth();

  useEffect(() => {
    if (sdk) {
      ensureDatabase(sdk)
        .then(() => seedDatabase(sdk))
        .catch((err) =>
          console.warn('[RecursivProvider] DB setup error:', err.message)
        );
    }
  }, [sdk]);

  if (!sdk || !orgId) return null;

  return (
    <RecursivContext.Provider value={{ sdk, orgId }}>
      {children}
    </RecursivContext.Provider>
  );
}

export function useRecursiv() {
  const ctx = useContext(RecursivContext);
  if (!ctx) throw new Error('useRecursiv must be used within RecursivProvider');
  return ctx;
}
