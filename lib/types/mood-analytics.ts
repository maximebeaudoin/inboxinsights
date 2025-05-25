import type { MoodEntry } from './mood-entry';

// Basic statistics interfaces
export interface BasicMoodStats {
  average: number;
  min: number;
  max: number;
  range: number;
  total: number;
  count: number;
}

export interface TrendData {
  direction: 'up' | 'down' | 'stable';
  value: number;
  percentage?: number;
}

export interface StreakData {
  length: number;
  type: 'positive' | 'negative' | 'neutral';
  current: boolean;
}

// Time-based analysis
export interface TimePatterns {
  morning: {
    average: number;
    count: number;
    entries: MoodEntry[];
  };
  afternoon: {
    average: number;
    count: number;
    entries: MoodEntry[];
  };
  evening: {
    average: number;
    count: number;
    entries: MoodEntry[];
  };
  bestTime: 'morning' | 'afternoon' | 'evening' | null;
}

export interface WeekdayPatterns {
  [key: string]: {
    average: number;
    count: number;
    entries: MoodEntry[];
  };
}

// Distribution analysis
export interface MoodDistribution {
  '1-3': number;
  '4-5': number;
  '6-7': number;
  '8-10': number;
}

export interface DistributionStats {
  distribution: MoodDistribution;
  positivePercentage: number;
  mostCommon: {
    range: string;
    value: number;
    percentage: number;
  };
}

// Correlation analysis
export interface CorrelationData {
  sleepMood: number | null;
  energyMood: number | null;
  stressMood: number | null;
}

// Wellness scoring
export interface WellnessScore {
  score: number;
  level: 'excellent' | 'good' | 'fair' | 'poor';
  components: {
    mood: number;
    energy: number;
    stress: number;
  };
}

// Insights and recommendations
export interface MoodInsight {
  type: 'positive' | 'warning' | 'info';
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: string;
  priority: number;
}

// Comprehensive analytics result
export interface MoodAnalytics {
  basicStats: BasicMoodStats;
  trends: {
    weekly: TrendData | null;
    recent: TrendData | null;
    overall: TrendData | null;
  };
  streaks: {
    current: StreakData;
    longest: StreakData;
  };
  timePatterns: TimePatterns;
  weekdayPatterns: WeekdayPatterns & { bestDay: string | null };
  distribution: DistributionStats;
  correlations: CorrelationData;
  wellness: WellnessScore;
  insights: MoodInsight[];
  recentActivity: {
    last7Days: number;
    last30Days: number;
    recentAverage: number;
  };
  personalBests: {
    highestMood: number;
    bestWeek: {
      startDate: string;
      average: number;
    } | null;
    longestStreak: StreakData;
  };
}

// Chart-specific data structures
export interface ChartDataPoint {
  date: string;
  mood: number;
  energy?: number;
  stress?: number;
  [key: string]: any;
}

export interface DistributionChartData {
  range: string;
  value: number;
  percentage: number;
  color: string;
}

// Configuration types
export interface AnalyticsConfig {
  positiveThreshold: number;
  trendSensitivity: number;
  streakMinimum: number;
  timeZone?: string;
}

// Enhanced analytics for dashboard
export interface EnhancedAnalytics {
  currentStreak: number;
  goalProgress: number;
  goalTrend: 'up' | 'down' | 'neutral';
  avgEnergy: number;
  energyTrend: 'up' | 'down' | 'stable';
  wellnessScore: number;
  wellnessLevel: 'excellent' | 'good' | 'fair' | 'poor';
  weeklyTrend: 'up' | 'down' | 'stable';
  todayMood?: number;
  bestDayScore?: number;
  bestDay?: string;
  weeklyAverage?: number;
  morningAvg?: number;
  afternoonAvg?: number;
  eveningAvg?: number;
  bestTimeOfDay?: 'morning' | 'afternoon' | 'evening';
  sleepImpact?: 'positive' | 'negative' | 'neutral';
  stressCorrelation?: 'high' | 'medium' | 'low';
  energySync?: 'aligned' | 'misaligned';
  topRecommendation?: string;
}
