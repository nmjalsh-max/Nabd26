import type { StatusKey } from "../theme/tokens";

export type Team = {
  name: string;
  headcount: number;
  engagement: number;
  wellbeing: number;
  trend: number;
  status: StatusKey;
};

export const teams: Team[] = [
  { name: "Engineering", headcount: 84, engagement: 68, wellbeing: 71, trend: -8, status: "watch" },
  { name: "Sales", headcount: 46, engagement: 82, wellbeing: 79, trend: 4, status: "healthy" },
  { name: "Customer Support", headcount: 38, engagement: 61, wellbeing: 58, trend: -3, status: "at-risk" },
  { name: "Marketing", headcount: 22, engagement: 88, wellbeing: 84, trend: 6, status: "healthy" },
  { name: "Operations", headcount: 31, engagement: 74, wellbeing: 70, trend: 1, status: "healthy" },
  { name: "Finance & HR", headcount: 19, engagement: 79, wellbeing: 77, trend: 2, status: "healthy" },
];

