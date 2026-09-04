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
  { id: "u1", name: "Sara Ahmed", department: "Engineering", role: "Software Engineer", joinDate: "2021-03-14", status: "watch", avgMood: 3.8, absenceDays: 2, email: "sara@nabd.io", statusHistory: [{ status: "critical", date: "2026-01-10" }, { status: "watch", date: "2026-02-01" }] },
  { id: "u2", name: "Ahmed Khalid", department: "Sales", role: "Sales Manager", joinDate: "2020-07-01", status: "stable", avgMood: 4.2, absenceDays: 1, email: "ahmad@nabd.io", statusHistory: [{ status: "critical", date: "2025-11-05" }, { status: "watch", date: "2026-01-12" }, { status: "stable", date: "2026-02-20" }] },
  { id: "u3", name: "Laila Mohamed", department: "Support", role: "Support Representative", joinDate: "2022-01-10", status: "critical", avgMood: 2.9, absenceDays: 5, email: "laila@nabd.io" },
  { id: "u4", name: "Khaled Omar", department: "Engineering", role: "Senior Developer", joinDate: "2019-11-20", status: "stable", avgMood: 4.4, absenceDays: 0, email: "khaled@nabd.io", statusHistory: [{ status: "watch", date: "2025-09-01" }, { status: "stable", date: "2025-11-15" }] },
  { id: "u5", name: "Noura Saad", department: "Human Resources", role: "HR Specialist", joinDate: "2021-09-05", status: "stable", avgMood: 4.1, absenceDays: 1, email: "noura@nabd.io" },
  { id: "u6", name: "Omar Youssef", department: "Marketing", role: "Graphic Designer", joinDate: "2023-02-14", status: "watch", avgMood: 3.5, absenceDays: 3, email: "omar@nabd.io", statusHistory: [{ status: "critical", date: "2026-01-25" }, { status: "watch", date: "2026-02-14" }] },
];

export const leaveRequests: LeaveRequest[] = [
  { id: 1, employee: "Laila Mohamed", department: "Support", type: "Medical Leave", from: "2026-03-02", to: "2026-03-06", days: 4, status: "pending", reason: "Mental fatigue and work pressure" },
  { id: 2, employee: "Omar Youssef", department: "Marketing", type: "Annual Leave", from: "2026-03-10", to: "2026-03-14", days: 5, status: "pending", reason: "Annual leave" },
  { id: 3, employee: "Ahmed Khalid", department: "Sales", type: "Annual Leave", from: "2026-02-20", to: "2026-02-22", days: 3, status: "approved", reason: "Vacation" },
  { id: 4, employee: "Noura Saad", department: "Human Resources", type: "Day Off", from: "2026-03-08", to: "2026-03-08", days: 1, status: "approved", reason: "Personal matter" },
  { id: 5, employee: "Khaled Omar", department: "Engineering", type: "Annual Leave", from: "2026-02-05", to: "2026-02-06", days: 2, status: "rejected", reason: "Workload pressure" },
];

export const wellbeingAbsenceInsights = [
  {
    employee: "Laila Mohamed",
    department: "Support",
    avgMood: 2.9,
    absenceDays: 5,
    insight: "Low morale with recurring absences — supportive follow-up and workload reduction are recommended.",
  },
  {
    employee: "Omar Youssef",
    department: "Marketing",
    avgMood: 3.5,
    absenceDays: 3,
    insight: "Moderate morale with early absence growth — weekly follow-up is recommended.",
  },
  {
    employee: "Sara Ahmed",
    department: "Engineering",
    avgMood: 3.8,
    absenceDays: 2,
    insight: "Stable status with some stress periods — a relaxation session could help.",
  },
];

