const DAY_MS = 24 * 60 * 60 * 1000;

export function toDateOnly(dateLike) {
  return new Date(`${dateLike}T00:00:00`);
}

export function formatLeaveDate(millis) {
  return new Date(millis).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

export function isPastDate(dateString) {
  if (!dateString) return false;
  return toDateOnly(dateString) < toDateOnly(getTodayDateString());
}

export function countBusinessDays(startDateString, endDateString) {
  if (!startDateString || !endDateString) return 0;

  const start = toDateOnly(startDateString);
  const end = toDateOnly(endDateString);

  if (end < start) return 0;

  let total = 0;
  for (let current = new Date(start); current <= end; current = new Date(current.getTime() + DAY_MS)) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      total += 1;
    }
  }

  return total;
}
