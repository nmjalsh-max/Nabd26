import { getSupabaseClient } from "./supabaseClient";

export const DAILY_MOOD_QUESTIONS = [
  {
    key: "daily_energy",
    label: "كيف تقيّم مستوى طاقتك اليوم؟",
  },
  {
    key: "daily_stress",
    label: "كم شعرت بالتوتر أو الضغط خلال يومك؟ (1 = ضغط عالٍ، 5 = هادئ)",
  },
  {
    key: "daily_focus",
    label: "كيف كانت قدرتك على التركيز في مهامك اليوم؟",
  },
  {
    key: "daily_support",
    label: "إلى أي درجة شعرت بالدعم من زملائك/مديرك اليوم؟",
  },
  {
    key: "daily_mood",
    label: "بشكل عام، كيف تصف حالتك المزاجية اليوم؟",
  },
] as const;

const DAILY_PULSE_POINTS = 25;
const REWARD_THRESHOLD = 500;
const STORAGE_KEY = "daily_mood_snapshot";

export type DailyMoodAnswerPayload = {
  questionKey: string;
  value: number;
};

export async function hasCompletedDailyMoodForUser(userId: string | null) {
  const client = getSupabaseClient();

  if (!client || !userId) {
    const today = new Date().toISOString().slice(0, 10);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;

    const parsed = JSON.parse(raw) as Record<string, string[]>;
    return Boolean(parsed[today]?.includes(userId ?? ""));
  }

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const { data, error } = await client
    .from("pulse_responses")
    .select("id")
    .eq("user_id", userId)
    .gte("created_at", start.toISOString())
    .lt("created_at", end.toISOString());

  if (error) {
    return false;
  }

  return Boolean(data?.length);
}

export async function saveDailyMoodAnswers(userId: string | null, answers: DailyMoodAnswerPayload[]) {
  const client = getSupabaseClient();

  if (!client || !userId) {
    const today = new Date().toISOString().slice(0, 10);
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, string[]>) : {};
    const users = parsed[today] ?? [];
    if (!users.includes(userId ?? "")) {
      parsed[today] = [...users, userId ?? ""];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }

    return { pointsEarned: DAILY_PULSE_POINTS, saved: true, mock: true };
  }

  const todayCompleted = await hasCompletedDailyMoodForUser(userId);
  if (todayCompleted) {
    return { pointsEarned: 0, saved: false, mock: false, alreadyAnswered: true };
  }

  const questionCatalog = await Promise.all(
    DAILY_MOOD_QUESTIONS.map(async (question) => {
      const { data, error } = await client
        .from("pulse_questions")
        .upsert(
          {
            question_key: question.key,
            question_text: question.label,
            is_active: true,
          },
          { onConflict: "question_key" }
        )
        .select("id")
        .single();

      if (error || !data?.id) {
        return null;
      }

      return { key: question.key, id: data.id };
    })
  );

  const resolvedCatalog = questionCatalog.filter(Boolean) as Array<{ key: string; id: number }>;

  const answerRows = answers.map((answer) => {
    const match = resolvedCatalog.find((item) => item.key === answer.questionKey);
    return match
      ? {
          user_id: userId,
          pulse_question_id: match.id,
          response_value: answer.value,
          response_text: String(answer.value),
        }
      : null;
  });

  const validRows = answerRows.filter(Boolean) as Array<{
    user_id: string;
    pulse_question_id: number;
    response_value: number;
    response_text: string;
  }>;

  if (validRows.length) {
    await client.from("pulse_responses").insert(validRows);
  }

  await client.from("points_ledger").insert([
    {
      user_id: userId,
      points_delta: DAILY_PULSE_POINTS,
      reason: "daily_mood_checkin",
    },
  ]);

  await client.from("notifications").insert([
    {
      user_id: userId,
      type: "achievement",
      title: "تمت إضافة نقاط المقياس اليومي",
      body: `تمت إضافة ${DAILY_PULSE_POINTS} نقطة لقياس اليوم، شكراً لك!`,
      is_read: false,
    },
  ]);

  return { pointsEarned: DAILY_PULSE_POINTS, saved: true, mock: false };
}

