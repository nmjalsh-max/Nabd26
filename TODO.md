# TODO — Nabd HR Admin (MVP)

## المرحلة 1: فهم + هيكلة
- [x] إنشاء خطة تنفيذ تفصيلية
- [x] إنشاء مجلدات المشروع: `src/components`, `src/mock-data`, `src/pages` (أو `src/app`), `src/theme`
- [x] تهيئة RTL كامل (تعديل `src/main.tsx` و/أو `src/index.css`)



## المرحلة 2: Design Tokens + Shared Components
- [ ] نقل لوحة الألوان والـtokens من `App.tsx` إلى `src/theme/*`
- [ ] إنشاء `<HeartLoader progress={n} />` داخل `src/components/HeartLoader.tsx`
- [ ] إنشاء مكونات حالات: Loading / Empty / Data (قابلة لإعادة الاستخدام)
- [ ] إنشاء shared UI cards (Stat/KPI/Card wrappers)

## المرحلة 3: Mock Data
- [ ] إنشاء `/mock-data` كامل بملفات متنوعة (موظفين، إدمن view، معنويات، نقاط، جلسات، إشعارات، uploads)
- [ ] إزالة hardcoded data من صفحات/مكوّنات واستخدام الاستيراد من `/mock-data`

## المرحلة 4: Routing + الصفحات (0 → 12)
- [ ] إضافة React Router وربط مسارات الصفحات
- [ ] بناء الصفحة 0: Landing
- [ ] بناء الصفحة 1: Login (UI فقط + toggle role + local validation)
- [ ] بناء الصفحة 2: Employee Dashboard
- [ ] بناء الصفحة 3: Admin Dashboard (privacy-friendly follow-up card)
- [ ] بناء الصفحة 4: Upload files page (drag&drop + preview mock + record mock)
- [ ] بناء الصفحة 5: Mood questions (5 أسئلة + Likert/emoji + شكر بعد الإكمال)
- [ ] بناء الصفحة 6: Reports (filters + export toast mock + charts preview)
- [ ] بناء الصفحة 7: Points & Rewards (ledger + badges + threshold animation)
- [ ] بناء الصفحة 8: Sessions calendar weekly view + local booking
- [ ] بناء الصفحة 10: Analytics & Monitoring (charts + heatmap-like + لطيف/غير وصمي)
- [ ] بناء الصفحة 12: Notification system + Notification Center + toasts

## المرحلة 5: دمج/اختبار
- [ ] التأكد من تطبيق حالات 3 لكل قسم فرعي
- [ ] التأكد من mobile-first + responsiveness
- [ ] التأكد من عدم وجود backend/API حقيقي
- [ ] تحديث `README.md` لشرح التشغيل وهيكلة المشروع

## المرحلة 6: نهاية
- [ ] تشغيل `npm run dev` والتأكد بصريًا من كل صفحة

