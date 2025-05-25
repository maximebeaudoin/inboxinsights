import React from 'react';

import {
  Activity,
  AlertTriangle,
  Brain,
  Heart,
  Moon,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import type { MoodInsight } from '@/lib/types/mood-analytics';
import type { MoodEntry } from '@/lib/types/mood-entry';

import { moodAnalytics } from './mood-analytics';

export class MoodInsightsService {
  /**
   * Generate personalized insights based on mood data
   */
  generateInsights(entries: MoodEntry[]): MoodInsight[] {
    if (entries.length < 3) {
      return [
        {
          type: 'info',
          icon: React.createElement(Brain, { className: 'h-4 w-4' }),
          title: 'Keep tracking to unlock insights',
          description:
            'Track your mood for a few more days to get personalized insights and recommendations.',
          action: 'Send more mood emails to get started',
          priority: 1,
        },
      ];
    }

    const insights: MoodInsight[] = [];
    const analytics = moodAnalytics.generateComprehensiveAnalytics(entries);
    const recentEntries = entries.slice(0, 7); // Last 7 entries
    const avgMood = analytics.basicStats.average;
    const recentAvg = analytics.recentActivity.recentAverage;

    // Trend insights
    if (analytics.trends.weekly) {
      if (analytics.trends.weekly.direction === 'up') {
        insights.push({
          type: 'positive',
          icon: React.createElement(TrendingUp, { className: 'h-4 w-4' }),
          title: 'Your mood is trending upward!',
          description: `Your mood has improved by ${analytics.trends.weekly.value.toFixed(1)} points over the past week.`,
          action: "Keep doing what you're doing - it's working!",
          priority: 2,
        });
      } else if (analytics.trends.weekly.direction === 'down') {
        insights.push({
          type: 'warning',
          icon: React.createElement(TrendingDown, { className: 'h-4 w-4' }),
          title: 'Mood decline detected',
          description: `Your mood has decreased by ${analytics.trends.weekly.value.toFixed(1)} points this week.`,
          action: 'Consider what might be affecting your mood and try some self-care activities',
          priority: 1,
        });
      }
    }

    // Sleep insights
    const sleepEntries = entries.filter((entry) => entry.sleep_hours);
    if (sleepEntries.length > 5) {
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
            icon: React.createElement(Moon, { className: 'h-4 w-4' }),
            title: 'Sleep positively impacts your mood',
            description: `Your mood is ${(goodSleepMood - poorSleepMood).toFixed(1)} points higher when you get 7+ hours of sleep.`,
            action: 'Prioritize getting 7-8 hours of sleep for better mood',
            priority: 2,
          });
        }
      }
    }

    // Stress insights
    const stressEntries = entries.filter((entry) => entry.stress_level);
    if (stressEntries.length > 5) {
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
            icon: React.createElement(AlertTriangle, { className: 'h-4 w-4' }),
            title: 'High stress affects your mood',
            description: `Your mood drops by ${(lowStressMood - highStressMood).toFixed(1)} points during high-stress periods.`,
            action: 'Try stress-reduction techniques like meditation or deep breathing',
            priority: 1,
          });
        }
      }
    }

    // Energy insights
    const energyEntries = entries.filter((entry) => entry.energy_level);
    if (energyEntries.length > 5) {
      const correlation = analytics.correlations.energyMood;
      if (correlation && correlation > 0.6) {
        insights.push({
          type: 'positive',
          icon: React.createElement(Activity, { className: 'h-4 w-4' }),
          title: 'Energy and mood are well connected',
          description: `Your energy levels strongly correlate with your mood (${(correlation * 100).toFixed(0)}% correlation).`,
          action: 'Focus on activities that boost your energy to improve your mood',
          priority: 3,
        });
      }
    }

    // Time pattern insights
    if (analytics.timePatterns.bestTime) {
      const bestTime = analytics.timePatterns.bestTime;
      const bestAverage = analytics.timePatterns[bestTime].average;
      const otherTimes = Object.keys(analytics.timePatterns).filter(
        (time) => time !== bestTime && time !== 'bestTime'
      ) as Array<'morning' | 'afternoon' | 'evening'>;

      const otherAverages = otherTimes.map((time) => analytics.timePatterns[time].average);
      const maxOtherAverage = Math.max(...otherAverages);

      if (bestAverage > maxOtherAverage + 0.5) {
        insights.push({
          type: 'info',
          icon: React.createElement(Brain, { className: 'h-4 w-4' }),
          title: `You're happiest in the ${bestTime}`,
          description: `Your ${bestTime} mood average (${bestAverage.toFixed(1)}) is significantly higher than other times.`,
          action: `Try scheduling important activities during your ${bestTime} hours`,
          priority: 4,
        });
      }
    }

    // Streak insights
    if (analytics.streaks.current.length >= 3) {
      const streakType = analytics.streaks.current.type;
      if (streakType === 'positive') {
        insights.push({
          type: 'positive',
          icon: React.createElement(Heart, { className: 'h-4 w-4' }),
          title: `${analytics.streaks.current.length}-day positive streak!`,
          description: "You're on a roll with consistently good moods.",
          action: 'Keep up the great work and maintain your positive habits',
          priority: 2,
        });
      } else if (streakType === 'negative') {
        insights.push({
          type: 'warning',
          icon: React.createElement(AlertTriangle, { className: 'h-4 w-4' }),
          title: 'Challenging period detected',
          description: `You've had ${analytics.streaks.current.length} consecutive days of lower mood.`,
          action: 'Consider reaching out for support or trying mood-boosting activities',
          priority: 1,
        });
      }
    }

    // Consistency insights
    const moodVariance = this.calculateVariance(entries.map((e) => e.mood_score));
    if (moodVariance < 2) {
      insights.push({
        type: 'positive',
        icon: React.createElement(Heart, { className: 'h-4 w-4' }),
        title: 'Stable mood patterns',
        description:
          'Your mood has been consistently stable, which indicates good emotional regulation.',
        action: "Continue your current routine - it's working well for you",
        priority: 4,
      });
    } else if (moodVariance > 6) {
      insights.push({
        type: 'warning',
        icon: React.createElement(AlertTriangle, { className: 'h-4 w-4' }),
        title: 'Mood fluctuations detected',
        description:
          'Your mood varies significantly. This could indicate external stressors or lifestyle factors.',
        action: 'Consider tracking additional factors like diet, exercise, or social interactions',
        priority: 3,
      });
    }

    // Recent improvement insight
    if (recentAvg > avgMood + 1) {
      insights.push({
        type: 'positive',
        icon: React.createElement(TrendingUp, { className: 'h-4 w-4' }),
        title: 'Recent mood improvement',
        description: `Your recent mood average (${recentAvg.toFixed(1)}) is higher than your overall average (${avgMood.toFixed(1)}).`,
        action: "Reflect on what you've been doing differently lately",
        priority: 2,
      });
    }

    // Sort by priority and limit to 4 insights
    return insights.sort((a, b) => a.priority - b.priority).slice(0, 4);
  }

  /**
   * Calculate mood health score
   */
  calculateMoodHealthScore(entries: MoodEntry[]): number {
    if (entries.length === 0) return 0;
    const avgMood = entries.reduce((sum, entry) => sum + entry.mood_score, 0) / entries.length;
    return Math.round((avgMood / 10) * 100);
  }

  /**
   * Calculate variance for mood stability analysis
   */
  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  }
}

// Export a default instance
export const moodInsights = new MoodInsightsService();
