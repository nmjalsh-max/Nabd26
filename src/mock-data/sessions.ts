export const sessionsMock = {
  radioTaiso: true,
  nextSessions: [
    { id: "s1", title: "Morning Yoga Session", time: "Sun · 7:30 AM", mode: "In-person", coach: "Coach Khalid", duration: "45 minutes" },
    { id: "s2", title: "Stress Management Workshop", time: "Tue · 1:00 PM", mode: "Virtual", coach: "Coach Noura", duration: "60 minutes" },
    { id: "s3", title: "1:1 Consultation Slots", time: "Wed · open slots", mode: "Virtual", coach: "Behavioral Specialist", duration: "30 minutes" },
    { id: "s4", title: "Midday Reset Break", time: "Daily · 3:00 PM", mode: "In-person", coach: "Wellbeing Team", duration: "20 minutes" },
  ],
  calendarWeeks: [
    { day: "Sunday", items: ["s1"] },
    { day: "Monday", items: [] },
    { day: "Tuesday", items: ["s2"] },
    { day: "Wednesday", items: ["s3"] },
    { day: "Thursday", items: [] },
    { day: "Friday", items: [] },
    { day: "Saturday", items: [] },
  ],
};

