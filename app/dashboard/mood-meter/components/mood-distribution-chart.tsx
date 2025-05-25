'use client';

import { useMemo } from 'react';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import type { MoodEntry } from '@/lib/types/mood-entry';

interface MoodDistributionChartProps {
  moodEntries: MoodEntry[];
}

const moodRanges = [
  { range: '1-3', label: 'Low Mood', color: '#ef4444', emoji: '😢' },
  { range: '4-5', label: 'Fair Mood', color: '#f59e0b', emoji: '😐' },
  { range: '6-7', label: 'Good Mood', color: '#3b82f6', emoji: '😊' },
  { range: '8-10', label: 'Great Mood', color: '#10b981', emoji: '😍' },
];

export function MoodDistributionChart({ moodEntries }: MoodDistributionChartProps) {
  const distributionData = useMemo(() => {
    if (moodEntries.length === 0) return [];

    const distribution = {
      '1-3': 0,
      '4-5': 0,
      '6-7': 0,
      '8-10': 0,
    };

    moodEntries.forEach((entry) => {
      const score = entry.mood_score;
      if (score >= 1 && score <= 3) distribution['1-3']++;
      else if (score >= 4 && score <= 5) distribution['4-5']++;
      else if (score >= 6 && score <= 7) distribution['6-7']++;
      else if (score >= 8 && score <= 10) distribution['8-10']++;
    });

    return moodRanges
      .map((range) => ({
        ...range,
        value: distribution[range.range as keyof typeof distribution],
        percentage: Math.round(
          (distribution[range.range as keyof typeof distribution] / moodEntries.length) * 100
        ),
      }))
      .filter((item) => item.value > 0);
  }, [moodEntries]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card className="shadow-lg border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{data.emoji}</span>
              <div>
                <p className="font-medium">{data.label}</p>
                <p className="text-sm text-muted-foreground">
                  {data.value} entries ({data.percentage}%)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  if (distributionData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mood Distribution</CardTitle>
          <CardDescription>Breakdown of your mood scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p>No mood data to analyze yet.</p>
              <p className="text-sm">Start tracking to see your mood distribution!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Distribution</CardTitle>
        <CardDescription>How your moods are distributed across different ranges</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend and Stats */}
          <div className="space-y-4">
            <div className="space-y-3">
              {distributionData.map((item) => (
                <div key={item.range} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-lg">{item.emoji}</span>
                    <div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">Score {item.range}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{item.percentage}%</p>
                    <p className="text-xs text-muted-foreground">{item.value} entries</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Most common mood:{' '}
                <span className="font-medium">
                  {
                    distributionData.reduce((max, current) =>
                      current.value > max.value ? current : max
                    ).label
                  }
                </span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
