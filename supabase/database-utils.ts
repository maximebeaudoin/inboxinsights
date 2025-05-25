/**
 * Database Utilities for Next.js Application
 *
 * Common database operations and utilities for the mood_entries table
 * following Supabase best practices for Next.js integration.
 */
import type { SupabaseClient } from '@supabase/supabase-js';

import type { CreateEmailViolation, EmailViolation } from '@/lib/types/email-violations';
import type { MoodEntry } from '@/lib/types/mood-entry';

/**
 * Database statistics interface
 */
export interface DatabaseStats {
  totalEntries: number;
  totalUsers: number;
  averageMoodScore: number;
  averageEnergyLevel: number;
  averageStressLevel: number;
  dateRange: {
    earliest: string;
    latest: string;
  };
}

/**
 * User statistics interface
 */
export interface UserStats {
  userEmail: string;
  totalEntries: number;
  averageMoodScore: number;
  averageEnergyLevel: number;
  averageStressLevel: number;
  averageSleepHours: number;
  dateRange: {
    earliest: string;
    latest: string;
  };
}

/**
 * Mood trends interface
 */
export interface MoodTrend {
  date: string;
  averageMood: number;
  averageEnergy: number;
  averageStress: number;
  entryCount: number;
}

/**
 * Get overall database statistics
 */
export async function getDatabaseStats(supabase: SupabaseClient): Promise<DatabaseStats> {
  // Get total count and basic stats
  const { data: statsData, error: statsError } = await supabase
    .from('mood_entries')
    .select('mood_score, energy_level, stress_level, created_at, from')
    .order('created_at', { ascending: true });

  if (statsError) {
    throw new Error(`Failed to fetch database stats: ${statsError.message}`);
  }

  if (!statsData || statsData.length === 0) {
    return {
      totalEntries: 0,
      totalUsers: 0,
      averageMoodScore: 0,
      averageEnergyLevel: 0,
      averageStressLevel: 0,
      dateRange: {
        earliest: '',
        latest: '',
      },
    };
  }

  // Calculate statistics
  const totalEntries = statsData.length;
  const uniqueUsers = new Set(statsData.map((entry) => entry.from)).size;

  const moodScores = statsData
    .filter((entry) => entry.mood_score !== null)
    .map((entry) => entry.mood_score);
  const energyLevels = statsData
    .filter((entry) => entry.energy_level !== null)
    .map((entry) => entry.energy_level);
  const stressLevels = statsData
    .filter((entry) => entry.stress_level !== null)
    .map((entry) => entry.stress_level);

  const averageMoodScore =
    moodScores.length > 0
      ? moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length
      : 0;

  const averageEnergyLevel =
    energyLevels.length > 0
      ? energyLevels.reduce((sum, level) => sum + level, 0) / energyLevels.length
      : 0;

  const averageStressLevel =
    stressLevels.length > 0
      ? stressLevels.reduce((sum, level) => sum + level, 0) / stressLevels.length
      : 0;

  return {
    totalEntries,
    totalUsers: uniqueUsers,
    averageMoodScore: Math.round(averageMoodScore * 10) / 10,
    averageEnergyLevel: Math.round(averageEnergyLevel * 10) / 10,
    averageStressLevel: Math.round(averageStressLevel * 10) / 10,
    dateRange: {
      earliest: statsData[0].created_at,
      latest: statsData[statsData.length - 1].created_at,
    },
  };
}

/**
 * Get statistics for a specific user
 */
export async function getUserStats(
  supabase: SupabaseClient,
  userEmail: string
): Promise<UserStats | null> {
  const { data, error } = await supabase
    .from('mood_entries')
    .select('mood_score, energy_level, stress_level, sleep_hours, created_at')
    .eq('from', userEmail)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch user stats: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return null;
  }

  // Calculate user-specific statistics
  const totalEntries = data.length;

  const moodScores = data
    .filter((entry) => entry.mood_score !== null)
    .map((entry) => entry.mood_score);
  const energyLevels = data
    .filter((entry) => entry.energy_level !== null)
    .map((entry) => entry.energy_level);
  const stressLevels = data
    .filter((entry) => entry.stress_level !== null)
    .map((entry) => entry.stress_level);
  const sleepHours = data
    .filter((entry) => entry.sleep_hours !== null)
    .map((entry) => entry.sleep_hours);

  const averageMoodScore =
    moodScores.length > 0
      ? moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length
      : 0;

  const averageEnergyLevel =
    energyLevels.length > 0
      ? energyLevels.reduce((sum, level) => sum + level, 0) / energyLevels.length
      : 0;

  const averageStressLevel =
    stressLevels.length > 0
      ? stressLevels.reduce((sum, level) => sum + level, 0) / stressLevels.length
      : 0;

  const averageSleepHours =
    sleepHours.length > 0
      ? sleepHours.reduce((sum, hours) => sum + hours, 0) / sleepHours.length
      : 0;

  return {
    userEmail,
    totalEntries,
    averageMoodScore: Math.round(averageMoodScore * 10) / 10,
    averageEnergyLevel: Math.round(averageEnergyLevel * 10) / 10,
    averageStressLevel: Math.round(averageStressLevel * 10) / 10,
    averageSleepHours: Math.round(averageSleepHours * 10) / 10,
    dateRange: {
      earliest: data[0].created_at,
      latest: data[data.length - 1].created_at,
    },
  };
}

