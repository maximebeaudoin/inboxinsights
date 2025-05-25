-- Seed data for mood_entries table
-- This file contains sample data for testing and development
-- Following Supabase best practices for seeding

-- Insert sample mood entries for demo users
INSERT INTO public.mood_entries (
    id,
    email_entry_id,
    mood_score,
    energy_level,
    stress_level,
    note,
    weather,
    sleep_hours,
    activity,
    original_text,
    "from",
    from_name,
    created_at
) VALUES
-- Recent entries for main demo user (last 7 days)
(
    gen_random_uuid(),
    gen_random_uuid(),
    8,
    7,
    3,
    'Had a great morning workout and productive day at work. Feeling optimistic about the week ahead.',
    'Sunny',
    7.5,
    'Morning run, work meetings, evening reading',
    'Subject: Daily Check-in

Mood: 8/10 - Feeling great today!
Energy: 7/10 - Good energy after workout
Stress: 3/10 - Low stress, manageable workload

Had a great morning workout and productive day at work. Weather was sunny which always helps my mood. Got 7.5 hours of sleep last night. Activities included morning run, work meetings, and evening reading. Feeling optimistic about the week ahead.',
    'maxime.l.beaudoin@gmail.com',
    'Maxime Beaudoin',
    NOW() - INTERVAL '1 day'
),
(
    gen_random_uuid(),
    gen_random_uuid(),
    6,
    5,
    6,
    'Busy day with back-to-back meetings. Feeling a bit overwhelmed but managing.',
    'Cloudy',
    6.0,
    'Work meetings, quick lunch, late dinner',
    'Subject: End of day reflection

Mood: 6/10 - Okay day, bit stressed
Energy: 5/10 - Feeling drained
Stress: 6/10 - Higher than usual

Busy day with back-to-back meetings. Feeling a bit overwhelmed but managing. Weather was cloudy which matched my mood. Only got 6 hours of sleep. Had work meetings all day, quick lunch, and late dinner.',
    'maxime.l.beaudoin@gmail.com',
    'Maxime Beaudoin',
    NOW() - INTERVAL '2 days'
),
(
    gen_random_uuid(),
    gen_random_uuid(),
    9,
    8,
    2,
    'Amazing weekend! Spent time with family and friends. Recharged and ready for the week.',
    'Partly cloudy',
    8.5,
    'Family brunch, hiking, board games',
    'Subject: Weekend Wrap-up

Mood: 9/10 - Fantastic weekend!
Energy: 8/10 - Feeling refreshed
Stress: 2/10 - Very relaxed

Amazing weekend! Spent time with family and friends. Weather was partly cloudy but perfect for hiking. Got 8.5 hours of sleep. Activities included family brunch, hiking in the mountains, and board games in the evening. Recharged and ready for the week.',
    'maxime.l.beaudoin@gmail.com',
    'Maxime Beaudoin',
    NOW() - INTERVAL '3 days'
),
(
    gen_random_uuid(),
    gen_random_uuid(),
    4,
    3,
    8,
    'Difficult day dealing with project deadline. Feeling anxious and tired.',
    'Rainy',
    5.5,
    'Work crisis management, skipped lunch',
    'Subject: Tough Day

Mood: 4/10 - Not great
Energy: 3/10 - Exhausted
Stress: 8/10 - Very high stress

Difficult day dealing with project deadline. Client changed requirements last minute. Weather was rainy which didn''t help. Only got 5.5 hours of sleep due to worrying. Spent day in crisis management mode and skipped lunch. Feeling anxious and tired.',
    'maxime.l.beaudoin@gmail.com',
    'Maxime Beaudoin',
    NOW() - INTERVAL '4 days'
),
(
    gen_random_uuid(),
    gen_random_uuid(),
    7,
    6,
    4,
    'Good recovery day. Took some time for self-care and relaxation.',
    'Sunny',
    7.0,
    'Yoga, meditation, cooking',
    'Subject: Self-care Sunday

Mood: 7/10 - Much better
Energy: 6/10 - Recovering well
Stress: 4/10 - More manageable

Good recovery day after yesterday''s stress. Took some time for self-care and relaxation. Sunny weather helped lift my spirits. Got 7 hours of sleep. Did yoga in the morning, meditation session, and spent time cooking a nice meal. Feeling more balanced.',
    'maxime.l.beaudoin@gmail.com',
    'Maxime Beaudoin',
    NOW() - INTERVAL '5 days'
),