export async function getEmployeeDashboardSnapshot(userId: string | null) {
  const client = getSupabaseClient();

  if (!client || !userId) {
    return {
      pointsBalance: 420,
      nextThreshold: 500,
      progressPct: 84,
      completion: false,
      sessions: [
        { id: 1, title: "يوغا هادئة", mode: "Online", coach: "سارة", time: "غدًا 18:00" },
        { id: 2, title: "تنفس جماعي", mode: "Hybrid", coach: "أحمد", time: "بعد غد 15:00" },
      ],
      notifications: [
        { id: "n1", type: "تذكير", title: "أكمل مقياس اليوم", time: "قبل ساعة", unread: true },
      ],
    };
  }

  const { data: pointsData } = await client.from("points_ledger").select("points_delta").eq("user_id", userId);
  const balance = (pointsData ?? []).reduce((sum, item) => sum + Number(item.points_delta ?? 0), 0);

  const completion = await hasCompletedDailyMoodForUser(userId);

  const { data: attendanceData } = await client
    .from("session_attendance")
    .select("session_id, status")
    .eq("user_id", userId)
    .limit(3);

  const sessionIds = (attendanceData ?? []).map((item) => item.session_id).filter(Boolean);
  const sessionsQuery = sessionIds.length
    ? await client.from("yoga_sessions").select("id, title, mode, coach, starts_at").in("id", sessionIds)
    : { data: [] as Array<Record<string, unknown>> };

  const { data: notificationsData } = await client
    .from("notifications")
    .select("id, type, title, created_at, is_read")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(3);

  return {
    pointsBalance: balance,
    nextThreshold: REWARD_THRESHOLD,
    progressPct: Math.min(100, Math.round((balance / REWARD_THRESHOLD) * 100)),
    completion,
    sessions: (sessionsQuery.data ?? []).map((session) => ({
      id: session.id,
      title: String(session.title ?? "جلسة"),
      mode: String(session.mode ?? "Online"),
      coach: String(session.coach ?? "مدرب"),
      time: new Date(String(session.starts_at ?? new Date())).toLocaleString("ar-SA"),
    })),
    notifications: (notificationsData ?? []).map((item) => ({
      id: item.id,
      type: String(item.type ?? "notification"),
      title: String(item.title ?? "إشعار"),
      time: new Date(String(item.created_at ?? new Date())).toLocaleString("ar-SA"),
      unread: !item.is_read,
    })),
  };
}

export async function getAdminDashboardSnapshot() {
  const client = getSupabaseClient();

  if (!client) {
    return {
      participationRate: 54,
      totalPointsDistributed: 1240,
      followUpCount: 5,
      trendNotes: ["مشاركة اليوم مرتفعة", "عدد نقاط التفاعل جيد"],
    };
  }

  const { data: usersData } = await client.from("users").select("id").eq("role", "employee");
  const employeeCount = usersData?.length ?? 0;

  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const { data: pulseData } = await client
    .from("pulse_responses")
    .select("user_id")
    .gte("created_at", start.toISOString())
    .lt("created_at", end.toISOString());

  const uniqueResponders = new Set((pulseData ?? []).map((item) => item.user_id)).size;
  const participationRate = employeeCount ? Math.round((uniqueResponders / employeeCount) * 100) : 0;

  const { data: pointsData } = await client.from("points_ledger").select("points_delta");
  const totalPointsDistributed = (pointsData ?? []).reduce((sum, item) => sum + Number(item.points_delta ?? 0), 0);

  const { data: alertsData } = await client.from("critical_alerts").select("id").eq("is_resolved", false);
  const followUpCount = alertsData?.length ?? 0;

  return {
    participationRate,
    totalPointsDistributed,
    followUpCount,
    trendNotes: [
      `مشاركة اليوم: ${participationRate}%`,
      `إجمالي النقاط الموزعة: ${totalPointsDistributed}`,
    ],
  };
}

