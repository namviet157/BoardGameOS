import { useState } from "react";
import { cn } from "@/lib/utils";
import { TONE_CLASS } from "@/lib/bgos/helpers";

export function GameThumb({
  emoji,
  tone,
  imageDataUrl,
  alt,
  size = "md",
  className,
}: {
  emoji: string;
  tone: number;
  imageDataUrl?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const sizes = {
    sm: "h-10 w-10 text-lg rounded-xl",
    md: "h-14 w-14 text-2xl rounded-2xl",
    lg: "h-40 w-full text-6xl rounded-2xl",
  };
  const showImage = Boolean(imageDataUrl && failedImage !== imageDataUrl);
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden border border-border/60",
        TONE_CLASS[tone] ?? TONE_CLASS[1],
        sizes[size],
        className,
      )}
    >
      {showImage ? (
        <img
          src={imageDataUrl}
          alt={alt ?? "Ảnh bìa board game"}
          className="h-full w-full object-contain"
          onError={() => setFailedImage(imageDataUrl ?? null)}
        />
      ) : (
        <span aria-hidden>{emoji}</span>
      )}
    </div>
  );
}