/**
 * Get mood trends over time for a user
 */
export async function getMoodTrends(
  supabase: SupabaseClient,
  userEmail: string,
  days: number = 30
): Promise<MoodTrend[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('mood_entries')
    .select('mood_score, energy_level, stress_level, created_at')
    .eq('from', userEmail)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch mood trends: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Group by date and calculate averages
  const trendsByDate = new Map<
    string,
    {
      moodScores: number[];
      energyLevels: number[];
      stressLevels: number[];
      count: number;
    }
  >();

  data.forEach((entry) => {
    const date = new Date(entry.created_at).toISOString().split('T')[0];

    if (!trendsByDate.has(date)) {
      trendsByDate.set(date, {
        moodScores: [],
        energyLevels: [],
        stressLevels: [],
        count: 0,
      });
    }

    const dayData = trendsByDate.get(date)!;
    dayData.count++;

    if (entry.mood_score !== null) dayData.moodScores.push(entry.mood_score);
    if (entry.energy_level !== null) dayData.energyLevels.push(entry.energy_level);
    if (entry.stress_level !== null) dayData.stressLevels.push(entry.stress_level);
  });

  // Convert to trend objects
  const trends: MoodTrend[] = Array.from(trendsByDate.entries()).map(([date, data]) => ({
    date,
    averageMood:
      data.moodScores.length > 0
        ? Math.round(
            (data.moodScores.reduce((sum, score) => sum + score, 0) / data.moodScores.length) * 10
          ) / 10
        : 0,
    averageEnergy:
      data.energyLevels.length > 0
        ? Math.round(
            (data.energyLevels.reduce((sum, level) => sum + level, 0) / data.energyLevels.length) *
              10
          ) / 10
        : 0,
    averageStress:
      data.stressLevels.length > 0
        ? Math.round(
            (data.stressLevels.reduce((sum, level) => sum + level, 0) / data.stressLevels.length) *
              10
          ) / 10
        : 0,
    entryCount: data.count,
  }));

  return trends.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Validate mood entry data before insertion
 */
export function validateMoodEntry(entry: Partial<MoodEntry>): string[] {
  const errors: string[] = [];

  // Required fields
  if (!entry.original_text) {
    errors.push('original_text is required');
  }
  if (!entry.from) {
    errors.push('from (email) is required');
  }
  if (!entry.from_name) {
    errors.push('from_name is required');
  }

  // Validate ranges
  if (entry.mood_score !== undefined && entry.mood_score !== null) {
    if (entry.mood_score < 1 || entry.mood_score > 10) {
      errors.push('mood_score must be between 1 and 10');
    }
  }

  if (entry.energy_level !== undefined && entry.energy_level !== null) {
    if (entry.energy_level < 1 || entry.energy_level > 10) {
      errors.push('energy_level must be between 1 and 10');
    }
  }

  if (entry.stress_level !== undefined && entry.stress_level !== null) {
    if (entry.stress_level < 1 || entry.stress_level > 10) {
      errors.push('stress_level must be between 1 and 10');
    }
  }

  if (entry.sleep_hours !== undefined && entry.sleep_hours !== null) {
    if (entry.sleep_hours < 0 || entry.sleep_hours > 24) {
      errors.push('sleep_hours must be between 0 and 24');
    }
  }

  // Validate email format
  if (entry.from && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.from)) {
    errors.push('from must be a valid email address');
  }

  return errors;
}

/**
 * Get recent entries for a user (useful for dashboard)
 */
export async function getRecentEntries(
  supabase: SupabaseClient,
  userEmail: string,
  limit: number = 5
): Promise<MoodEntry[]> {
  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('from', userEmail)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch recent entries: ${error.message}`);
  }

  return data || [];
}

/**
 * Email Violations Utilities
 */

/**
 * Create a new email violation record
 */
export async function createEmailViolation(
  supabase: SupabaseClient,
  violation: CreateEmailViolation
): Promise<EmailViolation> {
  const { data, error } = await supabase
    .from('email_violations')
    .insert(violation)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create email violation: ${error.message}`);
  }

  return data;
}

