import { companyTrend } from "./analytics";

export const reportsMock = {
  charts: {
    trend: companyTrend,
  },
  tableRows: [
    { employee: "Ahmed", dept: "Engineering", avg: 72, critical: false },
    { employee: "Sara", dept: "Marketing", avg: 84, critical: false },
    { employee: "Laila", dept: "Customer Support", avg: 58, critical: true },
  ],
};

