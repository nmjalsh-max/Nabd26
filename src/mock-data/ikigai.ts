// Ikigai (生き甲斐) — "a reason for being"
// A reflective card that helps employees reflect on their sense of purpose.
// This is a gentle self-reflection prompt, not a diagnostic tool.

export type IkigaiPrompt = {
  id: number;
  emoji: string;
  /** 4 traditional ikigai circles */
  circleAr: string;
  circleEn: string;
  /** one guiding question for that circle */
  questionAr: string;
  questionEn: string;
};

export const ikigaiPrompts: IkigaiPrompt[] = [
  {
    id: 1,
    emoji: "❤️",
    circleAr: "ما تحبه",
    circleEn: "What you love",
    questionAr: "ما النشاط الذي يمنحك طاقة حقيقية دون أن تلتفت للساعة؟",
    questionEn: "Which activity gives you real energy without watching the clock?",
  },
  {
    id: 2,
    emoji: "🧠",
    circleAr: "ما تجيده",
    circleEn: "What you're good at",
    questionAr: "ما المهارة التي يطلبها منك زملاؤك دائمًا؟",
    questionEn: "Which skill do colleagues always ask you for?",
  },
  {
    id: 3,
    emoji: "🌍",
    circleAr: "ما يحتاجه العالم",
    circleEn: "What the world needs",
    questionAr: "ما المشكلة الصغيرة التي تحب أن تجعلها أفضل حولك؟",
    questionEn: "What small problem around you do you enjoy making better?",
  },
  {
    id: 4,
    emoji: "💰",
    circleAr: "ما يمكن أن تٌكافأ عليه",
    circleEn: "What you can be rewarded for",
    questionAr: "ما العمل الذي تشعر أن قيمته تُقدَّر في فريقك؟",
    questionEn: "Which work do you feel is valued in your team?",
  },
];

/** A calm reflective line shown under the card. */
export function ikigaiReflection(): string {
  return "الهدف ليس الإجابة الكاملة اليوم، بل فتح مساحة صغيرة للتفكير.";
}

