'use client';

import { useEffect, useMemo, useState } from 'react';

import { format, formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';

import { DataIngestionInfo } from '@/components/data-ingestion-info';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { APP_CONFIG } from '@/lib/config';
import { PAGINATION_CONFIG } from '@/lib/config/pagination';
import { createMoodEntriesService } from '@/lib/services/mood-entries';
import type { MoodEntry } from '@/lib/types/mood-entry';

import { createClient } from '@/utils/supabase/client';

import { deleteMoodEntryAction } from '@/app/actions';

import { useToast } from '@/hooks/use-toast';

import { RawDataSheet } from './raw-data-sheet';

interface RecentMoodsProps {
  moodEntries: MoodEntry[];
  hasMore?: boolean;
  loadingMore?: boolean;
  totalCount?: number;
  onLoadMore?: () => void;
}

const moodEmojis = {
  1: '😢',
  2: '😞',
  3: '😕',
  4: '😐',
  5: '😊',
  6: '😄',
  7: '😁',
  8: '😍',
  9: '🤩',
  10: '🥳',
};

const moodLabels = {
  1: 'Terrible',
  2: 'Very Bad',
  3: 'Bad',
  4: 'Poor',
  5: 'Okay',
  6: 'Good',
  7: 'Very Good',
  8: 'Great',
  9: 'Excellent',
  10: 'Amazing',
};

const getMoodColor = (score: number) => {
  if (score <= 3)
    return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
  if (score <= 5)
    return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
  if (score <= 7)
    return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
  return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
};

export function RecentMoods({
  moodEntries,
  hasMore = false,
  loadingMore = false,
  totalCount = 0,
  onLoadMore,
}: RecentMoodsProps) {
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState<number>(PAGINATION_CONFIG.INITIAL_DISPLAY_COUNT);
  const [canDeleteMap, setCanDeleteMap] = useState<Record<string, boolean>>({});
  const [lastTotalCount, setLastTotalCount] = useState(totalCount);
  const { toast } = useToast();

  const supabase = useMemo(() => createClient(), []);
  const moodEntriesService = useMemo(() => createMoodEntriesService(supabase), [supabase]);

  // Check permissions for all entries (optimized to get user once)
  useEffect(() => {
    const checkPermissions = async () => {
      if (moodEntries.length === 0) return;

      // Get current user once instead of for each entry
      const user = await moodEntriesService.getCurrentUser();
      const permissions: Record<string, boolean> = {};

      // Check if current user is the demo user
      const isDemoUser = user !== null && user.email === APP_CONFIG.demo.email;

      for (const entry of moodEntries) {
        // Demo user cannot delete any entries, even their own
        if (isDemoUser) {
          permissions[entry.id] = false;
        } else {
          permissions[entry.id] = user !== null && entry.from === user.email;
        }
      }

      setCanDeleteMap(permissions);
    };

    checkPermissions();
  }, [moodEntries, moodEntriesService]);

  // Check if current user can delete this entry
  const canDeleteEntry = (entry: MoodEntry): boolean => {
    return canDeleteMap[entry.id] || false;
  };

  const handleDeleteEntry = async (entryId: string) => {
    setDeletingEntryId(entryId);

    try {
      const result = await deleteMoodEntryAction(entryId);

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting mood entry:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while deleting the mood entry',
        variant: 'destructive',
      });
    } finally {
      setDeletingEntryId(null);
    }
  };

  const handleLoadMore = () => {
    const remainingEntries = moodEntries.length - displayCount;

    if (remainingEntries > 0) {
      // Show more from already loaded entries
      const nextBatch = Math.min(PAGINATION_CONFIG.LOAD_MORE_DISPLAY_COUNT, remainingEntries);
      setDisplayCount((prev) => prev + nextBatch);
    } else if (hasMore && onLoadMore) {
      // Load more from server - this will automatically show the new entries
      onLoadMore();
    }
  };

  // Handle when new data is loaded from server
  useEffect(() => {
    if (totalCount !== lastTotalCount) {
      // Total count changed, meaning we switched view modes or data was refreshed
      setDisplayCount(PAGINATION_CONFIG.INITIAL_DISPLAY_COUNT);
      setLastTotalCount(totalCount);
    } else if (moodEntries.length > displayCount) {
      // New entries were loaded, expand display to show them
      setDisplayCount(moodEntries.length);
    }
  }, [moodEntries.length, totalCount, lastTotalCount, displayCount]);

  const displayedEntries = moodEntries.slice(0, displayCount);
  const canShowMore = displayCount < moodEntries.length || hasMore;

  if (moodEntries.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          <div className="text-center">
            <div className="text-4xl mb-2">📝</div>
            <p>No mood entries yet.</p>
            <p className="text-sm">Start tracking your mood by sending an email!</p>
          </div>
        </div>
        <DataIngestionInfo variant="compact" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line - responsive positioning */}
      <div className="absolute left-4 sm:left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-border via-border to-transparent"></div>

      <div className="space-y-6 sm:space-y-8">
        {displayedEntries.map((entry) => (
          <div key={entry.id} className="relative flex items-start gap-3 sm:gap-6">
            {/* Timeline dot - responsive sizing */}
            <div className="relative z-10 flex-shrink-0">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-background border-2 border-border flex items-center justify-center text-lg sm:text-2xl shadow-md hover:shadow-lg transition-shadow duration-200">
                {moodEmojis[entry.mood_score as keyof typeof moodEmojis]}
              </div>
            </div>

            {/* Content - improved mobile spacing */}
            <div className="flex-1 min-w-0 pb-4 sm:pb-6">
              <div className="bg-card rounded-lg border p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-border/80">
                <div className="space-y-4">
                  {/* Header with time and action buttons - improved mobile layout */}
                  <div className="flex items-start justify-between gap-2 flex-wrap sm:flex-nowrap">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-xs sm:text-sm text-muted-foreground font-medium cursor-help">
                            {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {format(new Date(entry.created_at), "EEEE, MMMM do, yyyy 'at' h:mm a")}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Raw Data Sheet */}
                      <RawDataSheet entry={entry} />

                      {/* Delete Button with Confirmation - Only show if user can delete */}
                      {canDeleteEntry(entry) && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 p-0 text-muted-foreground hover:text-red-600 hover:bg-transparent text-xs min-w-0"
                              disabled={deletingEntryId === entry.id}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Mood Entry</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this mood entry? This action cannot
                                be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteEntry(entry.id)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={deletingEntryId === entry.id}
                              >
                                {deletingEntryId === entry.id ? 'Deleting...' : 'Delete'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>

                  {/* Unified Badge Section - improved mobile layout */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                    {/* Mood badge - always first, responsive sizing */}
                    <span
                      className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium border ${getMoodColor(entry.mood_score)}`}
                    >
                      <span className="sm:hidden">{entry.mood_score}/10</span>
                      <span className="hidden sm:inline">
                        {entry.mood_score}/10 -{' '}
                        {moodLabels[entry.mood_score as keyof typeof moodLabels]}
                      </span>
                    </span>

                    {/* Additional metrics - responsive sizing */}
                    {entry.energy_level && (
                      <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium">
                        <span className="sm:hidden">⚡{entry.energy_level}</span>
                        <span className="hidden sm:inline">⚡ Energy: {entry.energy_level}/10</span>
                      </span>
                    )}
                    {entry.stress_level && (
                      <span className="bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium">
                        <span className="sm:hidden">😰{entry.stress_level}</span>
                        <span className="hidden sm:inline">😰 Stress: {entry.stress_level}/10</span>
                      </span>
                    )}
                    {entry.sleep_hours && (
                      <span className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium">
                        <span className="sm:hidden">😴{entry.sleep_hours}h</span>
                        <span className="hidden sm:inline">😴 Sleep: {entry.sleep_hours}h</span>
                      </span>
                    )}
                    {entry.weather && (
                      <span className="bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium">
                        <span className="sm:hidden">🌤️</span>
                        <span className="hidden sm:inline">🌤️ {entry.weather}</span>
                      </span>
                    )}
                  </div>

                  {/* Chat Conversation - improved mobile layout */}
                  {(entry.activity || entry.note) && (
                    <div className="space-y-3 pl-2 sm:pl-6">
                      {/* User Message */}
                      {entry.activity && (
                        <div className="flex items-start gap-2 sm:gap-3">
                          {/* Avatar - responsive sizing */}
                          <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-600">
                            <span className="text-xs sm:text-sm">👤</span>
                          </div>

                          {/* Chat bubble - improved mobile responsiveness */}
                          <div className="flex-1 max-w-[90%] sm:max-w-[85%]">
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                  {entry.from_name || entry.from || 'User'}
                                </span>
                                <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
                                  Message Resume
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                                {entry.activity}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Aura Response - improved mobile layout */}
                      {entry.note && (
                        <div className="flex items-start gap-2 sm:gap-3">
                          {/* Avatar - responsive sizing */}
                          <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-600">
                            <span className="text-xs sm:text-sm">🤖</span>
                          </div>

                          {/* Chat bubble - improved mobile responsiveness */}
                          <div className="flex-1 max-w-[90%] sm:max-w-[85%]">
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                  Aura
                                </span>
                                <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
                                  AI Assistant
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                                {entry.note}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Section - improved mobile layout */}
      {canShowMore && (
        <div className="text-center pt-4 sm:pt-6 space-y-3 sm:space-y-4">
          <div className="text-xs sm:text-sm text-muted-foreground">
            Showing {displayedEntries.length} out of {totalCount} total entries
          </div>
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="min-w-[120px] h-10 sm:h-auto"
          >
            {loadingMore ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}

      {/* Show total count when all entries are displayed */}
      {!canShowMore && totalCount > 0 && (
        <div className="text-center text-xs sm:text-sm text-muted-foreground pt-3 sm:pt-4">
          All {totalCount} entries displayed
        </div>
      )}
    </div>
  );
}
