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
),

-- Additional users for more diverse testing data
-- User 3: Sarah Johnson - Health-focused professional
(
    gen_random_uuid(),
    gen_random_uuid(),
    9,
    8,
    2,
    'Perfect morning routine! Yoga, meditation, and healthy breakfast set the tone.',
    'Clear and crisp',
    8.0,
    'Morning yoga, meditation, healthy breakfast, work',
    'Subject: Morning Bliss ✨

Mood: 9/10 - Absolutely radiant today!
Energy: 8/10 - Feeling energized and centered
Stress: 2/10 - Peaceful and calm

Perfect morning routine! Started with 30 minutes of yoga, followed by 15 minutes of meditation. The clear and crisp weather made everything feel fresh. Had a nutritious breakfast with overnight oats and berries. Ready to tackle the day with positivity!',
    'sarah.johnson@healthylife.com',
    'Sarah Johnson',
    NOW() - INTERVAL '12 hours'
),
(
    gen_random_uuid(),
    gen_random_uuid(),
    3,
    2,
    9,
    'Migraine day. Had to cancel all plans and stay in bed.',
    'Stormy',
    4.5,
    'Rest, cancelled meetings, pain management',
    'Subject: Not feeling well

Mood: 3/10 - Struggling with migraine
Energy: 2/10 - Completely drained
Stress: 9/10 - Pain is overwhelming

Woke up with a severe migraine. The stormy weather isn''t helping. Had to cancel all my meetings and client calls. Spent most of the day in a dark room trying to manage the pain. Only got 4.5 hours of sleep due to the pain. Hoping tomorrow will be better.',
    'sarah.johnson@healthylife.com',
    'Sarah Johnson',
    NOW() - INTERVAL '3 days'
),

-- User 4: Alex Chen - Tech entrepreneur with irregular schedule
(
    gen_random_uuid(),
    gen_random_uuid(),
    7,
    9,
    4,
    'Product launch went live! Team celebration and lots of positive feedback.',
    'Sunny',
    5.0,
    'Product launch, team celebration, customer calls',
    'Subject: LAUNCH DAY! 🚀

Mood: 7/10 - Excited but exhausted
Energy: 9/10 - Adrenaline is pumping
Stress: 4/10 - Good stress, manageable

Our new app feature went live today! Despite only getting 5 hours of sleep, I''m running on pure adrenaline. The team celebration was amazing and early customer feedback is incredibly positive. Sunny weather made the outdoor team lunch perfect. This is what we''ve been working towards for months!',
    'alex.chen@techstartup.io',
    'Alex Chen',
    NOW() - INTERVAL '1 day'
),
(
    gen_random_uuid(),
    gen_random_uuid(),
    4,
    3,
    8,
    'Investor meeting didn''t go as planned. Need to rethink our strategy.',
    'Foggy',
    3.5,
    'Investor pitch, strategy session, late night coding',
    'Subject: Tough day at the office

Mood: 4/10 - Disappointed and worried
Energy: 3/10 - Running on fumes
Stress: 8/10 - High pressure situation

The investor meeting was brutal. They had concerns about our market fit that I hadn''t anticipated. Spent the rest of the day in emergency strategy sessions with the team. The foggy weather matched my mental state. Only got 3.5 hours of sleep last night preparing for the pitch. Need to regroup and come back stronger.',
    'alex.chen@techstartup.io',
    'Alex Chen',
    NOW() - INTERVAL '5 days'
),

