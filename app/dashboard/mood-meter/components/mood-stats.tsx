'use client';

import { useMemo } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { MoodEntry } from '@/lib/types/mood-entry';

interface MoodStatsProps {
  moodEntries: MoodEntry[];
}

export function MoodStats({ moodEntries }: MoodStatsProps) {
  const stats = useMemo(() => {
    if (moodEntries.length === 0) {
      return {
        average: 0,
        highest: 0,
        lowest: 0,
        totalEntries: 0,
        thisWeek: 0,
        lastWeek: 0,
        trend: 'neutral' as 'up' | 'down' | 'neutral',
        avgEnergy: 0,
        avgStress: 0,
        avgSleep: 0,
      };
    }

    const scores = moodEntries.map((entry) => entry.mood_score);
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);

    // Calculate this week vs last week
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const thisWeekEntries = moodEntries.filter((entry) => new Date(entry.created_at) >= oneWeekAgo);
    const lastWeekEntries = moodEntries.filter(
      (entry) =>
        new Date(entry.created_at) >= twoWeeksAgo && new Date(entry.created_at) < oneWeekAgo
    );

    const thisWeekAvg =
      thisWeekEntries.length > 0
        ? thisWeekEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / thisWeekEntries.length
        : 0;

    const lastWeekAvg =
      lastWeekEntries.length > 0
        ? lastWeekEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / lastWeekEntries.length
        : 0;

    let trend: 'up' | 'down' | 'neutral' = 'neutral';
    if (thisWeekAvg > lastWeekAvg + 0.5) trend = 'up';
    else if (thisWeekAvg < lastWeekAvg - 0.5) trend = 'down';

    // Calculate averages for other metrics
    const energyEntries = moodEntries.filter((entry) => entry.energy_level);
    const avgEnergy =
      energyEntries.length > 0
        ? energyEntries.reduce((sum, entry) => sum + (entry.energy_level || 0), 0) /
          energyEntries.length
        : 0;

    const stressEntries = moodEntries.filter((entry) => entry.stress_level);
    const avgStress =
      stressEntries.length > 0
        ? stressEntries.reduce((sum, entry) => sum + (entry.stress_level || 0), 0) /
          stressEntries.length
        : 0;

    const sleepEntries = moodEntries.filter((entry) => entry.sleep_hours);
    const avgSleep =
      sleepEntries.length > 0
        ? sleepEntries.reduce((sum, entry) => sum + (entry.sleep_hours || 0), 0) /
          sleepEntries.length
        : 0;

    return {
      average: Math.round(average * 10) / 10,
      highest,
      lowest,
      totalEntries: moodEntries.length,
      thisWeek: Math.round(thisWeekAvg * 10) / 10,
      lastWeek: Math.round(lastWeekAvg * 10) / 10,
      trend,
      avgEnergy: Math.round(avgEnergy * 10) / 10,
      avgStress: Math.round(avgStress * 10) / 10,
      avgSleep: Math.round(avgSleep * 10) / 10,
    };
  }, [moodEntries]);

  const getTrendIcon = () => {
    switch (stats.trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      default:
        return '➡️';
    }
  };

  const getTrendColor = () => {
    switch (stats.trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
          <span className="text-2xl">😊</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.average}/10</div>
          <p className="text-xs text-muted-foreground">Overall average</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Energy Level</CardTitle>
          <span className="text-2xl">⚡</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.avgEnergy > 0 ? `${stats.avgEnergy}/10` : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground">Average energy</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stress Level</CardTitle>
          <span className="text-2xl">😰</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.avgStress > 0 ? `${stats.avgStress}/10` : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground">Average stress</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sleep Hours</CardTitle>
          <span className="text-2xl">😴</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.avgSleep > 0 ? `${stats.avgSleep}h` : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground">Average sleep</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Trend</CardTitle>
          <span className="text-2xl">{getTrendIcon()}</span>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getTrendColor()}`}>
            {stats.thisWeek > 0 ? `${stats.thisWeek}/10` : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.lastWeek > 0 ? `Last week: ${stats.lastWeek}/10` : 'This week'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
          <span className="text-2xl">📊</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEntries}</div>
          <p className="text-xs text-muted-foreground">Mood recordings</p>
        </CardContent>
      </Card>
    </div>
  );
}
