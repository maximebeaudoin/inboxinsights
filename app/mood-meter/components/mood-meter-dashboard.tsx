'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

      {/* Tabs for different views */}
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chart">Mood Chart</TabsTrigger>
          <TabsTrigger value="recent">Recent Entries</TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mood Trends</CardTitle>
              <CardDescription>Your mood patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
              <MoodChart moodEntries={moodEntries} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Mood Entries</CardTitle>
              <CardDescription>Your latest mood recordings</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentMoods moodEntries={moodEntries} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
