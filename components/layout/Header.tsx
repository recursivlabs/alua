import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export default function Header({
  title = 'ALUA',
  showBack = false,
  onBack,
  rightAction,
}: HeaderProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  return (
    <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.borderSubtle }]}>
      <View style={styles.left}>
        {showBack && onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={[styles.backArrow, { color: colors.text }]}>
              {'\u2190'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      <View style={styles.right}>
        {rightAction || null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  left: {
    width: 48,
    alignItems: 'flex-start',
  },
  right: {
    width: 48,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  backButton: {
    padding: Spacing.xs,
  },
  backArrow: {
    fontSize: 22,
    fontWeight: '400',
  },
});