export async function getPointsRewardsSnapshot(userId: string | null) {
  const client = getSupabaseClient();

  if (!client || !userId) {
    return {
      currentPoints: 420,
      nextThreshold: REWARD_THRESHOLD,
      progressPct: 84,
      ledger: [
        { id: "p1", at: "قبل يومين", type: "مقياس يومي", delta: 20 },
        { id: "p2", at: "قبل يوم", type: "حضور جلسة", delta: 50 },
      ],
      rewards: [
        { id: "b1", name: "خطوة لطيفة", at: 300, achieved: true },
        { id: "b2", name: "منتظم بالقياس", at: 400, achieved: true },
        { id: "b3", name: "شهادة الرفاه", at: 500, achieved: false },
      ],
      rewardUnlocked: false,
    };
  }

  const { data: pointsData } = await client.from("points_ledger").select("id, points_delta, reason, created_at").eq("user_id", userId).order("created_at", { ascending: false });
  const ledger = (pointsData ?? []).map((item) => ({
    id: item.id,
    at: new Date(String(item.created_at ?? new Date())).toLocaleString("ar-SA"),
    type: String(item.reason ?? "activity"),
    delta: Number(item.points_delta ?? 0),
  }));

  const currentPoints = ledger.reduce((sum, item) => sum + item.delta, 0);
  const progressPct = Math.min(100, Math.round((currentPoints / REWARD_THRESHOLD) * 100));

  const { data: existingRewards } = await client
    .from("user_rewards")
    .select("reward_id")
    .eq("user_id", userId);

  const achievedRewardIds = new Set((existingRewards ?? []).map((item) => item.reward_id));

  const { data: rewardRows } = await client.from("rewards").select("id, title, points_cost").order("points_cost", { ascending: true });
  const rewards = (rewardRows ?? []).map((item) => ({
    id: item.id,
    name: String(item.title ?? "Reward"),
    at: Number(item.points_cost ?? 0),
    achieved: currentPoints >= Number(item.points_cost ?? 0),
  }));

  const rewardUnlocked = currentPoints >= REWARD_THRESHOLD && !achievedRewardIds.has(rewards.find((reward) => reward.at >= REWARD_THRESHOLD)?.id ?? -1);

  if (rewardUnlocked && rewardRows?.length) {
    const thresholdReward = rewardRows.find((item) => Number(item.points_cost ?? 0) >= REWARD_THRESHOLD)
      ?? rewardRows[rewardRows.length - 1];

    if (thresholdReward) {
      await client.from("user_rewards").insert([
        {
          user_id: userId,
          reward_id: Number(thresholdReward.id),
          status: "earned",
        },
      ]);

      await client.from("notifications").insert([
        {
          user_id: userId,
          type: "reward",
          title: "تمت مكافأتك تلقائيًا",
          body: `وصلت إلى عتبة ${REWARD_THRESHOLD} نقطة وفتح لك مكافأة جديدة.`,
          is_read: false,
        },
      ]);
    }
  }

  return {
    currentPoints,
    nextThreshold: REWARD_THRESHOLD,
    progressPct,
    ledger,
    rewards,
    rewardUnlocked,
  };
}

export type SessionCalendarEntry = {
  id: number;
  title: string;
  mode: string;
  coach: string;
  time: string;
  seatsLeft: number;
  capacity: number;
};

export async function getSessionCalendarSnapshot() {
  const client = getSupabaseClient();

  if (!client) {
    return {
      sessions: [
        { id: 1, title: "يوغا هادئة", mode: "Online", coach: "سارة", time: "غدًا 18:00", seatsLeft: 9, capacity: 12 },
        { id: 2, title: "تنفس جماعي", mode: "Hybrid", coach: "أحمد", time: "بعد غد 15:00", seatsLeft: 6, capacity: 10 },
      ] satisfies SessionCalendarEntry[],
    };
  }

  const { data: sessionsData, error: sessionsError } = await client
    .from("yoga_sessions")
    .select("id, title, mode, coach, starts_at, capacity")
    .eq("is_active", true)
    .order("starts_at", { ascending: true });

  if (sessionsError || !sessionsData?.length) {
    return { sessions: [] as SessionCalendarEntry[] };
  }

  const { data: attendanceData } = await client
    .from("session_attendance")
    .select("session_id")
    .in("session_id", sessionsData.map((item) => Number(item.id)));

  const occupancyBySession = new Map<number, number>();
  for (const row of attendanceData ?? []) {
    const sessionId = Number(row.session_id ?? 0);
    if (!sessionId) continue;
    occupancyBySession.set(sessionId, (occupancyBySession.get(sessionId) ?? 0) + 1);
  }

  return {
    sessions: sessionsData.map((session) => {
      const sessionId = Number(session.id ?? 0);
      const capacity = Number(session.capacity ?? 0);
      const registered = occupancyBySession.get(sessionId) ?? 0;

      return {
        id: sessionId,
        title: String(session.title ?? "جلسة"),
        mode: String(session.mode ?? "Online"),
        coach: String(session.coach ?? "مدرب"),
        time: new Date(String(session.starts_at ?? new Date())).toLocaleString("ar-SA"),
        seatsLeft: Math.max(0, capacity - registered),
        capacity,
      } satisfies SessionCalendarEntry;
    }),
  };
}

