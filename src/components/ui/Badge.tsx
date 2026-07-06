import type { HTMLAttributes } from "react";
import type { StatusKey } from "../../theme/tokens";

const statusTo = {
  healthy: { bg: "bg-[#0D2A20]", text: "text-green" },
  watch: { bg: "bg-[#2A1F08]", text: "text-amber" },
  "at-risk": { bg: "bg-[#2A0D0D]", text: "text-red" },
} satisfies Record<StatusKey, { bg: string; text: string }>;

export function Badge({ status, className = "", ...rest }: { status: StatusKey } & HTMLAttributes<HTMLSpanElement>) {
  const s = statusTo[status];
  return (
    <span
      className={
        "inline-flex items-center rounded-xl border border-borderLo px-3 py-1 text-xs font-extrabold " +
        s.bg +
        " " +
        s.text +
        " " +
        className
      }
      {...rest}
    />
  );
}

