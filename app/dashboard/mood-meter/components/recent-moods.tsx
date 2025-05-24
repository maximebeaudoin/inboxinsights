'use client';

import { format, formatDistanceToNow } from 'date-fns';

import { Badge } from '@/components/ui/badge';

import type { MoodEntry } from '../page';

interface RecentMoodsProps {
  moodEntries: MoodEntry[];
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
                    <span className="text-sm text-muted-foreground font-medium">
                      {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                    </span>
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

                  {/* Emotions and Activity */}
                  {(entry.emotions || entry.activity) && (
                    <div className="space-y-2">
                      {entry.emotions && (
                        <div className="text-sm">
                          <span className="font-medium text-foreground">💭 Emotions: </span>
                          <span className="text-muted-foreground">{entry.emotions}</span>
                        </div>
                      )}
                      {entry.activity && (
                        <div className="text-sm">
                          <span className="font-medium text-foreground">🎯 Activity: </span>
                          <span className="text-muted-foreground">{entry.activity}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Note */}
                  {entry.note && (
                    <div className="bg-muted/50 p-3 rounded-md border-l-4 border-primary/20">
                      <p className="text-sm italic text-muted-foreground">"{entry.note}"</p>
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
