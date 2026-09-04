export const uploadsMock = {
  previewColumns: ["الاسم", "رقم وظيفي", "القسم", "بريد"] as const,
  rows: [
    { name: "سارة أحمد", id: "EMP-1021", dept: "التسويق", email: "sarah@email.com" },
    { name: "محمد علي", id: "EMP-0987", dept: "الهندسة", email: "mohamed@email.com" },
    { name: "ليلى حسن", id: "EMP-1110", dept: "الدعم", email: "laila@email.com" },
  ],
  validation: [
    { kind: "صف مكرر", row: 2, message: "تم العثور على رقم وظيفي مكرر" },
    { kind: "حقل ناقص", row: 3, message: "القسم غير موجود في السطر 3" },
  ],
  history: [
    { id: "u1", fileName: "employees_march.csv", time: "قبل يوم", status: "تم" },
    { id: "u2", fileName: "staff_export.xlsx", time: "قبل أسبوع", status: "تم" },
  ],
};

