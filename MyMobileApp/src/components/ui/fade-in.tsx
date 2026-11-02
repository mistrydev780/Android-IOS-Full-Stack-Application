import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeInDown, FadeOutLeft, LinearTransition } from 'react-native-reanimated';

type FadeInProps = {
  children: ReactNode;
  // Position in a list: items appear one after another
  index?: number;
  style?: StyleProp<ViewStyle>;
  // Slide out and let siblings glide into place when removed
  removable?: boolean;
};

const STAGGER_MS = 55;
const MAX_STAGGER = 10;

// Staggered entrance animation. Reanimated honours the system Reduce Motion setting.
export function FadeIn({ children, index = 0, style, removable = false }: FadeInProps) {
  return (
    <Animated.View
      style={style}
      entering={FadeInDown.delay(Math.min(index, MAX_STAGGER) * STAGGER_MS)
        .duration(420)
        .springify()
        .damping(18)}
      exiting={removable ? FadeOutLeft.duration(220) : undefined}
      layout={removable ? LinearTransition.springify().damping(20) : undefined}
    >
      {children}
    </Animated.View>
  );
}