-- Additional sample entries for different users (global view testing)
(
    gen_random_uuid(),
    gen_random_uuid(),
    8,
    7,
    3,
    'Great start to the week. New project is exciting and team is motivated.',
    'Clear',
    8.0,
    'Team standup, project planning, gym',
    'Subject: Monday Motivation

Mood: 8/10 - Excited about new project
Energy: 7/10 - Well rested
Stress: 3/10 - Manageable workload

Great start to the week. New project is exciting and team is motivated. Clear weather made for a nice commute. Got 8 hours of sleep. Had team standup, project planning session, and evening gym workout.',
    'demo.user@example.com',
    'Demo User',
    NOW() - INTERVAL '1 day'
),
(
    gen_random_uuid(),
    gen_random_uuid(),
    5,
    4,
    7,
    'Struggling with work-life balance. Need to find better boundaries.',
    'Overcast',
    6.5,
    'Long work day, missed dinner plans',
    'Subject: Reflection on Balance

Mood: 5/10 - Feeling off balance
Energy: 4/10 - Drained from long hours
Stress: 7/10 - High due to overcommitment

Struggling with work-life balance lately. Had to cancel dinner plans due to work running late. Overcast weather matched my mood. Got 6.5 hours of sleep. Need to find better boundaries between work and personal time.',
    'demo.user@example.com',
    'Demo User',
    NOW() - INTERVAL '2 days'
),

-- Older entries for trend analysis
(
    gen_random_uuid(),
    gen_random_uuid(),
    6,
    5,
    5,
    'Average day, nothing special but nothing terrible either.',
    'Partly cloudy',
    7.0,
    'Regular work day, evening walk',
    'Subject: Midweek Check

Mood: 6/10 - Neutral
Energy: 5/10 - Average
Stress: 5/10 - Normal levels

Average day, nothing special but nothing terrible either. Partly cloudy weather. Got 7 hours of sleep. Regular work day followed by evening walk around the neighborhood.',
    'maxime.l.beaudoin@gmail.com',
    'Maxime Beaudoin',
    NOW() - INTERVAL '10 days'
),
(
    gen_random_uuid(),
    gen_random_uuid(),
    9,
    9,
    1,
    'Vacation day! Spent at the beach with perfect weather and great company.',
    'Sunny and warm',
    9.0,
    'Beach day, swimming, barbecue',
    'Subject: Perfect Vacation Day

Mood: 9/10 - Absolutely wonderful
Energy: 9/10 - Feeling amazing
Stress: 1/10 - Zero stress

Vacation day! Spent at the beach with perfect weather and great company. Sunny and warm all day. Got 9 hours of sleep. Beach activities, swimming in the ocean, and evening barbecue with friends. Life is good!',
    'maxime.l.beaudoin@gmail.com',
    'Maxime Beaudoin',
    NOW() - INTERVAL '15 days'
),

-- Add some entries with minimal data to test optional fields
(
    gen_random_uuid(),
    NULL, -- email_entry_id
    7, -- mood_score
    NULL, -- energy_level
    NULL, -- stress_level
    NULL, -- note
    NULL, -- weather
    NULL, -- sleep_hours
    NULL, -- activity
    'Subject: Quick Check-in

Mood: 7/10 - Doing well today

Just a quick check-in. Feeling good overall, no specific details to share.',
    'maxime.l.beaudoin@gmail.com',
    'Maxime Beaudoin',
    NOW() - INTERVAL '6 days'
),
(
    gen_random_uuid(),
    NULL, -- email_entry_id
    5, -- mood_score
    NULL, -- energy_level
    NULL, -- stress_level
    NULL, -- note
    NULL, -- weather
    NULL, -- sleep_hours
    NULL, -- activity
    'Subject: Neutral Day

Mood: 5/10 - Okay

Nothing particularly good or bad to report. Just an average day.',
    'demo.user@example.com',
    'Demo User',
    NOW() - INTERVAL '8 days'
);
