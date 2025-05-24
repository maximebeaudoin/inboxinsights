'use client';

import { useCallback, useEffect, useState } from 'react';

import { createClient } from '@/utils/supabase/client';

import type { MoodEntry } from '@/app/mood-meter/page';

interface UseMoodEntriesReturn {
  moodEntries: MoodEntry[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMoodEntries(initialData: MoodEntry[] = []): UseMoodEntriesReturn {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

      const { data: moodEntriesData, error: fetchError } = await supabase
        .from('mood_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

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
  }, [supabase]);

  const refetch = async () => {
    await fetchMoodEntries();
  };

  useEffect(() => {
    // If we don't have initial data, fetch it
    if (initialData.length === 0) {
      fetchMoodEntries();
    }
  }, [initialData.length, fetchMoodEntries]);

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
        (payload) => {
          // Real-time update received

          if (payload.eventType === 'INSERT') {
            const newEntry = payload.new as MoodEntry;
            setMoodEntries((current) => {
              // Add new entry at the beginning and maintain limit of 50
              const updated = [newEntry, ...current].slice(0, 50);
              return updated;
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedEntry = payload.new as MoodEntry;
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
  }, [supabase]);

  return {
    moodEntries,
    loading,
    error,
    refetch,
  };
}
