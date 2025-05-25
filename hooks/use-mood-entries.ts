'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { PAGINATION_CONFIG } from '@/lib/config/pagination';
import { createMoodEntriesService } from '@/lib/services/mood-entries';
import type { MoodEntry, ViewMode } from '@/lib/types/mood-entry';

import { createClient } from '@/utils/supabase/client';

interface UseMoodEntriesReturn {
  moodEntries: MoodEntry[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
}

export function useMoodEntries(
  initialData: MoodEntry[] = [],
  viewMode: ViewMode = 'personal'
): UseMoodEntriesReturn {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(0);

  const supabase = useMemo(() => createClient(), []);
  const moodEntriesService = useMemo(() => createMoodEntriesService(supabase), [supabase]);

  const fetchMoodEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await moodEntriesService.getMoodEntries({
        viewMode,
        limit: PAGINATION_CONFIG.MOOD_ENTRIES_PER_PAGE,
        offset: 0,
      });

      setMoodEntries(result.data);
      setHasMore(result.hasMore);
      setTotalCount(result.total);
      setCurrentOffset(result.nextOffset || 0);
    } catch (err) {
      console.error('Error in fetchMoodEntries:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [moodEntriesService, viewMode]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      setError(null);

      const result = await moodEntriesService.getMoodEntries({
        viewMode,
        limit: PAGINATION_CONFIG.MOOD_ENTRIES_PER_PAGE,
        offset: currentOffset,
      });

      setMoodEntries((current) => [...current, ...result.data]);
      setHasMore(result.hasMore);
      setTotalCount(result.total);
      setCurrentOffset(result.nextOffset || currentOffset);
    } catch (err) {
      console.error('Error in loadMore:', err);
      setError(err instanceof Error ? err.message : 'Failed to load more entries');
    } finally {
      setLoadingMore(false);
    }
  }, [moodEntriesService, viewMode, currentOffset, loadingMore, hasMore]);

  const refetch = useCallback(async () => {
    setCurrentOffset(0);
    setTotalCount(0);
    await fetchMoodEntries();
  }, [fetchMoodEntries]);

  // Initialize data
  useEffect(() => {
    // On first load, if we have initial data and we're in personal mode, just mark as initialized
    if (!hasInitialized && initialData.length > 0 && viewMode === 'personal') {
      setHasInitialized(true);
      setCurrentOffset(initialData.length);
      // We still need to get the total count even with initial data
      fetchMoodEntries();
      return;
    }

    // For all other cases (view mode changes, no initial data, or global mode), fetch fresh data
    setMoodEntries([]);
    setCurrentOffset(0);
    setTotalCount(0);
    fetchMoodEntries();
    setHasInitialized(true);
  }, [fetchMoodEntries, viewMode, initialData.length, hasInitialized]);

  // Set up real-time subscription
  useEffect(() => {
    const unsubscribe = moodEntriesService.subscribeToChanges(
      viewMode,
      // onInsert
      (newEntry) => {
        setMoodEntries((current) => {
          // Add new entry at the beginning and maintain reasonable limit
          const updated = [newEntry, ...current].slice(0, PAGINATION_CONFIG.MAX_ENTRIES_IN_MEMORY);
          return updated;
        });
        // Increment total count when new entry is added
        setTotalCount((current) => current + 1);
      },
      // onUpdate
      (updatedEntry) => {
        setMoodEntries((current) =>
          current.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry))
        );
      },
      // onDelete
      (deletedEntry) => {
        setMoodEntries((current) => current.filter((entry) => entry.id !== deletedEntry.id));
        // Decrement total count when entry is deleted
        setTotalCount((current) => Math.max(0, current - 1));
      }
    );

    return unsubscribe;
  }, [moodEntriesService, viewMode]);

  return {
    moodEntries,
    loading,
    loadingMore,
    error,
    hasMore,
    totalCount,
    refetch,
    loadMore,
  };
}
