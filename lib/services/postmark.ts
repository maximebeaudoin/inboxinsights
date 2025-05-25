import { Client } from 'postmark';

import { APP_CONFIG } from '@/lib/config';

/**
 * Postmark email service for sending emails
 */
export class PostmarkService {
  private client: Client;
  private fromEmail: string;

  constructor() {
    const serverToken = process.env.POSTMARK_SERVER_TOKEN;
    this.fromEmail = process.env.POSTMARK_FROM_EMAIL || APP_CONFIG.demo.email;

    if (!serverToken) {
      throw new Error('POSTMARK_SERVER_TOKEN environment variable is required');
    }

    this.client = new Client(serverToken);
  }

  /**
   * Send a test mood tracking email
   */
  async sendTestMoodEmail(subject: string, message: string): Promise<void> {
    try {
      const result = await this.client.sendEmail({
        From: this.fromEmail,
        To: APP_CONFIG.dataIngestion.email,
        Subject: subject,
        TextBody: message,
        Tag: 'test-mood-email',
        TrackOpens: false,
        TrackLinks: 'None',
        MessageStream: 'outbound',
      });

      console.log('✅ Postmark email sent successfully:', {
        MessageID: result.MessageID,
        To: result.To,
        SubmittedAt: result.SubmittedAt,
        ErrorCode: result.ErrorCode,
      });
    } catch (error) {
      console.error('❌ Postmark email sending failed:', error);
      throw new Error(`Failed to send email via Postmark: ${error}`);
    }
  }

  /**
   * Test Postmark configuration
   */
  async testConfiguration(): Promise<boolean> {
    try {
      // Test the server token by getting account info
      await this.client.getServer();
      return true;
    } catch (error) {
      console.error('Postmark configuration test failed:', error);
      return false;
    }
  }
}

/**
 * Factory function to create PostmarkService instance
 */
export function createPostmarkService(): PostmarkService {
  return new PostmarkService();
}
