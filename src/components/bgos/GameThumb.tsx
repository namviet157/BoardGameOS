import { useState } from "react";
import { cn } from "@/lib/utils";
import { TONE_CLASS } from "@/lib/bgos/helpers";

export function GameThumb({
  emoji,
  tone,
  imageDataUrl,
  coverImageUrl,
  alt,
  size = "md",
  className,
}: {
  emoji: string;
  tone: number;
  imageDataUrl?: string;
  coverImageUrl?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const sizes = {
    sm: "h-11 w-11 text-lg rounded-lg",
    md: "h-16 w-14 text-2xl rounded-lg",
    lg: "h-52 w-full text-6xl rounded-lg",
  };
  const imageSource = imageDataUrl || coverImageUrl;
  const showImage = Boolean(imageSource && failedImage !== imageSource);
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
          src={imageSource}
          alt={alt ?? "Ảnh bìa board game"}
          className="h-full w-full object-contain"
          onError={() => setFailedImage(imageSource ?? null)}
        />
      ) : (
        <span aria-hidden>{emoji}</span>
      )}
    </div>
  );
}
