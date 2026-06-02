import { useRef, useEffect } from 'react';
import { Animated, Easing, Platform, StyleSheet } from 'react-native';
import type { ViewStyle, StyleProp } from 'react-native';

/** A single shimmering placeholder block. */
export function Skeleton({ style }: { style?: StyleProp<ViewStyle> }) {
  const pulse = useRef(new Animated.Value(0.45)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 750, easing: Easing.inOut(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(pulse, { toValue: 0.45, duration: 750, easing: Easing.inOut(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  return <Animated.View style={[s.block, { opacity: pulse }, style]} />;
}

/** A few stacked list-item skeletons, matching the retreat/experience rows. */
export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <Animated.View key={i} style={s.row}>
          <Skeleton style={{ width: '55%', height: 22 }} />
          <Skeleton style={{ width: '32%', height: 14, marginTop: 12 }} />
          <Skeleton style={{ width: '45%', height: 14, marginTop: 8 }} />
        </Animated.View>
      ))}
    </>
  );
}

const s = StyleSheet.create({
  block: { backgroundColor: '#E8E0D8', borderRadius: 8 },
  row: { paddingVertical: 24, borderTopWidth: 1, borderTopColor: '#F0EBE4' },
});
