# Database Service Layer Architecture

This directory contains the centralized database service layer following Supabase and Next.js best practices.

## Structure

```
lib/
├── services/           # Database service classes
│   └── mood-entries.ts # Mood entries operations
├── supabase/          # Supabase utilities
│   └── auth.ts        # Authentication helpers
├── types/             # Shared TypeScript types
│   └── mood-entry.ts  # Mood entry types
└── README.md          # This file
```

## Key Benefits

### 1. **Centralized Database Operations**

- All mood entry database queries are centralized in `MoodEntriesService`
- Consistent error handling and response patterns
- Easy to test and maintain

### 2. **Type Safety**

- Shared TypeScript types in `lib/types/`
- Consistent interfaces across the application
- Better IDE support and error catching

### 3. **Separation of Concerns**

- Service layer handles database operations
- Hooks handle React state management
- Components focus on UI rendering

### 4. **Supabase Best Practices**

- Proper client/server separation
- Efficient pagination with `range()`
- Real-time subscriptions handled centrally
- Authentication checks abstracted

## Usage Examples

### Server-Side (SSR)

```typescript
import { createMoodEntriesService } from '@/lib/services/mood-entries';
import { createClient } from '@/utils/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const service = createMoodEntriesService(supabase);

  const entries = await service.getInitialMoodEntries('personal');
  return <Dashboard entries={entries} />;
}
```

### Client-Side (React Hook)

```typescript
import { useMoodEntries } from '@/hooks/use-mood-entries';

function Dashboard({ initialEntries }) {
  const {
    moodEntries,
    loading,
    loadMore,
    hasMore
  } = useMoodEntries(initialEntries, 'personal');

  return (
    <div>
      {moodEntries.map(entry => <Entry key={entry.id} {...entry} />)}
      {hasMore && <button onClick={loadMore}>Load More</button>}
    </div>
  );
}
```

### Server Actions

```typescript
import { createMoodEntriesService } from '@/lib/services/mood-entries';

export async function deleteMoodEntryAction(entryId: string) {
  const supabase = await createClient();
  const service = createMoodEntriesService(supabase);

  return await service.deleteMoodEntry(entryId);
}
```

## Service Methods

### MoodEntriesService

- `getMoodEntries(query)` - Fetch entries with pagination
- `getInitialMoodEntries(viewMode)` - Get initial entries for SSR
- `deleteMoodEntry(entryId)` - Delete entry with ownership check
- `canDeleteEntry(entry)` - Check if user can delete entry
- `subscribeToChanges(...)` - Set up real-time subscriptions

## Migration Guide

### Before (Old Pattern)

```typescript
// Duplicated in multiple places
const { data } = await supabase
  .from('mood_entries')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(50);
```

### After (New Pattern)

```typescript
// Centralized and reusable
const service = createMoodEntriesService(supabase);
const result = await service.getMoodEntries({
  viewMode: 'personal',
  limit: 50,
});
```

## Real-time Updates

The service layer handles real-time subscriptions efficiently:

```typescript
const unsubscribe = service.subscribeToChanges(
  'personal',
  (newEntry) => console.log('New entry:', newEntry),
  (updatedEntry) => console.log('Updated:', updatedEntry),
  (deletedEntry) => console.log('Deleted:', deletedEntry)
);

// Clean up
return unsubscribe;
```

## Error Handling

All service methods use consistent error handling:

```typescript
try {
  const result = await service.getMoodEntries(query);
  // Handle success
} catch (error) {
  // Error is properly typed and includes helpful messages
  console.error('Database error:', error.message);
}
```

## Performance Optimizations

1. **Efficient Pagination**: Uses Supabase `range()` for offset-based pagination
2. **Minimal Re-renders**: Service instances are stable across renders
3. **Smart Caching**: Initial data is preserved when possible
4. **Batch Operations**: Permission checks are batched for better performance

## Testing

Service classes are easy to test in isolation:

```typescript
import { createMoodEntriesService } from '@/lib/services/mood-entries';

describe('MoodEntriesService', () => {
  it('should fetch mood entries', async () => {
    const mockSupabase = createMockSupabaseClient();
    const service = createMoodEntriesService(mockSupabase);

    const result = await service.getMoodEntries({ viewMode: 'personal' });
    expect(result.data).toBeDefined();
  });
});
```
