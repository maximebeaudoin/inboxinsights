'use client';

import { useMemo } from 'react';

import {
  AlertTriangle,
  Brain,
  CheckCircle,
  Clock,
  Lightbulb,
  Moon,
  Sun,
  TrendingUp,
} from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

import type { MoodEntry } from '@/lib/types/mood-entry';

interface MoodInsightsProps {
  moodEntries: MoodEntry[];
}

interface Insight {
  type: 'positive' | 'warning' | 'info';
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: string;
}

export function MoodInsights({ moodEntries }: MoodInsightsProps) {
  const insights = useMemo(() => {
    if (moodEntries.length < 3) {
      return [
        {
          type: 'info' as const,
          icon: <Brain className="h-4 w-4" />,
          title: 'Keep tracking to unlock insights',
          description:
            'Track your mood for a few more days to get personalized insights and recommendations.',
          action: 'Send more mood emails to get started',
        },
      ];
    }

    const insights: Insight[] = [];
    const recentEntries = moodEntries.slice(0, 7); // Last 7 entries
    const avgMood =
      moodEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / moodEntries.length;
    const recentAvg =
      recentEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / recentEntries.length;

    // Trend analysis
    if (recentAvg > avgMood + 0.5) {
      insights.push({
        type: 'positive',
        icon: <TrendingUp className="h-4 w-4" />,
        title: 'Your mood is improving!',
        description: `Your recent mood average (${recentAvg.toFixed(1)}) is higher than your overall average (${avgMood.toFixed(1)}).`,
        action: "Keep up whatever you're doing - it's working!",
      });
    } else if (recentAvg < avgMood - 0.5) {
      insights.push({
        type: 'warning',
        icon: <AlertTriangle className="h-4 w-4" />,
        title: 'Recent mood dip detected',
        description: `Your recent mood average (${recentAvg.toFixed(1)}) is lower than usual (${avgMood.toFixed(1)}).`,
        action: 'Consider reaching out to friends or engaging in self-care activities',
      });
    }

    // Sleep analysis
    const sleepEntries = moodEntries.filter((entry) => entry.sleep_hours);
    if (sleepEntries.length >= 3) {
      const goodSleepEntries = sleepEntries.filter((entry) => (entry.sleep_hours || 0) >= 7);
      const poorSleepEntries = sleepEntries.filter((entry) => (entry.sleep_hours || 0) < 6);

      if (goodSleepEntries.length > 0 && poorSleepEntries.length > 0) {
        const goodSleepMood =
          goodSleepEntries.reduce((sum, entry) => sum + entry.mood_score, 0) /
          goodSleepEntries.length;
        const poorSleepMood =
          poorSleepEntries.reduce((sum, entry) => sum + entry.mood_score, 0) /
          poorSleepEntries.length;

        if (goodSleepMood > poorSleepMood + 1) {
          insights.push({
            type: 'positive',
            icon: <Moon className="h-4 w-4" />,
            title: 'Sleep positively impacts your mood',
            description: `Your mood is ${(goodSleepMood - poorSleepMood).toFixed(1)} points higher when you get 7+ hours of sleep.`,
            action: 'Prioritize getting 7-8 hours of sleep for better mood',
          });
        }
      }
    }

    // Stress correlation
    const stressEntries = moodEntries.filter((entry) => entry.stress_level);
    if (stressEntries.length >= 3) {
      const highStressEntries = stressEntries.filter((entry) => (entry.stress_level || 0) >= 7);
      const lowStressEntries = stressEntries.filter((entry) => (entry.stress_level || 0) <= 4);

      if (highStressEntries.length > 0 && lowStressEntries.length > 0) {
        const highStressMood =
          highStressEntries.reduce((sum, entry) => sum + entry.mood_score, 0) /
          highStressEntries.length;
        const lowStressMood =
          lowStressEntries.reduce((sum, entry) => sum + entry.mood_score, 0) /
          lowStressEntries.length;

        if (lowStressMood > highStressMood + 1) {
          insights.push({
            type: 'warning',
            icon: <AlertTriangle className="h-4 w-4" />,
            title: 'High stress affects your mood',
            description: `Your mood drops by ${(lowStressMood - highStressMood).toFixed(1)} points during high-stress periods.`,
            action: 'Try stress-reduction techniques like meditation or deep breathing',
          });
        }
      }
    }

    // Time of day patterns
    const morningEntries = moodEntries.filter((entry) => {
      const hour = new Date(entry.created_at).getHours();
      return hour >= 6 && hour < 12;
    });
    const eveningEntries = moodEntries.filter((entry) => {
      const hour = new Date(entry.created_at).getHours();
      return hour >= 18 || hour < 6;
    });

    if (morningEntries.length >= 2 && eveningEntries.length >= 2) {
      const morningAvg =
        morningEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / morningEntries.length;
      const eveningAvg =
        eveningEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / eveningEntries.length;

      if (morningAvg > eveningAvg + 1) {
        insights.push({
          type: 'info',
          icon: <Sun className="h-4 w-4" />,
          title: "You're a morning person!",
          description: `Your mood is typically ${(morningAvg - eveningAvg).toFixed(1)} points higher in the morning.`,
          action: 'Schedule important tasks and decisions for morning hours',
        });
      } else if (eveningAvg > morningAvg + 1) {
        insights.push({
          type: 'info',
          icon: <Moon className="h-4 w-4" />,
          title: "You're an evening person!",
          description: `Your mood is typically ${(eveningAvg - morningAvg).toFixed(1)} points higher in the evening.`,
          action: 'Consider scheduling important activities for later in the day',
        });
      }
    }

    // Consistency check
    const moodVariance =
      moodEntries.reduce((sum, entry) => sum + Math.pow(entry.mood_score - avgMood, 2), 0) /
      moodEntries.length;
    if (moodVariance < 2) {
      insights.push({
        type: 'positive',
        icon: <CheckCircle className="h-4 w-4" />,
        title: 'Your mood is stable',
        description:
          'You maintain consistent mood levels, which indicates good emotional regulation.',
        action: 'Keep maintaining your current lifestyle and habits',
      });
    } else if (moodVariance > 6) {
      insights.push({
        type: 'warning',
        icon: <AlertTriangle className="h-4 w-4" />,
        title: 'Mood fluctuations detected',
        description:
          'Your mood varies significantly. This could indicate external stressors or lifestyle factors.',
        action: 'Consider tracking additional factors like diet, exercise, or social interactions',
      });
    }

    return insights.slice(0, 4); // Limit to 4 insights
  }, [moodEntries]);

  const moodScore = useMemo(() => {
    if (moodEntries.length === 0) return 0;
    const avgMood =
      moodEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / moodEntries.length;
    return Math.round((avgMood / 10) * 100);
  }, [moodEntries]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Mood Health Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Mood Health Score
          </CardTitle>
          <CardDescription>Based on your mood tracking patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{moodScore}%</span>
              <Badge
                variant={moodScore >= 80 ? 'default' : moodScore >= 60 ? 'secondary' : 'outline'}
              >
                {moodScore >= 80 ? 'Excellent' : moodScore >= 60 ? 'Good' : 'Needs Attention'}
              </Badge>
            </div>
            <Progress value={moodScore} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {moodScore >= 80
                ? 'Your mood patterns indicate excellent emotional well-being!'
                : moodScore >= 60
                  ? 'Your mood patterns show good emotional health with room for improvement.'
                  : 'Your mood patterns suggest focusing on self-care and stress management.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Personalized Insights
          </CardTitle>
          <CardDescription>AI-powered recommendations based on your mood data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index}>
                <Alert variant={insight.type === 'warning' ? 'destructive' : 'default'}>
                  <div className="flex items-start gap-3">
                    <div
                      className={`
                      p-2 rounded-full 
                      ${insight.type === 'positive' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : ''}
                      ${insight.type === 'warning' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : ''}
                      ${insight.type === 'info' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                    `}
                    >
                      {insight.icon}
                    </div>
                    <div className="flex-1">
                      <AlertDescription>
                        <div className="space-y-2">
                          <p className="font-medium">{insight.title}</p>
                          <p className="text-sm">{insight.description}</p>
                          {insight.action && (
                            <p className="text-xs text-muted-foreground italic">
                              💡 {insight.action}
                            </p>
                          )}
                        </div>
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
                {index < insights.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
