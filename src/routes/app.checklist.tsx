import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ClipboardCheck } from "lucide-react";
import { toast } from "sonner";
import { ComponentInspectionForm } from "@/components/bgos/ComponentInspectionForm";
import { EmptyState, PageHeader } from "@/components/bgos/StatCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  componentInspectionResult,
  createComponentInspectionDraft,
  validateComponentInspection,
} from "@/lib/bgos/component-inspection";
import { useStore } from "@/lib/bgos/store";
import type { GameComponentItem, GameIncident } from "@/lib/bgos/types";

export const Route = createFileRoute("/app/checklist")({
  validateSearch: (search: Record<string, unknown>) => ({
    gameId: typeof search.gameId === "string" ? search.gameId : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Kiểm tra linh kiện — BoardGameOS" },
      {
        name: "description",
        content: "Đối chiếu linh kiện thực tế và ghi nhận chính xác linh kiện thiếu hoặc hư hỏng.",
      },
      { property: "og:title", content: "Kiểm tra linh kiện — BoardGameOS" },
      { property: "og:description", content: "Checklist linh kiện cho từng bộ board game." },
    ],
  }),
  component: ChecklistPage,
});

function ChecklistPage() {
  const { gameId: requestedGameId } = Route.useSearch();
  const { games, saveComponentInspection } = useStore();
  const initialGame =
    games.find((game) => game.id === requestedGameId) ??
    games.find((game) => game.status === "pending_check") ??
    games[0];
  const [gameId, setGameId] = useState(initialGame?.id ?? "");
  const game = games.find((candidate) => candidate.id === gameId);
  const [draft, setDraft] = useState<GameComponentItem[]>(() =>
    createComponentInspectionDraft(initialGame?.components ?? []),
  );
  const [level, setLevel] = useState<GameIncident["level"]>("low");
  const [generalNote, setGeneralNote] = useState("");

  const selectGame = (nextGameId: string) => {
    const selected = games.find((candidate) => candidate.id === nextGameId);
    setGameId(nextGameId);
    setDraft(createComponentInspectionDraft(selected?.components ?? []));
    setLevel("low");
    setGeneralNote("");
  };

  const completeInspection = () => {
    if (!game) return;
    const validationError = validateComponentInspection(draft);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    saveComponentInspection({
      gameId: game.id,
      components: draft,
      level,
      note: generalNote,
      context: "standalone",
    });
    const result = componentInspectionResult(draft);
    toast.success(
      result === "damaged"
        ? "Đã ghi nhận linh kiện hư hỏng"
        : result === "missing"
          ? "Đã ghi nhận số lượng linh kiện thiếu"
          : "Đã xác nhận đầy đủ linh kiện",
    );
    setDraft(createComponentInspectionDraft(draft));
    setGeneralNote("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kiểm tra linh kiện"
        description="Đối chiếu linh kiện thực tế với danh sách chuẩn của bộ game."
      />

      <div className="card-soft p-4">
        <Select value={gameId} onValueChange={selectGame}>
          <SelectTrigger className="rounded-xl sm:max-w-sm">
            <SelectValue placeholder="Chọn bộ game" />
          </SelectTrigger>
          <SelectContent>
            {games.map((candidate) => (
              <SelectItem key={candidate.id} value={candidate.id}>
                {candidate.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!game || game.components.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="Chưa có checklist"
          description="Bộ game này chưa được cấu hình danh sách linh kiện chuẩn tại trang chi tiết game."
        />
      ) : (
        <div className="card-soft space-y-4 p-5">
          <ComponentInspectionForm
            value={draft}
            onChange={setDraft}
            level={level}
            onLevelChange={setLevel}
            generalNote={generalNote}
            onGeneralNoteChange={setGeneralNote}
          />
          <Button className="rounded-xl" onClick={completeInspection}>
            Xác nhận hoàn tất kiểm tra
          </Button>
        </div>
      )}
    </div>
  );
}
