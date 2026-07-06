# TODO — Nabd HR Admin (UI Only)

## المرحلة 1: فهم + هيكلة
- [x] إنشاء خطة تنفيذ تفصيلية
- [x] هيكلة المشروع الحالي (React/Vite + صفحات + mock-data موجود)
- [ ] ضبط RTL ثابت + خط عربي مريح

## المرحلة 2: Design Tokens + Shared Components
- [ ] نقل/توحيد tokens في Tailwind (tailwind.config.js) + استخدام tokens بدل inline عند الإمكان
- [ ] بناء مكتبة مكونات UI مشتركة:
  - [ ] Button
  - [ ] Card
  - [ ] Dialog/Modal
  - [ ] Input/Select/Textarea
  - [ ] Badge
  - [ ] Avatar
  - [ ] Toast/Notification + NotificationCenter
  - [ ] SkeletonLoader
  - [ ] EmptyState

## المرحلة 3: Mock Data المركزي
- [ ] توحيد exports في `src/mock-data/index.ts` لتصبح جميع البيانات مستوردة من مكان واحد
- [ ] التأكد أن الصفحات لن تحتوي hardcoded data

## المرحلة 4: Routing + الصفحات (0 → 12)
- [ ] إضافة/توحيد routes للصفحات (بدون backend):
  - [ ] 0 Landing
  - [ ] 1 Login
  - [ ] 2 Employee Dashboard
  - [ ] 3 Admin Dashboard
  - [ ] 4 Upload files
  - [ ] 5 Mood questions
  - [ ] 6 Reports
  - [ ] 7 Points & Rewards
  - [ ] 8 Sessions calendar
  - [ ] 9 Heart loader page
  - [ ] 10 Analytics & Monitoring
  - [ ] 11 Analytics/Monitoring (إن لزم كقسم مستقل وفق التصميم)
  - [ ] 12 Notification system
- [ ] تحديث الأقسام الحالية (Employee/Admin) لتطبيق حالات: loading/empty/data

## المرحلة 5: الدمج/اختبار
- [ ] فحص mobile-first + responsiveness
- [ ] التأكد من عدم وجود أي backend/API حقيقي
- [ ] تحديث README.md للتشغيل وهيكلة المشروع

## المرحلة 6: نهاية
- [ ] تشغيل `npm run dev` والتأكد بصريًا من كل route

