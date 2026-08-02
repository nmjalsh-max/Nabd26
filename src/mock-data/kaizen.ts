// Kaizen (改善) — "Continuous improvement"
// A gentle suggestion box that turns small employee ideas into visible improvements.
// Inspired by the Japanese philosophy of continuous small steps.

export type KaizenIdea = {
  id: number;
  emoji: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  /** Votes from colleagues — shows the idea is valued */
  votes: number;
  /** Status of the idea in the improvement pipeline */
  status: "proposed" | "reviewing" | "implemented";
};

export const kaizenIdeas: KaizenIdea[] = [
  {
    id: 1,
    emoji: "💡",
    titleAr: "مساحة ركن هادئ",
    titleEn: "Quiet corner space",
    descAr: "تخصيص ركن صغير للاسترخاء بعيدًا عن ضجيج الشاشات والاجتماعات.",
    descEn: "Dedicate a small corner for relaxation away from screen and meeting noise.",
    votes: 18,
    status: "implemented",
  },
  {
    id: 2,
    emoji: "🌱",
    titleAr: "زراعة مكتبية",
    titleEn: "Desk plants",
    descAr: "إضافة نباتات صغيرة على المكاتب لتحسين جودة الهواء والمزاج العام.",
    descEn: "Add small plants to desks to improve air quality and overall mood.",
    votes: 12,
    status: "reviewing",
  },
  {
    id: 3,
    emoji: "⏰",
    titleAr: "مرونة مواعيد البدء",
    titleEn: "Flexible start times",
    descAr: "السماح بمرونة ±30 دقيقة في موعد بدء الدوام لتقليل التوتر الصباحي.",
    descEn: "Allow ±30 min flexibility in start time to reduce morning stress.",
    votes: 24,
    status: "proposed",
  },
  {
    id: 4,
    emoji: "📅",
    titleAr: "يوم خالٍ من الاجتماعات",
    titleEn: "Meeting-free day",
    descAr: "تخصيص يوم أسبوعيًا للعمل العميق دون اجتماعات داخلية.",
    descEn: "Dedicate one day weekly for deep work without internal meetings.",
    votes: 31,
    status: "proposed",
  },
];

/** Total votes cast across all ideas (quick stat). */
export function totalKaizenVotes(): number {
  return kaizenIdeas.reduce((acc, idea) => acc + idea.votes, 0);
}

/** Ideas currently in the "implemented" pipeline (success stories). */
export function implementedKaizenCount(): number {
  return kaizenIdeas.filter((idea) => idea.status === "implemented").length;
}

/** localStorage key for the new-idea form (optional, demo only). */
export const KAIZEN_SUGGESTION_KEY = "nabd_kaizen_draft";

