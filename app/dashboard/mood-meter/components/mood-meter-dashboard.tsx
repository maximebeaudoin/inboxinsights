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

// Enhanced analytics calculation function
const calculateEnhancedAnalytics = (moodEntries: MoodEntry[]): EnhancedAnalytics => {
  if (moodEntries.length === 0) {
    return {
      currentStreak: 0,
      goalProgress: 0,
      goalTrend: 'neutral',
      avgEnergy: 0,
      energyTrend: 'stable',
      wellnessScore: 0,
      wellnessLevel: 'poor',
      weeklyTrend: 'stable',
    };
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

  // Calculate current streak
  const sortedEntries = [...moodEntries].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  let currentStreak = 0;
  const checkDate = new Date(today);

  for (let i = 0; i < 30; i++) {
    // Check last 30 days
    const hasEntry = sortedEntries.some((entry) => {
      const entryDate = new Date(entry.created_at);
      return entryDate.toDateString() === checkDate.toDateString();
    });

    if (hasEntry) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Today's mood
  const todayEntries = moodEntries.filter((entry) => {
    const entryDate = new Date(entry.created_at);
    return entryDate.toDateString() === today.toDateString();
  });
  const todayMood = todayEntries.length > 0 ? todayEntries[0].mood_score : undefined;

  // Weekly analysis
  const thisWeekEntries = moodEntries.filter((entry) => new Date(entry.created_at) >= oneWeekAgo);
  const lastWeekEntries = moodEntries.filter(
    (entry) => new Date(entry.created_at) >= twoWeeksAgo && new Date(entry.created_at) < oneWeekAgo
  );

  const thisWeekAvg =
    thisWeekEntries.length > 0
      ? thisWeekEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / thisWeekEntries.length
      : 0;
  const lastWeekAvg =
    lastWeekEntries.length > 0
      ? lastWeekEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / lastWeekEntries.length
      : 0;

  const weeklyTrend =
    thisWeekAvg > lastWeekAvg + 0.5 ? 'up' : thisWeekAvg < lastWeekAvg - 0.5 ? 'down' : 'stable';

  // Best day this week
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let bestDayScore = 0;
  let bestDay = '';

  thisWeekEntries.forEach((entry) => {
    if (entry.mood_score > bestDayScore) {
      bestDayScore = entry.mood_score;
      bestDay = weekDays[new Date(entry.created_at).getDay()];
    }
  });

  // Energy analysis
  const energyEntries = moodEntries.filter((entry) => entry.energy_level);
  const avgEnergy =
    energyEntries.length > 0
      ? Math.round(
          (energyEntries.reduce((sum, entry) => sum + (entry.energy_level || 0), 0) /
            energyEntries.length) *
            10
        ) / 10
      : 0;

  const recentEnergyEntries = energyEntries.slice(0, 5);
  const olderEnergyEntries = energyEntries.slice(5, 10);
  const recentEnergyAvg =
    recentEnergyEntries.length > 0
      ? recentEnergyEntries.reduce((sum, entry) => sum + (entry.energy_level || 0), 0) /
        recentEnergyEntries.length
      : 0;
  const olderEnergyAvg =
    olderEnergyEntries.length > 0
      ? olderEnergyEntries.reduce((sum, entry) => sum + (entry.energy_level || 0), 0) /
        olderEnergyEntries.length
      : 0;

  const energyTrend =
    recentEnergyAvg > olderEnergyAvg + 0.5
      ? 'up'
      : recentEnergyAvg < olderEnergyAvg - 0.5
        ? 'down'
        : 'stable';

  // Wellness score calculation
  const avgMood =
    moodEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / moodEntries.length;
  const stressEntries = moodEntries.filter((entry) => entry.stress_level);
  const avgStress =
    stressEntries.length > 0
      ? stressEntries.reduce((sum, entry) => sum + (entry.stress_level || 0), 0) /
        stressEntries.length
      : 5;

  const wellnessScore =
    Math.round((avgMood * 0.4 + avgEnergy * 0.3 + (10 - avgStress) * 0.3) * 10) / 10;
  const wellnessLevel =
    wellnessScore >= 8
      ? 'excellent'
      : wellnessScore >= 6.5
        ? 'good'
        : wellnessScore >= 5
          ? 'fair'
          : 'poor';

  // Goal progress (assuming goal is to maintain mood above 7)
  const goodMoodEntries = moodEntries.filter((entry) => entry.mood_score >= 7);
  const goalProgress = Math.round((goodMoodEntries.length / moodEntries.length) * 100);
  const goalTrend = thisWeekAvg >= 7 ? 'up' : 'down';

  // Time of day analysis
  const morningEntries = moodEntries.filter((entry) => {
    const hour = new Date(entry.created_at).getHours();
    return hour >= 6 && hour < 12;
  });
  const afternoonEntries = moodEntries.filter((entry) => {
    const hour = new Date(entry.created_at).getHours();
    return hour >= 12 && hour < 18;
  });
  const eveningEntries = moodEntries.filter((entry) => {
    const hour = new Date(entry.created_at).getHours();
    return hour >= 18 || hour < 6;
  });

  const morningAvg =
    morningEntries.length > 0
      ? Math.round(
          (morningEntries.reduce((sum, entry) => sum + entry.mood_score, 0) /
            morningEntries.length) *
            10
        ) / 10
      : undefined;
  const afternoonAvg =
    afternoonEntries.length > 0
      ? Math.round(
          (afternoonEntries.reduce((sum, entry) => sum + entry.mood_score, 0) /
            afternoonEntries.length) *
            10
        ) / 10
      : undefined;
  const eveningAvg =
    eveningEntries.length > 0
      ? Math.round(
          (eveningEntries.reduce((sum, entry) => sum + entry.mood_score, 0) /
            eveningEntries.length) *
            10
        ) / 10
      : undefined;

  const timeAverages = [
    { time: 'morning', avg: morningAvg || 0 },
    { time: 'afternoon', avg: afternoonAvg || 0 },
    { time: 'evening', avg: eveningAvg || 0 },
  ];
  const bestTimeOfDay = timeAverages.reduce((best, current) =>
    current.avg > best.avg ? current : best
  ).time;

  // Sleep impact analysis
  const sleepEntries = moodEntries.filter((entry) => entry.sleep_hours);
  let sleepImpact: 'positive' | 'negative' | 'neutral' | undefined;
  if (sleepEntries.length >= 3) {
    const goodSleepEntries = sleepEntries.filter((entry) => (entry.sleep_hours || 0) >= 7);
    const goodSleepMoodAvg =
      goodSleepEntries.length > 0
        ? goodSleepEntries.reduce((sum, entry) => sum + entry.mood_score, 0) /
          goodSleepEntries.length
        : 0;
    const poorSleepEntries = sleepEntries.filter((entry) => (entry.sleep_hours || 0) < 7);
    const poorSleepMoodAvg =
      poorSleepEntries.length > 0
        ? poorSleepEntries.reduce((sum, entry) => sum + entry.mood_score, 0) /
          poorSleepEntries.length
        : 0;

    sleepImpact =
      goodSleepMoodAvg > poorSleepMoodAvg + 0.5
        ? 'positive'
        : goodSleepMoodAvg < poorSleepMoodAvg - 0.5
          ? 'negative'
          : 'neutral';
  }

  // Generate recommendation
  let topRecommendation = '';
  if (avgMood < 5) {
    topRecommendation = 'Consider reaching out to friends or engaging in activities you enjoy';
  } else if (avgEnergy < 5) {
    topRecommendation = 'Focus on getting better sleep and regular exercise';
  } else if (avgStress > 7) {
    topRecommendation = 'Try stress-reduction techniques like meditation or deep breathing';
  } else {
    topRecommendation = 'Keep up the great work! Your mood patterns look healthy';
  }

  return {
    currentStreak,
    goalProgress,
    goalTrend,
    avgEnergy,
    energyTrend,
    wellnessScore,
    wellnessLevel,
    todayMood,
    bestDayScore: bestDayScore > 0 ? bestDayScore : undefined,
    bestDay: bestDay || undefined,
    weeklyAverage: thisWeekAvg > 0 ? Math.round(thisWeekAvg * 10) / 10 : undefined,
    weeklyTrend,
    morningAvg,
    afternoonAvg,
    eveningAvg,
    bestTimeOfDay: morningAvg || afternoonAvg || eveningAvg ? bestTimeOfDay : undefined,
    sleepImpact,
    stressCorrelation: avgStress > 7 ? 'high' : avgStress > 4 ? 'medium' : 'low',
    energySync: Math.abs(avgMood - avgEnergy) < 1 ? 'aligned' : 'misaligned',
    topRecommendation,
  };
};

export function MoodMeterDashboard({ initialMoodEntries }: MoodMeterDashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('personal');
  const { moodEntries, loading, loadingMore, error, hasMore, totalCount, refetch, loadMore } =
    useMoodEntries(initialMoodEntries, viewMode);

  // Enhanced analytics calculations
  const analytics = calculateEnhancedAnalytics(moodEntries);

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

      {/* Enhanced Hero Metrics Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-blue-500">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-blue-100/80 dark:from-blue-950/30 dark:to-blue-900/30 group-hover:from-blue-100/90 group-hover:to-blue-200/90 dark:group-hover:from-blue-950/50 dark:group-hover:to-blue-900/50 transition-all duration-300"></div>
          <CardContent className="relative p-5">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-semibold text-muted-foreground">Current Streak</p>
                  {analytics.currentStreak >= 7 && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      🔥 Hot
                    </Badge>
                  )}
                </div>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform duration-200">
                  {analytics.currentStreak}
                </p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
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
              <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Award className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-3 w-full bg-blue-100 dark:bg-blue-900/30 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((analytics.currentStreak / 30) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              {analytics.currentStreak < 30
                ? `${30 - analytics.currentStreak} days to 30-day milestone`
                : 'Milestone achieved! 🎉'}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-green-500">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 to-green-100/80 dark:from-green-950/30 dark:to-green-900/30 group-hover:from-green-100/90 group-hover:to-green-200/90 dark:group-hover:from-green-950/50 dark:group-hover:to-green-900/50 transition-all duration-300"></div>
          <CardContent className="relative p-5">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-semibold text-muted-foreground">Mood Goal</p>
                  {analytics.goalProgress >= 80 && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      🎯 Excellent
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400 group-hover:scale-105 transition-transform duration-200">
                    {Math.round(analytics.goalProgress)}%
                  </p>
                  {analytics.goalTrend === 'up' ? (
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <span>{analytics.goalTrend === 'up' ? 'On track' : 'Needs attention'}</span>
                  {analytics.goalProgress >= 90 && <span>🌟</span>}
                </p>
              </div>
              <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Target className="h-7 w-7 text-green-600 dark:text-green-400" />
              </div>
            </div>

            {/* Enhanced progress indicator */}
            <div className="mt-3 relative w-full h-2 bg-green-100 dark:bg-green-900/30 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${analytics.goalProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              {analytics.goalProgress >= 100
                ? 'Goal achieved! 🎉'
                : `${100 - analytics.goalProgress}% to reach goal`}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-purple-500">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 to-purple-100/80 dark:from-purple-950/30 dark:to-purple-900/30 group-hover:from-purple-100/90 group-hover:to-purple-200/90 dark:group-hover:from-purple-950/50 dark:group-hover:to-purple-900/50 transition-all duration-300"></div>
          <CardContent className="relative p-5">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-semibold text-muted-foreground">Energy Level</p>
                  {analytics.avgEnergy >= 8 && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      ⚡ High
                    </Badge>
                  )}
                </div>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform duration-200">
                  {analytics.avgEnergy > 0 ? `${analytics.avgEnergy}/10` : 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
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
              <div className="h-14 w-14 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Zap className="h-7 w-7 text-purple-600 dark:text-purple-400" />
              </div>
            </div>

            {/* Energy level indicator */}
            {analytics.avgEnergy > 0 && (
              <div className="mt-3">
                <div className="w-full h-2 bg-purple-100 dark:bg-purple-900/30 rounded-full overflow-hidden">
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
          <CardContent className="relative p-5">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-semibold text-muted-foreground">Wellness Score</p>
                  {analytics.wellnessLevel === 'excellent' && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      🌟 Excellent
                    </Badge>
                  )}
                </div>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 group-hover:scale-105 transition-transform duration-200">
                  {analytics.wellnessScore}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={
                      analytics.wellnessLevel === 'excellent'
                        ? 'default'
                        : analytics.wellnessLevel === 'good'
                          ? 'secondary'
                          : 'outline'
                    }
                    className="text-xs capitalize"
                  >
                    {analytics.wellnessLevel}
                  </Badge>
                  {analytics.wellnessLevel === 'excellent' && (
                    <span className="text-orange-600">🏆</span>
                  )}
                </div>
              </div>
              <div className="h-14 w-14 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Brain className="h-7 w-7 text-orange-600 dark:text-orange-400" />
              </div>
            </div>

            {/* Wellness score indicator */}
            <div className="mt-3">
              <div className="w-full h-2 bg-orange-100 dark:bg-orange-900/30 rounded-full overflow-hidden">
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
