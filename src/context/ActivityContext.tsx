import { createContext, useContext, useState, ReactNode } from 'react';

export interface DayActivity {
  date: string; // ISO date string YYYY-MM-DD
  written: boolean;
  published: boolean;
}

interface ActivityContextType {
  activities: Map<string, DayActivity>;
  updateActivity: (date: Date, written?: boolean, published?: boolean) => void;
  getActivity: (date: Date) => DayActivity | undefined;
  clearActivity: (date: Date) => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Map<string, DayActivity>>(() => {
    const stored = localStorage.getItem('activities');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return new Map(parsed);
      } catch {
        return new Map();
      }
    }
    return new Map();
  });

  const dateToString = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const updateActivity = (date: Date, written?: boolean, published?: boolean) => {
    setActivities((prev) => {
      const key = dateToString(date);
      const current = prev.get(key);
      const updated: DayActivity = {
        date: key,
        written: written !== undefined ? written : current?.written ?? false,
        published: published !== undefined ? published : current?.published ?? false,
      };

      const newActivities = new Map(prev);
      if (updated.written || updated.published) {
        newActivities.set(key, updated);
      } else {
        newActivities.delete(key);
      }

      // Persist to localStorage
      localStorage.setItem('activities', JSON.stringify(Array.from(newActivities.entries())));

      return newActivities;
    });
  };

  const getActivity = (date: Date): DayActivity | undefined => {
    const key = dateToString(date);
    return activities.get(key);
  };

  const clearActivity = (date: Date) => {
    const key = dateToString(date);
    setActivities((prev) => {
      const newActivities = new Map(prev);
      newActivities.delete(key);
      localStorage.setItem('activities', JSON.stringify(Array.from(newActivities.entries())));
      return newActivities;
    });
  };

  return (
    <ActivityContext.Provider value={{ activities, updateActivity, getActivity, clearActivity }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within ActivityProvider');
  }
  return context;
}
