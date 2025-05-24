'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import type { MoodEntry } from '../page';
import { MoodChart } from './mood-chart';
import { MoodStats } from './mood-stats';
import { RecentMoods } from './recent-moods';

interface MoodMeterDashboardProps {
  initialMoodEntries: MoodEntry[];
}

export function MoodMeterDashboard({ initialMoodEntries }: MoodMeterDashboardProps) {
  const moodEntries = initialMoodEntries;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Mood Statistics */}
      <MoodStats moodEntries={moodEntries} />

      {/* Mood Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Mood Trends</CardTitle>
          <CardDescription>Your mood patterns over time</CardDescription>
        </CardHeader>
        <CardContent>
          <MoodChart moodEntries={moodEntries} />
        </CardContent>
      </Card>

      {/* Recent Mood Entries Timeline */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Recent Mood Entries</h2>
          <p className="text-muted-foreground">Your latest mood recordings</p>
        </div>
        <RecentMoods moodEntries={moodEntries} />
      </div>
    </div>
  );
}
