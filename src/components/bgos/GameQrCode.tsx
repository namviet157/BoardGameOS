import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function normalizeBaseUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

function buildGameQrUrl(baseUrl: string, gameId: string) {
  return `${normalizeBaseUrl(baseUrl)}/app/games/${encodeURIComponent(gameId)}`;
}

function fileSafeName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function GameQrCode({
  gameId,
  gameCode,
  gameName,
  size = 160,
  showDownload = false,
  className,
}: {
  gameId: string;
  gameCode: string;
  gameName: string;
  size?: number;
  showDownload?: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    const configuredUrl = import.meta.env.VITE_PUBLIC_APP_URL?.trim();
    setBaseUrl(configuredUrl || window.location.origin);
  }, []);

  const qrUrl = baseUrl ? buildGameQrUrl(baseUrl, gameId) : "";
  const renderSize = showDownload ? 512 : size;

  const downloadQrCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      toast.error("Chưa thể tạo ảnh QR. Vui lòng thử lại.");
      return;
    }

    try {
      const anchor = document.createElement("a");
      anchor.download = `${gameCode}-${fileSafeName(gameName) || gameId}-qr.png`;
      anchor.href = canvas.toDataURL("image/png");
      anchor.click();
      toast.success("Đã tải mã QR");
    } catch {
      toast.error("Không thể tải mã QR. Vui lòng thử lại.");
    }
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white"
        style={{ width: size, height: size }}
      >
        {qrUrl ? (
          <QRCodeCanvas
            ref={canvasRef}
            value={qrUrl}
            title={`Mã QR ${gameName}`}
            size={renderSize}
            level="M"
            marginSize={4}
            bgColor="#ffffff"
            fgColor="#171717"
            style={{ width: size, height: size }}
          />
        ) : (
          <div className="h-full w-full animate-pulse bg-muted" aria-label="Đang tạo mã QR" />
        )}
      </div>
      {showDownload ? (
        <Button
          type="button"
          variant="outline"
          className="mt-3 rounded-xl"
          disabled={!qrUrl}
          onClick={downloadQrCode}
        >
          <Download className="h-4 w-4" /> Tải mã QR
        </Button>
      ) : null}
    </div>
  );
}
