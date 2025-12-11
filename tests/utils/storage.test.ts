import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  serialize,
  deserialize,
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
  hasLocalStorage,
  StorageError,
} from '../../src/utils/storage';
import { DayStatusMap, STORAGE_VERSION, STORAGE_KEY } from '../../src/models/DayStatus';

describe('Storage Utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('serialize', () => {
    it('should serialize empty map', () => {
      const data: DayStatusMap = {};
      const serialized = serialize(data);
      const parsed = JSON.parse(serialized);

      expect(parsed).toEqual({
        version: STORAGE_VERSION,
        data: {},
      });
    });

    it('should serialize map with data', () => {
      const data: DayStatusMap = {
        '2024-01-01': {
          date: '2024-01-01',
          written: true,
          published: false,
        },
        '2024-01-02': {
          date: '2024-01-02',
          written: false,
          published: true,
        },
      };
      const serialized = serialize(data);
      const parsed = JSON.parse(serialized);

      expect(parsed).toEqual({
        version: STORAGE_VERSION,
        data,
      });
    });

    it('should include version in serialized data', () => {
      const data: DayStatusMap = {};
      const serialized = serialize(data);
      const parsed = JSON.parse(serialized);

      expect(parsed.version).toBe(STORAGE_VERSION);
    });
  });

  describe('deserialize', () => {
    it('should deserialize valid data', () => {
      const data: DayStatusMap = {
        '2024-01-01': {
          date: '2024-01-01',
          written: true,
          published: false,
        },
      };
      const serialized = serialize(data);
      const deserialized = deserialize(serialized);

      expect(deserialized).toEqual(data);
    });

    it('should deserialize empty map', () => {
      const data: DayStatusMap = {};
      const serialized = serialize(data);
      const deserialized = deserialize(serialized);

      expect(deserialized).toEqual({});
    });

    it('should throw on invalid JSON', () => {
      expect(() => deserialize('invalid json')).toThrow(StorageError);
      expect(() => deserialize('invalid json')).toThrow('Invalid JSON format');
    });

    it('should throw on non-object', () => {
      expect(() => deserialize('null')).toThrow(StorageError);
      expect(() => deserialize('null')).toThrow('Invalid storage format: not an object');
    });

    it('should throw on missing version', () => {
      const invalid = JSON.stringify({ data: {} });
      expect(() => deserialize(invalid)).toThrow(StorageError);
      expect(() => deserialize(invalid)).toThrow('missing or invalid version');
    });

    it('should throw on invalid version type', () => {
      const invalid = JSON.stringify({ version: '1', data: {} });
      expect(() => deserialize(invalid)).toThrow(StorageError);
      expect(() => deserialize(invalid)).toThrow('missing or invalid version');
    });

    it('should throw on version mismatch', () => {
      const invalid = JSON.stringify({ version: 999, data: {} });
      expect(() => deserialize(invalid)).toThrow(StorageError);
      expect(() => deserialize(invalid)).toThrow('Version mismatch');
    });

    it('should throw on missing data', () => {
      const invalid = JSON.stringify({ version: STORAGE_VERSION });
      expect(() => deserialize(invalid)).toThrow(StorageError);
      expect(() => deserialize(invalid)).toThrow('missing data');
    });

    it('should throw on invalid data structure', () => {
      const invalid = JSON.stringify({
        version: STORAGE_VERSION,
        data: {
          '2024-01-01': {
            date: '2024-01-01',
            written: 'not a boolean',
            published: false,
          },
        },
      });
      expect(() => deserialize(invalid)).toThrow(StorageError);
      expect(() => deserialize(invalid)).toThrow('invalid data structure');
    });

    it('should throw on non-object data', () => {
      const invalid = JSON.stringify({
        version: STORAGE_VERSION,
        data: 'not an object',
      });
      expect(() => deserialize(invalid)).toThrow(StorageError);
    });
  });

  describe('saveToLocalStorage', () => {
    it('should save data to localStorage', () => {
      const data: DayStatusMap = {
        '2024-01-01': {
          date: '2024-01-01',
          written: true,
          published: false,
        },
      };

      saveToLocalStorage(data);
      const stored = localStorage.getItem(STORAGE_KEY);

      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed.data).toEqual(data);
    });

    it('should overwrite existing data', () => {
      const data1: DayStatusMap = {
        '2024-01-01': {
          date: '2024-01-01',
          written: true,
          published: false,
        },
      };
      const data2: DayStatusMap = {
        '2024-01-02': {
          date: '2024-01-02',
          written: false,
          published: true,
        },
      };

      saveToLocalStorage(data1);
      saveToLocalStorage(data2);

      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(stored!);
      expect(parsed.data).toEqual(data2);
    });
  });

  describe('loadFromLocalStorage', () => {
    it('should load data from localStorage', () => {
      const data: DayStatusMap = {
        '2024-01-01': {
          date: '2024-01-01',
          written: true,
          published: false,
        },
      };

      saveToLocalStorage(data);
      const loaded = loadFromLocalStorage();

      expect(loaded).toEqual(data);
    });

    it('should return null if no data exists', () => {
      const loaded = loadFromLocalStorage();
      expect(loaded).toBeNull();
    });

    it('should return null on invalid data and log warning', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      localStorage.setItem(STORAGE_KEY, 'invalid json');

      const loaded = loadFromLocalStorage();

      expect(loaded).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should return null on version mismatch and log warning', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const invalid = JSON.stringify({ version: 999, data: {} });
      localStorage.setItem(STORAGE_KEY, invalid);

      const loaded = loadFromLocalStorage();

      expect(loaded).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to load from localStorage'),
        expect.stringContaining('Version mismatch')
      );
      consoleWarnSpy.mockRestore();
    });
  });

  describe('clearLocalStorage', () => {
    it('should clear data from localStorage', () => {
      const data: DayStatusMap = {
        '2024-01-01': {
          date: '2024-01-01',
          written: true,
          published: false,
        },
      };

      saveToLocalStorage(data);
      expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();

      clearLocalStorage();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('should not throw if no data exists', () => {
      expect(() => clearLocalStorage()).not.toThrow();
    });
  });

  describe('hasLocalStorage', () => {
    it('should return true when localStorage is available', () => {
      expect(hasLocalStorage()).toBe(true);
    });

    it('should return false when localStorage throws', () => {
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = () => {
        throw new Error('localStorage disabled');
      };

      expect(hasLocalStorage()).toBe(false);

      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('serialization round-trip', () => {
    it('should preserve data through serialize/deserialize cycle', () => {
      const original: DayStatusMap = {
        '2024-01-01': {
          date: '2024-01-01',
          written: true,
          published: false,
        },
        '2024-01-02': {
          date: '2024-01-02',
          written: false,
          published: true,
        },
        '2024-01-03': {
          date: '2024-01-03',
          written: true,
          published: true,
        },
      };

      const serialized = serialize(original);
      const deserialized = deserialize(serialized);

      expect(deserialized).toEqual(original);
    });
  });

  describe('StorageError', () => {
    it('should create error with message', () => {
      const error = new StorageError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('StorageError');
    });

    it('should create error with cause', () => {
      const cause = new Error('Underlying error');
      const error = new StorageError('Test error', cause);
      expect(error.message).toBe('Test error');
      expect(error.cause).toBe(cause);
    });
  });
});