-- User 5: Maria Rodriguez - Teacher and mother
(
    gen_random_uuid(),
    gen_random_uuid(),
    8,
    7,
    3,
    'Kids'' school play was amazing! So proud of my students and my daughter.',
    'Partly sunny',
    7.5,
    'School play, family dinner, grading papers',
    'Subject: Proud teacher and mom moment

Mood: 8/10 - Heart full of pride
Energy: 7/10 - Energized by joy
Stress: 3/10 - Happy stress

Today was the annual school play and it was absolutely magical! My 3rd grade class performed beautifully, and my own daughter had a starring role. The partly sunny weather was perfect for the outdoor reception afterward. Had a lovely family dinner celebrating. Even grading papers tonight feels less like work. These are the moments that remind me why I love teaching.',
    'maria.rodriguez@elementaryschool.edu',
    'Maria Rodriguez',
    NOW() - INTERVAL '2 days'
),
(
    gen_random_uuid(),
    gen_random_uuid(),
    5,
    4,
    7,
    'Parent-teacher conferences all day. Some difficult conversations about student progress.',
    'Overcast',
    6.0,
    'Parent conferences, lesson planning, household chores',
    'Subject: Long conference day

Mood: 5/10 - Emotionally drained
Energy: 4/10 - Tired from long day
Stress: 7/10 - Difficult conversations

Parent-teacher conference day is always challenging. Had some tough conversations with parents about their children''s academic struggles. The overcast weather didn''t help the mood. Got decent sleep but still feel exhausted from the emotional labor. Still have lesson planning to do tonight and household chores waiting. Need to find time for self-care.',
    'maria.rodriguez@elementaryschool.edu',
    'Maria Rodriguez',
    NOW() - INTERVAL '7 days'
),

-- Historical entries for trend analysis (going back 2-3 months)
-- Holiday season entries
(
    gen_random_uuid(),
    gen_random_uuid(),
    10,
    9,
    1,
    'Christmas morning with family! Best gift was seeing everyone together.',
    'Light snow',
    9.0,
    'Family breakfast, gift exchange, Christmas dinner',
    'Subject: Merry Christmas! 🎄

Mood: 10/10 - Pure joy and gratitude
Energy: 9/10 - Holiday excitement
Stress: 1/10 - Completely relaxed

Christmas morning magic! Woke up to light snow falling, making everything look like a winter wonderland. Family breakfast was perfect, gift exchange filled with laughter, and Christmas dinner brought everyone together. Got 9 hours of sleep and feel completely recharged. Grateful for family, health, and all the blessings this year.',
    'maxime.l.beaudoin@gmail.com',
    'Maxime Beaudoin',
    NOW() - INTERVAL '45 days'
),
(
    gen_random_uuid(),
    gen_random_uuid(),
    6,
    5,
    6,
    'Holiday shopping stress. Crowds everywhere and still haven''t found the perfect gifts.',
    'Cold and windy',
    6.5,
    'Shopping mall, gift hunting, traffic',
    'Subject: Holiday shopping marathon

Mood: 6/10 - Stressed but determined
Energy: 5/10 - Tired from crowds
Stress: 6/10 - Time pressure building

Spent the entire day holiday shopping. The mall was absolutely packed and parking was a nightmare. Cold and windy weather made walking between stores unpleasant. Still haven''t found the perfect gifts for a few family members and time is running out. Got decent sleep but the crowds and noise were draining. Need to finish shopping online.',
    'sarah.johnson@healthylife.com',
    'Sarah Johnson',
    NOW() - INTERVAL '50 days'
),

-- Summer vacation entries
(
    gen_random_uuid(),
    gen_random_uuid(),
    9,
    8,
    2,
    'Beach vacation day 3! Snorkeling was incredible, saw so many colorful fish.',
    'Tropical paradise',
    8.5,
    'Snorkeling, beach lounging, sunset dinner',
    'Subject: Vacation Paradise 🏝️

Mood: 9/10 - Living my best life
Energy: 8/10 - Refreshed and happy
Stress: 2/10 - Vacation mode activated

Third day of beach vacation and it just keeps getting better! Went snorkeling this morning and the underwater world was absolutely breathtaking. Saw parrotfish, angelfish, and even a sea turtle! Tropical weather is perfect - warm but not too hot. Had sunset dinner on the beach. This is exactly what I needed to recharge.',
    'alex.chen@techstartup.io',
    'Alex Chen',
    NOW() - INTERVAL '75 days'
),

