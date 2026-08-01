# TODO — Tasks Roadmap

## ✅ Completed

### System Foundation
- [x] Routing + هيكلة مجلدات + مكونات مشتركة
- [x] Supabase Schema + RLS
- [x] Auth حقيقية (Supabase + Mock)
- [x] رفع ملفات الموظفين (Upload)
- [x] Daily Mood Survey
- [x] Employee Dashboard real data
- [x] Admin Dashboard real data
- [x] Points & Rewards
- [x] Business flow completion (جلسات, تقارير, تحليلات, تنبيهات, إشعارات)

### Theme System (Dark/Light Mode)
- [x] Design tokens: `src/theme/tokens.ts` — darkC + lightC palettes
- [x] Theme context: `src/theme/ThemeContext.tsx` — `ThemeProvider` + `useTheme` hook
- [x] Theme toggle: `src/components/ThemeToggle.tsx`
- [x] CSS variables: `src/index.css` — `:root` + `[data-theme='light']` with all nabd-* vars
- [x] Tailwind config: colors use CSS vars, fonts include Tajawal/Cairo
- [x] Fonts: `src/styles/fonts.css` — Tajawal (Arabic primary), Cairo (headings), Sora (Latin), JetBrains Mono (mono)
- [x] `src/main.tsx` — wrapped with `<ThemeProvider>`

### Pages Updated with useTheme()
- [x] `src/components/AppShell.tsx` — `useTheme()` + HR/Employees/Leaves nav links
- [x] `src/components/AdminUI.tsx` — `useTheme()` for all components
- [x] `src/pages/EmployeeDashboard.tsx` — `useTheme()`
- [x] `src/pages/MoodQuestions.tsx` — `useTheme()`
- [x] `src/pages/PointsRewards.tsx` — `useTheme()`
- [x] `src/pages/SessionsCalendar.tsx` — `useTheme()`
- [x] `src/pages/NotificationSystem.tsx` — `useTheme()`
- [x] `src/pages/AdminDashboard.tsx` — `useTheme()`
- [x] `src/pages/AnalyticsMonitoring.tsx` — `useTheme()`
- [x] `src/pages/AnalyticsMonitoring2.tsx` — `useTheme()`
- [x] `src/pages/Reports.tsx` — `useTheme()`
- [x] `src/pages/HRDashboard.tsx` — `useTheme()`
- [x] `src/pages/Employees.tsx` — `useTheme()` (new HR page)
- [x] `src/pages/Leaves.tsx` — `useTheme()` (new HR page)
- [x] `src/pages/Landing.tsx` — `useTheme()`
- [x] `src/pages/Login.tsx` — `useTheme()`
- [x] `src/pages/Signup.tsx` — `useTheme()`

### HR Module (ربط التقنية بالموارد البشرية)
- [x] Mock data: `src/mock-data/hr.ts` — employeesHR, leaveRequests, wellbeingAbsenceInsights
- [x] Business logic: `src/lib/dashboardData.ts` — HR correlations in `getAdminDashboardSnapshot`
- [x] HR Dashboard: `src/pages/HRDashboard.tsx` — لوحة الموارد البشرية
- [x] Employees directory: `src/pages/Employees.tsx` — دليل الموظفين مع البحث
- [x] Leaves management: `src/pages/Leaves.tsx` — إدارة الإجازات
- [x] Routes: `src/App.tsx` — `/hr`, `/employees`, `/leaves` paths added

### Typography & Font Clarity
- [x] Fonts CSS: Tajawal (primary Arabic), Cairo (headings), Sora (Latin headings), JetBrains Mono (mono)
- [x] Tailwind: `fontFamily` includes `tajawal`, `cairo`, `sora`, `mono`
- [x] `index.css`: `html { font-size: 16px }`, `body { font-family: var(--font-ui); font-size: 15px }`
- [x] Better readability: `-webkit-font-smoothing: antialiased`, optimized line-height

### Build
- [x] `tsconfig.node.json` — fixed `composite: true` for project references

## 🔄 In Progress / Next
- [x] Run `npm run build` — passed (Vite 5.4.21, removed `--configLoader` option)
- [x] Final testing of all routes
- [ ] Deploy to Railway (if needed)
