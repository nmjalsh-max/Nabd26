// Mock data for HR module (employees directory, leaves, absence × wellbeing)

export type EmployeeHR = {
  id: string;
  name: string;
  department: string;
  role: string;
  joinDate: string;
  status: "stable" | "watch" | "critical";
  avgMood: number;
  absenceDays: number;
  email: string;
  /** Simple historical timeline of status changes (used by Kintsugi recovery medal) */
  statusHistory?: { status: "stable" | "watch" | "critical"; date: string }[];
};

export type LeaveRequest = {
  id: number;
  employee: string;
  department: string;
  type: string;
  from: string;
  to: string;
  days: number;
  status: "pending" | "approved" | "rejected";
  reason: string;
};

export const employeesHR: EmployeeHR[] = [
  { id: "u1", name: "سارة أحمد", department: "الهندسة", role: "مهندسة برمجيات", joinDate: "2021-03-14", status: "watch", avgMood: 3.8, absenceDays: 2, email: "sara@nabd.io", statusHistory: [{ status: "critical", date: "2026-01-10" }, { status: "watch", date: "2026-02-01" }] },
  { id: "u2", name: "أحمد خالد", department: "المبيعات", role: "مدير مبيعات", joinDate: "2020-07-01", status: "stable", avgMood: 4.2, absenceDays: 1, email: "ahmad@nabd.io", statusHistory: [{ status: "critical", date: "2025-11-05" }, { status: "watch", date: "2026-01-12" }, { status: "stable", date: "2026-02-20" }] },
  { id: "u3", name: "ليلى محمد", department: "الدعم", role: "ممثلة دعم", joinDate: "2022-01-10", status: "critical", avgMood: 2.9, absenceDays: 5, email: "laila@nabd.io" },
  { id: "u4", name: "خالد عمر", department: "الهندسة", role: "مطور أول", joinDate: "2019-11-20", status: "stable", avgMood: 4.4, absenceDays: 0, email: "khaled@nabd.io", statusHistory: [{ status: "watch", date: "2025-09-01" }, { status: "stable", date: "2025-11-15" }] },
  { id: "u5", name: "نورة سعد", department: "الموارد البشرية", role: "أخصائية HR", joinDate: "2021-09-05", status: "stable", avgMood: 4.1, absenceDays: 1, email: "noura@nabd.io" },
  { id: "u6", name: "عمر يوسف", department: "التسويق", role: "مصمم جرافيك", joinDate: "2023-02-14", status: "watch", avgMood: 3.5, absenceDays: 3, email: "omar@nabd.io", statusHistory: [{ status: "critical", date: "2026-01-25" }, { status: "watch", date: "2026-02-14" }] },
];

export const leaveRequests: LeaveRequest[] = [
  { id: 1, employee: "ليلى محمد", department: "الدعم", type: "إجازة مرضية", from: "2026-03-02", to: "2026-03-06", days: 4, status: "pending", reason: "إرهاق وضغط نفسي" },
  { id: 2, employee: "عمر يوسف", department: "التسويق", type: "إجازة سنوية", from: "2026-03-10", to: "2026-03-14", days: 5, status: "pending", reason: "إجازة سنوية" },
  { id: 3, employee: "أحمد خالد", department: "المبيعات", type: "إجازة سنوية", from: "2026-02-20", to: "2026-02-22", days: 3, status: "approved", reason: "إجازة" },
  { id: 4, employee: "نورة سعد", department: "الموارد البشرية", type: "إجازة يوم", from: "2026-03-08", to: "2026-03-08", days: 1, status: "approved", reason: "ظرف شخصي" },
  { id: 5, employee: "خالد عمر", department: "الهندسة", type: "إجازة سنوية", from: "2026-02-05", to: "2026-02-06", days: 2, status: "rejected", reason: "ضغط عمل" },
];

export const wellbeingAbsenceInsights = [
  {
    employee: "ليلى محمد",
    department: "الدعم",
    avgMood: 2.9,
    absenceDays: 5,
    insight: "مستوى معنويات منخفض مع غياب متكرر — يُنصح بتواصل داعم وتخفيف ضغط العمل",
  },
  {
    employee: "عمر يوسف",
    department: "التسويق",
    avgMood: 3.5,
    absenceDays: 3,
    insight: "معنويات متوسطة مع بداية ارتفاع غياب — يفضّل متابعة أسبوعية",
  },
  {
    employee: "سارة أحمد",
    department: "الهندسة",
    avgMood: 3.8,
    absenceDays: 2,
    insight: "حالة مستقرة مع بعض فترات التوتر — يمكن دعمها بجلسة استرخاء",
  },
];

