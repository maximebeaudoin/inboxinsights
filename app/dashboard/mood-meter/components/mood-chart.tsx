'use client';

import { useMemo, useState } from 'react';

import { format, parseISO } from 'date-fns';
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

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import type { MoodEntry } from '../page';

interface MoodChartProps {
  moodEntries: MoodEntry[];
}

type ChartType = 'line' | 'area';
type TimeRange = '7d' | '30d' | '90d' | 'all';

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

const getMoodGradient = (score: number) => {
  if (score <= 3) return 'from-red-500/20 to-red-500/5';
  if (score <= 5) return 'from-amber-500/20 to-amber-500/5';
  if (score <= 7) return 'from-blue-500/20 to-blue-500/5';
  return 'from-emerald-500/20 to-emerald-500/5';
};

export function MoodChart({ moodEntries }: MoodChartProps) {
  const [chartType, setChartType] = useState<ChartType>('area');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const chartData = useMemo(() => {
    if (moodEntries.length === 0) return [];

    // Calculate date range
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
      default:
        startDate = new Date(0); // Beginning of time
        break;
    }

    const filteredEntries = moodEntries
      .filter((entry) => new Date(entry.created_at) >= startDate)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    return filteredEntries.map((entry) => ({
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
  }, [moodEntries, timeRange]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p>No mood data to display yet.</p>
          <p className="text-sm">Start tracking your mood to see trends!</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card className="p-3 shadow-lg border">
          <div className="space-y-2">
            <div className="font-medium text-sm">
              {format(parseISO(data.fullDate), "EEEE, MMM do 'at' h:mm a")}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{moodEmojis[data.mood as keyof typeof moodEmojis]}</span>
              <span className="font-semibold" style={{ color: getMoodColor(data.mood) }}>
                Mood: {data.mood}/10
              </span>
            </div>
            {data.energy && (
              <div className="text-sm text-muted-foreground">⚡ Energy: {data.energy}/10</div>
            )}
            {data.stress && (
              <div className="text-sm text-muted-foreground">😰 Stress: {data.stress}/10</div>
            )}
            {data.sleep && (
              <div className="text-sm text-muted-foreground">😴 Sleep: {data.sleep}h</div>
            )}
            {data.weather && <div className="text-sm text-muted-foreground">🌤️ {data.weather}</div>}
            {data.activity && (
              <div className="text-sm text-muted-foreground">🎯 {data.activity}</div>
            )}
            {data.note && (
              <div className="text-sm italic text-muted-foreground border-t pt-2 mt-2">
                <span className="text-xs font-medium">🤖 Aura:</span> "{data.note}"
              </div>
            )}
          </div>
        </Card>
      );
    }
    return null;
  };

  const averageMood = chartData.reduce((sum, entry) => sum + entry.mood, 0) / chartData.length;

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <Button
            variant={timeRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </Button>
          <Button
            variant={timeRange === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </Button>
          <Button
            variant={timeRange === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('90d')}
          >
            90 Days
          </Button>
          <Button
            variant={timeRange === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('all')}
          >
            All Time
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={chartType === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('line')}
          >
            Line Chart
          </Button>
          <Button
            variant={chartType === 'area' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('area')}
          >
            Area Chart
          </Button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 10]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                width={30}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="mood"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#moodGradient)"
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 10]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                width={30}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span>Mood Score</span>
        </div>
        <div className="text-muted-foreground">Showing {chartData.length} entries</div>
        <div className="text-muted-foreground">Average: {averageMood.toFixed(1)}/10</div>
        {chartData.length > 1 && (
          <div className="text-muted-foreground">
            Range: {Math.min(...chartData.map((d) => d.mood))}-
            {Math.max(...chartData.map((d) => d.mood))}/10
          </div>
        )}
      </div>
    </div>
  );
}
