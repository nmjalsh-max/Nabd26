import type { InputHTMLAttributes } from "react";

export function Input({ className = "", ...rest }: { className?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={
        "h-11 rounded-xl border border-border bg-surfaceHi px-3 text-sm text-textHi outline-none placeholder:text-textLo\/70 focus:border-lavender focus:ring-0 " +
        className
      }
      {...rest}
    />
  );
}

