export interface StreakData {
  currentStreak: number;
  maxStreak: number;
  isOnStreak: boolean;
  lastActivityDate: Date | null;
  graceUsed: boolean;
  daysUntilBreak: number;
  status: 'healthy' | 'grace' | 'broken';
}

export interface DayActivity {
  date: string;
  written: boolean;
  published: boolean;
}

export function calculateStreak(activities: Map<string, DayActivity>): StreakData {
  if (activities.size === 0) {
    return {
      currentStreak: 0,
      maxStreak: 0,
      isOnStreak: false,
      lastActivityDate: null,
      graceUsed: false,
      daysUntilBreak: 0,
      status: 'broken',
    };
  }

  const sortedDates = Array.from(activities.keys())
    .map((dateStr) => new Date(dateStr))
    .sort((a, b) => b.getTime() - a.getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastActivityDate = sortedDates[0];
  lastActivityDate.setHours(0, 0, 0, 0);

  const daysSinceLastActivity = Math.floor((today.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));

  let currentStreak = 0;
  let maxStreak = 0;
  let graceUsed = false;
  let status: 'healthy' | 'grace' | 'broken' = 'broken';

  // Check if currently on streak (activity today or yesterday, or within grace period)
  const isOnStreak = daysSinceLastActivity <= 1;

  if (isOnStreak) {
    // Calculate streak length
    currentStreak = 1;
    let checkDate = new Date(lastActivityDate);
    checkDate.setDate(checkDate.getDate() - 1);

    for (const dateStr of sortedDates.slice(1)) {
      const checkDateNormalized = new Date(dateStr);
      checkDateNormalized.setHours(0, 0, 0, 0);

      if (checkDate.getTime() === checkDateNormalized.getTime()) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    status = daysSinceLastActivity === 1 ? 'healthy' : 'grace';
    graceUsed = daysSinceLastActivity === 1;
  }

  // Calculate max streak from all activities
  maxStreak = currentStreak;
  let tempStreak = 1;
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const current = new Date(sortedDates[i]);
    current.setHours(0, 0, 0, 0);
    const next = new Date(sortedDates[i + 1]);
    next.setHours(0, 0, 0, 0);

    const diff = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      tempStreak++;
      maxStreak = Math.max(maxStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  const daysUntilBreak = isOnStreak ? (daysSinceLastActivity === 0 ? 1 : 0) : 0;

  return {
    currentStreak,
    maxStreak,
    isOnStreak,
    lastActivityDate,
    graceUsed,
    daysUntilBreak,
    status,
  };
}
