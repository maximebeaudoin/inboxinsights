import { format, isSameDay, startOfWeek, subDays } from 'date-fns';

import type {
  AnalyticsConfig,
  BasicMoodStats,
  ChartDataPoint,
  CorrelationData,
  DistributionChartData,
  DistributionStats,
  EnhancedAnalytics,
  MoodAnalytics,
  MoodDistribution,
  StreakData,
  TimePatterns,
  TrendData,
  WeekdayPatterns,
  WellnessScore,
} from '@/lib/types/mood-analytics';
import type { MoodEntry } from '@/lib/types/mood-entry';

// Default configuration
const DEFAULT_CONFIG: AnalyticsConfig = {
  positiveThreshold: 6,
  trendSensitivity: 0.5,
  streakMinimum: 3,
  timeZone: 'America/Chicago', // Central timezone as fallback
};

export class MoodAnalyticsService {
  private config: AnalyticsConfig;

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Calculate basic mood statistics
   */
  calculateBasicStats(entries: MoodEntry[]): BasicMoodStats {
    if (entries.length === 0) {
      return {
        average: 0,
        min: 0,
        max: 0,
        range: 0,
        total: 0,
        count: 0,
      };
    }

    const scores = entries.map((entry) => entry.mood_score);
    const total = scores.reduce((sum, score) => sum + score, 0);
    const average = total / scores.length;
    const min = Math.min(...scores);
    const max = Math.max(...scores);

    return {
      average: Math.round(average * 10) / 10,
      min,
      max,
      range: max - min,
      total: Math.round(total * 10) / 10,
      count: entries.length,
    };
  }

  /**
   * Calculate trend between two periods
   */
  calculateTrend(recent: MoodEntry[], previous: MoodEntry[]): TrendData | null {
    if (recent.length === 0 || previous.length === 0) {
      return null;
    }

    const recentAvg = recent.reduce((sum, entry) => sum + entry.mood_score, 0) / recent.length;
    const previousAvg =
      previous.reduce((sum, entry) => sum + entry.mood_score, 0) / previous.length;

    const difference = recentAvg - previousAvg;
    const value = Math.abs(difference);
    const percentage = previousAvg > 0 ? Math.round((difference / previousAvg) * 100) : 0;

    let direction: 'up' | 'down' | 'stable' = 'stable';
    if (value >= this.config.trendSensitivity) {
      direction = difference > 0 ? 'up' : 'down';
    }

    return {
      direction,
      value: Math.round(value * 10) / 10,
      percentage,
    };
  }

  /**
   * Calculate weekly trend (last 7 days vs previous 7 days)
   */
  calculateWeeklyTrend(entries: MoodEntry[]): TrendData | null {
    const now = new Date();
    const last7Days = entries.filter((entry) => new Date(entry.created_at) >= subDays(now, 7));
    const previous7Days = entries.filter((entry) => {
      const entryDate = new Date(entry.created_at);
      return entryDate >= subDays(now, 14) && entryDate < subDays(now, 7);
    });

    return this.calculateTrend(last7Days, previous7Days);
  }

  /**
   * Calculate recent trend (last 3 vs previous 3 entries)
   */
  calculateRecentTrend(entries: MoodEntry[]): TrendData | null {
    if (entries.length < 6) return null;

    const sortedEntries = [...entries].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const recent = sortedEntries.slice(0, 3);
    const previous = sortedEntries.slice(3, 6);

    return this.calculateTrend(recent, previous);
  }

