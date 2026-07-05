import { companyTrend } from "./analytics";

export const reportsMock = {
  charts: {
    trend: companyTrend,
  },
  tableRows: [
    { employee: "أحمد", dept: "Engineering", avg: 72, critical: false },
    { employee: "سارة", dept: "Marketing", avg: 84, critical: false },
    { employee: "ليلى", dept: "Customer Support", avg: 58, critical: true },
  ],
};

