export interface DayStatus {
  date: string;
  written: boolean;
  published: boolean;
}

export type DayStatusMap = Record<string, DayStatus>;

export interface DayStatusStorage {
  version: number;
  data: DayStatusMap;
}

export const STORAGE_VERSION = 1;
export const STORAGE_KEY = 'dayStatuses';

export function createDayStatus(date: string, written = false, published = false): DayStatus {
  return {
    date,
    written,
    published,
  };
}

export function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function isValidDayStatus(obj: unknown): obj is DayStatus {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const status = obj as Record<string, unknown>;

  return (
    typeof status.date === 'string' &&
    typeof status.written === 'boolean' &&
    typeof status.published === 'boolean'
  );
}

export function isValidDayStatusMap(obj: unknown): obj is DayStatusMap {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return false;
  }

  const map = obj as Record<string, unknown>;

  return Object.values(map).every(isValidDayStatus);
}
