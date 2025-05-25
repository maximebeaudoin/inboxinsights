'use client';

import { useMemo } from 'react';

import { format, parseISO } from 'date-fns';
import { Calendar, Clock, Moon, Sun, Sunrise, Sunset } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import { moodAnalytics } from '@/lib/services/mood-analytics';
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

    // Use centralized analytics service
    const analytics = moodAnalytics.generateComprehensiveAnalytics(moodEntries);

    return {
      timePatterns: {
        averages: {
          morning: analytics.timePatterns.morning.average,
          afternoon: analytics.timePatterns.afternoon.average,
          evening: analytics.timePatterns.evening.average,
        },
        bestTime: {
          time: analytics.timePatterns.bestTime || 'morning',
          avg: analytics.timePatterns.bestTime
            ? analytics.timePatterns[analytics.timePatterns.bestTime].average
            : 0,
        },
        distribution: {
          morning: analytics.timePatterns.morning.entries,
          afternoon: analytics.timePatterns.afternoon.entries,
          evening: analytics.timePatterns.evening.entries,
        },
      },
      correlations: analytics.correlations,
      recentActivity: analytics.recentActivity,
      weekdayPatterns: {
        patterns: Object.entries(analytics.weekdayPatterns)
          .filter(([key]) => key !== 'bestDay')
          .map(([day, data]) => ({
            day,
            count: data.count,
            average: data.average,
          })),
        bestDay: analytics.weekdayPatterns.bestDay
          ? {
              day: analytics.weekdayPatterns.bestDay,
              average: analytics.weekdayPatterns[analytics.weekdayPatterns.bestDay].average,
              count: analytics.weekdayPatterns[analytics.weekdayPatterns.bestDay].count,
            }
          : { day: 'Monday', average: 0, count: 0 },
      },
      personalBests: analytics.personalBests,
    };
  }, [moodEntries]);

  // Note: Helper functions moved to centralized mood-analytics service

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
                  {insights.personalBests.longestStreak.length} days
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">⭐</span>
                  <span className="text-xs">Best Week</span>
                </div>
                <Badge variant="outline" className="text-xs h-5">
                  {insights.personalBests.bestWeek?.average.toFixed(1) || '0.0'}/10
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
