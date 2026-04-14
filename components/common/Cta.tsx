import { TouchableOpacity, Text, StyleSheet, type ViewStyle } from 'react-native';

const C = {
  dark: '#1A2F38',
  accent: '#C4956A',
  white: '#FFFFFF',
  cream: '#F0EBE4',
  text: '#1A1A1A',
  textLight: '#6B6560',
};

type Variant = 'primary' | 'secondary' | 'accent';

interface CtaProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  style?: ViewStyle;
}

export default function Cta({ title, onPress, variant = 'primary', style }: CtaProps) {
  const bg = variant === 'primary' ? C.dark : variant === 'accent' ? C.accent : C.cream;
  const textColor = variant === 'secondary' ? C.textLight : C.white;

  return (
    <TouchableOpacity
      style={[s.btn, { backgroundColor: bg }, style]}
      onPress={onPress}
      activeOpacity={0.8}>
      <Text style={[s.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  btn: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
  },
});