-- Work milestone entries
(
    gen_random_uuid(),
    gen_random_uuid(),
    8,
    7,
    4,
    'Got promoted to Senior Developer! All the late nights and hard work paid off.',
    'Sunny and warm',
    7.0,
    'Promotion meeting, celebration lunch, code review',
    'Subject: Career milestone achieved! 🎉

Mood: 8/10 - Proud and accomplished
Energy: 7/10 - Motivated for new challenges
Stress: 4/10 - Excited nervous energy

Finally got the promotion I''ve been working towards! The meeting with my manager went perfectly and they recognized all the extra effort I''ve put in. Sunny and warm weather made the celebration lunch with colleagues even better. Got good sleep and feel ready to take on the new responsibilities. This opens up so many new opportunities.',
    'demo.user@example.com',
    'Demo User',
    NOW() - INTERVAL '30 days'
),

-- Health and fitness journey entries
(
    gen_random_uuid(),
    gen_random_uuid(),
    7,
    8,
    3,
    'Completed my first 10K run! Legs are tired but spirit is soaring.',
    'Cool and breezy',
    8.0,
    '10K race, post-race celebration, stretching',
    'Subject: 10K Achievement Unlocked! 🏃‍♀️

Mood: 7/10 - Accomplished and proud
Energy: 8/10 - Runner''s high is real
Stress: 3/10 - Endorphins working their magic

Crossed the finish line of my first 10K race this morning! The cool and breezy weather was perfect for running. My legs are definitely feeling it, but the sense of accomplishment is incredible. Got great sleep last night and woke up excited. Post-race celebration with other runners was inspiring. Already thinking about training for a half marathon!',
    'maria.rodriguez@elementaryschool.edu',
    'Maria Rodriguez',
    NOW() - INTERVAL '20 days'
),

-- Seasonal depression/winter blues entries
(
    gen_random_uuid(),
    gen_random_uuid(),
    4,
    3,
    6,
    'Winter blues hitting hard. Dark days and cold weather affecting my motivation.',
    'Gray and cold',
    7.5,
    'Indoor workout, vitamin D supplement, early bedtime',
    'Subject: Fighting the winter blues

Mood: 4/10 - Struggling with seasonal changes
Energy: 3/10 - Low motivation
Stress: 6/10 - Frustrated with lack of energy

The short days and gray, cold weather are really getting to me. Despite getting 7.5 hours of sleep, I feel sluggish and unmotivated. Did an indoor workout to try to boost my mood and took my vitamin D supplement. Planning an early bedtime to maintain good sleep habits. Need to book that light therapy session I''ve been considering.',
    'maxime.l.beaudoin@gmail.com',
    'Maxime Beaudoin',
    NOW() - INTERVAL '60 days'
),

-- Edge cases and extreme scenarios
-- User 6: Dr. Jennifer Park - Medical professional with night shifts
(
    gen_random_uuid(),
    gen_random_uuid(),
    2,
    1,
    9,
    'Double shift at the hospital. Lost a patient today. Emotionally and physically exhausted.',
    'Rainy',
    3.0,
    'Hospital rounds, emergency surgery, grief counseling',
    'Subject: Difficult shift

Mood: 2/10 - Heartbroken and exhausted
Energy: 1/10 - Running on empty
Stress: 9/10 - Overwhelming grief and fatigue

Had to work a double shift due to staffing shortages. Lost a patient during emergency surgery despite our best efforts. The family was devastated and so was our entire team. Rainy weather made the drive home even more depressing. Only managed 3 hours of sleep between shifts. Sometimes this job takes everything out of you.',
    'dr.jennifer.park@hospital.org',
    'Dr. Jennifer Park',
    NOW() - INTERVAL '4 days'
),
(
    gen_random_uuid(),
    gen_random_uuid(),
    9,
    8,
    2,
    'Successful surgery today! Patient is recovering well and family is grateful.',
    'Bright and sunny',
    7.0,
    'Surgery, patient rounds, family meeting',
    'Subject: Good day in the OR

Mood: 9/10 - Fulfilled and proud
Energy: 8/10 - Energized by success
Stress: 2/10 - Confident and calm

Performed a complex cardiac surgery today and everything went perfectly. The patient is stable and recovering well in ICU. Meeting with the family afterward was emotional in the best way - their relief and gratitude reminded me why I became a doctor. Bright sunny weather made the walk between hospital buildings pleasant. Got decent sleep and feel ready for tomorrow.',
    'dr.jennifer.park@hospital.org',
    'Dr. Jennifer Park',
    NOW() - INTERVAL '9 days'
),

