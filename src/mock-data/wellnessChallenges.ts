// Wellness Challenges — team activity challenges with progress + a weekly leaderboard.
// New feature ported from the Google Stitch "wellness_challenges" design.

export type ChallengeStatus = "active" | "upcoming" | "previous";

export type WellnessChallenge = {
  id: number;
  icon: string; // Material Symbols name
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  status: ChallengeStatus;
  daysLeft?: number;
  participants?: number;
  /** Current user's personal progress, 0-100 (undefined = not joined yet) */
  progress?: number;
  joined: boolean;
};

export const featuredChallenge: WellnessChallenge = {
  id: 1,
  icon: "directions_run",
  titleAr: "تحدي 10,000 خطوة",
  titleEn: "10,000 Steps Challenge",
  descAr: "انضم لزملائك في تحدي مشي لمدة شهر كامل. عزّز نشاطك اليومي وحقق أهدافك الصحية واربح جوائز قيّمة.",
  descEn: "Join your colleagues in a month-long walking challenge. Boost your daily activity and achieve your health goals to win valuable prizes.",
  status: "active",
  participants: 42,
  joined: false,
};

export const wellnessChallenges: WellnessChallenge[] = [
  {
    id: 2,
    icon: "water_drop",
    titleAr: "بطل الترطيب",
    titleEn: "Hydration Hero",
    descAr: "اشرب 8 أكواب ماء يوميًا وحافظ على نشاطك الذهني والبدني.",
    descEn: "Drink 8 glasses of water daily and maintain your mental and physical activity.",
    status: "active",
    daysLeft: 12,
    progress: 65,
    joined: true,
  },
  {
    id: 3,
    icon: "self_improvement",
    titleAr: "دقائق التأمل",
    titleEn: "Meditation Minutes",
    descAr: "خصص 10 دقائق يوميًا للتأمل وصفّي ذهنك لتعزيز التركيز.",
    descEn: "Dedicate 10 minutes daily for meditation and clear your mind to enhance focus.",
    status: "upcoming",
    daysLeft: 5,
    participants: 15,
    joined: false,
  },
];

export type LeaderboardEntry = {
  rank: number;
  nameAr: string;
  nameEn: string;
  deptAr: string;
  deptEn: string;
  points: number;
  initials: string;
};

export const weeklyLeaderboard: LeaderboardEntry[] = [
  { rank: 1, nameAr: "أحمد محمود", nameEn: "Ahmed Mahmoud", deptAr: "التسويق الرقمي", deptEn: "Digital Marketing", points: 850, initials: "أم" },
  { rank: 2, nameAr: "سارة خالد", nameEn: "Sarah Khaled", deptAr: "الموارد البشرية", deptEn: "Human Resources", points: 720, initials: "سخ" },
  { rank: 3, nameAr: "عمر مصطفى", nameEn: "Omar Mostafa", deptAr: "تطوير البرمجيات", deptEn: "Software Development", points: 680, initials: "عم" },
];