export type ReportPeriod = "weekly" | "monthly" | "yearly";

export type ReportRow = {
  department: string;
  average: number;
  status: "stable" | "watch" | "critical";
  participants: number;
};

export type ReportSnapshot = {
  rows: ReportRow[];
  summary: {
    totalEmployees: number;
    avgMood: number;
    criticalCount: number;
  };
};

function buildReportStatus(average: number): ReportRow["status"] {
  if (average >= 4) return "stable";
  if (average >= 3) return "watch";
  return "critical";
}

function buildReportRange(period: ReportPeriod) {
  const now = new Date();
  const days = period === "weekly" ? 7 : period === "monthly" ? 30 : 365;
  const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return start;
}

export async function getReportsSnapshot(period: ReportPeriod): Promise<ReportSnapshot> {
  const client = getSupabaseClient();

  if (!client) {
    return {
      rows: [
        { department: "العمليات", average: 3.9, status: "watch", participants: 14 },
        { department: "المبيعات", average: 4.2, status: "stable", participants: 11 },
        { department: "الهندسة", average: 3.5, status: "watch", participants: 18 },
      ],
      summary: {
        totalEmployees: 43,
        avgMood: 3.9,
        criticalCount: 1,
      },
    };
  }

  const { data: employeeRows } = await client.from("users").select("id, department").eq("role", "employee");
  const employees = (employeeRows ?? []).map((row) => ({
    id: String(row.id),
    department: String(row.department ?? "غير محدد"),
  }));

  const rangeStart = buildReportRange(period).toISOString();
  const { data: pulseRows } = await client
    .from("pulse_responses")
    .select("user_id, response_value, created_at")
    .gte("created_at", rangeStart);

  const departmentStats = new Map<string, { total: number; count: number; users: Set<string> }>();
  const allValues: number[] = [];

  for (const employee of employees) {
    if (!departmentStats.has(employee.department)) {
      departmentStats.set(employee.department, { total: 0, count: 0, users: new Set() });
    }
  }

  for (const row of pulseRows ?? []) {
    const userId = String(row.user_id ?? "");
    const department = employees.find((employee) => employee.id === userId)?.department ?? "غير محدد";
    const value = Number(row.response_value ?? 0);

    if (!Number.isFinite(value)) continue;

    allValues.push(value);
    const stat = departmentStats.get(department) ?? { total: 0, count: 0, users: new Set<string>() };
    stat.total += value;
    stat.count += 1;
    stat.users.add(userId);
    departmentStats.set(department, stat);
  }

  const rows = Array.from(departmentStats.entries()).map(([department, stat]) => ({
    department,
    average: stat.count ? stat.total / stat.count : 0,
    status: buildReportStatus(stat.count ? stat.total / stat.count : 0),
    participants: stat.users.size,
  }));

  const criticalCount = rows.filter((row) => row.status === "critical").length;
  const avgMood = allValues.length ? allValues.reduce((sum, value) => sum + value, 0) / allValues.length : 0;

  return {
    rows: rows.sort((a, b) => b.average - a.average),
    summary: {
      totalEmployees: employees.length,
      avgMood,
      criticalCount,
    },
  };
}

export function buildReportCsv(rows: ReportRow[]) {
  const header = ["department", "average", "status", "participants"].join(",");
  const body = rows
    .map((row) => [row.department, row.average.toFixed(1), row.status, row.participants].join(","))
    .join("\n");
  return `${header}\n${body}`;
}

export function buildReportPdf(rows: ReportRow[], period: ReportPeriod) {
  const summaryLines = rows.map((row) => `- ${row.department}: ${row.average.toFixed(1)} | ${row.status} | ${row.participants} مشارك`);
  return `Nabd HR Report (${period})\n${summaryLines.join("\n")}`;
}

export type NotificationFeedItem = {
  id: string;
  type: string;
  title: string;
  time: string;
  unread: boolean;
};