/**
 * Get email violation by email_entry_id
 */
export async function getEmailViolation(
  supabase: SupabaseClient,
  emailEntryId: string
): Promise<EmailViolation | null> {
  const { data, error } = await supabase
    .from('email_violations')
    .select('*')
    .eq('email_entry_id', emailEntryId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    throw new Error(`Failed to fetch email violation: ${error.message}`);
  }

  return data;
}

/**
 * Get all flagged violations for a user
 */
export async function getFlaggedViolations(
  supabase: SupabaseClient,
  userEmail?: string,
  limit: number = 50
): Promise<EmailViolation[]> {
  let query = supabase
    .from('email_violations')
    .select(
      `
      *,
      mood_entry:mood_entries!email_violations_email_entry_id_fkey(
        id,
        from,
        from_name,
        original_text,
        created_at
      )
    `
    )
    .eq('flagged', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (userEmail) {
    // Filter by user email through the mood_entries relationship
    query = query.eq('mood_entries.from', userEmail);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch flagged violations: ${error.message}`);
  }

  return data || [];
}

/**
 * Update an existing email violation
 */
export async function updateEmailViolation(
  supabase: SupabaseClient,
  emailEntryId: string,
  updates: Partial<CreateEmailViolation>
): Promise<EmailViolation> {
  const { data, error } = await supabase
    .from('email_violations')
    .update(updates)
    .eq('email_entry_id', emailEntryId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update email violation: ${error.message}`);
  }

  return data;
}

/**
 * Delete an email violation record
 */
export async function deleteEmailViolation(
  supabase: SupabaseClient,
  emailEntryId: string
): Promise<void> {
  const { error } = await supabase
    .from('email_violations')
    .delete()
    .eq('email_entry_id', emailEntryId);

  if (error) {
    throw new Error(`Failed to delete email violation: ${error.message}`);
  }
}

/**
 * Get violation statistics
 */
export async function getViolationStats(
  supabase: SupabaseClient,
  userEmail?: string
): Promise<{
  totalViolations: number;
  flaggedViolations: number;
  categoryBreakdown: Record<string, number>;
}> {
  let query = supabase.from('email_violations').select('*');

  if (userEmail) {
    // Join with mood_entries to filter by user
    query = supabase
      .from('email_violations')
      .select(
        `
        *,
        mood_entries!email_violations_email_entry_id_fkey(from)
      `
      )
      .eq('mood_entries.from', userEmail);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch violation stats: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return {
      totalViolations: 0,
      flaggedViolations: 0,
      categoryBreakdown: {},
    };
  }

  const totalViolations = data.length;
  const flaggedViolations = data.filter((v) => v.flagged).length;

  // Count violations by category
  const categories = [
    'sexual',
    'hate',
    'harassment',
    'self_harm',
    'sexual_minors',
    'hate_threatening',
    'violence_graphic',
    'self_harm_intent',
    'self_harm_instructions',
    'harassment_threatening',
    'violence',
  ];

  const categoryBreakdown: Record<string, number> = {};
  categories.forEach((category) => {
    categoryBreakdown[category] = data.filter((v) => v[category] === true).length;
  });

  return {
    totalViolations,
    flaggedViolations,
    categoryBreakdown,
  };
}

/**
 * Validate email violation data before insertion
 */
export function validateEmailViolation(violation: Partial<CreateEmailViolation>): string[] {
  const errors: string[] = [];

  // Required fields
  if (!violation.email_entry_id) {
    errors.push('email_entry_id is required');
  }

  if (violation.flagged === undefined || violation.flagged === null) {
    errors.push('flagged status is required');
  }

  // Validate score ranges (0.0 to 1.0)
  const scoreFields = [
    'sexual_score',
    'hate_score',
    'harassment_score',
    'self_harm_score',
    'sexual_minors_score',
    'hate_threatening_score',
    'violence_graphic_score',
    'self_harm_intent_score',
    'self_harm_instructions_score',
    'harassment_threatening_score',
    'violence_score',
  ];

  scoreFields.forEach((field) => {
    const score = violation[field as keyof CreateEmailViolation] as number;
    if (score !== undefined && score !== null) {
      if (score < 0.0 || score > 1.0) {
        errors.push(`${field} must be between 0.0 and 1.0`);
      }
    }
  });

  return errors;
}
