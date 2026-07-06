import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
};

const sizeClass: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

const variantClass: Record<Variant, string> = {
  primary:
    "border-none text-[#0B0B14] bg-gradient-to-r from-lavender to-pink hover:brightness-110 active:brightness-95",
  secondary: "border border-borderLo text-lavSoft bg-transparent hover:bg-white\/5",
  ghost: "border-none bg-transparent text-textLo hover:bg-white\/5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", leftIcon, rightIcon, className = "", disabled, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={
        "inline-flex items-center justify-center gap-2 rounded-xl font-extrabold transition focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed " +
        sizeClass[size] +
        " " +
        variantClass[variant] +
        " " +
        className
      }
      {...rest}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
});

