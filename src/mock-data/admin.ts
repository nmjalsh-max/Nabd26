import type { StatusKey } from "../theme/tokens";
import { teams } from "./employee";

export const adminOverview = {
  totalEmployees: 240,
  criticalCount: teams.filter((t) => t.status === ("at-risk" as StatusKey)).length,
};

