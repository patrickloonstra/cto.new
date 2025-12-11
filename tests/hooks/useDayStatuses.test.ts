import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDayStatuses } from '../../src/hooks/useDayStatuses';
import { STORAGE_KEY } from '../../src/models/DayStatus';

describe('useDayStatuses Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('initialization', () => {
    it('should initialize with empty statuses', () => {
      const { result } = renderHook(() => useDayStatuses());
      expect(result.current.statuses).toEqual({});
    });

    it('should load existing data from localStorage', () => {
      const existingData = {
        version: 1,
        data: {
          '2024-01-01': {
            date: '2024-01-01',
            written: true,
            published: false,
          },
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));

      const { result } = renderHook(() => useDayStatuses());

      expect(result.current.statuses).toEqual(existingData.data);
    });

    it('should initialize with empty map if localStorage has invalid data', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json');

      const { result } = renderHook(() => useDayStatuses());

      expect(result.current.statuses).toEqual({});
    });

    it('should report hasStorage as true', () => {
      const { result } = renderHook(() => useDayStatuses());
      expect(result.current.hasStorage).toBe(true);
    });
  });

  describe('createStatus', () => {
    it('should create a new status with string date', () => {
      const { result } = renderHook(() => useDayStatuses());

      act(() => {
        result.current.createStatus('2024-01-01', true, false);
      });

      expect(result.current.statuses['2024-01-01']).toEqual({
        date: '2024-01-01',
        written: true,
        published: false,
      });
    });

    it('should create a new status with Date object', () => {
      const { result } = renderHook(() => useDayStatuses());
      const date = new Date('2024-01-15T10:30:00Z');

      act(() => {
        result.current.createStatus(date, true, false);
      });

      expect(result.current.statuses['2024-01-15']).toEqual({
        date: '2024-01-15',
        written: true,
        published: false,
      });
    });

    it('should create a new status with default values', () => {
      const { result } = renderHook(() => useDayStatuses());

      act(() => {
        result.current.createStatus('2024-01-01');
      });

      expect(result.current.statuses['2024-01-01']).toEqual({
        date: '2024-01-01',
        written: false,
        published: false,
      });
    });

    it('should overwrite existing status', () => {
      const { result } = renderHook(() => useDayStatuses());

      act(() => {
        result.current.createStatus('2024-01-01', true, false);
      });

      act(() => {
        result.current.createStatus('2024-01-01', false, true);
      });

      expect(result.current.statuses['2024-01-01']).toEqual({
        date: '2024-01-01',
        written: false,
        published: true,
      });
    });
  });

  describe('getStatus', () => {
    it('should get existing status', () => {
      const { result } = renderHook(() => useDayStatuses());

      act(() => {
        result.current.createStatus('2024-01-01', true, false);
      });

      const status = result.current.getStatus('2024-01-01');
      expect(status).toEqual({
        date: '2024-01-01',
        written: true,
        published: false,
      });
    });

    it('should return undefined for non-existent status', () => {
      const { result } = renderHook(() => useDayStatuses());
      const status = result.current.getStatus('2024-01-01');
      expect(status).toBeUndefined();
    });

    it('should work with Date objects', () => {
      const { result } = renderHook(() => useDayStatuses());
      const date = new Date('2024-01-15T10:30:00Z');

      act(() => {
        result.current.createStatus(date, true, false);
      });

      const status = result.current.getStatus(date);
      expect(status).toEqual({
        date: '2024-01-15',
        written: true,
        published: false,
      });
    });
  });

  describe('setStatus', () => {
    it('should update existing status', () => {
      const { result } = renderHook(() => useDayStatuses());

      act(() => {
        result.current.createStatus('2024-01-01', false, false);
      });

      act(() => {
        result.current.setStatus('2024-01-01', { written: true });
      });

      expect(result.current.statuses['2024-01-01']).toEqual({
        date: '2024-01-01',
        written: true,
        published: false,
      });
    });

    it('should create new status if it does not exist', () => {
      const { result } = renderHook(() => useDayStatuses());

      act(() => {
        result.current.setStatus('2024-01-01', { written: true, published: false });
      });

      expect(result.current.statuses['2024-01-01']).toEqual({
        date: '2024-01-01',
        written: true,
        published: false,
      });
    });

    it('should partially update status', () => {
      const { result } = renderHook(() => useDayStatuses());

      act(() => {
        result.current.createStatus('2024-01-01', false, false);
      });

      act(() => {
        result.current.setStatus('2024-01-01', { published: true });
      });

      expect(result.current.statuses['2024-01-01']).toEqual({
        date: '2024-01-01',
        written: false,
        published: true,
      });
    });

    it('should work with Date objects', () => {
      const { result } = renderHook(() => useDayStatuses());
      const date = new Date('2024-01-15T10:30:00Z');

      act(() => {
        result.current.setStatus(date, { written: true, published: false });
      });

      expect(result.current.statuses['2024-01-15']).toEqual({
        date: '2024-01-15',
        written: true,
        published: false,
      });
    });
  });

  describe('deleteStatus', () => {
    it('should delete existing status', () => {
      const { result } = renderHook(() => useDayStatuses());

      act(() => {
        result.current.createStatus('2024-01-01', true, false);
        result.current.createStatus('2024-01-02', false, true);
      });

      act(() => {
        result.current.deleteStatus('2024-01-01');
      });

      expect(result.current.statuses['2024-01-01']).toBeUndefined();
      expect(result.current.statuses['2024-01-02']).toBeDefined();
    });

    it('should not throw when deleting non-existent status', () => {
      const { result } = renderHook(() => useDayStatuses());

      expect(() => {
        act(() => {
          result.current.deleteStatus('2024-01-01');
        });
      }).not.toThrow();
    });

    it('should work with Date objects', () => {
      const { result } = renderHook(() => useDayStatuses());
      const date = new Date('2024-01-15T10:30:00Z');

      act(() => {
        result.current.createStatus(date, true, false);
      });

      act(() => {
        result.current.deleteStatus(date);
      });

      expect(result.current.statuses['2024-01-15']).toBeUndefined();
    });
  });

  describe('clearAll', () => {
    it('should clear all statuses', () => {
      const { result } = renderHook(() => useDayStatuses());

      act(() => {
        result.current.createStatus('2024-01-01', true, false);
        result.current.createStatus('2024-01-02', false, true);
      });

      act(() => {
        result.current.clearAll();
      });

      expect(result.current.statuses).toEqual({});
    });

    it('should clear localStorage', () => {
      const { result } = renderHook(() => useDayStatuses());

      act(() => {
        result.current.createStatus('2024-01-01', true, false);
      });

      act(() => {
        result.current.clearAll();
      });

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  describe('localStorage persistence', () => {
    it('should save to localStorage after creating status', async () => {
      const { result } = renderHook(() => useDayStatuses());

      act(() => {
        result.current.createStatus('2024-01-01', true, false);
      });

      await waitFor(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        expect(stored).not.toBeNull();
        
        const parsed = JSON.parse(stored!);
        expect(parsed.data['2024-01-01']).toEqual({
          date: '2024-01-01',
          written: true,
          published: false,
        });
      });
    });

    it('should save to localStorage after updating status', async () => {
      const { result } = renderHook(() => useDayStatuses());

      act(() => {
        result.current.createStatus('2024-01-01', false, false);
      });

      act(() => {
        result.current.setStatus('2024-01-01', { written: true });
      });

      await waitFor(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        const parsed = JSON.parse(stored!);
        expect(parsed.data['2024-01-01'].written).toBe(true);
      });
    });

    it('should save to localStorage after deleting status', async () => {
      const { result } = renderHook(() => useDayStatuses());

      act(() => {
        result.current.createStatus('2024-01-01', true, false);
        result.current.createStatus('2024-01-02', false, true);
      });

      act(() => {
        result.current.deleteStatus('2024-01-01');
      });

      await waitFor(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        const parsed = JSON.parse(stored!);
        expect(parsed.data['2024-01-01']).toBeUndefined();
        expect(parsed.data['2024-01-02']).toBeDefined();
      });
    });

    it('should persist data across hook re-renders', () => {
      const { result: result1 } = renderHook(() => useDayStatuses());

      act(() => {
        result1.current.createStatus('2024-01-01', true, false);
      });

      const { result: result2 } = renderHook(() => useDayStatuses());

      expect(result2.current.statuses['2024-01-01']).toEqual({
        date: '2024-01-01',
        written: true,
        published: false,
      });
    });
  });

  describe('fallback when localStorage is unavailable', () => {
    let originalSetItem: typeof Storage.prototype.setItem;
    let originalGetItem: typeof Storage.prototype.getItem;

    beforeEach(() => {
      originalSetItem = Storage.prototype.setItem;
      originalGetItem = Storage.prototype.getItem;
    });

    afterEach(() => {
      Storage.prototype.setItem = originalSetItem;
      Storage.prototype.getItem = originalGetItem;
    });

    it('should work without localStorage', () => {
      Storage.prototype.setItem = () => {
        throw new Error('localStorage disabled');
      };
      Storage.prototype.getItem = () => {
        throw new Error('localStorage disabled');
      };

      const { result } = renderHook(() => useDayStatuses());

      expect(result.current.hasStorage).toBe(false);
      expect(result.current.statuses).toEqual({});

      act(() => {
        result.current.createStatus('2024-01-01', true, false);
      });

      expect(result.current.statuses['2024-01-01']).toEqual({
        date: '2024-01-01',
        written: true,
        published: false,
      });
    });
  });

  describe('multiple statuses', () => {
    it('should handle multiple statuses correctly', () => {
      const { result } = renderHook(() => useDayStatuses());

      act(() => {
        result.current.createStatus('2024-01-01', true, false);
        result.current.createStatus('2024-01-02', false, true);
        result.current.createStatus('2024-01-03', true, true);
      });

      expect(Object.keys(result.current.statuses)).toHaveLength(3);
      expect(result.current.statuses['2024-01-01'].written).toBe(true);
      expect(result.current.statuses['2024-01-02'].published).toBe(true);
      expect(result.current.statuses['2024-01-03'].written).toBe(true);
      expect(result.current.statuses['2024-01-03'].published).toBe(true);
    });
  });
});
