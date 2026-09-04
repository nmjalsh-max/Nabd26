export function SkeletonLoader({ className = "" }: { className?: string }) {
  return (
    <div
      className={
        "animate-pulse rounded-xl bg-white\/5 ring-1 ring-border " +
        className
      }
    />
  );
}

