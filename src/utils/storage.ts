import {
  DayStatusMap,
  DayStatusStorage,
  STORAGE_VERSION,
  STORAGE_KEY,
  isValidDayStatusMap,
} from '../models/DayStatus';

export class StorageError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'StorageError';
  }
}

export function serialize(data: DayStatusMap): string {
  const storage: DayStatusStorage = {
    version: STORAGE_VERSION,
    data,
  };
  return JSON.stringify(storage);
}

export function deserialize(json: string): DayStatusMap {
  try {
    const parsed: unknown = JSON.parse(json);

    if (typeof parsed !== 'object' || parsed === null) {
      throw new StorageError('Invalid storage format: not an object');
    }

    const storage = parsed as Record<string, unknown>;

    if (!('version' in storage) || typeof storage.version !== 'number') {
      throw new StorageError('Invalid storage format: missing or invalid version');
    }

    if (storage.version !== STORAGE_VERSION) {
      throw new StorageError(
        `Version mismatch: expected ${STORAGE_VERSION}, got ${storage.version}`
      );
    }

    if (!('data' in storage)) {
      throw new StorageError('Invalid storage format: missing data');
    }

    if (!isValidDayStatusMap(storage.data)) {
      throw new StorageError('Invalid storage format: invalid data structure');
    }

    return storage.data;
  } catch (error) {
    if (error instanceof StorageError) {
      throw error;
    }
    if (error instanceof SyntaxError) {
      throw new StorageError('Invalid JSON format', error);
    }
    throw new StorageError('Failed to deserialize storage', error);
  }
}

export function saveToLocalStorage(data: DayStatusMap): void {
  try {
    const serialized = serialize(data);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    throw new StorageError('Failed to save to localStorage', error);
  }
}

export function loadFromLocalStorage(): DayStatusMap | null {
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (item === null) {
      return null;
    }
    return deserialize(item);
  } catch (error) {
    if (error instanceof StorageError) {
      console.warn('Failed to load from localStorage:', error.message);
      return null;
    }
    throw error;
  }
}

export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    throw new StorageError('Failed to clear localStorage', error);
  }
}

export function hasLocalStorage(): boolean {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
