'use client';

import { useState } from 'react';

import {
  Activity,
  AlertCircle,
  Award,
  Brain,
  RefreshCw,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { moodAnalytics } from '@/lib/services/mood-analytics';
import type { MoodEntry, ViewMode } from '@/lib/types/mood-entry';

import { useMoodEntries } from '@/hooks/use-mood-entries';

import { FloatingHelpButton } from './floating-instructions-button';
import { MoodChart } from './mood-chart';
import { MoodDistributionChart } from './mood-distribution-chart';
import { MoodHeatmap } from './mood-heatmap';
import { MoodInsights } from './mood-insights';
import { MoodStats } from './mood-stats';
import { RecentMoods } from './recent-moods';
import { ViewModeToggle } from './view-mode-toggle';

interface MoodMeterDashboardProps {
  initialMoodEntries: MoodEntry[];
}

// Enhanced analytics interface
interface EnhancedAnalytics {
  currentStreak: number;
  goalProgress: number;
  goalTrend: 'up' | 'down' | 'neutral';
  avgEnergy: number;
  energyTrend: 'up' | 'down' | 'stable';
  wellnessScore: number;
  wellnessLevel: 'excellent' | 'good' | 'fair' | 'poor';
  todayMood?: number;
  bestDayScore?: number;
  bestDay?: string;
  weeklyAverage?: number;
  weeklyTrend: 'up' | 'down' | 'stable';
  morningAvg?: number;
  afternoonAvg?: number;
  eveningAvg?: number;
  bestTimeOfDay?: string;
  sleepImpact?: 'positive' | 'negative' | 'neutral';
  stressCorrelation?: 'high' | 'medium' | 'low';
  energySync?: 'aligned' | 'misaligned';
  topRecommendation?: string;
}

// Mood emoji mapping
const getMoodEmoji = (score: number): string => {
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

// Note: Enhanced analytics calculation moved to centralized mood-analytics service

export function MoodMeterDashboard({ initialMoodEntries }: MoodMeterDashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('personal');
  const { moodEntries, loading, loadingMore, error, hasMore, totalCount, refetch, loadMore } =
    useMoodEntries(initialMoodEntries, viewMode);

  // Enhanced analytics calculations using centralized service
  const analytics = moodAnalytics.calculateEnhancedAnalytics(moodEntries);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
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

      {/* Header Section with View Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mood Dashboard</h1>
          <p className="text-muted-foreground">
            {viewMode === 'personal'
              ? 'Track your emotional journey and discover patterns'
              : 'Explore global mood trends and insights'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Real-time indicator */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Live updates</span>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Updating...</span>
            </div>
          )}
          <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} disabled={loading} />
        </div>
      </div>

      {/* Compact Hero Metrics Section */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-blue-500">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-blue-100/80 dark:from-blue-950/30 dark:to-blue-900/30 group-hover:from-blue-100/90 group-hover:to-blue-200/90 dark:group-hover:from-blue-950/50 dark:group-hover:to-blue-900/50 transition-all duration-300"></div>
          <CardContent className="relative p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-semibold text-muted-foreground">Current Streak</p>
                  {analytics.currentStreak >= 7 && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-4">
                      🔥 Hot
                    </Badge>
                  )}
                </div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform duration-200">
                  {analytics.currentStreak}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <span>{analytics.currentStreak === 1 ? 'day' : 'days'} in a row</span>
                  {analytics.currentStreak > 0 && (
                    <span className="text-blue-600 dark:text-blue-400">
                      {analytics.currentStreak >= 30
                        ? '🏆'
                        : analytics.currentStreak >= 14
                          ? '🥇'
                          : analytics.currentStreak >= 7
                            ? '🥈'
                            : '🥉'}
                    </span>
                  )}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-2 w-full bg-blue-100 dark:bg-blue-900/30 rounded-full h-1">
              <div
                className="bg-blue-500 h-1 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((analytics.currentStreak / 30) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              {analytics.currentStreak < 30
                ? `${30 - analytics.currentStreak} days to milestone`
                : 'Milestone achieved! 🎉'}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-green-500">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 to-green-100/80 dark:from-green-950/30 dark:to-green-900/30 group-hover:from-green-100/90 group-hover:to-green-200/90 dark:group-hover:from-green-950/50 dark:group-hover:to-green-900/50 transition-all duration-300"></div>
          <CardContent className="relative p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-semibold text-muted-foreground">Mood Goal</p>
                  {analytics.goalProgress >= 80 && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-4">
                      🎯 Excellent
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 group-hover:scale-105 transition-transform duration-200">
                    {Math.round(analytics.goalProgress)}%
                  </p>
                  {analytics.goalTrend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <span>{analytics.goalTrend === 'up' ? 'On track' : 'Needs attention'}</span>
                  {analytics.goalProgress >= 90 && <span>🌟</span>}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>

            {/* Enhanced progress indicator */}
            <div className="mt-2 relative w-full h-1 bg-green-100 dark:bg-green-900/30 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${analytics.goalProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              {analytics.goalProgress >= 100
                ? 'Goal achieved! 🎉'
                : `${100 - analytics.goalProgress}% to goal`}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-purple-500">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 to-purple-100/80 dark:from-purple-950/30 dark:to-purple-900/30 group-hover:from-purple-100/90 group-hover:to-purple-200/90 dark:group-hover:from-purple-950/50 dark:group-hover:to-purple-900/50 transition-all duration-300"></div>
          <CardContent className="relative p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-semibold text-muted-foreground">Energy Level</p>
                  {analytics.avgEnergy >= 8 && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-4">
                      ⚡ High
                    </Badge>
                  )}
                </div>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform duration-200">
                  {analytics.avgEnergy > 0 ? `${analytics.avgEnergy}/10` : 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <span>
                    {analytics.energyTrend === 'up'
                      ? '↗ Increasing'
                      : analytics.energyTrend === 'down'
                        ? '↘ Decreasing'
                        : '→ Stable'}
                  </span>
                  {analytics.avgEnergy >= 9 && <span>🔋</span>}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>

            {/* Energy level indicator */}
            {analytics.avgEnergy > 0 && (
              <div className="mt-2">
                <div className="w-full h-1 bg-purple-100 dark:bg-purple-900/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${(analytics.avgEnergy / 10) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  {analytics.avgEnergy >= 8
                    ? 'High energy! 🚀'
                    : analytics.avgEnergy >= 6
                      ? 'Good energy ⚡'
                      : analytics.avgEnergy >= 4
                        ? 'Moderate energy'
                        : 'Low energy 🔋'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-orange-500">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 to-orange-100/80 dark:from-orange-950/30 dark:to-orange-900/30 group-hover:from-orange-100/90 group-hover:to-orange-200/90 dark:group-hover:from-orange-950/50 dark:group-hover:to-orange-900/50 transition-all duration-300"></div>
          <CardContent className="relative p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-semibold text-muted-foreground">Wellness Score</p>
                  {analytics.wellnessLevel === 'excellent' && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-4">
                      🌟 Excellent
                    </Badge>
                  )}
                </div>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 group-hover:scale-105 transition-transform duration-200">
                  {analytics.wellnessScore}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge
                    variant={
                      analytics.wellnessLevel === 'excellent'
                        ? 'default'
                        : analytics.wellnessLevel === 'good'
                          ? 'secondary'
                          : 'outline'
                    }
                    className="text-xs capitalize h-4"
                  >
                    {analytics.wellnessLevel}
                  </Badge>
                  {analytics.wellnessLevel === 'excellent' && (
                    <span className="text-orange-600">🏆</span>
                  )}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Brain className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>

            {/* Wellness score indicator */}
            <div className="mt-2">
              <div className="w-full h-1 bg-orange-100 dark:bg-orange-900/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${(analytics.wellnessScore / 10) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                {analytics.wellnessLevel === 'excellent'
                  ? 'Outstanding wellness! 🌟'
                  : analytics.wellnessLevel === 'good'
                    ? 'Great wellness 👍'
                    : analytics.wellnessLevel === 'fair'
                      ? 'Fair wellness'
                      : 'Focus on wellness 💪'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Enhanced Mood Statistics */}
          <MoodStats moodEntries={moodEntries} />

          {/* Quick Insights Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Today's Mood</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{analytics.todayMood || 'No data'}</p>
                    <p className="text-sm text-muted-foreground">
                      {analytics.todayMood ? 'Recorded today' : 'Send an email to track'}
                    </p>
                  </div>
                  <div className="text-3xl">
                    {analytics.todayMood ? getMoodEmoji(analytics.todayMood) : '📝'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Best Day This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{analytics.bestDayScore || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">
                      {analytics.bestDay || 'No data this week'}
                    </p>
                  </div>
                  <div className="text-3xl">
                    {analytics.bestDayScore ? getMoodEmoji(analytics.bestDayScore) : '🌟'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Weekly Average</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{analytics.weeklyAverage || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">
                      {analytics.weeklyTrend === 'up'
                        ? '↗ Improving'
                        : analytics.weeklyTrend === 'down'
                          ? '↘ Declining'
                          : '→ Stable'}
                    </p>
                  </div>
                  <div className="text-3xl">
                    {analytics.weeklyAverage
                      ? getMoodEmoji(Math.round(analytics.weeklyAverage))
                      : '📊'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Mood Entries Timeline */}
          <div className="space-y-4">
            <RecentMoods
              moodEntries={moodEntries}
              hasMore={hasMore}
              loadingMore={loadingMore}
              totalCount={totalCount}
              onLoadMore={loadMore}
            />
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
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

          {/* Additional Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            <MoodDistributionChart moodEntries={moodEntries} />
            <MoodHeatmap moodEntries={moodEntries} />
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <MoodInsights moodEntries={moodEntries} />
        </TabsContent>
      </Tabs>

      {/* Floating Help Button */}
      <FloatingHelpButton />
    </div>
  );
}
