# TODO — Japanese-Inspired Features (Nabd Space)

## Order of implementation (light → heavy)

- [x] 1. Seasonal Calendar Banner (`seasonalCampaigns.ts` + `EmployeeDashboard.tsx`)
- [x] 2. Kintsugi Recovery Medal (`hr.ts` statusHistory + `HRDashboard.tsx` + `EmployeeDashboard.tsx` + `PointsRewards.tsx`)
- [x] 3. Radio Taiso Group Exercises (`sessions.ts` type + `SessionsCalendar.tsx`)
- [x] 4. Omoiyari Nudges (`HRDashboard.tsx`)
- [x] 5. Teinei Quiet Hours (`NotificationSystem.tsx`)
- [x] 6. Ikigai Quarterly Check (`ikigai.ts` + `IkigaiCheck.tsx` + route + nav)
- [x] 7. Kaizen Box (`kaizen.ts` + `KaizenBox.tsx` + route + nav)
- [x] 8. 4-Day Work Week Pilot (`AdminDashboard.tsx` + `AnalyticsMonitoring.tsx`)
- [x] Final: `npm run lint` + `npm run build`

---

## ✅ Completed (Original HR Roadmap)

- [x] TASK 1: Routing + هيكلة مجلدات + مكونات مشتركة
- [x] TASK 2: Supabase Schema + RLS
- [x] TASK 3: Auth حقيقية
- [x] TASK 4: رفع ملفات الموظفين
- [x] TASK 5: Daily Mood Survey
- [x] TASK 6: Employee Dashboard real data
- [x] TASK 7: Admin Dashboard real data
- [x] TASK 8: Points & Rewards
- [x] TASK 9–13: Business flow completion

---

## ✅ Font Clarity Fix (نوع وحجم الخط)

- [x] `fonts.css`: إضافة خط `IBM Plex Sans Arabic` أوضح للنصوص العربية + fallbacks
- [x] `index.css`: رفع حجم الخط الأساسي من `15px` إلى `16px` + `line-height` أفضل
- [x] `index.html`: جعل العربية RTL هي الافتراضية + `preconnect` لتحميل أسرع للخطوط
- [x] `main.tsx`: مزامنة `dir="rtl"` و `lang="ar"` افتراضياً
- [x] إضافة `.font-mono` و `.mono-value` و `.card-title` لتحسين وضوح الأرقام والعناوين

