import type { ErrorBoundaryProps } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Logo } from '@/components/brand/logo';
import { colors, radius, spacing, typography } from '@/theme';

import { Button } from './button';
import { Icon } from './icon';

// Shown by Expo Router when a screen throws. Uses no app context on purpose.
export function AppError({ error, retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Logo size={36} />
        <View style={styles.iconWrap}>
          <Icon name="warning" size={34} color={colors.danger} />
        </View>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.message}>
          This screen hit an unexpected error. Try again — if it keeps happening, restart the app.
        </Text>
        {__DEV__ ? (
          <View style={styles.details}>
            <Text style={styles.detailsText} selectable>
              {error.message}
            </Text>
          </View>
        ) : null}
        <Button title="Try again" icon="returns" onPress={retry} style={styles.button} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  iconWrap: {
    width: 84,
    height: 84,
    borderRadius: radius.pill,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 420,
  },
  details: {
    maxWidth: 520,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  detailsText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  button: {
    minWidth: 200,
    marginTop: spacing.sm,
  },
});