  /**
   * Calculate current and longest streaks
   */
  calculateStreaks(entries: MoodEntry[]): { current: StreakData; longest: StreakData } {
    if (entries.length === 0) {
      return {
        current: { length: 0, type: 'neutral', current: true },
        longest: { length: 0, type: 'neutral', current: false },
      };
    }

    const sortedEntries = [...entries].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Calculate current streak
    let currentStreak = 0;
    let currentType: 'positive' | 'negative' | 'neutral' = 'neutral';

    if (sortedEntries.length > 0) {
      const firstScore = sortedEntries[0].mood_score;
      currentType = firstScore >= this.config.positiveThreshold ? 'positive' : 'negative';

      for (const entry of sortedEntries) {
        const isPositive = entry.mood_score >= this.config.positiveThreshold;
        if (
          (currentType === 'positive' && isPositive) ||
          (currentType === 'negative' && !isPositive)
        ) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let longestType: 'positive' | 'negative' | 'neutral' = 'neutral';
    let tempStreak = 0;
    let tempType: 'positive' | 'negative' | 'neutral' = 'neutral';

    for (const entry of sortedEntries.reverse()) {
      const isPositive = entry.mood_score >= this.config.positiveThreshold;
      const entryType = isPositive ? 'positive' : 'negative';

      if (tempType === entryType || tempStreak === 0) {
        tempStreak++;
        tempType = entryType;
      } else {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
          longestType = tempType;
        }
        tempStreak = 1;
        tempType = entryType;
      }
    }

    // Check final streak
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
      longestType = tempType;
    }

    return {
      current: {
        length: currentStreak,
        type: currentType,
        current: true,
      },
      longest: {
        length: longestStreak,
        type: longestType,
        current: false,
      },
    };
  }

  /**
   * Analyze time patterns (morning, afternoon, evening)
   */
  analyzeTimePatterns(entries: MoodEntry[]): TimePatterns {
    const patterns = {
      morning: { entries: [] as MoodEntry[], average: 0, count: 0 },
      afternoon: { entries: [] as MoodEntry[], average: 0, count: 0 },
      evening: { entries: [] as MoodEntry[], average: 0, count: 0 },
    };

    // Categorize entries by time of day
    entries.forEach((entry) => {
      const hour = new Date(entry.created_at).getHours();
      if (hour >= 6 && hour < 12) {
        patterns.morning.entries.push(entry);
      } else if (hour >= 12 && hour < 18) {
        patterns.afternoon.entries.push(entry);
      } else {
        patterns.evening.entries.push(entry);
      }
    });

    // Calculate averages
    Object.keys(patterns).forEach((timeKey) => {
      const time = timeKey as keyof typeof patterns;
      const timeEntries = patterns[time].entries;
      patterns[time].count = timeEntries.length;
      patterns[time].average =
        timeEntries.length > 0
          ? Math.round(
              (timeEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / timeEntries.length) *
                10
            ) / 10
          : 0;
    });

    // Determine best time
    let bestTime: 'morning' | 'afternoon' | 'evening' | null = null;
    let bestAverage = 0;

    Object.entries(patterns).forEach(([time, data]) => {
      if (data.count > 0 && data.average > bestAverage) {
        bestAverage = data.average;
        bestTime = time as 'morning' | 'afternoon' | 'evening';
      }
    });

    return {
      ...patterns,
      bestTime,
    };
  }

  /**
   * Calculate mood distribution across ranges
   */
  calculateDistribution(entries: MoodEntry[]): DistributionStats {
    const distribution: MoodDistribution = {
      '1-3': 0,
      '4-5': 0,
      '6-7': 0,
      '8-10': 0,
    };

    if (entries.length === 0) {
      return {
        distribution,
        positivePercentage: 0,
        mostCommon: { range: '1-3', value: 0, percentage: 0 },
      };
    }

    // Count entries in each range
    entries.forEach((entry) => {
      const score = entry.mood_score;
      if (score >= 1 && score <= 3) distribution['1-3']++;
      else if (score >= 4 && score <= 5) distribution['4-5']++;
      else if (score >= 6 && score <= 7) distribution['6-7']++;
      else if (score >= 8 && score <= 10) distribution['8-10']++;
    });

    const totalEntries = entries.length;
    const positiveEntries = distribution['6-7'] + distribution['8-10'];
    const positivePercentage = Math.round((positiveEntries / totalEntries) * 100);

    // Find most common range
    let mostCommonRange = '1-3';
    let mostCommonValue = distribution['1-3'];

    Object.entries(distribution).forEach(([range, value]) => {
      if (value > mostCommonValue) {
        mostCommonRange = range;
        mostCommonValue = value;
      }
    });

    return {
      distribution,
      positivePercentage,
      mostCommon: {
        range: mostCommonRange,
        value: mostCommonValue,
        percentage: Math.round((mostCommonValue / totalEntries) * 100),
      },
    };
  }

