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

import { moodInsights } from '@/lib/services/mood-insights';
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
  // Use centralized insights service
  const insights = useMemo(() => {
    return moodInsights.generateInsights(moodEntries);
  }, [moodEntries]);

  const moodScore = useMemo(() => {
    return moodInsights.calculateMoodHealthScore(moodEntries);
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
