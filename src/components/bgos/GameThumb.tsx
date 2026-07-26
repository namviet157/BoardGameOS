import { cn } from "@/lib/utils";
import { TONE_CLASS } from "@/lib/bgos/helpers";

export function GameThumb({
  emoji,
  tone,
  size = "md",
  className,
}: {
  emoji: string;
  tone: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "h-10 w-10 text-lg rounded-xl",
    md: "h-14 w-14 text-2xl rounded-2xl",
    lg: "h-40 w-full text-6xl rounded-2xl",
  };
  return (
    <div
      aria-hidden
      className={cn(
        "flex items-center justify-center border border-border/60",
        TONE_CLASS[tone] ?? TONE_CLASS[1],
        sizes[size],
        className,
      )}
    >
      <span>{emoji}</span>
    </div>
  );
}
