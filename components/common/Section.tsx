import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

interface SectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function Section({ title, subtitle, children, style }: SectionProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  return (
    <View style={[styles.section, style]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h2,
  },
  subtitle: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
});
