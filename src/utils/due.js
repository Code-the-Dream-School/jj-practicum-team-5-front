export const HOUR = 36e5; // milliseconds in one hour
export const DAY = 24 * HOUR; // milliseconds in one day

// Normalize input date to a 'YYYY-MM-DD' date-only string
export function toDateOnly(d) {
  if (!d) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// End of the local day (23:59:59.999) for 'YYYY-MM-DD' → epoch ms
export function endOfLocalDayMs(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d, 23, 59, 59, 999).getTime();
}

// Return deadline flags:
// - overdue: deadline has passed
// - dueSoon: less than 24 hours remaining
// - hoursLeft: hours remaining (rounded up)
export function getDueInfo(due, completed = false) {
  if (!due || completed)
    return { overdue: false, dueSoon: false, hoursLeft: null };
  const delta = endOfLocalDayMs(due) - Date.now();
  if (delta <= 0) return { overdue: true, dueSoon: false, hoursLeft: 0 };
  return {
    overdue: false,
    dueSoon: delta <= DAY,
    hoursLeft: Math.ceil(delta / HOUR),
  };
}
