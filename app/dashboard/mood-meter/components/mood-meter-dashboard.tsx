'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { useMoodEntries } from '@/hooks/use-mood-entries';

import type { MoodEntry } from '../page';
import { MoodChart } from './mood-chart';
import { MoodStats } from './mood-stats';
import { RecentMoods } from './recent-moods';

interface MoodMeterDashboardProps {
  initialMoodEntries: MoodEntry[];
}

export function MoodMeterDashboard({ initialMoodEntries }: MoodMeterDashboardProps) {
  const { moodEntries, loading, error, refetch } = useMoodEntries(initialMoodEntries);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={loading}
              className="ml-2"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Real-time indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Live updates enabled</span>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Updating...</span>
          </div>
        )}
      </div>

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
