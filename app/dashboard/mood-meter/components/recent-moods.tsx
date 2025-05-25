'use client';

import { useEffect, useMemo, useState } from 'react';

import { format, formatDistanceToNow } from 'date-fns';
import { FileText, Trash2 } from 'lucide-react';

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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { PAGINATION_CONFIG } from '@/lib/config/pagination';
import { createMoodEntriesService } from '@/lib/services/mood-entries';
import type { MoodEntry } from '@/lib/types/mood-entry';

import { createClient } from '@/utils/supabase/client';

import { deleteMoodEntryAction } from '@/app/actions';

import { useToast } from '@/hooks/use-toast';

interface RecentMoodsProps {
  moodEntries: MoodEntry[];
  hasMore?: boolean;
  loadingMore?: boolean;
  totalCount?: number;
  onLoadMore?: () => void;
}

// Utility function to escape HTML entities for XSS protection
const escapeHtml = (text: string): string => {
  // Server-side safe HTML escaping
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

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
  if (score <= 3) return 'bg-red-100 text-red-800 border-red-200';
  if (score <= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  if (score <= 7) return 'bg-blue-100 text-blue-800 border-blue-200';
  return 'bg-green-100 text-green-800 border-green-200';
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

      for (const entry of moodEntries) {
        permissions[entry.id] = user !== null && entry.from === user.email;
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
      {/* Timeline line */}
      <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-border via-border to-transparent"></div>

      <div className="space-y-8">
        {displayedEntries.map((entry) => (
          <div key={entry.id} className="relative flex items-start gap-6">
            {/* Timeline dot */}
            <div className="relative z-10 flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-background border-2 border-border flex items-center justify-center text-2xl shadow-md hover:shadow-lg transition-shadow duration-200">
                {moodEmojis[entry.mood_score as keyof typeof moodEmojis]}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pb-6">
              <div className="bg-card rounded-lg border p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-border/80">
                <div className="space-y-4">
                  {/* Header with time and action buttons */}
                  <div className="flex items-center justify-between gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-sm text-muted-foreground font-medium cursor-help">
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

                    <div className="flex items-center gap-1">
                      {/* Raw Data Sheet */}
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-muted-foreground hover:text-foreground text-xs p-1"
                          >
                            Show Raw Data
                            <FileText className="h-3 w-3" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[500px] sm:w-[700px] sm:max-w-[700px] overflow-y-auto">
                          <SheetHeader>
                            <SheetTitle>Raw Entry Data</SheetTitle>
                            <SheetDescription>
                              Original text and raw data for this mood entry
                            </SheetDescription>
                          </SheetHeader>
                          <div className="mt-6 space-y-4">
                            {/* Original Text */}
                            {entry.original_text && (
                              <div>
                                <h4 className="text-sm font-medium mb-2">Original Text</h4>
                                <div className="bg-muted p-3 rounded-md border">
                                  <pre className="text-sm whitespace-pre-wrap break-words">
                                    {escapeHtml(entry.original_text)}
                                  </pre>
                                </div>
                              </div>
                            )}

                            {/* Raw Data Fields */}
                            <div>
                              <h4 className="text-sm font-medium mb-2">Raw Data</h4>
                              <div className="space-y-2 text-sm">
                                {/* Core Fields */}
                                <div className="grid grid-cols-2 gap-2">
                                  <span className="font-medium">ID:</span>
                                  <span className="font-mono text-xs">{entry.id}</span>
                                </div>

                                {entry.email_entry_id && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="font-medium">Email Entry ID:</span>
                                    <span className="font-mono text-xs">
                                      {entry.email_entry_id}
                                    </span>
                                  </div>
                                )}

                                {entry.subject && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="font-medium">Subject:</span>
                                    <span className="text-xs break-words">
                                      {escapeHtml(entry.subject)}
                                    </span>
                                  </div>
                                )}

                                {/* Mood Data */}
                                <div className="grid grid-cols-2 gap-2">
                                  <span className="font-medium">Mood Score:</span>
                                  <span className="font-mono text-xs">{entry.mood_score}/10</span>
                                </div>

                                {entry.energy_level && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="font-medium">Energy Level:</span>
                                    <span className="font-mono text-xs">
                                      {entry.energy_level}/10
                                    </span>
                                  </div>
                                )}

                                {entry.stress_level && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="font-medium">Stress Level:</span>
                                    <span className="font-mono text-xs">
                                      {entry.stress_level}/10
                                    </span>
                                  </div>
                                )}

                                {entry.sleep_hours && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="font-medium">Sleep Hours:</span>
                                    <span className="font-mono text-xs">{entry.sleep_hours}h</span>
                                  </div>
                                )}

                                {/* Text Fields */}
                                {entry.note && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="font-medium">Note:</span>
                                    <span className="text-xs break-words">
                                      {escapeHtml(entry.note)}
                                    </span>
                                  </div>
                                )}

                                {entry.weather && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="font-medium">Weather:</span>
                                    <span className="text-xs">{escapeHtml(entry.weather)}</span>
                                  </div>
                                )}

                                {entry.activity && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="font-medium">Activity:</span>
                                    <span className="text-xs break-words">
                                      {escapeHtml(entry.activity)}
                                    </span>
                                  </div>
                                )}

                                {/* Source Information */}
                                <div className="grid grid-cols-2 gap-2">
                                  <span className="font-medium">From:</span>
                                  <span className="font-mono text-xs">{entry.from || 'N/A'}</span>
                                </div>

                                {entry.from_name && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="font-medium">From Name:</span>
                                    <span className="font-mono text-xs">{entry.from_name}</span>
                                  </div>
                                )}

                                {/* Timestamps */}
                                <div className="grid grid-cols-2 gap-2">
                                  <span className="font-medium">Created At:</span>
                                  <span className="font-mono text-xs">{entry.created_at}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>

                      {/* Delete Button with Confirmation - Only show if user can delete */}
                      {canDeleteEntry(entry) && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-muted-foreground hover:text-red-600 text-xs p-1"
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

                  {/* Unified Badge Section */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {/* Mood badge - always first */}
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getMoodColor(entry.mood_score)}`}
                    >
                      {entry.mood_score}/10 -{' '}
                      {moodLabels[entry.mood_score as keyof typeof moodLabels]}
                    </span>

                    {/* Additional metrics */}
                    {entry.energy_level && (
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full text-xs font-medium">
                        ⚡ Energy: {entry.energy_level}/10
                      </span>
                    )}
                    {entry.stress_level && (
                      <span className="bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1.5 rounded-full text-xs font-medium">
                        😰 Stress: {entry.stress_level}/10
                      </span>
                    )}
                    {entry.sleep_hours && (
                      <span className="bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-full text-xs font-medium">
                        😴 Sleep: {entry.sleep_hours}h
                      </span>
                    )}
                    {entry.weather && (
                      <span className="bg-cyan-50 text-cyan-700 border border-cyan-200 px-3 py-1.5 rounded-full text-xs font-medium">
                        🌤️ {entry.weather}
                      </span>
                    )}
                  </div>

                  {/* Chat Conversation */}
                  {(entry.activity || entry.note) && (
                    <div className="space-y-3 pl-6">
                      {/* User Message */}
                      {entry.activity && (
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-600">
                            <span className="text-sm">👤</span>
                          </div>

                          {/* Chat bubble */}
                          <div className="flex-1 max-w-[85%]">
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                  {entry.from_name || entry.from || 'User'}
                                </span>
                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                  Message Resume
                                </span>
                              </div>
                              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                                {entry.activity}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Aura Response */}
                      {entry.note && (
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-600">
                            <span className="text-sm">🤖</span>
                          </div>

                          {/* Chat bubble */}
                          <div className="flex-1 max-w-[85%]">
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                  Aura
                                </span>
                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                  AI Assistant
                                </span>
                              </div>
                              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
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

      {/* Load More Section */}
      {canShowMore && (
        <div className="text-center pt-6 space-y-4">
          <div className="text-sm text-muted-foreground">
            Showing {displayedEntries.length} out of {totalCount} total entries
          </div>
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="min-w-[120px]"
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
        <div className="text-center text-sm text-muted-foreground pt-4">
          All {totalCount} entries displayed
        </div>
      )}
    </div>
  );
}
