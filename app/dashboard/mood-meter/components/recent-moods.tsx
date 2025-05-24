'use client';

import { format, formatDistanceToNow } from 'date-fns';
import { FileText, Info } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
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

import type { MoodEntry } from '../page';

interface RecentMoodsProps {
  moodEntries: MoodEntry[];
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

export function RecentMoods({ moodEntries }: RecentMoodsProps) {
  if (moodEntries.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        <div className="text-center">
          <div className="text-4xl mb-2">📝</div>
          <p>No mood entries yet.</p>
          <p className="text-sm">Add your first mood entry above!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>

      <div className="space-y-6">
        {moodEntries.slice(0, 10).map((entry, index) => (
          <div key={entry.id} className="relative flex items-start gap-6">
            {/* Timeline dot */}
            <div className="relative z-10 flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-background border-2 border-border flex items-center justify-center text-2xl shadow-sm">
                {moodEmojis[entry.mood_score as keyof typeof moodEmojis]}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pb-6">
              <div className="bg-card rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  {/* Header with mood and time */}
                  <div className="flex items-center justify-between gap-2">
                    <Badge className={getMoodColor(entry.mood_score)}>
                      {entry.mood_score}/10 -{' '}
                      {moodLabels[entry.mood_score as keyof typeof moodLabels]}
                    </Badge>
                    <div className="flex items-center gap-1">

                      <span className="text-sm text-muted-foreground font-medium">
                        {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                      </span>
                      {/* Raw Data Sheet */}
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-muted-foreground hover:text-foreground"
                          >
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
                                {entry.user_email && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="font-medium">User Email:</span>
                                    <span className="font-mono text-xs">{entry.user_email}</span>
                                  </div>
                                )}
                                <div className="grid grid-cols-2 gap-2">
                                  <span className="font-medium">From:</span>
                                  <span className="font-mono text-xs">
                                    {entry.from || 'Unknown'}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <span className="font-medium">Date Occurred:</span>
                                  <span className="font-mono text-xs">{entry.date_occurred}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <span className="font-medium">Created At:</span>
                                  <span className="font-mono text-xs">{entry.created_at}</span>
                                </div>
                                {entry.activity && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="font-medium">Activity:</span>
                                    <span className="text-xs">{escapeHtml(entry.activity)}</span>
                                  </div>
                                )}
                                {entry.emotions && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="font-medium">Emotions:</span>
                                    <span className="text-xs">{escapeHtml(entry.emotions)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  </div>

                  {/* Full date */}
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(entry.created_at), "EEEE, MMMM do, yyyy 'at' h:mm a")}
                  </div>

                  {/* Additional metrics */}
                  {(entry.energy_level ||
                    entry.stress_level ||
                    entry.sleep_hours ||
                    entry.weather) && (
                    <div className="flex flex-wrap gap-2">
                      {entry.energy_level && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
                          ⚡ Energy: {entry.energy_level}/10
                        </span>
                      )}
                      {entry.stress_level && (
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-xs font-medium">
                          😰 Stress: {entry.stress_level}/10
                        </span>
                      )}
                      {entry.sleep_hours && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs font-medium">
                          😴 Sleep: {entry.sleep_hours}h
                        </span>
                      )}
                      {entry.weather && (
                        <span className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded-md text-xs font-medium">
                          🌤️ {entry.weather}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Activity */}
                  {entry.activity && (
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">🏃 Activity:</span>
                          <span className="text-sm ">{entry.activity}</span>
                        </div>
                      </div>
                  )}

                  {/* Note */}
                  {entry.note && (
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">💡 Hint:</span>
                          <span className="text-sm">{entry.note}</span>
                        </div>
                      </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {moodEntries.length > 10 && (
        <div className="text-center text-sm text-muted-foreground pt-4">
          Showing 10 most recent entries out of {moodEntries.length} total
        </div>
      )}
    </div>
  );
}
