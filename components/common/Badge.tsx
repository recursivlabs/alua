import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Brand, Spacing, Radius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

interface BadgeProps {
  label: string;
  color?: string;
}

export default function Badge({ label, color = Brand.accent }: BadgeProps) {
  useColorScheme(); // ensure re-render on scheme change

  return (
    <View style={[styles.badge, { backgroundColor: color + '20' }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs - 1,
    borderRadius: Radius.full,
  },
  text: {
    ...Typography.small,
    fontWeight: '600',
  },
});
