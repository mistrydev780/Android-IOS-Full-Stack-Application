import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { ApiError } from '@/services/api';

/**
 * Loads data from the API whenever the screen comes into focus,
 * with pull-to-refresh and error handling built in.
 */
export function useApiData<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(fetcher, deps);

  const run = useCallback(async () => {
    try {
      setData(await load());
      setError('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      void run();
    }, [run]),
  );

  return {
    data,
    setData,
    error,
    loading: loading && !data,
    refreshing,
    refresh: () => {
      setRefreshing(true);
      void run();
    },
    reload: run,
  };
}
