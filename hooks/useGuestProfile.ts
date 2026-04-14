import { useState, useEffect, useCallback } from 'react';
import { useRecursiv } from '@/contexts/RecursivContext';
import { useAuth } from '@/contexts/AuthContext';
import { dbQuery } from '@/lib/database';

export interface GuestProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  dietary: { restrictions: string[]; allergies: string[]; preferences: string } | null;
  medical: { conditions: string[]; medications: string[] } | null;
  emergency_contact: { name: string; phone: string; relationship: string } | null;
  experience_level: { surf: string; breathwork: string } | null;
  notes: string | null;
}

export function useGuestProfile() {
  const { sdk } = useRecursiv();
  const { user } = useAuth();
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) return;
    try {
      const rows = await dbQuery<GuestProfile>(sdk, `SELECT * FROM guest_profiles WHERE user_id = $1`, [user.id]);
      setProfile(rows[0] || null);
    } catch (err: any) {
      console.error('[useGuestProfile]', err);
    } finally {
      setLoading(false);
    }
  }, [sdk, user]);

  useEffect(() => { fetch(); }, [fetch]);

  const upsertProfile = useCallback(async (data: Partial<GuestProfile>) => {
    if (!user) return;
    const exists = !!profile;
    if (exists) {
      await dbQuery(sdk, `
        UPDATE guest_profiles SET
          full_name = COALESCE($2, full_name),
          phone = COALESCE($3, phone),
          dietary = COALESCE($4, dietary),
          medical = COALESCE($5, medical),
          emergency_contact = COALESCE($6, emergency_contact),
          experience_level = COALESCE($7, experience_level),
          notes = COALESCE($8, notes),
          updated_at = now()
        WHERE user_id = $1
      `, [user.id, data.full_name, data.phone, JSON.stringify(data.dietary), JSON.stringify(data.medical), JSON.stringify(data.emergency_contact), JSON.stringify(data.experience_level), data.notes]);
    } else {
      await dbQuery(sdk, `
        INSERT INTO guest_profiles (user_id, full_name, phone, dietary, medical, emergency_contact, experience_level, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [user.id, data.full_name, data.phone, JSON.stringify(data.dietary), JSON.stringify(data.medical), JSON.stringify(data.emergency_contact), JSON.stringify(data.experience_level), data.notes]);
    }
    await fetch();
  }, [sdk, user, profile, fetch]);

  return { profile, loading, upsertProfile, refresh: fetch };
}
