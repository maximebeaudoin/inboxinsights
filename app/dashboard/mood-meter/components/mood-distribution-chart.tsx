'use client';

import { useMemo, useState } from 'react';

import { subDays } from 'date-fns';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import type { MoodEntry } from '@/lib/types/mood-entry';

interface MoodDistributionChartProps {
  moodEntries: MoodEntry[];
}

const moodRanges = [
  {
    range: '1-3',
    label: 'Low Mood',
    color: '#ef4444',
    lightColor: '#fecaca',
    emoji: '😢',
    description: 'Challenging days',
  },
  {
    range: '4-5',
    label: 'Fair Mood',
    color: '#f59e0b',
    lightColor: '#fed7aa',
    emoji: '😐',
    description: 'Neutral feelings',
  },
  {
    range: '6-7',
    label: 'Good Mood',
    color: '#3b82f6',
    lightColor: '#bfdbfe',
    emoji: '😊',
    description: 'Positive vibes',
  },
  {
    range: '8-10',
    label: 'Great Mood',
    color: '#10b981',
    lightColor: '#bbf7d0',
    emoji: '😍',
    description: 'Excellent days',
  },
];

export function MoodDistributionChart({ moodEntries }: MoodDistributionChartProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const { distributionData, stats, trends } = useMemo(() => {
    if (moodEntries.length === 0) return { distributionData: [], stats: null, trends: null };

    const distribution = {
      '1-3': 0,
      '4-5': 0,
      '6-7': 0,
      '8-10': 0,
    };

    // Calculate distribution
    moodEntries.forEach((entry) => {
      const score = entry.mood_score;
      if (score >= 1 && score <= 3) distribution['1-3']++;
      else if (score >= 4 && score <= 5) distribution['4-5']++;
      else if (score >= 6 && score <= 7) distribution['6-7']++;
      else if (score >= 8 && score <= 10) distribution['8-10']++;
    });

    const chartData = moodRanges.map((range) => ({
      ...range,
      value: distribution[range.range as keyof typeof distribution],
      percentage: Math.round(
        (distribution[range.range as keyof typeof distribution] / moodEntries.length) * 100
      ),
    }));

    // Calculate statistics
    const totalEntries = moodEntries.length;
    const averageMood =
      moodEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / totalEntries;
    const positiveEntries = distribution['6-7'] + distribution['8-10'];
    const positivePercentage = Math.round((positiveEntries / totalEntries) * 100);

    // Calculate trends (last 7 days vs previous 7 days)
    const now = new Date();
    const last7Days = moodEntries.filter((entry) => new Date(entry.created_at) >= subDays(now, 7));
    const previous7Days = moodEntries.filter((entry) => {
      const entryDate = new Date(entry.created_at);
      return entryDate >= subDays(now, 14) && entryDate < subDays(now, 7);
    });

    let trendDirection = null;
    let trendValue = 0;

    if (last7Days.length > 0 && previous7Days.length > 0) {
      const recentAvg =
        last7Days.reduce((sum, entry) => sum + entry.mood_score, 0) / last7Days.length;
      const previousAvg =
        previous7Days.reduce((sum, entry) => sum + entry.mood_score, 0) / previous7Days.length;
      trendValue = Math.abs(recentAvg - previousAvg);
      trendDirection = recentAvg > previousAvg ? 'up' : recentAvg < previousAvg ? 'down' : 'stable';
    }

    return {
      distributionData: chartData,
      stats: {
        totalEntries,
        averageMood,
        positivePercentage,
        mostCommon: chartData.reduce((max, current) => (current.value > max.value ? current : max)),
      },
      trends: {
        direction: trendDirection,
        value: trendValue,
        recentCount: last7Days.length,
      },
    };
  }, [moodEntries]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card className="shadow-lg border-2 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{data.emoji}</div>
              <div>
                <p className="font-semibold text-base">{data.label}</p>
                <p className="text-sm text-muted-foreground mb-1">{data.description}</p>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{data.percentage}%</span>
                  <span className="text-sm text-muted-foreground">
                    ({data.value} {data.value === 1 ? 'entry' : 'entries'})
                  </span>
                </div>
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
          <CardDescription>Breakdown of your mood patterns and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-80 text-muted-foreground">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-lg font-medium mb-2">No mood data to analyze yet</p>
              <p className="text-sm">
                Start tracking your mood to see detailed insights and patterns!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Mood Distribution
              {trends?.direction && (
                <div className="flex items-center gap-1">
                  {trends.direction === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : trends.direction === 'down' ? (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  ) : null}
                </div>
              )}
            </CardTitle>
            <CardDescription>
              Breakdown of your mood patterns and insights
              {stats && (
                <span className="block mt-1 text-sm">
                  Average mood:{' '}
                  <span className="font-medium">{stats.averageMood.toFixed(1)}/10</span>
                  {trends?.direction && trends.recentCount > 0 && (
                    <span className="ml-2">
                      •{' '}
                      {trends.direction === 'up'
                        ? 'Improving'
                        : trends.direction === 'down'
                          ? 'Declining'
                          : 'Stable'}{' '}
                      trend
                    </span>
                  )}
                </span>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Ultra Compact Donut Chart */}
          <div className="relative">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData.filter((item) => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={65}
                    paddingAngle={1}
                    dataKey="value"
                    onMouseEnter={(_, index) => {
                      const item = distributionData.filter((item) => item.value > 0)[index];
                      setHoveredSegment(item?.range || null);
                    }}
                    onMouseLeave={() => setHoveredSegment(null)}
                  >
                    {distributionData
                      .filter((item) => item.value > 0)
                      .map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={hoveredSegment === entry.range ? entry.lightColor : entry.color}
                          stroke={hoveredSegment === entry.range ? entry.color : 'transparent'}
                          strokeWidth={hoveredSegment === entry.range ? 2 : 0}
                          style={{
                            filter: hoveredSegment === entry.range ? 'brightness(1.1)' : 'none',
                            transition: 'all 0.2s ease-in-out',
                          }}
                        />
                      ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Center Stats */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-base font-bold text-foreground">
                  {stats?.positivePercentage}%
                </div>
                <div className="text-xs text-muted-foreground">Positive</div>
              </div>
            </div>
          </div>

          {/* Ultra Compact Legend */}
          <div className="space-y-2">
            {distributionData.map((item) => (
              <div
                key={item.range}
                className={`
                  p-2 rounded border transition-all duration-200 cursor-pointer
                  ${
                    hoveredSegment === item.range
                      ? 'border-primary/50 bg-primary/5'
                      : 'border-border hover:border-primary/30'
                  }
                `}
                onMouseEnter={() => setHoveredSegment(item.range)}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-base">{item.emoji}</span>
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm">{item.percentage}%</span>
                  </div>
                </div>

                {/* Mini Progress Bar */}
                <Progress
                  value={item.percentage}
                  className="h-1"
                  style={
                    {
                      '--progress-background': item.lightColor,
                      '--progress-foreground': item.color,
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </div>

          {/* Ultra Compact Summary */}
          <div className="space-y-2 pt-3 border-t">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-1.5 bg-muted/50 rounded">
                <div className="text-lg font-bold text-foreground">{stats?.totalEntries}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="text-center p-1.5 bg-muted/50 rounded">
                <div className="text-lg font-bold text-foreground">
                  {stats?.averageMood.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Average</div>
              </div>
            </div>

            <div className="text-center p-2 bg-primary/10 rounded border border-primary/20">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <span className="text-base">{stats?.mostCommon.emoji}</span>
                <span className="font-medium text-xs">Most Common</span>
              </div>
              <div className="text-sm font-bold text-primary">{stats?.mostCommon.label}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
