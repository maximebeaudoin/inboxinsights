'use client';

import { useMemo, useState } from 'react';

import { format, parseISO, subDays } from 'date-fns';
import { BarChart3, LineChart as LineChartIcon, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import type { MoodEntry } from '@/lib/types/mood-entry';

interface MoodChartProps {
  moodEntries: MoodEntry[];
}

type ChartType = 'line' | 'area';
type TimeFilter = '7d' | '30d' | 'all';

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

const getMoodColor = (score: number) => {
  if (score <= 3) return '#ef4444'; // red-500
  if (score <= 5) return '#f59e0b'; // amber-500
  if (score <= 7) return '#3b82f6'; // blue-500
  return '#10b981'; // emerald-500
};

const getMoodGradient = (averageScore: number) => {
  if (averageScore <= 3)
    return {
      id: 'redGradient',
      colors: [
        { offset: '5%', color: '#ef4444', opacity: 0.3 },
        { offset: '95%', color: '#ef4444', opacity: 0.05 },
      ],
    };
  if (averageScore <= 5)
    return {
      id: 'amberGradient',
      colors: [
        { offset: '5%', color: '#f59e0b', opacity: 0.3 },
        { offset: '95%', color: '#f59e0b', opacity: 0.05 },
      ],
    };
  if (averageScore <= 7)
    return {
      id: 'blueGradient',
      colors: [
        { offset: '5%', color: '#3b82f6', opacity: 0.3 },
        { offset: '95%', color: '#3b82f6', opacity: 0.05 },
      ],
    };
  return {
    id: 'greenGradient',
    colors: [
      { offset: '5%', color: '#10b981', opacity: 0.3 },
      { offset: '95%', color: '#10b981', opacity: 0.05 },
    ],
  };
};

export function MoodChart({ moodEntries }: MoodChartProps) {
  const [chartType, setChartType] = useState<ChartType>('area');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30d');

  const { chartData, stats, insights } = useMemo(() => {
    if (moodEntries.length === 0) return { chartData: [], stats: null, insights: null };

    // Filter data based on time selection
    const now = new Date();
    let filteredEntries = moodEntries;

    if (timeFilter === '7d') {
      filteredEntries = moodEntries.filter(
        (entry) => new Date(entry.created_at) >= subDays(now, 7)
      );
    } else if (timeFilter === '30d') {
      filteredEntries = moodEntries.filter(
        (entry) => new Date(entry.created_at) >= subDays(now, 30)
      );
    }

    // Create a copy of the array before sorting to avoid mutating the original
    const sortedEntries = [...filteredEntries].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const data = sortedEntries.map((entry) => ({
      date: format(new Date(entry.created_at), 'MMM dd'),
      fullDate: entry.created_at,
      mood: entry.mood_score,
      energy: entry.energy_level || null,
      stress: entry.stress_level || null,
      sleep: entry.sleep_hours || null,
      note: entry.note || '',
      activity: entry.activity || '',
      weather: entry.weather || '',
    }));

    // Calculate statistics
    const averageMood = data.reduce((sum, entry) => sum + entry.mood, 0) / data.length;
    const moodScores = data.map((d) => d.mood);
    const minMood = Math.min(...moodScores);
    const maxMood = Math.max(...moodScores);

    // Calculate trend (last 3 vs previous 3 entries)
    let trend = null;
    if (data.length >= 6) {
      const recent = data.slice(-3).reduce((sum, entry) => sum + entry.mood, 0) / 3;
      const previous = data.slice(-6, -3).reduce((sum, entry) => sum + entry.mood, 0) / 3;
      const difference = recent - previous;
      trend = {
        direction: difference > 0.5 ? 'up' : difference < -0.5 ? 'down' : 'stable',
        value: Math.abs(difference),
      };
    }

    // Find streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let streakType = null;

    for (let i = data.length - 1; i >= 0; i--) {
      const isPositive = data[i].mood >= 6;
      if (i === data.length - 1) {
        currentStreak = 1;
        streakType = isPositive ? 'positive' : 'negative';
      } else {
        const prevPositive = data[i + 1].mood >= 6;
        if (isPositive === prevPositive) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    longestStreak = currentStreak;

    return {
      chartData: data,
      stats: {
        average: averageMood,
        min: minMood,
        max: maxMood,
        range: maxMood - minMood,
        trend,
        streak: { length: longestStreak, type: streakType },
      },
      insights: {
        dominantMood: averageMood >= 7 ? 'positive' : averageMood >= 4 ? 'neutral' : 'challenging',
        consistency: maxMood - minMood <= 3 ? 'stable' : 'variable',
      },
    };
  }, [moodEntries, timeFilter]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-muted-foreground">
        <div className="text-center">
          <div className="text-6xl mb-4">📈</div>
          <p className="text-lg font-medium mb-2">No mood data for this period</p>
          <p className="text-sm">
            Try selecting a different time range or start tracking your mood!
          </p>
        </div>
      </div>
    );
  }

  const gradient = getMoodGradient(stats?.average || 5);
  const averageColor = getMoodColor(stats?.average || 5);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card className="p-4 shadow-xl border-2 border-primary/20 bg-background/95 backdrop-blur-sm">
          <div className="space-y-3">
            <div className="font-semibold text-base">
              {format(parseISO(data.fullDate), "EEEE, MMM do 'at' h:mm a")}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{moodEmojis[data.mood as keyof typeof moodEmojis]}</span>
              <div>
                <span className="font-bold text-lg" style={{ color: getMoodColor(data.mood) }}>
                  Mood: {data.mood}/10
                </span>
                <div className="text-xs text-muted-foreground">
                  {data.mood >= 8
                    ? 'Excellent'
                    : data.mood >= 6
                      ? 'Good'
                      : data.mood >= 4
                        ? 'Fair'
                        : 'Challenging'}
                </div>
              </div>
            </div>

            {(data.energy || data.stress || data.sleep) && (
              <div className="grid grid-cols-3 gap-3 pt-2 border-t">
                {data.energy && (
                  <div className="text-center">
                    <div className="text-lg">⚡</div>
                    <div className="text-xs font-medium">{data.energy}/10</div>
                    <div className="text-xs text-muted-foreground">Energy</div>
                  </div>
                )}
                {data.stress && (
                  <div className="text-center">
                    <div className="text-lg">😰</div>
                    <div className="text-xs font-medium">{data.stress}/10</div>
                    <div className="text-xs text-muted-foreground">Stress</div>
                  </div>
                )}
                {data.sleep && (
                  <div className="text-center">
                    <div className="text-lg">😴</div>
                    <div className="text-xs font-medium">{data.sleep}h</div>
                    <div className="text-xs text-muted-foreground">Sleep</div>
                  </div>
                )}
              </div>
            )}

            {(data.weather || data.activity) && (
              <div className="space-y-1 pt-2 border-t">
                {data.weather && (
                  <div className="flex items-center gap-2 text-sm">
                    <span>🌤️</span>
                    <span>{data.weather}</span>
                  </div>
                )}
                {data.activity && (
                  <div className="flex items-center gap-2 text-sm">
                    <span>🎯</span>
                    <span>{data.activity}</span>
                  </div>
                )}
              </div>
            )}

            {data.note && (
              <div className="text-sm italic text-muted-foreground border-t pt-2">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-medium">🤖 Aura:</span>
                  <span className="flex-1">"{data.note}"</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-6">
      {/* Enhanced Controls and Insights */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Time Filter */}
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {[
              { key: '7d', label: '7 Days' },
              { key: '30d', label: '30 Days' },
              { key: 'all', label: 'All Time' },
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={timeFilter === key ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeFilter(key as TimeFilter)}
                className="h-8 px-3 text-xs"
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Insights Badges */}
          {stats?.trend && (
            <Badge variant="outline" className="flex items-center gap-1">
              {stats.trend.direction === 'up' ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : stats.trend.direction === 'down' ? (
                <TrendingDown className="h-3 w-3 text-red-500" />
              ) : (
                <Zap className="h-3 w-3 text-blue-500" />
              )}
              <span className="text-xs">
                {stats.trend.direction === 'up'
                  ? 'Improving'
                  : stats.trend.direction === 'down'
                    ? 'Declining'
                    : 'Stable'}
              </span>
            </Badge>
          )}

          {stats?.streak && stats.streak.length > 1 && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span className="text-xs">
                🔥 {stats.streak.length} day {stats.streak.type} streak
              </span>
            </Badge>
          )}
        </div>

        {/* Chart Type Controls */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <Button
            variant={chartType === 'line' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setChartType('line')}
            className="h-8 px-3"
          >
            <LineChartIcon className="h-4 w-4 mr-1" />
            Line
          </Button>
          <Button
            variant={chartType === 'area' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setChartType('area')}
            className="h-8 px-3"
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            Area
          </Button>
        </div>
      </div>

      {/* Enhanced Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradient.id} x1="0" y1="0" x2="0" y2="1">
                  {gradient.colors.map((color, index) => (
                    <stop
                      key={index}
                      offset={color.offset}
                      stopColor={color.color}
                      stopOpacity={color.opacity}
                    />
                  ))}
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 10]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                width={25}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="mood"
                stroke={averageColor}
                strokeWidth={3}
                fill={`url(#${gradient.id})`}
                dot={{
                  fill: averageColor,
                  strokeWidth: 2,
                  r: 5,
                  stroke: '#ffffff',
                }}
                activeDot={{
                  r: 8,
                  stroke: averageColor,
                  strokeWidth: 3,
                  fill: '#ffffff',
                }}
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 10]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                width={25}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="mood"
                stroke={averageColor}
                strokeWidth={3}
                dot={{
                  fill: averageColor,
                  strokeWidth: 2,
                  r: 5,
                  stroke: '#ffffff',
                }}
                activeDot={{
                  r: 8,
                  stroke: averageColor,
                  strokeWidth: 3,
                  fill: '#ffffff',
                }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
