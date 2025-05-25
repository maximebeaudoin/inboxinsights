-- Create mood_entries table
-- This migration creates the main table for storing mood tracking data

-- Create the mood_entries table
CREATE TABLE IF NOT EXISTS public.mood_entries (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email_entry_id uuid UNIQUE,
    mood_score int4 CHECK (mood_score >= 1 AND mood_score <= 10),
    energy_level int4 CHECK (energy_level >= 1 AND energy_level <= 10),
    stress_level int4 CHECK (stress_level >= 1 AND stress_level <= 10),
    note text,
    weather text,
    sleep_hours numeric(3,1) CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
    activity text,
    original_text text NOT NULL,
    "from" text NOT NULL,
    from_name text NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mood_entries_from ON public.mood_entries("from");
CREATE INDEX IF NOT EXISTS idx_mood_entries_created_at ON public.mood_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_mood_entries_from_created_at ON public.mood_entries("from", created_at DESC);


-- Grant necessary permissions
GRANT ALL ON public.mood_entries TO authenticated;
GRANT ALL ON public.mood_entries TO service_role;
