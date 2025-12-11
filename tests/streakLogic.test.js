const test = require('node:test');
const assert = require('node:assert/strict');

const { calculateStreak, MAX_GRACE_DAYS } = require('../src/streakLogic');

const complete = (date) => ({ date, written: true, published: true });
const writtenOnly = (date) => ({ date, written: true, published: false });
const publishedOnly = (date) => ({ date, written: false, published: true });

test('counts consecutive completions without grace usage', () => {
  const dataset = [
    complete('2024-06-05'),
    complete('2024-06-04'),
    complete('2024-06-03'),
    complete('2024-06-02'),
    complete('2024-06-01')
  ];

  const result = calculateStreak(dataset, '2024-06-05');

  assert.equal(result.streakLength, 5);
  assert.equal(result.daysUsedInGrace, 0);
  assert.equal(result.daysRemainingInGrace, MAX_GRACE_DAYS);
  assert.equal(result.isInGrace, false);
  assert.equal(result.lastCompleteDate, '2024-06-05');
  assert.equal(result.lastActivityDate, '2024-06-05');
});

test('keeps streak alive across two missed days and tracks metadata', () => {
  const dataset = [
    writtenOnly('2024-01-04'),
    { date: '2024-01-03', written: false, published: false },
    complete('2024-01-02'),
    complete('2024-01-01'),
    complete('2023-12-31'),
    publishedOnly('2023-12-30')
  ];

  const result = calculateStreak(dataset, '2024-01-04');

  assert.equal(result.streakLength, 3); // Jan 2, Jan 1, Dec 31
  assert.equal(result.lastCompleteDate, '2024-01-02');
  assert.equal(result.daysUsedInGrace, MAX_GRACE_DAYS);
  assert.equal(result.daysRemainingInGrace, 0);
  assert.equal(result.isInGrace, true);
  assert.equal(result.lastActivityDate, '2024-01-04');
  assert.equal(result.trailingMisses, MAX_GRACE_DAYS);
});

test('resets streak after the third consecutive missed day', () => {
  const dataset = [
    complete('2024-01-02'),
    complete('2024-01-01')
  ];

  const result = calculateStreak(dataset, '2024-01-05');

  assert.equal(result.streakLength, 0);
  assert.equal(result.lastCompleteDate, null);
  assert.equal(result.graceBroken, true);
  assert.equal(result.daysRemainingInGrace, 0);
  assert.equal(result.trailingMisses, MAX_GRACE_DAYS + 1);
  assert.equal(result.lastActivityDate, '2024-01-02');
});

test('handles month boundaries and leap days when applying grace', () => {
  const dataset = [
    writtenOnly('2024-03-01'),
    publishedOnly('2024-02-29'),
    complete('2024-02-28'),
    complete('2024-02-27'),
    complete('2024-02-26')
  ];

  const result = calculateStreak(dataset, '2024-03-01');

  assert.equal(result.streakLength, 3); // Feb 28 + Feb 27 + Feb 26
  assert.equal(result.lastCompleteDate, '2024-02-28');
  assert.equal(result.daysUsedInGrace, MAX_GRACE_DAYS);
  assert.equal(result.daysRemainingInGrace, 0);
  assert.equal(result.lastActivityDate, '2024-03-01');
  assert.equal(result.isInGrace, true);
});
