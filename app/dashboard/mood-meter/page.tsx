import { Suspense } from 'react';

import { createClient } from '@/utils/supabase/server';

import { MoodMeterDashboard } from './components/mood-meter-dashboard';

// Define the mood entry type based on the actual schema
export interface MoodEntry {
  id: string;
  email_entry_id?: string;
  user_email?: string;
  mood_score: number;
  energy_level?: number;
  stress_level?: number;
  note?: string;
  weather?: string;
  sleep_hours?: number;
  date_occurred: string;
  created_at: string;
  activity?: string;
  emotions?: string;
  from?: string;
}

async function getMoodEntries(viewMode: 'personal' | 'global' = 'personal'): Promise<MoodEntry[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  let query = supabase
    .from('mood_entries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  // Filter by user email only in personal mode
  if (viewMode === 'personal') {
    query = query.eq('from', user.email);
  }

  const { data: moodEntries, error } = await query;

  if (error) {
    console.error('Error fetching mood entries:', error);
    return [];
  }

  return moodEntries || [];
}

export default async function MoodMeterPage() {
  const moodEntries = await getMoodEntries();

  return (
    <div className="flex-1 w-full flex flex-col gap-6 px-4">
      <div className="w-full">
        <div className="py-6 font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent text-center">
          <h1 className="text-4xl">Mood Meter</h1>
          <p className="text-lg mt-2 text-foreground/80">
            Visualize your mood patterns and insights
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading mood data...</div>}>
        <MoodMeterDashboard initialMoodEntries={moodEntries} />
      </Suspense>
    </div>
  );
}
