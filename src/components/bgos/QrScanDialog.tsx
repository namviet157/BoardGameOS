import { useEffect, useRef, useState } from "react";
import { Check, QrCode, ScanLine, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/bgos/store";
import { GameQrCode } from "./GameQrCode";
import { GameThumb } from "./GameThumb";

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

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
  const [phase, setPhase] = useState<"idle" | "scanning" | "done">("idle");
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  useEffect(() => {
    if (open) {
      setPhase("idle");
      setPickedId(null);
      setQuery("");
    } else {
      clearTimers();
    }
    return clearTimers;
  }, [open]);

  const pick = (id: string) => {
    clearTimers();
    setPickedId(id);
    setPhase("scanning");
    timersRef.current = [
      setTimeout(() => setPhase("done"), 700),
      setTimeout(() => {
        onScanned?.(id);
        onOpenChange(false);
      }, 1150),
    ];
  };

  const picked = games.find((game) => game.id === pickedId);
  const normalizedQuery = normalizeSearch(query.trim());
  const filteredGames = games.filter((game) =>
    normalizeSearch(`${game.name} ${game.code}`).includes(normalizedQuery),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>Quét mã QR bộ game</DialogTitle>
          <DialogDescription>
            Chế độ demo cho phép chọn mã game bên dưới để mô phỏng quá trình nhận diện.
          </DialogDescription>
        </DialogHeader>

        <div className="relative overflow-hidden rounded-xl border border-border bg-muted/60 p-5">
          <div className="relative mx-auto flex h-48 w-48 items-center justify-center overflow-hidden rounded-xl border-2 border-primary/50 bg-white p-3">
            {picked ? (
              <GameQrCode
                gameId={picked.id}
                gameCode={picked.code}
                gameName={picked.name}
                size={160}
              />
            ) : (
              <QrCode className="h-16 w-16 text-muted-foreground" />
            )}
            {phase === "scanning" ? (
              <div className="qr-scan-line pointer-events-none absolute inset-x-3 top-3 h-0.5 bg-primary shadow-[0_0_8px_var(--color-primary)]" />
            ) : null}
            {phase === "done" && picked ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/92 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success text-success-foreground">
                  <Check className="h-6 w-6" />
                </span>
                <p className="mt-2 text-sm font-medium">{picked.name}</p>
                <p className="text-xs text-muted-foreground">Đã nhận diện {picked.code}</p>
              </div>
            ) : null}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            <ScanLine className="mr-1 inline h-3.5 w-3.5" />
            {phase === "idle"
              ? "Chọn một mã game để bắt đầu"
              : phase === "scanning"
                ? "Đang nhận diện mã QR..."
                : "Nhận diện thành công"}
          </p>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Chọn mã để demo quét</p>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm theo tên hoặc mã game"
              className="rounded-xl pl-9"
            />
          </div>
          <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <Button
                  key={game.id}
                  variant="outline"
                  className="h-auto w-full justify-start gap-3 rounded-xl px-3 py-2"
                  disabled={phase === "scanning"}
                  onClick={() => pick(game.id)}
                >
                  <GameThumb
                    emoji={game.emoji}
                    tone={game.tone}
                    imageDataUrl={game.imageDataUrl}
                    coverImageUrl={game.coverImageUrl}
                    alt={`Ảnh bìa ${game.name}`}
                    size="sm"
                  />
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block truncate text-sm font-medium">{game.name}</span>
                    <span className="block text-xs text-muted-foreground">{game.code}</span>
                  </span>
                  <GameQrCode
                    gameId={game.id}
                    gameCode={game.code}
                    gameName={game.name}
                    size={44}
                  />
                </Button>
              ))
            ) : (
              <p className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
                Không tìm thấy game phù hợp.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
