'use client';

import { useMemo } from 'react';

import { format, parseISO } from 'date-fns';
import { Calendar, Clock, Moon, Sun, Sunrise, Sunset } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import type { MoodEntry } from '@/lib/types/mood-entry';

interface MoodStatsProps {
  moodEntries: MoodEntry[];
}

export function MoodStats({ moodEntries }: MoodStatsProps) {
  const insights = useMemo(() => {
    if (moodEntries.length === 0) {
      return {
        timePatterns: null,
        correlations: null,
        recentActivity: null,
        weekdayPatterns: null,
        monthlyTrends: null,
        personalBests: null,
      };
    }

    // Time of day patterns
    const timePatterns = {
      morning: moodEntries.filter((entry) => {
        const hour = new Date(entry.created_at).getHours();
        return hour >= 6 && hour < 12;
      }),
      afternoon: moodEntries.filter((entry) => {
        const hour = new Date(entry.created_at).getHours();
        return hour >= 12 && hour < 18;
      }),
      evening: moodEntries.filter((entry) => {
        const hour = new Date(entry.created_at).getHours();
        return hour >= 18 || hour < 6;
      }),
    };

    const timeAverages = {
      morning:
        timePatterns.morning.length > 0
          ? timePatterns.morning.reduce((sum, entry) => sum + entry.mood_score, 0) /
            timePatterns.morning.length
          : 0,
      afternoon:
        timePatterns.afternoon.length > 0
          ? timePatterns.afternoon.reduce((sum, entry) => sum + entry.mood_score, 0) /
            timePatterns.afternoon.length
          : 0,
      evening:
        timePatterns.evening.length > 0
          ? timePatterns.evening.reduce((sum, entry) => sum + entry.mood_score, 0) /
            timePatterns.evening.length
          : 0,
    };

    const bestTimeOfDay = Object.entries(timeAverages).reduce(
      (best, [time, avg]) => (avg > best.avg ? { time, avg } : best),
      { time: 'morning', avg: 0 }
    );

    // Weekday patterns
    const weekdayPatterns = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ].map((day) => {
      const dayEntries = moodEntries.filter((entry) => {
        const entryDay = new Date(entry.created_at).toLocaleDateString('en-US', {
          weekday: 'long',
        });
        return entryDay === day;
      });
      return {
        day,
        count: dayEntries.length,
        average:
          dayEntries.length > 0
            ? dayEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / dayEntries.length
            : 0,
      };
    });

    const bestWeekday = weekdayPatterns.reduce((best, current) =>
      current.average > best.average ? current : best
    );

    // Recent activity (last 7 days)
    const last7Days = moodEntries.filter((entry) => {
      const entryDate = new Date(entry.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    });

    // Correlations
    const correlations = {
      sleepMood: calculateCorrelation(moodEntries, 'sleep_hours', 'mood_score'),
      energyMood: calculateCorrelation(moodEntries, 'energy_level', 'mood_score'),
      stressMood: calculateCorrelation(moodEntries, 'stress_level', 'mood_score'),
    };

    // Personal bests
    const personalBests = {
      highestMood: Math.max(...moodEntries.map((e) => e.mood_score)),
      bestWeek: getBestWeek(moodEntries),
      longestStreak: getLongestPositiveStreak(moodEntries),
    };

    return {
      timePatterns: {
        averages: timeAverages,
        bestTime: bestTimeOfDay,
        distribution: timePatterns,
      },
      correlations,
      recentActivity: {
        last7Days: last7Days.length,
        recentAverage:
          last7Days.length > 0
            ? last7Days.reduce((sum, entry) => sum + entry.mood_score, 0) / last7Days.length
            : 0,
      },
      weekdayPatterns: {
        patterns: weekdayPatterns,
        bestDay: bestWeekday,
      },
      personalBests,
    };
  }, [moodEntries]);

  // Helper functions
  function calculateCorrelation(
    entries: MoodEntry[],
    field1: keyof MoodEntry,
    field2: keyof MoodEntry
  ) {
    const validEntries = entries.filter((entry) => entry[field1] && entry[field2]);
    if (validEntries.length < 3) return null;

    // Simple correlation calculation
    const values1 = validEntries.map((entry) => Number(entry[field1]));
    const values2 = validEntries.map((entry) => Number(entry[field2]));

    const mean1 = values1.reduce((sum, val) => sum + val, 0) / values1.length;
    const mean2 = values2.reduce((sum, val) => sum + val, 0) / values2.length;

    const numerator = values1.reduce(
      (sum, val, i) => sum + (val - mean1) * (values2[i] - mean2),
      0
    );
    const denominator = Math.sqrt(
      values1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) *
        values2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0)
    );

    return denominator === 0 ? 0 : numerator / denominator;
  }

  function getBestWeek(entries: MoodEntry[]) {
    // Group entries by week and find the best average
    const weeks = new Map();
    entries.forEach((entry) => {
      const date = new Date(entry.created_at);
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weeks.has(weekKey)) {
        weeks.set(weekKey, []);
      }
      weeks.get(weekKey).push(entry.mood_score);
    });

    let bestWeek = { week: '', average: 0 };
    weeks.forEach((scores, week) => {
      const average = scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length;
      if (average > bestWeek.average) {
        bestWeek = { week, average };
      }
    });

    return bestWeek;
  }

  function getLongestPositiveStreak(entries: MoodEntry[]) {
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    let longestStreak = 0;
    let currentStreak = 0;

    sortedEntries.forEach((entry) => {
      if (entry.mood_score >= 7) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });

    return longestStreak;
  }

  if (!insights.timePatterns) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-lg font-medium mb-2">No insights available yet</p>
          <p className="text-sm">Start tracking your mood to discover patterns and insights!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Compact Insights Grid */}
      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sunrise className="h-4 w-4" />
              Best Time of Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-lg font-bold capitalize">
                  {insights.timePatterns.bestTime.time}
                </p>
                <p className="text-xs text-muted-foreground">
                  {insights.timePatterns.bestTime.avg.toFixed(1)}/10 avg
                </p>
              </div>
              <div className="text-xl">
                {insights.timePatterns.bestTime.time === 'morning'
                  ? '🌅'
                  : insights.timePatterns.bestTime.time === 'afternoon'
                    ? '☀️'
                    : '🌙'}
              </div>
            </div>

            <div className="space-y-1">
              {Object.entries(insights.timePatterns.averages).map(([time, avg]) => (
                <div key={time} className="flex items-center justify-between">
                  <span className="text-xs capitalize">{time}</span>
                  <div className="flex items-center gap-1">
                    <Progress value={(avg / 10) * 100} className="w-12 h-1" />
                    <span className="text-xs w-6">{avg.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Best Weekday
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-lg font-bold">{insights.weekdayPatterns.bestDay.day}</p>
                <p className="text-xs text-muted-foreground">
                  {insights.weekdayPatterns.bestDay.average.toFixed(1)}/10 avg
                </p>
              </div>
              <div className="text-xl">📅</div>
            </div>

            <div className="space-y-1">
              {insights.weekdayPatterns.patterns.slice(0, 3).map((pattern) => (
                <div key={pattern.day} className="flex items-center justify-between">
                  <span className="text-xs truncate">{pattern.day.slice(0, 3)}</span>
                  <div className="flex items-center gap-1">
                    <Progress value={(pattern.average / 10) * 100} className="w-10 h-1" />
                    <span className="text-xs w-6">{pattern.average.toFixed(1)}</span>
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground mt-1">
                +{insights.weekdayPatterns.patterns.length - 3} more
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-lg font-bold">{insights.recentActivity.last7Days}</p>
                <p className="text-xs text-muted-foreground">Entries this week</p>
              </div>
              <div className="text-xl">📈</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs">Weekly Average</span>
                <Badge variant="outline" className="text-xs h-5">
                  {insights.recentActivity.recentAverage.toFixed(1)}/10
                </Badge>
              </div>
              <Progress
                value={(insights.recentActivity.recentAverage / 10) * 100}
                className="h-1"
              />
              <p className="text-xs text-muted-foreground">
                {insights.recentActivity.last7Days >= 5
                  ? 'Great consistency! 🎯'
                  : insights.recentActivity.last7Days >= 3
                    ? 'Good tracking 👍'
                    : 'Try tracking more 📝'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compact Correlations & Personal Bests */}
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">🔗 Mood Correlations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.correlations.sleepMood !== null && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon className="h-3 w-3" />
                    <span className="text-xs">Sleep & Mood</span>
                  </div>
                  <Badge
                    variant={
                      Math.abs(insights.correlations.sleepMood) > 0.3 ? 'secondary' : 'outline'
                    }
                    className="text-xs h-5"
                  >
                    {insights.correlations.sleepMood > 0.3
                      ? 'Strong +'
                      : insights.correlations.sleepMood < -0.3
                        ? 'Strong -'
                        : 'Weak'}
                  </Badge>
                </div>
              )}

              {insights.correlations.energyMood !== null && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className="h-3 w-3" />
                    <span className="text-xs">Energy & Mood</span>
                  </div>
                  <Badge
                    variant={
                      Math.abs(insights.correlations.energyMood) > 0.3 ? 'secondary' : 'outline'
                    }
                    className="text-xs h-5"
                  >
                    {insights.correlations.energyMood > 0.3
                      ? 'Strong +'
                      : insights.correlations.energyMood < -0.3
                        ? 'Strong -'
                        : 'Weak'}
                  </Badge>
                </div>
              )}

              {insights.correlations.stressMood !== null && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sunset className="h-3 w-3" />
                    <span className="text-xs">Stress & Mood</span>
                  </div>
                  <Badge
                    variant={
                      Math.abs(insights.correlations.stressMood) > 0.3 ? 'secondary' : 'outline'
                    }
                    className="text-xs h-5"
                  >
                    {insights.correlations.stressMood > 0.3
                      ? 'Strong +'
                      : insights.correlations.stressMood < -0.3
                        ? 'Strong -'
                        : 'Weak'}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">🏆 Personal Bests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🎯</span>
                  <span className="text-xs">Highest Mood</span>
                </div>
                <Badge variant="secondary" className="text-xs font-bold h-5">
                  {insights.personalBests.highestMood}/10
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🔥</span>
                  <span className="text-xs">Longest Streak</span>
                </div>
                <Badge variant="secondary" className="text-xs h-5">
                  {insights.personalBests.longestStreak} days
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">⭐</span>
                  <span className="text-xs">Best Week</span>
                </div>
                <Badge variant="outline" className="text-xs h-5">
                  {insights.personalBests.bestWeek.average.toFixed(1)}/10
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
