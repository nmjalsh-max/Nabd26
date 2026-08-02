// Radio Taiso — Group exercise inspired by the Japanese morning routine
// A short, cheerful group exercise that employees can join at the office.

export type RadioTaisoExercise = {
  id: number;
  titleAr: string;
  titleEn: string;
  durationMin: number;
  /** Level of movement: "الجميع" / "مكتبي" / "قيّم" — everyone / desk-friendly / low-impact */
  intensity: "light" | "moderate";
  scheduleAr: string;
  scheduleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  emoji: string;
};

export const radioTaisoExercises: RadioTaisoExercise[] = [
  {
    id: 1,
    titleAr: "تمارين الراديو الصباحية",
    titleEn: "Morning Radio Taiso",
    durationMin: 5,
    intensity: "light",
    scheduleAr: "كل يوم عمل — 9:00 صباحًا",
    scheduleEn: "Every workday — 9:00 AM",
    descriptionAr: "خمس دقائق من الحركة الخفيفة بصحبة الزملاء تنشّط الدورة الدموية قبل بدء العمل.",
    descriptionEn: "Five minutes of light movement with colleagues to energize before work begins.",
    emoji: "🤸",
  },
  {
    id: 2,
    titleAr: "استراحة حركة منتصف اليوم",
    titleEn: "Midday Movement Break",
    durationMin: 3,
    intensity: "light",
    scheduleAr: "كل يوم بعد الظهر — 2:00 مساءً",
    scheduleEn: "Every afternoon — 2:00 PM",
    descriptionAr: "استراحة قصيرة لإطالة الجسم وتقليل التوتر المتراكم بعد ساعات الجلوس.",
    descriptionEn: "A short stretch break to release tension built up from sitting.",
    emoji: "🧘",
  },
  {
    id: 3,
    titleAr: "تمارين المقعد النشطة",
    titleEn: "Active Desk Exercises",
    durationMin: 2,
    intensity: "moderate",
    scheduleAr: "عند الحاجة — من مكانك",
    scheduleEn: "On demand — from your seat",
    descriptionAr: "تمارين سريعة أثناء الجلوس لتحسين التركيز وتقليل آلام الظهر والرقبة.",
    descriptionEn: "Quick seated exercises to improve focus and reduce back and neck strain.",
    emoji: "💺",
  },
];

/** Returns the total weekly minutes if all exercises are done daily (quick stat). */
export function weeklyRadioTaisoMinutes(): number {
  const workdays = 5;
  return radioTaisoExercises.reduce((sum, e) => sum + e.durationMin, 0) * workdays;
}

