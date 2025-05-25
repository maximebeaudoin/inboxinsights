import { Suspense } from 'react';

import { createMoodEntriesService } from '@/lib/services/mood-entries';
import type { MoodEntry, ViewMode } from '@/lib/types/mood-entry';

import { createClient } from '@/utils/supabase/server';

import { MoodMeterDashboard } from './components/mood-meter-dashboard';

// Re-export types for backward compatibility
export type { MoodEntry };

async function getMoodEntries(viewMode: ViewMode = 'personal'): Promise<MoodEntry[]> {
  const supabase = await createClient();
  const moodEntriesService = createMoodEntriesService(supabase);

  return await moodEntriesService.getInitialMoodEntries(viewMode);
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
