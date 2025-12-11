import { describe, it, expect } from 'vitest';
import {
  createDayStatus,
  formatDateKey,
  isValidDayStatus,
  isValidDayStatusMap,
  STORAGE_VERSION,
  STORAGE_KEY,
} from '../../src/models/DayStatus';

describe('DayStatus Model', () => {
  describe('createDayStatus', () => {
    it('should create a day status with default values', () => {
      const status = createDayStatus('2024-01-01');
      expect(status).toEqual({
        date: '2024-01-01',
        written: false,
        published: false,
      });
    });

    it('should create a day status with custom values', () => {
      const status = createDayStatus('2024-01-01', true, true);
      expect(status).toEqual({
        date: '2024-01-01',
        written: true,
        published: true,
      });
    });

    it('should create a day status with written only', () => {
      const status = createDayStatus('2024-01-01', true, false);
      expect(status).toEqual({
        date: '2024-01-01',
        written: true,
        published: false,
      });
    });
  });

  describe('formatDateKey', () => {
    it('should format a date as ISO date string', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = formatDateKey(date);
      expect(formatted).toBe('2024-01-15');
    });

    it('should handle different dates correctly', () => {
      const date1 = new Date('2023-12-31T23:59:59Z');
      const date2 = new Date('2024-01-01T00:00:00Z');
      
      expect(formatDateKey(date1)).toBe('2023-12-31');
      expect(formatDateKey(date2)).toBe('2024-01-01');
    });
  });

  describe('isValidDayStatus', () => {
    it('should return true for valid day status', () => {
      const status = {
        date: '2024-01-01',
        written: true,
        published: false,
      };
      expect(isValidDayStatus(status)).toBe(true);
    });

    it('should return false for null', () => {
      expect(isValidDayStatus(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isValidDayStatus(undefined)).toBe(false);
    });

    it('should return false for non-object', () => {
      expect(isValidDayStatus('string')).toBe(false);
      expect(isValidDayStatus(123)).toBe(false);
      expect(isValidDayStatus(true)).toBe(false);
    });

    it('should return false for missing date', () => {
      const status = {
        written: true,
        published: false,
      };
      expect(isValidDayStatus(status)).toBe(false);
    });

    it('should return false for invalid date type', () => {
      const status = {
        date: 123,
        written: true,
        published: false,
      };
      expect(isValidDayStatus(status)).toBe(false);
    });

    it('should return false for missing written', () => {
      const status = {
        date: '2024-01-01',
        published: false,
      };
      expect(isValidDayStatus(status)).toBe(false);
    });

    it('should return false for invalid written type', () => {
      const status = {
        date: '2024-01-01',
        written: 'yes',
        published: false,
      };
      expect(isValidDayStatus(status)).toBe(false);
    });

    it('should return false for missing published', () => {
      const status = {
        date: '2024-01-01',
        written: true,
      };
      expect(isValidDayStatus(status)).toBe(false);
    });

    it('should return false for invalid published type', () => {
      const status = {
        date: '2024-01-01',
        written: true,
        published: 'no',
      };
      expect(isValidDayStatus(status)).toBe(false);
    });
  });

  describe('isValidDayStatusMap', () => {
    it('should return true for valid map', () => {
      const map = {
        '2024-01-01': {
          date: '2024-01-01',
          written: true,
          published: false,
        },
        '2024-01-02': {
          date: '2024-01-02',
          written: false,
          published: false,
        },
      };
      expect(isValidDayStatusMap(map)).toBe(true);
    });

    it('should return true for empty map', () => {
      expect(isValidDayStatusMap({})).toBe(true);
    });

    it('should return false for null', () => {
      expect(isValidDayStatusMap(null)).toBe(false);
    });

    it('should return false for non-object', () => {
      expect(isValidDayStatusMap('string')).toBe(false);
      expect(isValidDayStatusMap([])).toBe(false);
    });

    it('should return false if any value is invalid', () => {
      const map = {
        '2024-01-01': {
          date: '2024-01-01',
          written: true,
          published: false,
        },
        '2024-01-02': {
          date: '2024-01-02',
          written: 'invalid',
          published: false,
        },
      };
      expect(isValidDayStatusMap(map)).toBe(false);
    });
  });

  describe('constants', () => {
    it('should have defined storage version', () => {
      expect(STORAGE_VERSION).toBe(1);
    });

    it('should have defined storage key', () => {
      expect(STORAGE_KEY).toBe('dayStatuses');
    });
  });
});
