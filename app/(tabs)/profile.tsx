import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useRecursivSafe } from '@/contexts/RecursivContext';
import { dbQuery } from '@/lib/database';
import { formatPrice } from '@/constants/pricing';
import type { Booking } from '@/hooks/useBookings';
import type { GuestProfile } from '@/hooks/useGuestProfile';

const C = {
  bg: '#FAF7F4', text: '#1A1A1A', textLight: '#6B6560', textMuted: '#A09890',
  accent: '#C4956A', dark: '#1A2F38', cream: '#F0EBE4', border: '#E8E0D8', white: '#FFF',
};

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, signOut } = useAuth();
  const ctx = useRecursivSafe();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dietary, setDietary] = useState('');
  const [medical, setMedical] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [surfLevel, setSurfLevel] = useState('beginner');
  const [breathworkLevel, setBreathworkLevel] = useState('beginner');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!ctx?.sdk || !user) return;
    dbQuery<Booking>(ctx.sdk, `
      SELECT b.*, COALESCE(r.title, e.title) as item_title, COALESCE(rl.name, el.name) as location_name, r.start_date
      FROM bookings b
      LEFT JOIN retreats r ON b.booking_type = 'retreat' AND b.item_id = r.id
      LEFT JOIN locations rl ON r.location_id = rl.id
      LEFT JOIN experiences e ON b.booking_type = 'experience' AND b.item_id = e.id
      LEFT JOIN locations el ON e.location_id = el.id
      WHERE b.user_id = $1 ORDER BY b.booked_at DESC
    `, [user.id]).then(setBookings).catch(console.error);

    dbQuery<GuestProfile>(ctx.sdk, `SELECT * FROM guest_profiles WHERE user_id = $1`, [user.id])
      .then((rows) => {
        const p = rows[0];
        if (p) {
          setProfile(p);
          setFullName(p.full_name || '');
          setPhone(p.phone || '');
          setDietary((p.dietary as any)?.preferences || '');
          setMedical((p.medical as any)?.conditions?.join(', ') || '');
          setEmergencyName((p.emergency_contact as any)?.name || '');
          setEmergencyPhone((p.emergency_contact as any)?.phone || '');
          setSurfLevel((p.experience_level as any)?.surf || 'beginner');
          setBreathworkLevel((p.experience_level as any)?.breathwork || 'beginner');
        }
      }).catch(console.error);
  }, [ctx?.sdk, user]);

  if (!isAuthenticated) {
    return (
      <View style={[s.container, { paddingTop: insets.top + 80, alignItems: 'center' }]}>
        <Text style={s.headline}>Your Profile</Text>
        <Text style={[s.body, { textAlign: 'center', marginBottom: 32 }]}>
          Sign in to manage your bookings and guest profile.
        </Text>
        <TouchableOpacity style={s.ctaButton} onPress={() => router.push('/auth/sign-in')}>
          <Text style={s.ctaButtonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 16 }} onPress={() => router.push('/auth/sign-up')}>
          <Text style={{ fontSize: 15, fontWeight: '500', color: C.dark }}>Create Account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSave = async () => {
    if (!ctx?.sdk || !user) return;
    setSaving(true);
    try {
      const data = {
        dietary: JSON.stringify({ restrictions: [], allergies: [], preferences: dietary }),
        medical: JSON.stringify({ conditions: medical ? medical.split(',').map(s => s.trim()) : [], medications: [] }),
        emergency_contact: JSON.stringify({ name: emergencyName, phone: emergencyPhone, relationship: '' }),
        experience_level: JSON.stringify({ surf: surfLevel, breathwork: breathworkLevel }),
      };
      if (profile) {
        await dbQuery(ctx.sdk, `UPDATE guest_profiles SET full_name=$2, phone=$3, dietary=$4, medical=$5, emergency_contact=$6, experience_level=$7, updated_at=now() WHERE user_id=$1`,
          [user.id, fullName, phone, data.dietary, data.medical, data.emergency_contact, data.experience_level]);
      } else {
        await dbQuery(ctx.sdk, `INSERT INTO guest_profiles (user_id, full_name, phone, dietary, medical, emergency_contact, experience_level) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [user.id, fullName, phone, data.dietary, data.medical, data.emergency_contact, data.experience_level]);
      }
      Alert.alert('Saved', 'Your profile has been updated.');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: insets.top + 40, paddingBottom: insets.bottom + 60 }} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <Text style={s.eyebrow}>PROFILE</Text>
        <Text style={s.headline}>{user?.name || 'Guest'}</Text>
        <Text style={s.body}>{user?.email}</Text>
      </View>

      {/* Bookings */}
      {bookings.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>My Bookings</Text>
          {bookings.map((b) => (
            <View key={b.id} style={s.bookingItem}>
              <View style={s.bookingHeader}>
                <Text style={s.bookingTitle}>{b.item_title || b.booking_type}</Text>
                <Text style={s.bookingPrice}>{formatPrice(b.amount_cents)}</Text>
              </View>
              {b.location_name && <Text style={s.bookingLocation}>{b.location_name}</Text>}
              <Text style={s.bookingStatus}>{b.status}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Guest Profile Form */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Guest Profile</Text>
        <Text style={[s.body, { marginBottom: 20 }]}>This info helps us prepare for your arrival.</Text>

        <Text style={s.inputLabel}>Full Name</Text>
        <TextInput style={s.input} value={fullName} onChangeText={setFullName} placeholder="Your full name" placeholderTextColor={C.textMuted} />

        <Text style={s.inputLabel}>Phone</Text>
        <TextInput style={s.input} value={phone} onChangeText={setPhone} placeholder="+1 555 123 4567" placeholderTextColor={C.textMuted} keyboardType="phone-pad" />

        <Text style={s.inputLabel}>Dietary Needs</Text>
        <TextInput style={s.input} value={dietary} onChangeText={setDietary} placeholder="Vegetarian, allergies, etc." placeholderTextColor={C.textMuted} />

        <Text style={s.inputLabel}>Medical Conditions</Text>
        <TextInput style={s.input} value={medical} onChangeText={setMedical} placeholder="Any conditions or medications" placeholderTextColor={C.textMuted} />

        <Text style={s.inputLabel}>Emergency Contact</Text>
        <TextInput style={s.input} value={emergencyName} onChangeText={setEmergencyName} placeholder="Contact name" placeholderTextColor={C.textMuted} />
        <TextInput style={[s.input, { marginTop: 8 }]} value={emergencyPhone} onChangeText={setEmergencyPhone} placeholder="Contact phone" placeholderTextColor={C.textMuted} keyboardType="phone-pad" />

        <Text style={s.inputLabel}>Surf Level</Text>
        <View style={s.levelRow}>
          {['beginner', 'intermediate', 'advanced'].map((l) => (
            <TouchableOpacity key={l} style={[s.levelChip, surfLevel === l && { backgroundColor: C.dark }]} onPress={() => setSurfLevel(l)}>
              <Text style={[s.levelText, { color: surfLevel === l ? C.white : C.text }]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.inputLabel}>Breathwork Level</Text>
        <View style={s.levelRow}>
          {['beginner', 'intermediate', 'advanced'].map((l) => (
            <TouchableOpacity key={l} style={[s.levelChip, breathworkLevel === l && { backgroundColor: C.dark }]} onPress={() => setBreathworkLevel(l)}>
              <Text style={[s.levelText, { color: breathworkLevel === l ? C.white : C.text }]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[s.ctaButton, { marginTop: 24 }]} onPress={handleSave} disabled={saving}>
          <Text style={s.ctaButtonText}>{saving ? 'Saving...' : 'Save Profile'}</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Out */}
      <View style={[s.section, { paddingBottom: 40 }]}>
        <TouchableOpacity style={s.signOutBtn} onPress={() => signOut()}>
          <Text style={s.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 32 },
  header: { paddingHorizontal: 32, marginBottom: 32 },
  eyebrow: { fontSize: 11, fontWeight: '600', letterSpacing: 4, color: C.accent, textTransform: 'uppercase', marginBottom: 12 },
  headline: { fontSize: 32, fontWeight: '200', color: C.text, letterSpacing: -0.5, marginBottom: 6 },
  body: { fontSize: 16, lineHeight: 28, color: C.textLight },
  section: { paddingHorizontal: 32, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '300', color: C.text, marginBottom: 8, letterSpacing: 0.3 },

  bookingItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  bookingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  bookingTitle: { fontSize: 16, fontWeight: '400', color: C.text },
  bookingPrice: { fontSize: 14, color: C.accent },
  bookingLocation: { fontSize: 13, letterSpacing: 1, color: C.accent, textTransform: 'uppercase', marginTop: 4 },
  bookingStatus: { fontSize: 12, fontWeight: '500', color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },

  inputLabel: { fontSize: 12, fontWeight: '500', letterSpacing: 1, color: C.textMuted, textTransform: 'uppercase', marginBottom: 6, marginTop: 16 },
  input: { borderWidth: 1, borderColor: C.border, backgroundColor: C.white, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: C.text },
  levelRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  levelChip: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: C.border },
  levelText: { fontSize: 13, textTransform: 'capitalize', letterSpacing: 0.5 },

  ctaButton: { backgroundColor: C.dark, paddingHorizontal: 36, paddingVertical: 14, alignItems: 'center' },
  ctaButtonText: { fontSize: 12, fontWeight: '500', letterSpacing: 3, color: C.white, textTransform: 'uppercase' },
  signOutBtn: { borderWidth: 1, borderColor: C.border, paddingVertical: 14, alignItems: 'center' },
  signOutText: { fontSize: 12, fontWeight: '500', letterSpacing: 3, color: '#C45A4A', textTransform: 'uppercase' },
});
