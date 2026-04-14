import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Brand, Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  fullWidth = false,
}: ButtonProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  const containerStyles: ViewStyle[] = [styles.base];

  if (variant === 'primary') {
    containerStyles.push({
      backgroundColor: disabled ? colors.textMuted : Brand.primary,
    });
  } else if (variant === 'secondary') {
    containerStyles.push({
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: disabled ? colors.textMuted : Brand.primary,
    });
  } else {
    containerStyles.push({ backgroundColor: 'transparent' });
  }

  if (fullWidth) {
    containerStyles.push(styles.fullWidth);
  }

  const textColor =
    variant === 'primary'
      ? '#ffffff'
      : disabled
        ? colors.textMuted
        : Brand.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[containerStyles, style]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: Spacing.md - 2,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    ...Typography.bodyMedium,
    letterSpacing: 0.3,
  },
});
