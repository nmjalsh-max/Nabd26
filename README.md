# Nabd Space — HR Admin (MVP)

مشروع React + TypeScript + Vite جاهز للفتح والتطوير على **Visual Studio Code**.

---

## 1) تشغيل المشروع على VS Code

### المتطلبات
- [Node.js](https://nodejs.org) الإصدار 18 أو أحدث (يشمل npm).
- Visual Studio Code.

### خطوات التشغيل
```bash
# 1. فك ضغط المجلد ثم افتحه في VS Code
code nabd-hr-admin

# 2. من الطرفية المدمجة في VS Code (Ctrl + `)، ثبّت الحزم:
npm install

# 3. شغّل خادم التطوير:
npm run dev
```
سيفتح المتصفح تلقائياً على `http://localhost:5173` وسترى اللوحة تعمل مباشرة (شاشة التحميل ثم الداشبورد).

### أوامر أخرى مفيدة
| الأمر            | الوظيفة                                   |
|------------------|--------------------------------------------|
| `npm run dev`    | تشغيل بيئة التطوير مع Hot Reload           |
| `npm run build`  | بناء نسخة إنتاج جاهزة للنشر (`dist/`)      |
| `npm run preview`| معاينة نسخة الإنتاج محلياً                 |
| `npm run lint`   | فحص الكود بـ ESLint                        |

### بنية المشروع
```
nabd-hr-admin/
├── src/
│   ├── App.tsx      ← كل مكوّنات اللوحة (Dashboard, Team, Analytics, Programs, Settings)
│   ├── main.tsx     ← نقطة الدخول
│   └── index.css    ← Tailwind
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── CLAUDE.md        ← ملف سياق للمساعد الذكي (انظر القسم 2)
└── .vscode/         ← إعدادات وامتدادات مقترحة لـ VS Code
```

---

## 2) المساعد الذكي لكتابة الأكواد والتحسينات

بدل بناء أداة منفصلة، أفضل طريقة عملية ومباشرة هي استخدام **Claude Code** من Anthropic
— وهو أداة برمجة وكيلية (agentic) تعمل داخل VS Code وتقرأ مشروعك بالكامل وتكتب/تعدّل
الأكواد فعلياً على القرص (وليس مجرد اقتراحات نصية).

### التثبيت داخل VS Code
1. افتح لوحة الإضافات: `Ctrl+Shift+X` (Windows/Linux) أو `Cmd+Shift+X` (Mac).
2. ابحث عن **"Claude Code"** (الناشر: Anthropic) واضغط **Install**.
3. بعد التثبيت ستظهر أيقونة Spark ✱ في شريط الأدوات — اضغط عليها لفتح لوحة المحادثة.
4. سجّل الدخول بحساب Claude.ai (اشتراك Pro/Max) أو بمفتاح API من Anthropic Console.

### كيف يفهم المشروع تلقائياً؟
أضفنا ملف **`CLAUDE.md`** في جذر المشروع — يقرأه Claude Code تلقائياً في كل جلسة،
ويحتوي على: المكدس التقني، قواعد الأسلوب، هيكل الملفات، وقائمة تحسينات مقترحة.
هذا يعني أن أي طلب توجهه للمساعد سيُنفَّذ متوافقاً مع تصميم اللوحة الحالي (الألوان،
الخطوط، أسلوب التقسيم) دون أن تشرح ذلك في كل مرة.

### أمثلة على طلبات يمكنك كتابتها في لوحة Claude Code
- "قسّم App.tsx إلى ملفات منفصلة تحت src/components وsrc/data مع الحفاظ على نفس السلوك"
- "أضف React Router بحيث يكون لكل تبويب رابط مستقل (/dashboard, /team, ...)"
- "اربط تبويب Team wellbeing بـ API حقيقي عبر fetch بدلاً من البيانات الوهمية"
- "أضف دعم اللغة العربية RTL كامل للوحة"
- "اكتب اختبارات Vitest لمكوّن KPICard وTrendBadge"

Claude Code سيعرض لك كل تعديل كـ **diff** جنباً إلى جنب قبل التطبيق، وتستطيع القبول أو
الرفض أو طلب تعديل آخر لكل تغيير.

### إن كنت تفضّل عدم تثبيت امتداد
يمكنك استخدام Claude Code من الطرفية مباشرة بدون الامتداد:
```bash
npm install -g @anthropic-ai/claude-code
claude
```
شغّله من داخل مجلد المشروع في طرفية VS Code المدمجة، وسيقرأ `CLAUDE.md` بنفس الطريقة.

📖 التوثيق الرسمي: https://docs.claude.com/en/docs/claude-code/overview