export async function getNotificationSnapshot(userId: string | null) {
  const client = getSupabaseClient();

  if (!client || !userId) {
    return {
      items: [
        { id: "n1", type: "تذكير", title: "أكمل مقياس اليوم", time: "قبل ساعة", unread: true },
        { id: "n2", type: "جلسة", title: "جلسة يوغا قادمة خلال 2 ساعات", time: "اليوم 14:00", unread: false },
      ] satisfies NotificationFeedItem[],
    };
  }

  const { data, error } = await client
    .from("notifications")
    .select("id, type, title, created_at, is_read")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    return { items: [] as NotificationFeedItem[] };
  }

  return {
    items: (data ?? []).map((item) => ({
      id: String(item.id ?? `${Date.now()}-${Math.random()}`),
      type: String(item.type ?? "notification"),
      title: String(item.title ?? "إشعار جديد"),
      time: new Date(String(item.created_at ?? new Date())).toLocaleString("ar-SA"),
      unread: !item.is_read,
    })) satisfies NotificationFeedItem[],
  };
}

export type AnalyticsSnapshot = {
  trend: Array<{ label: string; value: number }>;
  departmentComparison: Array<{ department: string; score: number }>;
  classifications: Array<{ user: string; department: string; status: ReportRow["status"]; average: number }>;
};

export async function getAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
  const client = getSupabaseClient();

  if (!client) {
    return {
      trend: [
        { label: "Mon", value: 3.8 },
        { label: "Tue", value: 4.0 },
        { label: "Wed", value: 3.9 },
        { label: "Thu", value: 4.1 },
        { label: "Fri", value: 3.7 },
      ],
      departmentComparison: [
        { department: "الهندسة", score: 3.9 },
        { department: "المبيعات", score: 4.1 },
        { department: "الدعم", score: 3.7 },
      ],
      classifications: [
        { user: "سارة", department: "الهندسة", status: "watch", average: 3.8 },
        { user: "أحمد", department: "المبيعات", status: "stable", average: 4.2 },
        { user: "ليلى", department: "الدعم", status: "critical", average: 2.9 },
      ],
    };
  }

  const { data: usersData } = await client.from("users").select("id, full_name, department").eq("role", "employee");
  const employeeMap = new Map((usersData ?? []).map((row) => [String(row.id), { fullName: String(row.full_name ?? "Employee"), department: String(row.department ?? "غير محدد") }]));

  const rangeStart = new Date();
  rangeStart.setDate(rangeStart.getDate() - 7);

  const { data: pulseRows } = await client
    .from("pulse_responses")
    .select("user_id, response_value, created_at")
    .gte("created_at", rangeStart.toISOString())
    .order("created_at", { ascending: true });

  const trendMap = new Map<string, { total: number; count: number }>();
  const departmentMap = new Map<string, { total: number; count: number }>();
  const classificationMap = new Map<string, { total: number; count: number; department: string; user: string }>();

  for (const row of pulseRows ?? []) {
    const userId = String(row.user_id ?? "");
    const profile = employeeMap.get(userId);
    const value = Number(row.response_value ?? 0);
    if (!profile || !Number.isFinite(value)) continue;

    const bucket = new Date(String(row.created_at ?? new Date())).toISOString().slice(0, 10);
    const existingTrend = trendMap.get(bucket) ?? { total: 0, count: 0 };
    existingTrend.total += value;
    existingTrend.count += 1;
    trendMap.set(bucket, existingTrend);

    const departmentEntry = departmentMap.get(profile.department) ?? { total: 0, count: 0 };
    departmentEntry.total += value;
    departmentEntry.count += 1;
    departmentMap.set(profile.department, departmentEntry);

    const existingClassification = classificationMap.get(userId) ?? { total: 0, count: 0, department: profile.department, user: profile.fullName };
    existingClassification.total += value;
    existingClassification.count += 1;
    classificationMap.set(userId, existingClassification);
  }

  const trend = Array.from(trendMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-5)
    .map(([label, stat]) => ({ label, value: stat.count ? stat.total / stat.count : 0 }));

  const departmentComparison = Array.from(departmentMap.entries())
    .map(([department, stat]) => ({ department, score: stat.count ? stat.total / stat.count : 0 }))
    .sort((a, b) => b.score - a.score);

  const classifications = Array.from(classificationMap.values())
    .map((item) => ({
      user: item.user,
      department: item.department,
      status: buildReportStatus(item.count ? item.total / item.count : 0),
      average: item.count ? item.total / item.count : 0,
    }))
    .slice(0, 5);

  return {
    trend,
    departmentComparison,
    classifications,
  };
}
