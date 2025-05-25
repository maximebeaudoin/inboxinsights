'use client';

import { useState } from 'react';

import { AlertCircle, RefreshCw } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import type { MoodEntry, ViewMode } from '@/lib/types/mood-entry';

import { useMoodEntries } from '@/hooks/use-mood-entries';

import { MoodChart } from './mood-chart';
import { MoodStats } from './mood-stats';
import { RecentMoods } from './recent-moods';
import { ViewModeToggle } from './view-mode-toggle';

interface MoodMeterDashboardProps {
  initialMoodEntries: MoodEntry[];
}

export function MoodMeterDashboard({ initialMoodEntries }: MoodMeterDashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('personal');
  const { moodEntries, loading, loadingMore, error, hasMore, refetch, loadMore } = useMoodEntries(
    initialMoodEntries,
    viewMode
  );

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

      {/* View Mode Toggle */}
      <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} disabled={loading} />

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
          <CardDescription>
            {viewMode === 'personal'
              ? 'Your mood patterns over time'
              : 'Global mood patterns from all users'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MoodChart moodEntries={moodEntries} />
        </CardContent>
      </Card>

      {/* Recent Mood Entries Timeline */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Recent Mood Entries</h2>
          <p className="text-muted-foreground">
            {viewMode === 'personal'
              ? 'Your latest mood recordings'
              : 'Latest mood recordings from all users'}
          </p>
        </div>
        <RecentMoods
          moodEntries={moodEntries}
          hasMore={hasMore}
          loadingMore={loadingMore}
          onLoadMore={loadMore}
        />
      </div>
    </div>
  );
}
