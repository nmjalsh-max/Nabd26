import type { HTMLAttributes, ReactNode } from "react";

export function Card({ className = "", children, ...rest }: { className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={
        "rounded-2xl border border-border bg-surface p-4 text-textHi " +
        className
      }
      {...rest}
    >
      {children}
    </div>
  );
}

