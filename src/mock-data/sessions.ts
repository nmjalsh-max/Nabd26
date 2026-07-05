export const sessionsMock = {
  nextSessions: [
    { id: "s1", title: "جلسة يوغا صباحية", time: "Sun · 7:30 AM", mode: "In-person", coach: "مدرب خالد", duration: "45 دقيقة" },
    { id: "s2", title: "ورشة إدارة التوتر", time: "Tue · 1:00 PM", mode: "Virtual", coach: "مدربة نور", duration: "60 دقيقة" },
    { id: "s3", title: "مواعيد استشارة 1:1", time: "Wed · open slots", mode: "Virtual", coach: "اختصاصي سلوكي", duration: "30 دقيقة" },
    { id: "s4", title: "استراحة يقظة منتصف اليوم", time: "Daily · 3:00 PM", mode: "In-person", coach: "فريق الرفاه", duration: "20 دقيقة" },
  ],
  calendarWeeks: [
    { day: "الأحد", items: ["s1"] },
    { day: "الإثنين", items: [] },
    { day: "الثلاثاء", items: ["s2"] },
    { day: "الأربعاء", items: ["s3"] },
    { day: "الخميس", items: [] },
    { day: "الجمعة", items: [] },
    { day: "السبت", items: [] },
  ],
};

