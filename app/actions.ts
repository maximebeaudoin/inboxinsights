'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import { encodedRedirect } from '@/utils/utils';

export const signUpAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get('origin');

  if (!email || !password) {
    return encodedRedirect('error', '/sign-up', 'Email and password are required');
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(`${error.code} ${error.message}`);
    return encodedRedirect('error', '/sign-up', error.message);
  } else {
    return encodedRedirect(
      'success',
      '/sign-up',
      'Thanks for signing up! Please check your email for a verification link.'
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect('error', '/sign-in', error.message);
  }

  return redirect('/dashboard/mood-meter');
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get('origin');
  const callbackUrl = formData.get('callbackUrl')?.toString();

  if (!email) {
    return encodedRedirect('error', '/forgot-password', 'Email is required');
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/dashboard/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect('error', '/forgot-password', 'Could not reset password');
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    'success',
    '/forgot-password',
    'Check your email for a link to reset your password.'
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      'error',
      '/dashboard/reset-password',
      'Password and confirm password are required'
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect('error', '/dashboard/reset-password', 'Passwords do not match');
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    encodedRedirect('error', '/dashboard/reset-password', 'Password update failed');
  }

  encodedRedirect('success', '/dashboard/reset-password', 'Password updated');
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/sign-in');
};

export const deleteMoodEntryAction = async (entryId: string) => {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'Authentication required',
    };
  }

  try {
    // First, verify that the mood entry belongs to the current user
    const { data: moodEntry, error: fetchError } = await supabase
      .from('mood_entries')
      .select('from')
      .eq('id', entryId)
      .single();

    if (fetchError) {
      console.error('Error fetching mood entry:', fetchError);
      return {
        success: false,
        error: 'Mood entry not found',
      };
    }

    // Check if the user owns this mood entry
    if (moodEntry.from !== user.email) {
      return {
        success: false,
        error: 'You can only delete your own mood entries',
      };
    }

    // Delete the mood entry
    const { error: deleteError } = await supabase.from('mood_entries').delete().eq('id', entryId);

    if (deleteError) {
      console.error('Error deleting mood entry:', deleteError);
      return {
        success: false,
        error: 'Failed to delete mood entry',
      };
    }

    return {
      success: true,
      message: 'Mood entry deleted successfully',
    };
  } catch (error) {
    console.error('Unexpected error in deleteMoodEntryAction:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
};
