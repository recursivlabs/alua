import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { RecursivProvider } from '@/contexts/RecursivContext';
import { Brand } from '@/constants/theme';

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === 'auth';
    if (!isAuthenticated && segments[0] === '(app)') {
      router.replace('/auth/sign-in');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf8f5' }}>
        <ActivityIndicator size="large" color={Brand.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth/sign-in" />
        <Stack.Screen name="auth/sign-up" />
        <Stack.Screen name="retreat/[id]" options={{ headerShown: true, title: 'Retreat Details' }} />
        <Stack.Screen name="experience/[id]" options={{ headerShown: true, title: 'Experience Details' }} />
        <Stack.Screen name="booking/checkout" options={{ headerShown: true, title: 'Book', presentation: 'modal' }} />
        <Stack.Screen name="booking/confirmation" options={{ headerShown: true, title: 'Confirmed!' }} />
        <Stack.Screen name="studio/[id]" options={{ headerShown: true, title: 'Practice' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthGate />
      </ThemeProvider>
    </AuthProvider>
  );
}

function AuthGate() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return <RootNavigator />;
  }

  return (
    <RecursivProvider>
      <RootNavigator />
    </RecursivProvider>
  );
}
