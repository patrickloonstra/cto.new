import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDayStatuses } from '../src/hooks/useDayStatuses';
import { STORAGE_KEY } from '../src/models/DayStatus';

describe('Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should retain statuses after page refresh (simulated)', () => {
    const { result: firstRender } = renderHook(() => useDayStatuses());

    act(() => {
      firstRender.current.createStatus('2024-01-01', true, false);
      firstRender.current.createStatus('2024-01-02', false, true);
      firstRender.current.createStatus('2024-01-03', true, true);
    });

    expect(Object.keys(firstRender.current.statuses)).toHaveLength(3);

    const storedData = localStorage.getItem(STORAGE_KEY);
    expect(storedData).not.toBeNull();

    const { result: secondRender } = renderHook(() => useDayStatuses());

    expect(Object.keys(secondRender.current.statuses)).toHaveLength(3);
    expect(secondRender.current.getStatus('2024-01-01')).toEqual({
      date: '2024-01-01',
      written: true,
      published: false,
    });
    expect(secondRender.current.getStatus('2024-01-02')).toEqual({
      date: '2024-01-02',
      written: false,
      published: true,
    });
    expect(secondRender.current.getStatus('2024-01-03')).toEqual({
      date: '2024-01-03',
      written: true,
      published: true,
    });
  });

  it('should handle a complete user workflow', () => {
    const { result } = renderHook(() => useDayStatuses());

    expect(result.current.statuses).toEqual({});

    act(() => {
      result.current.createStatus('2024-01-01', false, false);
    });

    expect(result.current.getStatus('2024-01-01')).toEqual({
      date: '2024-01-01',
      written: false,
      published: false,
    });

    act(() => {
      result.current.setStatus('2024-01-01', { written: true });
    });

    expect(result.current.getStatus('2024-01-01')).toEqual({
      date: '2024-01-01',
      written: true,
      published: false,
    });

    act(() => {
      result.current.setStatus('2024-01-01', { published: true });
    });

    expect(result.current.getStatus('2024-01-01')).toEqual({
      date: '2024-01-01',
      written: true,
      published: true,
    });

    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.version).toBe(1);
    expect(parsed.data['2024-01-01']).toEqual({
      date: '2024-01-01',
      written: true,
      published: true,
    });
  });

  it('should handle multiple days across sessions', () => {
    const { result: session1 } = renderHook(() => useDayStatuses());

    act(() => {
      session1.current.createStatus('2024-01-01', true, false);
      session1.current.createStatus('2024-01-02', true, false);
    });

    expect(Object.keys(session1.current.statuses)).toHaveLength(2);

    const { result: session2 } = renderHook(() => useDayStatuses());

    act(() => {
      session2.current.createStatus('2024-01-03', true, false);
    });

    expect(Object.keys(session2.current.statuses)).toHaveLength(3);

    const { result: session3 } = renderHook(() => useDayStatuses());

    expect(Object.keys(session3.current.statuses)).toHaveLength(3);
    expect(session3.current.getStatus('2024-01-01')).toBeDefined();
    expect(session3.current.getStatus('2024-01-02')).toBeDefined();
    expect(session3.current.getStatus('2024-01-03')).toBeDefined();

    act(() => {
      session3.current.deleteStatus('2024-01-02');
    });

    expect(Object.keys(session3.current.statuses)).toHaveLength(2);

    const { result: session4 } = renderHook(() => useDayStatuses());

    expect(Object.keys(session4.current.statuses)).toHaveLength(2);
    expect(session4.current.getStatus('2024-01-01')).toBeDefined();
    expect(session4.current.getStatus('2024-01-02')).toBeUndefined();
    expect(session4.current.getStatus('2024-01-03')).toBeDefined();
  });

  it('should handle clear operation correctly', () => {
    const { result: session1 } = renderHook(() => useDayStatuses());

    act(() => {
      session1.current.createStatus('2024-01-01', true, false);
      session1.current.createStatus('2024-01-02', true, false);
    });

    expect(Object.keys(session1.current.statuses)).toHaveLength(2);

    act(() => {
      session1.current.clearAll();
    });

    expect(Object.keys(session1.current.statuses)).toHaveLength(0);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();

    const { result: session2 } = renderHook(() => useDayStatuses());

    expect(Object.keys(session2.current.statuses)).toHaveLength(0);
  });
});
