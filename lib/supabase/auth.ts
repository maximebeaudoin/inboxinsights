import type { SupabaseClient, User } from '@supabase/supabase-js';

/**
 * Get the current authenticated user
 * @param supabase - Supabase client instance
 * @returns User object or null if not authenticated
 */
export async function getCurrentUser(supabase: SupabaseClient): Promise<User | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }

  return user;
}

/**
 * Check if user is authenticated
 * @param supabase - Supabase client instance
 * @returns boolean indicating if user is authenticated
 */
export async function isAuthenticated(supabase: SupabaseClient): Promise<boolean> {
  const user = await getCurrentUser(supabase);
  return user !== null;
}