-- User 7: James Wilson - Retired veteran dealing with PTSD
(
    gen_random_uuid(),
    gen_random_uuid(),
    3,
    2,
    8,
    'Nightmare woke me up again. Anniversary of deployment is coming up.',
    'Overcast and humid',
    4.0,
    'Therapy session, grocery shopping, avoided crowds',
    'Subject: Rough night

Mood: 3/10 - Struggling with memories
Energy: 2/10 - Exhausted from poor sleep
Stress: 8/10 - Anxiety is high

Another nightmare about the deployment. The anniversary is next week and it always gets harder around this time. Overcast and humid weather isn''t helping my mood. Had my weekly therapy session which helped a bit. Went grocery shopping early to avoid crowds. Only got 4 hours of sleep. Need to use my coping strategies more.',
    'james.wilson.vet@gmail.com',
    'James Wilson',
    NOW() - INTERVAL '6 days'
),
(
    gen_random_uuid(),
    gen_random_uuid(),
    7,
    6,
    4,
    'Good day at the VA support group. Connecting with other veterans helps.',
    'Clear skies',
    6.5,
    'VA support group, coffee with buddy, evening walk',
    'Subject: Brotherhood and healing

Mood: 7/10 - Supported and understood
Energy: 6/10 - Steady and stable
Stress: 4/10 - Manageable with support

Attended the VA support group today and it was really helpful. Sharing stories with other veterans who understand makes such a difference. Clear skies made the drive pleasant. Had coffee afterward with my buddy Mike from the group. Took an evening walk around the neighborhood. Got better sleep last night. These connections are healing.',
    'james.wilson.vet@gmail.com',
    'James Wilson',
    NOW() - INTERVAL '11 days'
),

-- Entries with minimal/missing data for testing edge cases
(
    gen_random_uuid(),
    NULL,
    1, -- Extreme low mood
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'Subject: Rock bottom

Mood: 1/10

Can''t even find words today. Everything feels impossible.',
    'anonymous.user@tempmail.com',
    'Anonymous User',
    NOW() - INTERVAL '25 days'
),
(
    gen_random_uuid(),
    NULL,
    10, -- Perfect mood
    10,
    1,
    'Life is absolutely perfect right now! Everything is going my way.',
    'Perfect weather',
    9.5,
    'Dream job offer, engagement, family celebration',
    'Subject: BEST DAY EVER!!! 🎉✨🎊

Mood: 10/10 - ECSTATIC!!!
Energy: 10/10 - UNLIMITED ENERGY!
Stress: 1/10 - What stress?!

I CAN''T BELIEVE IT! Got the dream job offer I''ve been hoping for, my partner proposed during lunch, and we''re having a surprise family celebration tonight! The weather is absolutely perfect, I got amazing sleep, and I feel like I''m floating on cloud nine! Life doesn''t get better than this! 🥳',
    'lucky.person@dreamlife.com',
    'Lucky Person',
    NOW() - INTERVAL '35 days'
),

-- Different email writing styles and formats
(
    gen_random_uuid(),
    gen_random_uuid(),
    6,
    5,
    5,
    'Regular Tuesday. Nothing special happening.',
    'Normal weather',
    7.0,
    'Work, lunch, TV',
    'tuesday check in

mood = 6
energy = 5
stress = 5

just a regular tuesday. work was work. had lunch. watched tv. weather was normal. got 7 hrs sleep. nothing exciting but nothing bad either.',
    'casual.writer@email.com',
    'Casual Writer',
    NOW() - INTERVAL '12 days'
),
(
    gen_random_uuid(),
    gen_random_uuid(),
    8,
    7,
    3,
    'Quarterly review exceeded expectations. Team performance metrics outstanding.',
    'Partly cloudy',
    7.5,
    'Quarterly review, strategic planning, team meeting',
    'Subject: Q4 Performance Review - Exceeds Expectations

Dear Mood Tracking System,

I am pleased to report that today''s quarterly performance review yielded exceptionally positive results.

Mood Assessment: 8/10 - Highly satisfied with professional achievements
Energy Evaluation: 7/10 - Sustained high performance levels
Stress Analysis: 3/10 - Well-managed workload distribution

Weather conditions were partly cloudy, conducive to productive indoor activities. Sleep duration: 7.5 hours, within optimal range. Daily activities included comprehensive quarterly review, strategic planning session, and team performance meeting.

Best regards,
Professional Correspondent',
    'formal.business@corporate.com',
    'Professional Correspondent',
    NOW() - INTERVAL '18 days'
),

