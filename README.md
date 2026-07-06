# Nabd Space — HR Admin (UI Only)

واجهة داخلية لإدارة بيانات الموظفين ومتابعة معنوياتهم النفسية.

> هذه المرحلة **UI فقط** باستخدام **Mock Data** (لا يوجد Backend / Supabase في هذه النسخة).

## تشغيل المشروع محليًا

```bash
npm install
npm run dev
```
ثم افتح الرابط الذي يظهر في الطرفية (غالبًا `http://localhost:5173`).

## الهيكلة (ملخص)
- `src/theme/tokens.ts`: Design tokens (لوحة الألوان والحالات)
- `src/components/`: Shared UI primitives مثل `HeartLoader` و `DataState`
- `src/mock-data/`: كل البيانات وهمية ومنظمة لكل كيان
- `src/pages/`: الصفحات الحالية + التوسعة لاحقًا
- `src/i18n/`: دعم لغة عربية/إنجليزية (RTL)

## ملاحظة RTL/الخط
- تم تفعيل اتجاه الصفحة `rtl` وافتراضيًا في `src/main.tsx`
- الخطوط العربية/الإنجليزية في `src/styles/fonts.css`

