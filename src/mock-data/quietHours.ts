// Teinei (ていねい) — "To do it so carefully that you bring out the best in yourself."
// Quiet Hours — respectful, focused work windows without meetings or chat pings.

export type QuietWindow = {
  id: number;
  titleAr: string;
  titleEn: string;
  /** 24h start hour, e.g. 9 = 9:00 AM */
  startHour: number;
  /** 24h end hour, e.g. 11 = 11:00 AM */
  endHour: number;
  emoji: string;
};

export const quietWindows: QuietWindow[] = [
  { id: 1, titleAr: "نافذة الصباح العميقة", titleEn: "Deep Morning Window", startHour: 9, endHour: 11, emoji: "🌅" },
  { id: 2, titleAr: "نافذة منتصف اليوم", titleEn: "Midday Focus Window", startHour: 13, endHour: 15, emoji: "🧠" },
  { id: 3, titleAr: "نافذة العصر الهادئة", titleEn: "Quiet Afternoon Window", startHour: 16, endHour: 17, emoji: "🌿" },
];

/** Returns the currently active quiet window (if any) based on the local time. */
export function getActiveQuietWindow(date: Date = new Date()): QuietWindow | null {
  const hour = date.getHours();
  return quietWindows.find((w) => hour >= w.startHour && hour < w.endHour) ?? null;
}

/** 0-100 — how close we are to the next quiet window (for a progress ring). */
export function quietHoursProgress(date: Date = new Date()): number {
  const hour = date.getHours();
  const next = quietWindows.find((w) => hour < w.startHour);
  if (!next) return 100; // all windows passed today
  const total = 24;
  return Math.min(100, Math.round((hour / total) * 100));
}

