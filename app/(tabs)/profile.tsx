import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Brand, Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { useGuestProfile } from '@/hooks/useGuestProfile';
import { useBookings } from '@/hooks/useBookings';
import { formatPrice } from '@/constants/pricing';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user, isAuthenticated, signOut } = useAuth();
  const { profile, upsertProfile } = useGuestProfile();
  const { bookings } = useBookings();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dietary, setDietary] = useState('');
  const [medical, setMedical] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [surfLevel, setSurfLevel] = useState('beginner');
  const [breathworkLevel, setBreathworkLevel] = useState('beginner');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setDietary(profile.dietary?.preferences || '');
      setMedical(profile.medical?.conditions?.join(', ') || '');
      setEmergencyName(profile.emergency_contact?.name || '');
      setEmergencyPhone(profile.emergency_contact?.phone || '');
      setSurfLevel(profile.experience_level?.surf || 'beginner');
      setBreathworkLevel(profile.experience_level?.breathwork || 'beginner');
    }
  }, [profile]);

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', paddingTop: insets.top }]}>
        <Text style={[styles.title, { color: colors.text }]}>Your Profile</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: 'center', marginBottom: Spacing.lg }]}>Sign in to manage your bookings and guest profile.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/auth/sign-in')}>
          <Text style={styles.primaryBtnText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: Spacing.md }} onPress={() => router.push('/auth/sign-up')}>
          <Text style={[styles.linkText, { color: Brand.primary }]}>Create Account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSave = async () => {
    try {
      await upsertProfile({
        full_name: fullName,
        phone,
        dietary: { restrictions: [], allergies: [], preferences: dietary },
        medical: { conditions: medical ? medical.split(',').map((s) => s.trim()) : [], medications: [] },
        emergency_contact: { name: emergencyName, phone: emergencyPhone, relationship: '' },
        experience_level: { surf: surfLevel, breathwork: breathworkLevel },
      });
      Alert.alert('Saved', 'Your profile has been updated.');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: Brand.accent }]}>PROFILE</Text>
        <Text style={[styles.title, { color: colors.text }]}>{user?.name || 'Guest'}</Text>
        <Text style={[styles.email, { color: colors.textSecondary }]}>{user?.email}</Text>
      </View>

      {/* Bookings */}
      {bookings.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>My Bookings</Text>
          {bookings.map((b) => (
            <View key={b.id} style={[styles.bookingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.bookingTitle, { color: colors.text }]}>{b.item_title || b.booking_type}</Text>
              <Text style={[styles.bookingDetail, { color: colors.textSecondary }]}>{b.location_name} · {formatPrice(b.amount_cents)}</Text>
              <View style={[styles.statusBadge, { backgroundColor: b.status === 'confirmed' ? Brand.success + '20' : Brand.warning + '20' }]}>
                <Text style={[styles.statusText, { color: b.status === 'confirmed' ? Brand.success : Brand.warning }]}>{b.status}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Guest Profile Form */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Guest Profile</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>This info helps us prepare for your arrival.</Text>

        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Full Name</Text>
        <TextInput style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} value={fullName} onChangeText={setFullName} placeholder="Your full name" placeholderTextColor={colors.textMuted} />

        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Phone</Text>
        <TextInput style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} value={phone} onChangeText={setPhone} placeholder="+1 555 123 4567" placeholderTextColor={colors.textMuted} keyboardType="phone-pad" />

        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Dietary Needs</Text>
        <TextInput style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} value={dietary} onChangeText={setDietary} placeholder="Vegetarian, allergies, etc." placeholderTextColor={colors.textMuted} />

        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Medical Conditions</Text>
        <TextInput style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} value={medical} onChangeText={setMedical} placeholder="Any conditions or medications" placeholderTextColor={colors.textMuted} />

        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Emergency Contact Name</Text>
        <TextInput style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} value={emergencyName} onChangeText={setEmergencyName} placeholder="Contact name" placeholderTextColor={colors.textMuted} />

        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Emergency Contact Phone</Text>
        <TextInput style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} value={emergencyPhone} onChangeText={setEmergencyPhone} placeholder="+1 555 123 4567" placeholderTextColor={colors.textMuted} keyboardType="phone-pad" />

        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Surf Level</Text>
        <View style={styles.levelRow}>
          {['beginner', 'intermediate', 'advanced'].map((level) => (
            <TouchableOpacity key={level} style={[styles.levelChip, surfLevel === level && { backgroundColor: Brand.primary }]} onPress={() => setSurfLevel(level)}>
              <Text style={[styles.levelText, { color: surfLevel === level ? '#fff' : colors.text }]}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Breathwork Level</Text>
        <View style={styles.levelRow}>
          {['beginner', 'intermediate', 'advanced'].map((level) => (
            <TouchableOpacity key={level} style={[styles.levelChip, breathworkLevel === level && { backgroundColor: Brand.primary }]} onPress={() => setBreathworkLevel(level)}>
              <Text style={[styles.levelText, { color: breathworkLevel === level ? '#fff' : colors.text }]}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Out */}
      <View style={styles.section}>
        <TouchableOpacity style={[styles.signOutBtn, { borderColor: colors.border }]} onPress={signOut}>
          <Text style={[styles.signOutText, { color: Brand.danger }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  label: { ...Typography.label, marginBottom: Spacing.sm },
  title: { ...Typography.h1, marginBottom: Spacing.xs },
  email: { ...Typography.body },
  subtitle: { ...Typography.body, lineHeight: 24, paddingHorizontal: Spacing.lg },
  primaryBtn: { backgroundColor: Brand.primary, paddingHorizontal: Spacing.xl, paddingVertical: 14, borderRadius: Radius.full },
  primaryBtnText: { color: '#fff', ...Typography.bodyMedium },
  linkText: { ...Typography.bodyMedium },

  section: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl },
  sectionTitle: { ...Typography.h3, marginBottom: Spacing.xs },
  sectionSubtitle: { ...Typography.caption, marginBottom: Spacing.md },

  bookingCard: { padding: Spacing.md, borderRadius: Radius.lg, borderWidth: 1, marginBottom: Spacing.sm },
  bookingTitle: { ...Typography.bodyMedium, marginBottom: Spacing.xs },
  bookingDetail: { ...Typography.caption, marginBottom: Spacing.sm },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.full },
  statusText: { ...Typography.small, fontWeight: '600' },

  inputLabel: { ...Typography.caption, marginBottom: Spacing.xs, marginTop: Spacing.md },
  input: { borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 12, ...Typography.body },
  levelRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs },
  levelChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.full, borderWidth: 1, borderColor: '#ddd' },
  levelText: { ...Typography.caption, textTransform: 'capitalize' },

  saveBtn: { backgroundColor: Brand.primary, paddingVertical: 14, borderRadius: Radius.full, alignItems: 'center', marginTop: Spacing.lg },
  saveBtnText: { color: '#fff', ...Typography.bodyMedium },

  signOutBtn: { borderWidth: 1, paddingVertical: 14, borderRadius: Radius.full, alignItems: 'center' },
  signOutText: { ...Typography.bodyMedium },
});
