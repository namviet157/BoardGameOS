import { useEffect, useState } from "react";
import { QrCode, ScanLine, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/bgos/store";
import { GameThumb } from "./GameThumb";

export function QrScanDialog({
  open,
  onOpenChange,
  onScanned,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onScanned?: (gameId: string) => void;
}) {
  const { games } = useStore();
  const [phase, setPhase] = useState<"scanning" | "done">("scanning");
  const [pickedId, setPickedId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setPhase("scanning");
      setPickedId(null);
    }
  }, [open]);

  const pick = (id: string) => {
    setPickedId(id);
    setPhase("done");
    setTimeout(() => {
      onScanned?.(id);
      onOpenChange(false);
    }, 700);
  };

  const picked = games.find((g) => g.id === pickedId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Quét mã QR bộ game</DialogTitle>
          <DialogDescription>
            Đây là bản mô phỏng để demo. Chọn một mã QR bên dưới để tiếp tục quy trình.
          </DialogDescription>
        </DialogHeader>

        <div className="relative overflow-hidden rounded-xl border border-border bg-muted/60 p-8">
          <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-xl border-2 border-dashed border-primary/50 bg-card">
            {phase === "done" && picked ? (
              <div className="text-center">
                <Check className="mx-auto h-8 w-8 text-success" />
                <p className="mt-2 text-sm font-medium">{picked.name}</p>
              </div>
            ) : (
              <QrCode className="h-16 w-16 text-muted-foreground" />
            )}
          </div>
          {phase === "scanning" ? (
            <div className="pointer-events-none absolute inset-x-10 top-1/2 h-0.5 animate-pulse bg-primary/60" />
          ) : null}
          <p className="mt-4 text-center text-xs text-muted-foreground">
            <ScanLine className="mr-1 inline h-3.5 w-3.5" />
            Đưa mã QR trên hộp game vào khung quét
          </p>
        </div>

        <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
          {games.map((g) => (
            <Button
              key={g.id}
              variant="outline"
              className="h-auto w-full justify-start gap-3 rounded-xl px-3 py-2"
              onClick={() => pick(g.id)}
            >
              <GameThumb
                emoji={g.emoji}
                tone={g.tone}
                imageDataUrl={g.imageDataUrl}
                alt={`Ảnh bìa ${g.name}`}
                size="sm"
              />
              <span className="text-left">
                <span className="block text-sm font-medium">{g.name}</span>
                <span className="block text-xs text-muted-foreground">{g.code}</span>
              </span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
