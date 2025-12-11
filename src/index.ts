export { useDayStatuses } from './hooks/useDayStatuses';
export type { UseDayStatusesResult } from './hooks/useDayStatuses';

export {
  createDayStatus,
  formatDateKey,
  isValidDayStatus,
  isValidDayStatusMap,
  STORAGE_VERSION,
  STORAGE_KEY,
} from './models/DayStatus';
export type {
  DayStatus,
  DayStatusMap,
  DayStatusStorage,
} from './models/DayStatus';

export {
  serialize,
  deserialize,
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
  hasLocalStorage,
  StorageError,
} from './utils/storage';
