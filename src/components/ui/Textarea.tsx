import type { TextareaHTMLAttributes } from "react";

export function Textarea({ className = "", ...rest }: { className?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={
        "min-h-[120px] rounded-xl border border-border bg-surfaceHi px-3 py-2 text-sm text-textHi outline-none placeholder:text-textLo\/70 focus:border-lavender focus:ring-0 " +
        className
      }
      {...rest}
    />
  );
}

