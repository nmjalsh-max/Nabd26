# TODO — Tasks Roadmap

- [x] TASK 1: Routing + هيكلة مجلدات + مكونات مشتركة
  - [x] تحديث `src/App.tsx` بحيث `/` يعرض Landing احترافيًا، و`*` يوجّه إلى `/`
  - [x] بناء Navigation موحد داخل `AppShell` حسب الدور (admin/employee)
  - [x] بناء Guards حقيقية حسب الدور (بعد ربط Auth بـ Supabase)
  - [x] إزالة الاعتماد على مسارات "يتيمة" بلا وصول داخلي

- [x] TASK 2: Supabase Schema + RLS
  - [x] إنشاء migration: `supabase/migrations/001_init_hr_schema.sql`
  - [x] تفعيل RLS + Policies تمنع الموظف من رؤية بيانات غيره

- [x] TASK 3: Auth حقيقية
  - [x] إنشاء `src/lib/supabaseClient.ts`
  - [x] استبدال `BootContext.tsx` ليقرأ session من Supabase
  - [x] تحديث `Login.tsx` باستخدام `signInWithPassword`
  - [x] إضافة "نسيت كلمة المرور" عبر `resetPasswordForEmail`
  - [x] توجيه تلقائي بعد الدخول حسب role
  - [x] حماية المسارات (موظف/أدمن)

- [x] TASK 4: رفع ملفات الموظفين
  - [x] تعديل `UploadFiles.tsx` ليرفع CSV/Excel إلى Supabase Storage
  - [x] parsing حقيقي + Preview + Validation
  - [x] upsert فعلي في `users` + إدخال سجل في `employee_uploads`

- [x] TASK 5: Daily Mood Survey
  - [x] شاشة 5 أسئلة مع حفظ يومي فعلي
  - [x] منع التكرار في نفس اليوم عبر `pulse_responses`
  - [x] إضافة نقاط في `points_ledger`
  - [x] شاشة شكر/تأكيد بعد الإرسال

- [x] TASK 6: Employee Dashboard real data
  - [x] قراءة نقاط وقيمة تقدم اليوم من `points_ledger`
  - [x] قراءة جلسات قادمة من `yoga_sessions`/`session_attendance`
  - [x] قراءة إشعارات من `notifications`

- [x] TASK 7: Admin Dashboard real data
  - [x] حساب نسبة المشاركة اليومية من `pulse_responses`
  - [x] جمع النقاط الموزعة من `points_ledger`
  - [x] عدد حالات المتابعة من `critical_alerts`

- [x] TASK 8: Points & Rewards
  - [x] حساب الرصيد الحقيقي من `points_ledger`
  - [x] إنشاء `user_rewards` عند الوصول للعُتبات
  - [x] إرسال إشعار مكافأة في `notifications`

- [x] TASK 9–13: Business flow completion
  - [x] جلسات يوغا واحتياطي booking/attendance
  - [x] تقارير + CSV/PDF export
  - [x] تحليل ورصد + تصنيف تلقائي
  - [x] تنبيهات علاجية/متابعة
  - [x] إشعارات Realtime + fallback

- [x] Testing
  - [x] `npm run lint` + `npm run build`
  - [x] اختبار: login/logout/role gates/upload/dashboard data flow (مع fallback Mock عند غياب Supabase)

