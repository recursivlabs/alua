import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Brand, Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';

export default function SignUpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!name || !email || !password) { setError('All fields are required'); return; }
    setLoading(true);
    setError('');
    try {
      await signUp(name, email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40 }]}>
        <Text style={[styles.logo, { color: colors.text }]}>A L U A</Text>
        <Text style={[styles.title, { color: colors.text }]}>Create your account</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Join the community</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} value={name} onChangeText={setName} placeholder="Full name" placeholderTextColor={colors.textMuted} autoCapitalize="words" />
        <TextInput style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor={colors.textMuted} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor={colors.textMuted} secureTextEntry />

        <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleSignUp} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Create Account</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/auth/sign-in')}>
          <Text style={[styles.linkText, { color: colors.textSecondary }]}>Already have an account? </Text>
          <Text style={[styles.linkTextBold, { color: Brand.primary }]}>Sign in</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: Spacing.lg, alignItems: 'center' },
  logo: { ...Typography.label, fontSize: 16, letterSpacing: 6, marginBottom: Spacing.xl },
  title: { ...Typography.h1, marginBottom: Spacing.xs },
  subtitle: { ...Typography.body, marginBottom: Spacing.xl },
  error: { color: Brand.danger, ...Typography.caption, marginBottom: Spacing.md, textAlign: 'center' },
  input: { width: '100%', maxWidth: 400, borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 14, ...Typography.body, marginBottom: Spacing.md },
  btn: { width: '100%', maxWidth: 400, backgroundColor: Brand.primary, paddingVertical: 16, borderRadius: Radius.full, alignItems: 'center', marginTop: Spacing.sm },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', ...Typography.bodyMedium },
  linkRow: { flexDirection: 'row', marginTop: Spacing.lg },
  linkText: { ...Typography.body },
  linkTextBold: { ...Typography.bodyMedium },
});
