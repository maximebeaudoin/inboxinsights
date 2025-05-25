import type { SupabaseClient } from '@supabase/supabase-js';

import { PAGINATION_CONFIG } from '@/lib/config/pagination';
import { getCurrentUser } from '@/lib/supabase/auth';
import type {
  MoodEntriesQuery,
  MoodEntry,
  PaginatedMoodEntriesResponse,
  ViewMode,
} from '@/lib/types/mood-entry';

/**
 * Service class for mood entries operations
 */
export class MoodEntriesService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Fetch mood entries with pagination
   */
  async getMoodEntries({
    viewMode = 'personal',
    limit = PAGINATION_CONFIG.MOOD_ENTRIES_PER_PAGE,
    offset = 0,
  }: MoodEntriesQuery): Promise<PaginatedMoodEntriesResponse> {
    const user = await getCurrentUser(this.supabase);

    if (!user) {
      return {
        data: [],
        hasMore: false,
        total: 0,
        nextOffset: 0,
      };
    }

    // Get total count with proper filtering
    let countQuery = this.supabase.from('mood_entries').select('*', { count: 'exact', head: true });

    // Filter by user email only in personal mode
    if (viewMode === 'personal') {
      countQuery = countQuery.eq('from', user.email);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error('Error fetching mood entries count:', countError);
      throw new Error('Failed to fetch mood entries count');
    }

    // Get paginated data
    let dataQuery = this.supabase
      .from('mood_entries')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply same filter for data query
    if (viewMode === 'personal') {
      dataQuery = dataQuery.eq('from', user.email);
    }

    const { data, error } = await dataQuery;

    if (error) {
      console.error('Error fetching mood entries:', error);
      throw new Error('Failed to fetch mood entries');
    }

    const entries = data || [];
    const total = count || 0;
    const hasMore = entries.length === limit && offset + limit < total;
    const nextOffset = hasMore ? offset + limit : undefined;

    return {
      data: entries,
      hasMore,
      total,
      nextOffset,
    };
  }

  /**
   * Get initial mood entries for server-side rendering
   */
  async getInitialMoodEntries(viewMode: ViewMode = 'personal'): Promise<MoodEntry[]> {
    try {
      const result = await this.getMoodEntries({
        viewMode,
        limit: PAGINATION_CONFIG.MOOD_ENTRIES_PER_PAGE,
      });
      return result.data;
    } catch (error) {
      console.error('Error fetching initial mood entries:', error);
      return [];
    }
  }

  /**
   * Delete a mood entry (with ownership verification)
   */
  async deleteMoodEntry(
    entryId: string
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    const user = await getCurrentUser(this.supabase);

    if (!user) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    try {
      // First, verify that the mood entry belongs to the current user
      const { data: moodEntry, error: fetchError } = await this.supabase
        .from('mood_entries')
        .select('from')
        .eq('id', entryId)
        .single();

      if (fetchError) {
        console.error('Error fetching mood entry:', fetchError);
        return {
          success: false,
          error: 'Mood entry not found',
        };
      }

      // Check if the user owns this mood entry
      if (moodEntry.from !== user.email) {
        return {
          success: false,
          error: 'You can only delete your own mood entries',
        };
      }

      // Delete the mood entry
      const { error: deleteError } = await this.supabase
        .from('mood_entries')
        .delete()
        .eq('id', entryId);

      if (deleteError) {
        console.error('Error deleting mood entry:', deleteError);
        return {
          success: false,
          error: 'Failed to delete mood entry',
        };
      }

      return {
        success: true,
        message: 'Mood entry deleted successfully',
      };
    } catch (error) {
      console.error('Unexpected error deleting mood entry:', error);
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    return await getCurrentUser(this.supabase);
  }

  /**
   * Check if user can delete a mood entry
   */
  async canDeleteEntry(entry: MoodEntry): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null && entry.from === user.email;
  }

  /**
   * Subscribe to real-time changes for mood entries
   */
  subscribeToChanges(
    viewMode: ViewMode,
    onInsert: (entry: MoodEntry) => void,
    onUpdate: (entry: MoodEntry) => void,
    onDelete: (entry: MoodEntry) => void
  ) {
    const channel = this.supabase
      .channel('mood_entries_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mood_entries',
        },
        async (payload) => {
          const user = await getCurrentUser(this.supabase);
          if (!user) return;

          if (payload.eventType === 'INSERT') {
            const newEntry = payload.new as MoodEntry;
            // Only trigger callback if it matches the current view mode
            if (viewMode === 'global' || newEntry.from === user.email) {
              onInsert(newEntry);
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedEntry = payload.new as MoodEntry;
            onUpdate(updatedEntry);
          } else if (payload.eventType === 'DELETE') {
            const deletedEntry = payload.old as MoodEntry;
            onDelete(deletedEntry);
          }
        }
      )
      .subscribe();

    return () => {
      this.supabase.removeChannel(channel);
    };
  }
}

/**
 * Factory function to create mood entries service
 */
export function createMoodEntriesService(supabase: SupabaseClient): MoodEntriesService {
  return new MoodEntriesService(supabase);
}
