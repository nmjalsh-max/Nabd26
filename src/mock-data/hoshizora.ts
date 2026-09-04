// Hoshizora (星空) — "Starry sky"
// A calm rest-space feature: relaxing soundscapes + stargazing ambience
// for employees to reset during a busy day.

export type HoshizoraScene = {
  id: number;
  emoji: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  /** soothing color gradient for the card */
  gradient: string;
  /** recommended duration in minutes */
  minutes: number;
};

export const hoshizoraScenes: HoshizoraScene[] = [
  {
    id: 1,
    emoji: "🌌",
    titleAr: "سماء الليل",
    titleEn: "Night Sky",
    descAr: "نجوم متلألئة مع نسيم هادئ — مثالي بعد اجتماعات مرهقة.",
    descEn: "Twinkling stars with a gentle breeze — perfect after intense meetings.",
    gradient: "linear-gradient(135deg, #1E1B4B, #3B0764)",
    minutes: 5,
  },
  {
    id: 2,
    emoji: "🌊",
    titleAr: "شاطئ هادئ",
    titleEn: "Calm Shore",
    descAr: "أمواج متساقطة ببطء تساعد على إعادة التركيز.",
    descEn: "Slow-dropping waves that help restore focus.",
    gradient: "linear-gradient(135deg, #0C4A6E, #155E75)",
    minutes: 8,
  },
  {
    id: 3,
    emoji: "🌲",
    titleAr: "غابة الضباب",
    titleEn: "Misty Forest",
    descAr: "هدوء الأشجار مع ضباب خفيف لتنفس أعمق.",
    descEn: "Trees in quiet with a light mist for deeper breathing.",
    gradient: "linear-gradient(135deg, #14532D, #3F6212)",
    minutes: 6,
  },
];

/** Total rest minutes available across all scenes. */
export function hoshizoraTotalMinutes(): number {
  return hoshizoraScenes.reduce((acc, s) => acc + s.minutes, 0);
}

