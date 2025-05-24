'use client';

import { useMemo } from 'react';

import { format } from 'date-fns';

import type { MoodEntry } from '../page';

interface MoodChartProps {
  moodEntries: MoodEntry[];
}

export function MoodChart({ moodEntries }: MoodChartProps) {
  const chartData = useMemo(() => {
    // Get last 30 days of data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentEntries = moodEntries
      .filter((entry) => new Date(entry.created_at) >= thirtyDaysAgo)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    return recentEntries.map((entry) => ({
      date: format(new Date(entry.created_at), 'MMM dd'),
      mood: entry.mood_score,
      fullDate: entry.created_at,
    }));
  }, [moodEntries]);

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

  const maxMood = Math.max(...chartData.map((d) => d.mood));
  const minMood = Math.min(...chartData.map((d) => d.mood));

  return (
    <div className="w-full h-64 relative">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground py-4">
        {[10, 8, 6, 4, 2, 0].map((value) => (
          <div key={value} className="flex items-center">
            {value}
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div className="ml-8 h-full relative">
        {/* Grid lines */}
        <div className="absolute inset-0">
          {[0, 2, 4, 6, 8, 10].map((value) => (
            <div
              key={value}
              className="absolute w-full border-t border-muted"
              style={{ bottom: `${(value / 10) * 100}%` }}
            />
          ))}
        </div>

        {/* Chart line */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            points={chartData
              .map((point, index) => {
                const x = (index / (chartData.length - 1)) * 100;
                const y = 100 - (point.mood / 10) * 100;
                return `${x},${y}`;
              })
              .join(' ')}
          />
          {/* Data points */}
          {chartData.map((point, index) => {
            const x = (index / (chartData.length - 1)) * 100;
            const y = 100 - (point.mood / 10) * 100;
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={`${y}%`}
                r="4"
                fill="hsl(var(--primary))"
                className="hover:r-6 transition-all cursor-pointer"
                title={`${point.date}: ${point.mood}/10`}
              />
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className="absolute bottom-0 w-full flex justify-between text-xs text-muted-foreground transform translate-y-6">
          {chartData.length > 0 && (
            <>
              <span>{chartData[0].date}</span>
              {chartData.length > 1 && <span>{chartData[chartData.length - 1].date}</span>}
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span>Mood Score</span>
        </div>
        <div className="text-muted-foreground">Showing last {chartData.length} entries</div>
      </div>
    </div>
  );
}
