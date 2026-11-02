import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/theme';

import { EmptyState } from './empty-state';

type LoadStateProps = {
  loading: boolean;
  error?: string;
  onRetry?: () => void;
};

// Spinner while loading, friendly error with retry when a request fails
export function LoadState({ loading, error, onRetry }: LoadStateProps) {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.ink} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon="info"
        title="Something went wrong"
        message={error}
        actionLabel={onRetry ? 'Try again' : undefined}
        onAction={onRetry}
      />
    );
  }

  return null;
}

const styles = StyleSheet.create({
  center: {
    paddingVertical: spacing.xxxl * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
