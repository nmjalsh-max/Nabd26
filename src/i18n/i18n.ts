export type Lang = "en" | "ar";

export const dict = {
  en: {
    brand: "Nabd",
    tagline: "Caring for employee morale — with calm and attention.",
    ctaLogin: "Login",
    landingTitle: "Welcome to Nabd Space",
    landingBody:
      "A UI-only MVP that helps teams support morale through gentle daily measurement, supportive follow-up, and motivating rewards.",

    loginTitle: "Sign in",
    loginSubtitle: "Unified interface — visual toggle between Employee/Admin.",
    roleEmployee: "Employee",
    roleAdmin: "Admin",
    identifierLabel: "Email or employee ID",
    passwordLabel: "Password",
    forgotPassword: "Forgot password? (mock)",
    submit: "Sign in",
    invalidData: "Invalid credentials. Please try again.",
    emptyIdentifier: "Please enter email or employee ID.",
    emptyPassword: "Please enter your password.",

    loginHint:
      "Mock credentials: employee emp1 / 1234 — admin admin / 1234",

    employeeTitle: "Employee dashboard",
    employeeSubtitle: "UI only — all data comes from Mock.",

    adminTitle: "Admin dashboard",
    adminSubtitle: "Non-stigmatizing UI — “needs outreach” wording.",

    notificationsLatest: "Latest notifications",
    sessionsNext: "Upcoming sessions",
    pointsBalance: "Points balance",
    moraleStatus: "Morale status",
  },
  ar: {
    brand: "نبض",
    tagline: "رعاية معنويات الموظفين — بهدوء واهتمام.",
    ctaLogin: "دخول",
    landingTitle: "مرحبًا بك في مساحة نبض",
    landingBody:
      "MVP واجهات فقط يساعد الفرق على رعاية معنويات الموظفين عبر قياس يومي لطيف، متابعة داعمة، ومكافآت تحفّز الاهتمام.",

    loginTitle: "تسجيل الدخول",
    loginSubtitle: "واجهة موحّدة — تمييز شكلي بين موظف/أدمن.",
    roleEmployee: "موظف",
    roleAdmin: "أدمن",
    identifierLabel: "البريد أو رقم الموظف",
    passwordLabel: "كلمة المرور",
    forgotPassword: "نسيت كلمة المرور؟ (شكلي)",
    submit: "دخول",
    invalidData: "بيانات غير صحيحة. جرّب مرة أخرى",
    emptyIdentifier: "الرجاء إدخال البريد/رقم وظيفي.",
    emptyPassword: "الرجاء إدخال كلمة المرور.",

    loginHint:
      "بيانات تجريبية: موظف emp1 / 1234 — أدمن admin / 1234",

    employeeTitle: "لوحة الموظف",
    employeeSubtitle: "واجهة UI فقط — جميع البيانات من Mock.",

    adminTitle: "لوحة الأدمن",
    adminSubtitle: "Non-stigmatizing UI — لغة داعمة “يحتاج تواصل”.",

    notificationsLatest: "آخر الإشعارات",
    sessionsNext: "مواعيد قريبة",
    pointsBalance: "رصيد النقاط",
    moraleStatus: "حالة المعنويات",
  },
} as const;

export const t = (lang: Lang, key: keyof typeof dict.en) => dict[lang][key];

