-- Create email_violations table
-- This migration creates the table for storing content moderation violations data

-- Create the email_violations table
CREATE TABLE IF NOT EXISTS public.email_violations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email_entry_id uuid UNIQUE NOT NULL,
    flagged boolean NOT NULL DEFAULT false,

    -- Category flags (boolean values)
    sexual boolean NOT NULL DEFAULT false,
    hate boolean NOT NULL DEFAULT false,
    harassment boolean NOT NULL DEFAULT false,
    self_harm boolean NOT NULL DEFAULT false,
    sexual_minors boolean NOT NULL DEFAULT false,
    hate_threatening boolean NOT NULL DEFAULT false,
    violence_graphic boolean NOT NULL DEFAULT false,
    self_harm_intent boolean NOT NULL DEFAULT false,
    self_harm_instructions boolean NOT NULL DEFAULT false,
    harassment_threatening boolean NOT NULL DEFAULT false,
    violence boolean NOT NULL DEFAULT false,

    -- Category scores (numeric values between 0.0 and 1.0)
    sexual_score numeric(18,17) CHECK (sexual_score >= 0.0 AND sexual_score <= 1.0),
    hate_score numeric(18,17) CHECK (hate_score >= 0.0 AND hate_score <= 1.0),
    harassment_score numeric(18,17) CHECK (harassment_score >= 0.0 AND harassment_score <= 1.0),
    self_harm_score numeric(18,17) CHECK (self_harm_score >= 0.0 AND self_harm_score <= 1.0),
    sexual_minors_score numeric(18,17) CHECK (sexual_minors_score >= 0.0 AND sexual_minors_score <= 1.0),
    hate_threatening_score numeric(18,17) CHECK (hate_threatening_score >= 0.0 AND hate_threatening_score <= 1.0),
    violence_graphic_score numeric(18,17) CHECK (violence_graphic_score >= 0.0 AND violence_graphic_score <= 1.0),
    self_harm_intent_score numeric(18,17) CHECK (self_harm_intent_score >= 0.0 AND self_harm_intent_score <= 1.0),
    self_harm_instructions_score numeric(18,17) CHECK (self_harm_instructions_score >= 0.0 AND self_harm_instructions_score <= 1.0),
    harassment_threatening_score numeric(18,17) CHECK (harassment_threatening_score >= 0.0 AND harassment_threatening_score <= 1.0),
    violence_score numeric(18,17) CHECK (violence_score >= 0.0 AND violence_score <= 1.0),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_violations_email_entry_id ON public.email_violations(email_entry_id);
CREATE INDEX IF NOT EXISTS idx_email_violations_flagged ON public.email_violations(flagged);
CREATE INDEX IF NOT EXISTS idx_email_violations_created_at ON public.email_violations(created_at);

-- Create a composite index for flagged violations with timestamp
CREATE INDEX IF NOT EXISTS idx_email_violations_flagged_created_at ON public.email_violations(flagged, created_at DESC) WHERE flagged = true;

-- Grant necessary permissions
GRANT ALL ON public.email_violations TO authenticated;
GRANT ALL ON public.email_violations TO service_role;

-- Add Row Level Security (RLS)
ALTER TABLE public.email_violations ENABLE ROW LEVEL SECURITY;
