import { useEffect, useRef, useState } from "react";
import { ImageIcon, LoaderCircle, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GAME_IMAGE_ACCEPT, processGameImage } from "@/lib/bgos/game-image";
import { cn } from "@/lib/utils";

interface GameImagePickerProps {
  imageDataUrl?: string;
  fileName?: string;
  onImageChange: (imageDataUrl: string, fileName: string) => void;
  onRemove?: () => void;
  onProcessingChange?: (processing: boolean) => void;
  showPreview?: boolean;
  className?: string;
}

export function GameImagePicker({
  imageDataUrl,
  fileName,
  onImageChange,
  onRemove,
  onProcessingChange,
  showPreview = true,
  className,
}: GameImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(0);
  const [processing, setProcessing] = useState(false);

  useEffect(
    () => () => {
      requestIdRef.current += 1;
    },
    [],
  );

  const setIsProcessing = (next: boolean) => {
    setProcessing(next);
    onProcessingChange?.(next);
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const requestId = ++requestIdRef.current;
    setIsProcessing(true);
    try {
      const processedImage = await processGameImage(file);
      if (requestId !== requestIdRef.current) return;
      onImageChange(processedImage, file.name);
    } catch (error) {
      if (requestId === requestIdRef.current) {
        toast.error(error instanceof Error ? error.message : "Không thể xử lý ảnh đã chọn.");
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsProcessing(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {showPreview && imageDataUrl ? (
        <div className="flex gap-3 rounded-xl border border-border p-3">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
            <img
              src={imageDataUrl}
              alt="Ảnh bìa đã chọn"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="min-w-0 flex-1 self-center">
            <p className="truncate text-sm font-medium">{fileName || "Ảnh bìa hiện tại"}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Ảnh đã được thu nhỏ và nén để lưu trên trình duyệt.
            </p>
          </div>
          {onRemove ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={processing}
              onClick={onRemove}
              aria-label="Xóa ảnh đã chọn"
            >
              <Trash2 />
            </Button>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={GAME_IMAGE_ACCEPT}
          className="hidden"
          onChange={(event) => void handleFile(event.target.files?.[0])}
        />
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          disabled={processing}
          onClick={() => inputRef.current?.click()}
        >
          {processing ? (
            <LoaderCircle className="animate-spin" />
          ) : imageDataUrl ? (
            <ImageIcon />
          ) : (
            <Upload />
          )}
          {processing ? "Đang xử lý..." : imageDataUrl ? "Thay ảnh" : "Tải ảnh"}
        </Button>
        {!showPreview && imageDataUrl && onRemove ? (
          <Button
            type="button"
            variant="outline"
            className="rounded-xl text-destructive"
            disabled={processing}
            onClick={onRemove}
          >
            <Trash2 /> Xóa ảnh
          </Button>
        ) : null}
      </div>
    </div>
  );
}
