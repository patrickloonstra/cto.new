const ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;
const MAX_GRACE_DAYS = 2;
const DEFAULT_ITERATION_PADDING = 366; // look back roughly a year beyond tracked days

/**
 * Normalizes any supported date input to a Date set to the UTC start of that day.
 * @param {string|Date} value
 * @param {string} label
 * @returns {Date}
 */
function normalizeToUTCDate(value, label = 'date') {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new Error(`Invalid date value provided for ${label}`);
    }
    return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    const match = ISO_DATE_REGEX.exec(trimmed);
    if (!match) {
      throw new Error(`Expected ${label} to be in YYYY-MM-DD format`);
    }
    const [_, yearStr, monthStr, dayStr] = match;
    const year = Number.parseInt(yearStr, 10);
    const monthIndex = Number.parseInt(monthStr, 10) - 1;
    const day = Number.parseInt(dayStr, 10);
    const normalized = new Date(Date.UTC(year, monthIndex, day));

    if (
      normalized.getUTCFullYear() !== year ||
      normalized.getUTCMonth() !== monthIndex ||
      normalized.getUTCDate() !== day
    ) {
      throw new Error(`Invalid calendar date provided for ${label}`);
    }
    return normalized;
  }

  throw new Error(`Unsupported date value provided for ${label}`);
}

function formatDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, amount) {
  const copy = new Date(date.getTime());
  copy.setUTCDate(copy.getUTCDate() + amount);
  return copy;
}

/**
 * Calculates the current streak length and grace metadata.
 *
 * @param {Array<{date: string|Date, written: boolean, published: boolean}>} dayStatuses
 * @param {string|Date} [todayInput]
 * @returns {{
 *   streakLength: number,
 *   lastCompleteDate: string|null,
 *   lastActivityDate: string|null,
 *   daysUsedInGrace: number,
 *   daysRemainingInGrace: number,
 *   trailingMisses: number,
 *   isInGrace: boolean,
 *   graceBroken: boolean,
 *   maxGraceDays: number,
 *   today: string
 * }}
 */
function calculateStreak(dayStatuses, todayInput = new Date()) {
  if (!Array.isArray(dayStatuses)) {
    throw new Error('dayStatuses must be an array');
  }

  const today = normalizeToUTCDate(todayInput, 'today');
  const todayKey = formatDateKey(today);
  const statusesByDate = new Map();
  let lastActivityDate = null;

  dayStatuses.forEach((rawStatus, index) => {
    if (!rawStatus || typeof rawStatus !== 'object') {
      throw new Error(`Day status at index ${index} must be an object`);
    }
    if (rawStatus.date === undefined) {
      throw new Error(`Day status at index ${index} is missing a date field`);
    }

    const normalizedDate = normalizeToUTCDate(rawStatus.date, `dayStatuses[${index}].date`);
    if (normalizedDate > today) {
      return; // ignore future-dated entries
    }

    const dateKey = formatDateKey(normalizedDate);
    const written = Boolean(rawStatus.written);
    const published = Boolean(rawStatus.published);
    statusesByDate.set(dateKey, { written, published });

    if ((written || published) && (!lastActivityDate || dateKey > lastActivityDate)) {
      lastActivityDate = dateKey;
    }
  });

  let streakLength = 0;
  let lastCompleteDate = null;
  let currentDate = new Date(today.getTime());
  let consecutiveMisses = 0;
  let trailingMisses = 0;
  let firstCompletionSeen = false;
  const safeIterationLimit = statusesByDate.size + MAX_GRACE_DAYS + DEFAULT_ITERATION_PADDING;

  for (let iterations = 0; iterations < safeIterationLimit; iterations += 1) {
    const dateKey = formatDateKey(currentDate);
    const record = statusesByDate.get(dateKey);
    const isComplete = Boolean(record && record.written && record.published);

    if (isComplete) {
      streakLength += 1;
      if (!lastCompleteDate) {
        lastCompleteDate = dateKey;
      }
      if (!firstCompletionSeen) {
        firstCompletionSeen = true;
        trailingMisses = consecutiveMisses;
      }
      consecutiveMisses = 0;
    } else {
      consecutiveMisses += 1;
      if (!firstCompletionSeen) {
        trailingMisses = consecutiveMisses;
      }
      if (consecutiveMisses > MAX_GRACE_DAYS) {
        break;
      }
    }

    currentDate = addDays(currentDate, -1);
  }

  const trailingMissCount = firstCompletionSeen ? trailingMisses : consecutiveMisses;
  const normalizedTrailing = Math.max(trailingMissCount, 0);
  const daysUsedInGrace = Math.min(normalizedTrailing, MAX_GRACE_DAYS);
  const daysRemainingInGrace = Math.max(0, MAX_GRACE_DAYS - daysUsedInGrace);
  const isInGrace = streakLength > 0 && normalizedTrailing > 0 && normalizedTrailing <= MAX_GRACE_DAYS;
  const graceBroken = normalizedTrailing > MAX_GRACE_DAYS;

  return {
    streakLength,
    lastCompleteDate,
    lastActivityDate,
    daysUsedInGrace,
    daysRemainingInGrace,
    trailingMisses: normalizedTrailing,
    isInGrace,
    graceBroken,
    maxGraceDays: MAX_GRACE_DAYS,
    today: todayKey
  };
}

module.exports = {
  calculateStreak,
  MAX_GRACE_DAYS
};
