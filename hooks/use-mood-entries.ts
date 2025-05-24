'use client';

import { useCallback, useEffect, useState } from 'react';

import { createClient } from '@/utils/supabase/client';

import type { ViewMode } from '@/app/dashboard/mood-meter/components/view-mode-toggle';
import type { MoodEntry } from '@/app/dashboard/mood-meter/page';

interface UseMoodEntriesReturn {
  moodEntries: MoodEntry[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMoodEntries(
  initialData: MoodEntry[] = [],
  viewMode: ViewMode = 'personal'
): UseMoodEntriesReturn {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const supabase = createClient();

  const fetchMoodEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMoodEntries([]);
        return;
      }

      let query = supabase
        .from('mood_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      // Filter by user email only in personal mode
      if (viewMode === 'personal') {
        query = query.eq('from', user.email);
      }

      const { data: moodEntriesData, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching mood entries:', fetchError);
        setError('Failed to fetch mood entries');
        return;
      }

      setMoodEntries(moodEntriesData || []);
    } catch (err) {
      console.error('Error in fetchMoodEntries:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [supabase, viewMode]);

  const refetch = async () => {
    await fetchMoodEntries();
  };

  useEffect(() => {
    // On first load, if we have initial data and we're in personal mode, just mark as initialized
    if (!hasInitialized && initialData.length > 0 && viewMode === 'personal') {
      setHasInitialized(true);
      return;
    }

    // For all other cases (view mode changes, no initial data, or global mode), fetch fresh data
    setMoodEntries([]);
    fetchMoodEntries();
    setHasInitialized(true);
  }, [fetchMoodEntries, viewMode, initialData.length, hasInitialized]);

  useEffect(() => {
    // Set up real-time subscription
    const channel = supabase
      .channel('mood_entries_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'mood_entries',
        },
        async (payload) => {
          // Real-time update received
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) return;

          if (payload.eventType === 'INSERT') {
            const newEntry = payload.new as MoodEntry;
            // Only add entry if it matches the current view mode
            if (viewMode === 'global' || newEntry.from === user.email) {
              setMoodEntries((current) => {
                // Add new entry at the beginning and maintain limit of 50
                const updated = [newEntry, ...current].slice(0, 50);
                return updated;
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedEntry = payload.new as MoodEntry;
            // Only update if entry is currently in our list
            setMoodEntries((current) =>
              current.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry))
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedEntry = payload.old as MoodEntry;
            setMoodEntries((current) => current.filter((entry) => entry.id !== deletedEntry.id));
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, viewMode]);

  return {
    moodEntries,
    loading,
    error,
    refetch,
  };
}
