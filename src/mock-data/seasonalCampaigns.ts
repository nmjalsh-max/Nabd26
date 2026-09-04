// Seasonal campaigns — inspired by the Japanese awareness of seasons (hanami / wet consciousness)
// A welcome banner that changes based on where we are in the year.

export type SeasonalCampaign = {
  id: string;
  /** 0 = Jan, 1 = Feb, ... 11 = Dec — start month of the campaign quarter */
  startMonth: number;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  /** Accent color used for the banner gradient (hex) */
  accent: string;
  /** Emoji shown on the banner */
  emoji: string;
};

// Four quarters:
// Q1 (months 0-2): Spring / renewal  (hanami — cherry blossom viewing)
// Q2 (months 3-5): Growth / balance  (tsuyu — rainy season, introspection)
// Q3 (months 6-8): Energy / vitality (natsu — summer)
// Q4 (months 9-11): Reflection / rest (aki/fuyu — autumn/winter, hunkering)
export const seasonalCampaigns: SeasonalCampaign[] = [
  {
    id: "q1_spring",
    startMonth: 0,
    titleAr: "ربيع جديد — أزهار تتفتح",
    titleEn: "New Spring — Blossoms Bloom",
    messageAr: "مثل أزهار الكرز، كل بداية فصل فرصة لتجديد طاقتك واهتمامك بنفسك.",
    messageEn: "Like cherry blossoms, every season is a chance to renew your energy and self-care.",
    accent: "#F5A7C7",
    emoji: "🌸",
  },
  {
    id: "q2_growth",
    startMonth: 3,
    titleAr: "موسم النمو والتوازن",
    titleEn: "Season of Growth & Balance",
    messageAr: "أمطار الصيف تنعش الأرض — خذ وقتًا للتوازن بين العمل والراحة.",
    messageEn: "Summer rains refresh the earth — take time to balance work and rest.",
    accent: "#67E8F9",
    emoji: "🌿",
  },
  {
    id: "q3_vitality",
    startMonth: 6,
    titleAr: "حيوية الصيف",
    titleEn: "Summer Vitality",
    messageAr: "الطاقة في أعلى مستوياتها — استثمرها في جلسات الحركة والتمارين الجماعية.",
    messageEn: "Your energy is at its peak — invest it in movement and group exercise.",
    accent: "#FCD34D",
    emoji: "☀️",
  },
  {
    id: "q4_reflection",
    startMonth: 9,
    titleAr: "موسم التأمل والراحة",
    titleEn: "Season of Reflection & Rest",
    messageAr: "مع نهاية العام، توقف قليلاً وتأمل إنجازاتك وامنح نفسك الراحة التي تستحق.",
    messageEn: "As the year closes, pause to reflect on your achievements and grant yourself the rest you deserve.",
    accent: "#A78BFA",
    emoji: "🍂",
  },
];

/** Returns the active campaign based on the current month (0-11). */
export function getCurrentCampaign(date: Date = new Date()): SeasonalCampaign {
  const month = date.getMonth();
  // Each campaign covers 3 months starting from startMonth.
  const active =
    seasonalCampaigns.find((c) => month >= c.startMonth && month < c.startMonth + 3) ??
    seasonalCampaigns[seasonalCampaigns.length - 1];
  return active;
}

/** localStorage key so the banner only shows once (dismissible). */
export const SEASONAL_BANNER_KEY = "nabd_seasonal_banner_dismissed";

export function isSeasonalBannerDismissed(): boolean {
  try {
    return window.localStorage.getItem(SEASONAL_BANNER_KEY) === "1";
  } catch {
    return false;
  }
}

export function dismissSeasonalBanner(): void {
  try {
    window.localStorage.setItem(SEASONAL_BANNER_KEY, "1");
  } catch {
    /* ignore */
  }
}

