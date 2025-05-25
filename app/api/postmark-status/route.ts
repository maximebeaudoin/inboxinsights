import { NextResponse } from 'next/server';

import { createPostmarkService } from '@/lib/services/postmark';

import { createClient } from '@/utils/supabase/server';

export async function GET() {
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

    const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;
    const fromEmail = process.env.POSTMARK_FROM_EMAIL;

    // Check if environment variables are set
    if (!postmarkToken || postmarkToken === 'your_postmark_server_token_here') {
      return NextResponse.json({
        configured: false,
        status: 'not_configured',
        message: 'Postmark server token not configured',
        details: {
          hasToken: false,
          hasFromEmail: !!fromEmail,
          mode: 'simulation',
        },
      });
    }

    // Test Postmark connection
    try {
      const postmarkService = createPostmarkService();
      const isValid = await postmarkService.testConfiguration();

      if (isValid) {
        return NextResponse.json({
          configured: true,
          status: 'ready',
          message: 'Postmark is configured and ready to send emails',
          details: {
            hasToken: true,
            hasFromEmail: !!fromEmail,
            fromEmail,
            mode: 'postmark',
          },
        });
      } else {
        return NextResponse.json({
          configured: false,
          status: 'invalid_token',
          message: 'Postmark token is invalid or server is unreachable',
          details: {
            hasToken: true,
            hasFromEmail: !!fromEmail,
            mode: 'simulation_fallback',
          },
        });
      }
    } catch (error) {
      return NextResponse.json({
        configured: false,
        status: 'connection_error',
        message: 'Failed to connect to Postmark service',
        details: {
          hasToken: true,
          hasFromEmail: !!fromEmail,
          mode: 'simulation_fallback',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  } catch (error) {
    console.error('Error checking Postmark status:', error);
    return NextResponse.json({ error: 'Failed to check Postmark status' }, { status: 500 });
  }
}
