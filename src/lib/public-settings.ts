export const PHONE_10_REGEX = /^\d{10}$/;
export const EMAIL_DOT_COM_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.com$/i;

/** Allow only digits and cap mobile numbers at 10 characters. */
export function sanitizePhoneInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}

export const DEFAULT_DINING_DURATIONS = [
  "30 minutes",
  "45 minutes",
  "1 hour",
  "1 hour 30 minutes",
  "2 hours",
  "More than 2 hours",
];

export const DEFAULT_SEATING_PREFERENCES = [
  "Indoor seating",
  "Outdoor seating",
  "No preference",
];

export type PublicRestaurantSettings = {
  restaurantEmail: string;
  restaurantPhone: string;
  restaurantAddress: string;
  lunchStart: string;
  lunchEnd: string;
  dinnerStart: string;
  dinnerEnd: string;
  acceptOnlineOrders: boolean;
  acceptDiningReservations: boolean;
  diningDurations?: string[];
  seatingPreferences?: string[];
};

export const DEFAULT_PUBLIC_SETTINGS: PublicRestaurantSettings = {
  restaurantEmail: "hello@cravora.com",
  restaurantPhone: "9876543210",
  restaurantAddress: "42 Spice Courtyard, Bengaluru",
  lunchStart: "12:00",
  lunchEnd: "15:00",
  dinnerStart: "19:00",
  dinnerEnd: "22:00",
  acceptOnlineOrders: true,
  acceptDiningReservations: true,
  diningDurations: DEFAULT_DINING_DURATIONS,
  seatingPreferences: DEFAULT_SEATING_PREFERENCES,
};

/** Parse an HH:MM 24-hour string into total minutes from midnight. */
export function parseTimeMinutes(hhmm: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(hhmm.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
}

/** Format an HH:MM 24-hour string into 12-hour display (e.g. "7:30 PM"). */
export function formatTime12h(hhmm: string): string {
  const mins = parseTimeMinutes(hhmm);
  if (mins === null) return hhmm;
  const hour24 = Math.floor(mins / 60);
  const minute = mins % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  const displayHour = hour24 % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
}

/** Generate half-open [start, end) time slots in fixed minute increments. */
export function generateTimeSlots(
  start: string,
  end: string,
  stepMinutes = 15
): { value: string; label: string }[] {
  const startMin = parseTimeMinutes(start);
  const endMin = parseTimeMinutes(end);
  if (startMin === null || endMin === null || stepMinutes <= 0) return [];

  const slots: { value: string; label: string }[] = [];
  const span = endMin > startMin ? endMin - startMin : 24 * 60 - startMin + endMin;
  if (span <= 0 || span > 24 * 60) return [];

  for (let offset = 0; offset < span; offset += stepMinutes) {
    const mins = (startMin + offset) % (24 * 60);
    const hh = String(Math.floor(mins / 60)).padStart(2, "0");
    const mm = String(mins % 60).padStart(2, "0");
    const value = `${hh}:${mm}`;
    slots.push({ value, label: formatTime12h(value) });
  }
  return slots;
}

/** Generate all 24-hour times in 12-hour display format (e.g. "12:00 PM"). */
export function build12HourTimeOptions(
  stepMinutes = 15,
  includeValues: string[] = []
): { value: string; label: string }[] {
  const minuteSet = new Set<number>();
  for (let m = 0; m < 24 * 60; m += stepMinutes) {
    minuteSet.add(m);
  }
  for (const val of includeValues) {
    const parsed = parseTimeMinutes(val);
    if (parsed !== null) minuteSet.add(parsed);
  }
  return Array.from(minuteSet)
    .sort((a, b) => a - b)
    .map((mins) => {
      const hh = String(Math.floor(mins / 60)).padStart(2, "0");
      const mm = String(mins % 60).padStart(2, "0");
      const value = `${hh}:${mm}`;
      return { value, label: formatTime12h(value) };
    });
}

function isInWindow(valueMin: number, start: string, end: string): boolean {
  const s = parseTimeMinutes(start);
  const e = parseTimeMinutes(end);
  if (s === null || e === null || s === e) return false;
  if (s < e) return valueMin >= s && valueMin < e;
  return valueMin >= s || valueMin < e;
}

/** Return true if hhmm falls inside configured lunch or dinner service hours. */
export function isTimeWithinHours(
  hhmm: string,
  hours: Pick<
    PublicRestaurantSettings,
    "lunchStart" | "lunchEnd" | "dinnerStart" | "dinnerEnd"
  >
): boolean {
  const valueMin = parseTimeMinutes(hhmm);
  if (valueMin === null) return false;
  return (
    isInWindow(valueMin, hours.lunchStart, hours.lunchEnd) ||
    isInWindow(valueMin, hours.dinnerStart, hours.dinnerEnd)
  );
}
