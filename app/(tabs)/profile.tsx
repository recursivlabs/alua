import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const C = {
  bg: '#FAF7F4', text: '#1A1A1A', textLight: '#6B6560', textMuted: '#A09890',
  accent: '#C4956A', dark: '#1A2F38', cream: '#F0EBE4', border: '#E8E0D8', white: '#FFF',
};

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, signOut } = useAuth();

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
          <Text style={[s.linkText, { color: C.dark }]}>Create Account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: insets.top + 40, paddingBottom: insets.bottom + 60 }} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <Text style={s.eyebrow}>PROFILE</Text>
        <Text style={s.headline}>{user?.name || 'Guest'}</Text>
        <Text style={s.body}>{user?.email}</Text>
      </View>

      <View style={s.section}>
        <Text style={[s.body, { marginBottom: 20 }]}>
          Guest profile management — dietary needs, medical info, emergency contacts, and booking history — will be available here once bookings open.
        </Text>
      </View>

      <View style={s.section}>
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
  linkText: { fontSize: 15, fontWeight: '500', letterSpacing: 1 },
  ctaButton: { backgroundColor: C.dark, paddingHorizontal: 48, paddingVertical: 16 },
  ctaButtonText: { fontSize: 12, fontWeight: '500', letterSpacing: 4, color: C.white, textTransform: 'uppercase' },
  signOutBtn: { borderWidth: 1, borderColor: C.border, paddingVertical: 14, alignItems: 'center' },
  signOutText: { fontSize: 12, fontWeight: '500', letterSpacing: 3, color: '#C45A4A', textTransform: 'uppercase' },
});