-- International users with different time zones and cultural contexts
(
    gen_random_uuid(),
    gen_random_uuid(),
    7,
    6,
    4,
    'Diwali celebrations with family! Beautiful rangoli and delicious sweets.',
    'Clear evening',
    6.0,
    'Diwali prayers, family gathering, fireworks',
    'Subject: Happy Diwali! 🪔✨

Mood: 7/10 - Joyful and blessed
Energy: 6/10 - Tired but happy
Stress: 4/10 - Busy but manageable

Celebrated Diwali with extended family today! Made beautiful rangoli patterns in the morning, performed prayers together, and enjoyed amazing homemade sweets. The clear evening was perfect for fireworks. Got less sleep due to early morning preparations but the joy made up for it. Grateful for family traditions and togetherness.',
    'priya.sharma@mumbai.in',
    'Priya Sharma',
    NOW() - INTERVAL '40 days'
),
(
    gen_random_uuid(),
    gen_random_uuid(),
    8,
    7,
    2,
    'Midsummer celebration in Stockholm! White nights and beautiful nature.',
    'Bright midnight sun',
    5.0,
    'Midsummer pole dancing, herring feast, nature walk',
    'Subject: Midsummer Magic in Sweden 🌞

Mood: 8/10 - Enchanted by tradition
Energy: 7/10 - Energized by endless daylight
Stress: 2/10 - Peaceful and relaxed

Celebrated Midsummer in traditional Swedish style! Danced around the maypole, enjoyed herring and new potatoes, and took long walks in nature. The midnight sun is incredible - it never gets dark! Only got 5 hours of sleep but the endless daylight keeps me energized. Love how this celebration connects us to nature and community.',
    'erik.lindqvist@stockholm.se',
    'Erik Lindqvist',
    NOW() - INTERVAL '85 days'
),

-- Student life and academic stress
(
    gen_random_uuid(),
    gen_random_uuid(),
    3,
    2,
    9,
    'Finals week is killing me. Three exams tomorrow and I''m not ready.',
    'Rainy and depressing',
    2.5,
    'All-night studying, energy drinks, panic',
    'Subject: finals week hell 😭

mood: 3/10 - stressed beyond belief
energy: 2/10 - running on caffeine fumes
stress: 9/10 - MAXIMUM PANIC MODE

finals week is absolutely destroying me right now. have three exams tomorrow and i feel like i know NOTHING. been studying all night, living on energy drinks and anxiety. the rainy weather is making everything worse. only got 2.5 hours of sleep. why did i procrastinate so much?? 😩',
    'stressed.student@university.edu',
    'Stressed Student',
    NOW() - INTERVAL '55 days'
),
(
    gen_random_uuid(),
    gen_random_uuid(),
    9,
    8,
    1,
    'Graduated summa cum laude! All the hard work paid off.',
    'Sunny graduation day',
    8.0,
    'Graduation ceremony, family celebration, photos',
    'Subject: I DID IT! 🎓🎉

Mood: 9/10 - OVER THE MOON!
Energy: 8/10 - Pure excitement energy
Stress: 1/10 - All stress melted away

I GRADUATED SUMMA CUM LAUDE!!! Four years of hard work, late nights, and stress all led to this moment. The graduation ceremony was beautiful with perfect sunny weather. Family came from across the country to celebrate. Got great sleep last night and woke up ready for this milestone. Starting my dream job next month!',
    'proud.graduate@university.edu',
    'Proud Graduate',
    NOW() - INTERVAL '90 days'
);
