import { NextRequest, NextResponse } from 'next/server';

import { APP_CONFIG } from '@/lib/config';
import { createPostmarkService } from '@/lib/services/postmark';

import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { subject, message } = await request.json();

    if (!subject || !message) {
      return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
    }

    // Check if Postmark is configured
    const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;

    if (!postmarkToken || postmarkToken === 'your_postmark_server_token_here') {
      // Fallback to simulation mode if Postmark is not configured
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.warn('📧 Test email simulation (Postmark not configured):', {
        from: APP_CONFIG.demo.email,
        to: APP_CONFIG.dataIngestion.email,
        subject,
        message,
        timestamp: new Date().toISOString(),
        user: user.email,
      });

      return NextResponse.json({
        success: true,
        message:
          'Test email simulated successfully! (Postmark not configured - check console for details)',
        details: {
          from: APP_CONFIG.demo.email,
          to: APP_CONFIG.dataIngestion.email,
          subject,
          mode: 'simulation',
        },
      });
    }

    // Send real email using Postmark
    try {
      const postmarkService = createPostmarkService();
      await postmarkService.sendTestMoodEmail(subject, message);

      return NextResponse.json({
        success: true,
        message:
          'Test email sent successfully via Postmark! Check your dashboard in a few moments to see the processed mood data.',
        details: {
          from: process.env.POSTMARK_FROM_EMAIL || APP_CONFIG.demo.email,
          to: APP_CONFIG.dataIngestion.email,
          subject,
          mode: 'postmark',
        },
      });
    } catch (postmarkError) {
      console.error('Postmark sending failed, falling back to simulation:', postmarkError);

      // Fallback to simulation if Postmark fails
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return NextResponse.json({
        success: true,
        message: 'Test email simulated (Postmark unavailable). Check console for details.',
        details: {
          from: APP_CONFIG.demo.email,
          to: APP_CONFIG.dataIngestion.email,
          subject,
          mode: 'simulation_fallback',
          error: 'Postmark service unavailable',
        },
      });
    }
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json({ error: 'Failed to send test email' }, { status: 500 });
  }
}
