'use client';

import { useMemo, useState } from 'react';

import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarData = useMemo(() => {
    const today = new Date();
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday start
    const calendarEnd = addDays(calendarStart, 34); // 5 weeks (35 days)

    const days = [];
    let day = calendarStart;

    while (day <= calendarEnd) {
      const dayEntry = moodEntries.find((entry) => isSameDay(new Date(entry.created_at), day));

      days.push({
        date: new Date(day),
        mood: dayEntry?.mood_score || null,
        hasEntry: !!dayEntry,
        isToday: isSameDay(day, today),
        isFuture: day > today,
        isCurrentMonth: isSameMonth(day, currentDate),
      });

      day = addDays(day, 1);
    }

    // Group days into weeks (exactly 5 weeks)
    const weeks = [];
    for (let i = 0; i < 35; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return weeks;
  }, [moodEntries, currentDate]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => (direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)));
  };

  const currentMonthEntries = moodEntries.filter((entry) =>
    isSameMonth(new Date(entry.created_at), currentDate)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mood Calendar</CardTitle>
            <CardDescription>
              Your mood patterns for {format(currentDate, 'MMMM yyyy')}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="space-y-2">
            {calendarData.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-2">
                {week.map((day, dayIndex) => (
                  <TooltipProvider key={`${weekIndex}-${dayIndex}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`
                            aspect-square rounded-lg border-2 cursor-pointer
                            transition-all duration-200 hover:scale-105 hover:shadow-md
                            flex flex-col items-center justify-center p-1 min-h-[60px]
                            ${getMoodColor(day.mood)}
                            ${day.isToday ? 'ring-2 ring-primary ring-offset-2' : 'border-border'}
                            ${day.isFuture ? 'opacity-40' : ''}
                            ${!day.hasEntry && !day.isFuture ? 'opacity-60' : ''}
                            ${!day.isCurrentMonth ? 'opacity-30' : ''}
                          `}
                        >
                          {/* Date number */}
                          <div
                            className={`
                              text-xs font-medium mb-1
                              ${day.isToday ? 'text-primary font-bold' : 'text-foreground'}
                              ${!day.isCurrentMonth ? 'text-muted-foreground' : ''}
                            `}
                          >
                            {format(day.date, 'd')}
                          </div>

                          {/* Mood emoji */}
                          {day.hasEntry && (
                            <div className="text-lg leading-none">{getMoodEmoji(day.mood)}</div>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <p className="font-medium">{format(day.date, 'EEEE, MMM dd, yyyy')}</p>
                          {day.hasEntry ? (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-lg">{getMoodEmoji(day.mood)}</span>
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

          {/* Legend and Stats */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>Mood Scale:</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-sm bg-gray-100 dark:bg-gray-800 border"></div>
                <span>None</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-sm bg-red-200 dark:bg-red-900/50 border"></div>
                <span>Low (1-3)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-sm bg-yellow-200 dark:bg-yellow-900/50 border"></div>
                <span>Mid (4-5)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-sm bg-blue-200 dark:bg-blue-900/50 border"></div>
                <span>Good (6-7)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-sm bg-green-200 dark:bg-green-900/50 border"></div>
                <span>High (8-10)</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              {currentMonthEntries.length} entries this month
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
