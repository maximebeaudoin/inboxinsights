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
    <div className="space-y-4">
      {moodEntries.slice(0, 10).map((entry) => (
        <div
          key={entry.id}
          className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
          <div className="text-3xl">{moodEmojis[entry.mood_score as keyof typeof moodEmojis]}</div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={getMoodColor(entry.mood_score)}>
                {entry.mood_score}/10 - {moodLabels[entry.mood_score as keyof typeof moodLabels]}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
              </span>
            </div>

            <div className="text-sm text-muted-foreground">
              {format(new Date(entry.created_at), "EEEE, MMMM do, yyyy 'at' h:mm a")}
            </div>

            {/* Additional metrics */}
            <div className="flex flex-wrap gap-2 text-xs">
              {entry.energy_level && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Energy: {entry.energy_level}/10
                </span>
              )}
              {entry.stress_level && (
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                  Stress: {entry.stress_level}/10
                </span>
              )}
              {entry.sleep_hours && (
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  Sleep: {entry.sleep_hours}h
                </span>
              )}
              {entry.weather && (
                <span className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded">{entry.weather}</span>
              )}
            </div>

            {entry.emotions && (
              <div className="text-sm">
                <span className="font-medium">Emotions: </span>
                <span className="text-muted-foreground">{entry.emotions}</span>
              </div>
            )}

            {entry.activity && (
              <div className="text-sm">
                <span className="font-medium">Activity: </span>
                <span className="text-muted-foreground">{entry.activity}</span>
              </div>
            )}

            {entry.note && (
              <div className="text-sm bg-muted/50 p-3 rounded-md">
                <p className="italic">"{entry.note}"</p>
              </div>
            )}
          </div>
        </div>
      ))}

      {moodEntries.length > 10 && (
        <div className="text-center text-sm text-muted-foreground pt-4">
          Showing 10 most recent entries out of {moodEntries.length} total
        </div>
      )}
    </div>
  );
}
