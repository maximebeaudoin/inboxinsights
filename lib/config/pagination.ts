/**
 * Pagination configuration constants
 */

export const PAGINATION_CONFIG = {
  /**
   * Number of mood entries to load per page/batch
   */
  MOOD_ENTRIES_PER_PAGE: 50,

  /**
   * Number of mood entries to display initially in the UI
   */
  INITIAL_DISPLAY_COUNT: 10,

  /**
   * Number of additional entries to show when "Load More" is clicked
   * (for already loaded entries)
   */
  LOAD_MORE_DISPLAY_COUNT: 10,

  /**
   * Maximum number of entries to keep in memory for real-time updates
   * (to prevent memory issues with very active users)
   */
  MAX_ENTRIES_IN_MEMORY: 200,
} as const;

/**
 * Type for pagination configuration
 */
export type PaginationConfig = typeof PAGINATION_CONFIG;
