# Day State Storage

A robust client-side persistence layer for tracking daily writing data using `localStorage`. This library provides a type-safe domain model, serialization helpers with versioning, and a React hook for managing day statuses.

## Features

- **Domain Model**: Type-safe representation of daily writing data (date, written, published)
- **localStorage Persistence**: Automatic saving and loading with error handling
- **Version Management**: Guards against version mismatches with migration support
- **React Hook**: Easy-to-use `useDayStatuses` hook for React applications
- **CRUD Operations**: Complete set of operations for managing day statuses
- **Fallback Support**: Gracefully handles absence of localStorage
- **Comprehensive Tests**: Full test coverage for all functionality

## Installation

```bash
npm install
```

## Usage

### Basic Example

```tsx
import { useDayStatuses } from './hooks/useDayStatuses';

function MyComponent() {
  const {
    statuses,
    getStatus,
    setStatus,
    createStatus,
    deleteStatus,
    clearAll,
    hasStorage
  } = useDayStatuses();

  // Create a new status
  const handleCreate = () => {
    createStatus('2024-01-01', true, false);
  };

  // Update a status
  const handleUpdate = () => {
    setStatus('2024-01-01', { written: true });
  };

  // Get a status
  const status = getStatus('2024-01-01');

  // Delete a status
  const handleDelete = () => {
    deleteStatus('2024-01-01');
  };

  // Clear all statuses
  const handleClearAll = () => {
    clearAll();
  };

  return (
    <div>
      <p>Storage available: {hasStorage ? 'Yes' : 'No'}</p>
      {/* Your UI */}
    </div>
  );
}
```

### Working with Dates

The hook accepts both string dates (YYYY-MM-DD format) and Date objects:

```tsx
// Using string dates
createStatus('2024-01-01', true, false);
setStatus('2024-01-01', { published: true });

// Using Date objects
const today = new Date();
createStatus(today, true, false);
setStatus(today, { published: true });
```

## API Reference

### `useDayStatuses()`

Custom React hook that provides day status management with localStorage persistence.

#### Returns

- `statuses`: Record of all day statuses, keyed by date (YYYY-MM-DD)
- `getStatus(date)`: Get a specific day's status
- `setStatus(date, updates)`: Update or create a day's status
- `createStatus(date, written?, published?)`: Create a new day status
- `deleteStatus(date)`: Delete a day's status
- `clearAll()`: Clear all statuses and localStorage
- `hasStorage`: Boolean indicating if localStorage is available

### Domain Model

```typescript
interface DayStatus {
  date: string;        // YYYY-MM-DD format
  written: boolean;    // Has writing been done
  published: boolean;  // Has content been published
}
```

### Storage Format

Data is stored with versioning for future migration support:

```json
{
  "version": 1,
  "data": {
    "2024-01-01": {
      "date": "2024-01-01",
      "written": true,
      "published": false
    }
  }
}
```

## Testing

Run all tests:

```bash
npm test
```

Run tests with UI:

```bash
npm run test:ui
```

Run tests with coverage:

```bash
npm run test:coverage
```

Type checking:

```bash
npm run type-check
```

## Architecture

### Components

1. **Domain Model** (`src/models/DayStatus.ts`)
   - Type definitions for day statuses
   - Validation functions
   - Utility functions for date formatting

2. **Storage Layer** (`src/utils/storage.ts`)
   - Serialization/deserialization with versioning
   - localStorage operations with error handling
   - Storage availability detection

3. **React Hook** (`src/hooks/useDayStatuses.ts`)
   - State management with React hooks
   - Automatic localStorage synchronization
   - CRUD operations

### Design Decisions

- **Versioning**: All stored data includes a version number to support future migrations
- **Error Handling**: Failed localStorage operations fall back gracefully
- **Type Safety**: Full TypeScript types for all operations
- **Separation of Concerns**: Domain model, storage, and UI logic are separated
- **Immutability**: State updates create new objects rather than mutating
- **Testing**: Comprehensive test coverage including edge cases

## Error Handling

The library handles various error scenarios:

- **Invalid JSON**: Returns `null` and logs warning
- **Version Mismatch**: Returns `null` and logs warning
- **localStorage Unavailable**: Falls back to in-memory storage
- **Corrupt Data**: Validates structure and returns `null` if invalid

## Browser Support

Requires:
- ES2020 support
- localStorage API (optional, falls back gracefully)
- React 18+

## License

MIT
