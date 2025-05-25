/**
 * Application Configuration
 *
 * Centralized configuration for demo credentials, email addresses, and other app constants.
 * This ensures all demo data and configuration is maintained in one place.
 */

export const APP_CONFIG = {
  /**
   * Demo user credentials for testing and demonstration purposes
   * Note: These credentials should exist in your authentication system
   */
  demo: {
    email: 'demo@inboxinsights.me',
    password: 'asBuhn7YHzekK46!',
    description: 'Demo account with pre-populated mood data for testing',
  },

  /**
   * Data ingestion email address where users send mood data
   */
  dataIngestion: {
    email: 'b82ba9d30ef2dd7cf65016dfe8c69b37@inbound.postmarkapp.com',
  },

  /**
   * Application metadata
   */
  app: {
    name: 'InboxInsights',
    description: 'Track your mood and emotional well-being through email',
    author: {
      name: 'Maxime Beaudoin',
      github: 'https://github.com/maximebeaudoin',
    },
  },
} as const;

/**
 * Type-safe access to configuration values
 */
export type AppConfig = typeof APP_CONFIG;