  /**
   * Calculate correlation between two fields
   */
  calculateCorrelation(
    entries: MoodEntry[],
    field1: keyof MoodEntry,
    field2: keyof MoodEntry
  ): number | null {
    const validEntries = entries.filter((entry) => entry[field1] && entry[field2]);
    if (validEntries.length < 3) return null;

    const values1 = validEntries.map((entry) => Number(entry[field1]));
    const values2 = validEntries.map((entry) => Number(entry[field2]));

    const mean1 = values1.reduce((sum, val) => sum + val, 0) / values1.length;
    const mean2 = values2.reduce((sum, val) => sum + val, 0) / values2.length;

    const numerator = values1.reduce(
      (sum, val, i) => sum + (val - mean1) * (values2[i] - mean2),
      0
    );
    const denominator = Math.sqrt(
      values1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) *
        values2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0)
    );

    return denominator === 0 ? 0 : Math.round((numerator / denominator) * 100) / 100;
  }

  /**
   * Calculate all correlations
   */
  calculateCorrelations(entries: MoodEntry[]): CorrelationData {
    return {
      sleepMood: this.calculateCorrelation(entries, 'sleep_hours', 'mood_score'),
      energyMood: this.calculateCorrelation(entries, 'energy_level', 'mood_score'),
      stressMood: this.calculateCorrelation(entries, 'stress_level', 'mood_score'),
    };
  }

  /**
   * Calculate wellness score
   */
  calculateWellnessScore(entries: MoodEntry[]): WellnessScore {
    if (entries.length === 0) {
      return {
        score: 0,
        level: 'poor',
        components: { mood: 0, energy: 0, stress: 0 },
      };
    }

    const avgMood = entries.reduce((sum, entry) => sum + entry.mood_score, 0) / entries.length;

    const energyEntries = entries.filter((entry) => entry.energy_level);
    const avgEnergy =
      energyEntries.length > 0
        ? energyEntries.reduce((sum, entry) => sum + (entry.energy_level || 0), 0) /
          energyEntries.length
        : 5;

    const stressEntries = entries.filter((entry) => entry.stress_level);
    const avgStress =
      stressEntries.length > 0
        ? stressEntries.reduce((sum, entry) => sum + (entry.stress_level || 0), 0) /
          stressEntries.length
        : 5;

    const wellnessScore =
      Math.round((avgMood * 0.4 + avgEnergy * 0.3 + (10 - avgStress) * 0.3) * 10) / 10;

    let level: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';
    if (wellnessScore >= 8) level = 'excellent';
    else if (wellnessScore >= 6.5) level = 'good';
    else if (wellnessScore >= 5) level = 'fair';

    return {
      score: wellnessScore,
      level,
      components: {
        mood: Math.round(avgMood * 10) / 10,
        energy: Math.round(avgEnergy * 10) / 10,
        stress: Math.round(avgStress * 10) / 10,
      },
    };
  }

  /**
   * Analyze weekday patterns
   */
  analyzeWeekdayPatterns(entries: MoodEntry[]): WeekdayPatterns & { bestDay: string | null } {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const patterns: WeekdayPatterns = {};

    // Initialize patterns
    weekdays.forEach((day) => {
      patterns[day] = { average: 0, count: 0, entries: [] };
    });

    // Categorize entries by weekday
    entries.forEach((entry) => {
      const dayName = weekdays[new Date(entry.created_at).getDay()];
      patterns[dayName].entries.push(entry);
    });

    // Calculate averages
    let bestDay: string | null = null;
    let bestAverage = 0;

    Object.keys(patterns).forEach((day) => {
      const dayEntries = patterns[day].entries;
      patterns[day].count = dayEntries.length;
      patterns[day].average =
        dayEntries.length > 0
          ? Math.round(
              (dayEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / dayEntries.length) *
                10
            ) / 10
          : 0;

      if (patterns[day].count > 0 && patterns[day].average > bestAverage) {
        bestAverage = patterns[day].average;
        bestDay = day;
      }
    });

    return Object.assign(patterns, { bestDay });
  }

  /**
   * Calculate recent activity metrics
   */
  calculateRecentActivity(entries: MoodEntry[]) {
    const now = new Date();
    const last7Days = entries.filter((entry) => new Date(entry.created_at) >= subDays(now, 7));
    const last30Days = entries.filter((entry) => new Date(entry.created_at) >= subDays(now, 30));

    const recentAverage =
      last7Days.length > 0
        ? Math.round(
            (last7Days.reduce((sum, entry) => sum + entry.mood_score, 0) / last7Days.length) * 10
          ) / 10
        : 0;

    return {
      last7Days: last7Days.length,
      last30Days: last30Days.length,
      recentAverage,
    };
  }

  /**
   * Calculate personal bests
   */
  calculatePersonalBests(entries: MoodEntry[]) {
    if (entries.length === 0) {
      return {
        highestMood: 0,
        bestWeek: null,
        longestStreak: { length: 0, type: 'neutral' as const, current: false },
      };
    }

    const highestMood = Math.max(...entries.map((e) => e.mood_score));
    const streaks = this.calculateStreaks(entries);

    // Calculate best week
    let bestWeek: { startDate: string; average: number } | null = null;
    let bestWeekAverage = 0;

    // Group entries by week
    const weekGroups: { [key: string]: MoodEntry[] } = {};
    entries.forEach((entry) => {
      const entryDate = new Date(entry.created_at);
      const weekStart = startOfWeek(entryDate, { weekStartsOn: 0 });
      const weekKey = format(weekStart, 'yyyy-MM-dd');

      if (!weekGroups[weekKey]) {
        weekGroups[weekKey] = [];
      }
      weekGroups[weekKey].push(entry);
    });

    // Find best week
    Object.entries(weekGroups).forEach(([weekKey, weekEntries]) => {
      if (weekEntries.length >= 3) {
        // Minimum 3 entries for a valid week
        const weekAverage =
          weekEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / weekEntries.length;
        if (weekAverage > bestWeekAverage) {
          bestWeekAverage = weekAverage;
          bestWeek = {
            startDate: weekKey,
            average: Math.round(weekAverage * 10) / 10,
          };
        }
      }
    });

    return {
      highestMood,
      bestWeek,
      longestStreak: streaks.longest,
    };
  }

  /**
   * Prepare chart data for mood visualization
   */
  prepareChartData(entries: MoodEntry[], timeFilter: string = 'all'): ChartDataPoint[] {
    let filteredEntries = [...entries];

    // Apply time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      const days =
        timeFilter === '7d' ? 7 : timeFilter === '30d' ? 30 : timeFilter === '90d' ? 90 : 0;
      if (days > 0) {
        filteredEntries = entries.filter(
          (entry) => new Date(entry.created_at) >= subDays(now, days)
        );
      }
    }

    return filteredEntries
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((entry) => ({
        date: format(new Date(entry.created_at), 'MMM dd'),
        mood: entry.mood_score,
        energy: entry.energy_level || undefined,
        stress: entry.stress_level || undefined,
        sleep: entry.sleep_hours || undefined,
        fullDate: entry.created_at,
      }));
  }

  /**
   * Prepare distribution chart data
   */
  prepareDistributionChartData(entries: MoodEntry[]): DistributionChartData[] {
    const distribution = this.calculateDistribution(entries);
    const colors = {
      '1-3': '#ef4444', // red
      '4-5': '#f59e0b', // amber
      '6-7': '#3b82f6', // blue
      '8-10': '#10b981', // emerald
    };

    return Object.entries(distribution.distribution).map(([range, value]) => ({
      range,
      value,
      percentage: entries.length > 0 ? Math.round((value / entries.length) * 100) : 0,
      color: colors[range as keyof typeof colors],
    }));
  }

  /**
   * Calculate enhanced analytics for dashboard
   */
  calculateEnhancedAnalytics(entries: MoodEntry[]): EnhancedAnalytics {
    if (entries.length === 0) {
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

    const basicStats = this.calculateBasicStats(entries);
    const streaks = this.calculateStreaks(entries);
    const weeklyTrend = this.calculateWeeklyTrend(entries);
    const timePatterns = this.analyzeTimePatterns(entries);
    const wellness = this.calculateWellnessScore(entries);
    const recentActivity = this.calculateRecentActivity(entries);

    // Calculate today's mood
    const today = new Date();
    const todayEntry = entries.find((entry) => isSameDay(new Date(entry.created_at), today));

    // Calculate best day this week
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 0 }); // Start on Sunday
    const thisWeekEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.created_at);
      return entryDate >= startOfCurrentWeek && entryDate <= today;
    });

    let bestDayScore: number | undefined;
    let bestDay: string | undefined;

    if (thisWeekEntries.length > 0) {
      const weekdays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      let highestScore = 0;

      thisWeekEntries.forEach((entry) => {
        if (entry.mood_score > highestScore) {
          highestScore = entry.mood_score;
          bestDayScore = entry.mood_score;
          bestDay = weekdays[new Date(entry.created_at).getDay()];
        }
      });
    }

    // Calculate energy trend
    const energyEntries = entries.filter((entry) => entry.energy_level);
    const recentEnergyEntries = energyEntries.filter(
      (entry) => new Date(entry.created_at) >= subDays(today, 7)
    );
    const previousEnergyEntries = energyEntries.filter((entry) => {
      const entryDate = new Date(entry.created_at);
      return entryDate >= subDays(today, 14) && entryDate < subDays(today, 7);
    });

    let energyTrend: 'up' | 'down' | 'stable' = 'stable';
    if (recentEnergyEntries.length > 0 && previousEnergyEntries.length > 0) {
      const recentAvg =
        recentEnergyEntries.reduce((sum, entry) => sum + (entry.energy_level || 0), 0) /
        recentEnergyEntries.length;
      const previousAvg =
        previousEnergyEntries.reduce((sum, entry) => sum + (entry.energy_level || 0), 0) /
        previousEnergyEntries.length;
      const difference = recentAvg - previousAvg;
      if (Math.abs(difference) >= 0.5) {
        energyTrend = difference > 0 ? 'up' : 'down';
      }
    }

    // Calculate sleep impact
    const sleepEntries = entries.filter((entry) => entry.sleep_hours);
    const goodSleepEntries = sleepEntries.filter((entry) => (entry.sleep_hours || 0) >= 7);
    const poorSleepEntries = sleepEntries.filter((entry) => (entry.sleep_hours || 0) < 6);

    let sleepImpact: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (goodSleepEntries.length > 0 && poorSleepEntries.length > 0) {
      const goodSleepMood =
        goodSleepEntries.reduce((sum, entry) => sum + entry.mood_score, 0) /
        goodSleepEntries.length;
      const poorSleepMood =
        poorSleepEntries.reduce((sum, entry) => sum + entry.mood_score, 0) /
        poorSleepEntries.length;
      if (goodSleepMood > poorSleepMood + 1) {
        sleepImpact = 'positive';
      } else if (poorSleepMood > goodSleepMood + 1) {
        sleepImpact = 'negative';
      }
    }

    // Calculate stress correlation
    const stressEntries = entries.filter((entry) => entry.stress_level);
    const avgStress =
      stressEntries.length > 0
        ? stressEntries.reduce((sum, entry) => sum + (entry.stress_level || 0), 0) /
          stressEntries.length
        : 5;

    const stressCorrelation = avgStress > 7 ? 'high' : avgStress > 4 ? 'medium' : 'low';

    // Calculate energy sync
    const energySync =
      Math.abs(basicStats.average - wellness.components.energy) < 1 ? 'aligned' : 'misaligned';

    // Generate top recommendation
    let topRecommendation: string | undefined;
    if (sleepImpact === 'positive') {
      topRecommendation = "Maintain your good sleep habits - they're boosting your mood!";
    } else if (stressCorrelation === 'high') {
      topRecommendation = 'Consider stress management techniques to improve your mood';
    } else if (energySync === 'misaligned') {
      topRecommendation = 'Focus on activities that align your energy and mood levels';
    } else if (basicStats.average < 6) {
      topRecommendation = 'Try incorporating more positive activities into your routine';
    }

    return {
      currentStreak: streaks.current.length,
      goalProgress: Math.min(Math.round((basicStats.average / 8) * 100), 100),
      goalTrend:
        weeklyTrend?.direction === 'stable' ? 'neutral' : weeklyTrend?.direction || 'neutral',
      avgEnergy: wellness.components.energy,
      energyTrend,
      wellnessScore: wellness.score,
      wellnessLevel: wellness.level,
      weeklyTrend: weeklyTrend?.direction || 'stable',
      todayMood: todayEntry?.mood_score,
      bestDayScore,
      bestDay,
      weeklyAverage: recentActivity.recentAverage > 0 ? recentActivity.recentAverage : undefined,
      morningAvg: timePatterns.morning.count > 0 ? timePatterns.morning.average : undefined,
      afternoonAvg: timePatterns.afternoon.count > 0 ? timePatterns.afternoon.average : undefined,
      eveningAvg: timePatterns.evening.count > 0 ? timePatterns.evening.average : undefined,
      bestTimeOfDay: timePatterns.bestTime || undefined,
      sleepImpact,
      stressCorrelation,
      energySync,
      topRecommendation,
    };
  }

  /**
   * Generate comprehensive mood analytics
   */
  generateComprehensiveAnalytics(entries: MoodEntry[]): MoodAnalytics {
    const basicStats = this.calculateBasicStats(entries);
    const weeklyTrend = this.calculateWeeklyTrend(entries);
    const recentTrend = this.calculateRecentTrend(entries);
    const streaks = this.calculateStreaks(entries);
    const timePatterns = this.analyzeTimePatterns(entries);
    const weekdayPatterns = this.analyzeWeekdayPatterns(entries);
    const distribution = this.calculateDistribution(entries);
    const correlations = this.calculateCorrelations(entries);
    const wellness = this.calculateWellnessScore(entries);
    const recentActivity = this.calculateRecentActivity(entries);
    const personalBests = this.calculatePersonalBests(entries);

    return {
      basicStats,
      trends: {
        weekly: weeklyTrend,
        recent: recentTrend,
        overall: null, // Can be calculated based on longer time periods
      },
      streaks,
      timePatterns,
      weekdayPatterns,
      distribution,
      correlations,
      wellness,
      insights: [], // Will be generated by separate insights service
      recentActivity,
      personalBests,
    };
  }
}

// Export a default instance
export const moodAnalytics = new MoodAnalyticsService();

// Export factory function for custom configurations
export const createMoodAnalyticsService = (config?: Partial<AnalyticsConfig>) => {
  return new MoodAnalyticsService(config);
};
