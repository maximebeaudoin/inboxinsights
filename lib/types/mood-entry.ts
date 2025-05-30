import { PAGINATION_CONFIG } from '@/lib/config/pagination';

import type { EmailViolation } from './email-violations';

// Centralized type definitions for mood entries
export interface MoodEntry {
  id: string;
  email_entry_id?: string;
  mood_score: number;
  energy_level?: number;
  stress_level?: number;
  note?: string;
  weather?: string;
  sleep_hours?: number;
  activity?: string;
  original_text?: string;
  from?: string;
  from_name?: string;
  subject?: string;
  created_at: string;
  // Optional relation to email violation data
  email_violation?: EmailViolation | null;
}

export type ViewMode = 'personal' | 'global';

export interface MoodEntriesQuery {
  viewMode: ViewMode;
  limit?: number;
  offset?: number;
}

export interface MoodEntriesResponse {
  data: MoodEntry[];
  hasMore: boolean;
  total: number;
}

export interface PaginatedMoodEntriesResponse extends MoodEntriesResponse {
  nextOffset?: number;
}

// Re-export pagination config for convenience
export { PAGINATION_CONFIG };
