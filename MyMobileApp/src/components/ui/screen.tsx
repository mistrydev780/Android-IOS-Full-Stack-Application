import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useResponsive } from '@/hooks/use-responsive';
import { colors, layout, spacing } from '@/theme';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  // Content rendered outside the scroll view (e.g. a sticky bottom bar)
  footer?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  background?: string;
  // Pull-to-refresh
  refreshing?: boolean;
  onRefresh?: () => void;
};

// Safe-area aware page with centered, max-width content for large screens
export function Screen({
  children,
  scroll = true,
  edges = ['top'],
  footer,
  contentStyle,
  background = colors.background,
  refreshing = false,
  onRefresh,
}: ScreenProps) {
  const { gutter } = useResponsive();

  const inner = [styles.inner, { paddingHorizontal: gutter }, contentStyle];

  return (
    <SafeAreaView edges={edges} style={[styles.root, { backgroundColor: background }]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.ink} />
            ) : undefined
          }
        >
          <View style={inner}>{children}</View>
        </ScrollView>
      ) : (
        <View style={[styles.flex, inner]}>{children}</View>
      )}
      {footer}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },
  inner: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
});
