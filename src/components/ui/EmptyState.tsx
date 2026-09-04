import type { ReactNode } from "react";
import { Card } from "./Card";

export function EmptyState({
  title = "لا توجد بيانات",
  description = "جرّب لاحقًا أو غيّر الفلاتر.",
  action,
  icon,
}: {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-3">
          {icon}
          <div>
            <div className="text-sm font-extrabold text-textHi">{title}</div>
            <div className="mt-1 text-xs leading-relaxed text-textLo">{description}</div>
          </div>
        </div>
        {action}
      </div>
    </Card>
  );
}

