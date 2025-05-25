import type { SupabaseClient } from '@supabase/supabase-js';

import type { EmailViolation } from '@/lib/types/email-violations';

/**
 * Service class for email violations operations
 */
export class EmailViolationsService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Get email violation by email_entry_id
   */
  async getViolationByEmailEntryId(emailEntryId: string): Promise<EmailViolation | null> {
    try {
      const { data, error } = await this.supabase
        .from('email_violations')
        .select('*')
        .eq('email_entry_id', emailEntryId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - this is normal, not all entries have violations
          return null;
        }
        console.error('Error fetching email violation:', error);
        throw new Error('Failed to fetch email violation');
      }

      return data;
    } catch (error) {
      console.error('Error in getViolationByEmailEntryId:', error);
      return null; // Return null instead of throwing to avoid breaking the UI
    }
  }

  /**
   * Get multiple violations by email_entry_ids
   */
  async getViolationsByEmailEntryIds(
    emailEntryIds: string[]
  ): Promise<Record<string, EmailViolation>> {
    try {
      if (emailEntryIds.length === 0) {
        return {};
      }

      const { data, error } = await this.supabase
        .from('email_violations')
        .select('*')
        .in('email_entry_id', emailEntryIds);

      if (error) {
        console.error('Error fetching email violations:', error);
        return {};
      }

      // Convert array to record keyed by email_entry_id
      const violationsMap: Record<string, EmailViolation> = {};
      data?.forEach((violation) => {
        violationsMap[violation.email_entry_id] = violation;
      });

      return violationsMap;
    } catch (error) {
      console.error('Error in getViolationsByEmailEntryIds:', error);
      return {};
    }
  }

  /**
   * Get all flagged violations
   */
  async getFlaggedViolations(limit: number = 50): Promise<EmailViolation[]> {
    try {
      const { data, error } = await this.supabase
        .from('email_violations')
        .select('*')
        .eq('flagged', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching flagged violations:', error);
        throw new Error('Failed to fetch flagged violations');
      }

      return data || [];
    } catch (error) {
      console.error('Error in getFlaggedViolations:', error);
      return [];
    }
  }

  /**
   * Check if an email entry has any violations
   */
  async hasViolations(emailEntryId: string): Promise<boolean> {
    try {
      const violation = await this.getViolationByEmailEntryId(emailEntryId);
      return violation !== null && violation.flagged;
    } catch (error) {
      console.error('Error checking violations:', error);
      return false;
    }
  }
}

/**
 * Factory function to create EmailViolationsService instance
 */
export function createEmailViolationsService(supabase: SupabaseClient): EmailViolationsService {
  return new EmailViolationsService(supabase);
}
