import { useState, useCallback, useEffect, useRef } from 'react';
import {
  DayStatus,
  DayStatusMap,
  createDayStatus,
  formatDateKey,
} from '../models/DayStatus';
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
  hasLocalStorage,
} from '../utils/storage';

export interface UseDayStatusesResult {
  statuses: DayStatusMap;
  getStatus: (date: string | Date) => DayStatus | undefined;
  setStatus: (date: string | Date, status: Partial<Pick<DayStatus, 'written' | 'published'>>) => void;
  createStatus: (date: string | Date, written?: boolean, published?: boolean) => void;
  deleteStatus: (date: string | Date) => void;
  clearAll: () => void;
  hasStorage: boolean;
}

export function useDayStatuses(): UseDayStatusesResult {
  const [statuses, setStatuses] = useState<DayStatusMap>(() => {
    if (!hasLocalStorage()) {
      return {};
    }
    const loaded = loadFromLocalStorage();
    return loaded ?? {};
  });

  const hasStorageRef = useRef(hasLocalStorage());
  const isInitialMount = useRef(true);
  const isClearing = useRef(false);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (isClearing.current) {
      isClearing.current = false;
      return;
    }

    if (hasStorageRef.current) {
      saveToLocalStorage(statuses);
    }
  }, [statuses]);

  const normalizeDate = useCallback((date: string | Date): string => {
    if (typeof date === 'string') {
      return date;
    }
    return formatDateKey(date);
  }, []);

  const getStatus = useCallback(
    (date: string | Date): DayStatus | undefined => {
      const dateKey = normalizeDate(date);
      return statuses[dateKey];
    },
    [statuses, normalizeDate]
  );

  const setStatus = useCallback(
    (date: string | Date, updates: Partial<Pick<DayStatus, 'written' | 'published'>>) => {
      const dateKey = normalizeDate(date);
      setStatuses((prev) => {
        const existing = prev[dateKey];
        if (!existing) {
          const newStatus = createDayStatus(
            dateKey,
            updates.written ?? false,
            updates.published ?? false
          );
          return {
            ...prev,
            [dateKey]: newStatus,
          };
        }

        return {
          ...prev,
          [dateKey]: {
            ...existing,
            ...updates,
          },
        };
      });
    },
    [normalizeDate]
  );

  const createStatus = useCallback(
    (date: string | Date, written = false, published = false) => {
      const dateKey = normalizeDate(date);
      setStatuses((prev) => ({
        ...prev,
        [dateKey]: createDayStatus(dateKey, written, published),
      }));
    },
    [normalizeDate]
  );

  const deleteStatus = useCallback(
    (date: string | Date) => {
      const dateKey = normalizeDate(date);
      setStatuses((prev) => {
        const { [dateKey]: _, ...rest } = prev;
        return rest;
      });
    },
    [normalizeDate]
  );

  const clearAll = useCallback(() => {
    isClearing.current = true;
    if (hasStorageRef.current) {
      clearLocalStorage();
    }
    setStatuses({});
  }, []);

  return {
    statuses,
    getStatus,
    setStatus,
    createStatus,
    deleteStatus,
    clearAll,
    hasStorage: hasStorageRef.current,
  };
}
