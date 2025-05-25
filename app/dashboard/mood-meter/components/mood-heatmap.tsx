'use client';

import { useMemo } from 'react';

import { addDays, format, isSameDay, startOfWeek, subWeeks } from 'date-fns';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import type { MoodEntry } from '@/lib/types/mood-entry';

interface MoodHeatmapProps {
  moodEntries: MoodEntry[];
}

const getMoodColor = (score: number | null): string => {
  if (score === null) return 'bg-gray-100 dark:bg-gray-800';
  if (score <= 3) return 'bg-red-200 dark:bg-red-900/50';
  if (score <= 5) return 'bg-yellow-200 dark:bg-yellow-900/50';
  if (score <= 7) return 'bg-blue-200 dark:bg-blue-900/50';
  return 'bg-green-200 dark:bg-green-900/50';
};

const getMoodEmoji = (score: number | null): string => {
  if (score === null) return '';
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
  return moodEmojis[score as keyof typeof moodEmojis] || '😐';
};

export function MoodHeatmap({ moodEntries }: MoodHeatmapProps) {
  const heatmapData = useMemo(() => {
    const weeks = [];
    const today = new Date();

    // Generate last 12 weeks
    for (let i = 11; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(today, i), { weekStartsOn: 1 }); // Monday start
      const week = [];

      for (let j = 0; j < 7; j++) {
        const date = addDays(weekStart, j);
        const dayEntry = moodEntries.find((entry) => isSameDay(new Date(entry.created_at), date));

        week.push({
          date,
          mood: dayEntry?.mood_score || null,
          hasEntry: !!dayEntry,
          isToday: isSameDay(date, today),
          isFuture: date > today,
        });
      }

      weeks.push(week);
    }

    return weeks;
  }, [moodEntries]);

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Calendar</CardTitle>
        <CardDescription>Your mood patterns over the last 12 weeks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Month labels */}
          <div className="flex justify-between text-xs text-muted-foreground">
            {heatmapData.length > 0 && (
              <>
                <span>{months[heatmapData[0][0].date.getMonth()]}</span>
                <span>
                  {months[heatmapData[Math.floor(heatmapData.length / 2)][0].date.getMonth()]}
                </span>
                <span>{months[heatmapData[heatmapData.length - 1][0].date.getMonth()]}</span>
              </>
            )}
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-2">
              <div className="h-3"></div> {/* Spacer for alignment */}
              {weekDays.map((day, index) => (
                <div key={day} className="h-3 text-xs text-muted-foreground flex items-center">
                  {index % 2 === 0 ? day : ''}
                </div>
              ))}
            </div>

            {/* Heatmap cells */}
            <div className="flex gap-1">
              {heatmapData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <TooltipProvider key={`${weekIndex}-${dayIndex}`}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`
                              w-3 h-3 rounded-sm border border-gray-200 dark:border-gray-700 cursor-pointer
                              transition-all duration-200 hover:scale-110
                              ${getMoodColor(day.mood)}
                              ${day.isToday ? 'ring-2 ring-blue-500' : ''}
                              ${day.isFuture ? 'opacity-30' : ''}
                              ${!day.hasEntry && !day.isFuture ? 'opacity-50' : ''}
                            `}
                          >
                            {day.hasEntry && (
                              <div className="w-full h-full flex items-center justify-center text-[6px]">
                                {getMoodEmoji(day.mood)}
                              </div>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-center">
                            <p className="font-medium">{format(day.date, 'MMM dd, yyyy')}</p>
                            {day.hasEntry ? (
                              <div className="flex items-center gap-1 mt-1">
                                <span>{getMoodEmoji(day.mood)}</span>
                                <span>Mood: {day.mood}/10</span>
                              </div>
                            ) : day.isFuture ? (
                              <p className="text-xs text-muted-foreground">Future date</p>
                            ) : (
                              <p className="text-xs text-muted-foreground">No mood recorded</p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800 border"></div>
                <div className="w-3 h-3 rounded-sm bg-red-200 dark:bg-red-900/50 border"></div>
                <div className="w-3 h-3 rounded-sm bg-yellow-200 dark:bg-yellow-900/50 border"></div>
                <div className="w-3 h-3 rounded-sm bg-blue-200 dark:bg-blue-900/50 border"></div>
                <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900/50 border"></div>
              </div>
              <span>More</span>
            </div>

            <div className="text-xs text-muted-foreground">{moodEntries.length} total entries</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
