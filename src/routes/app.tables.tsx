import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock3, Gamepad2, LifeBuoy, Settings2, UsersRound } from "lucide-react";
import { toast } from "sonner";
import { ConfirmActionDialog } from "@/components/bgos/ConfirmActionDialog";
import { PageHeader } from "@/components/bgos/StatCard";
import { TableStatusBadge } from "@/components/bgos/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/lib/bgos/store";
import { minutesSince } from "@/lib/bgos/helpers";
import type { TableStatus } from "@/lib/bgos/types";
import { useMinuteRefresh } from "@/hooks/use-minute-refresh";

export const Route = createFileRoute("/app/tables")({
  head: () => ({
    meta: [
      { title: "Bàn chơi — BoardGameOS" },
      {
        name: "description",
        content: "Sơ đồ bàn chơi trực quan với trạng thái, game đang chơi và nhân viên phụ trách.",
      },
      { property: "og:title", content: "Bàn chơi — BoardGameOS" },
      { property: "og:description", content: "Quản lý trạng thái và phiên chơi của từng bàn." },
    ],
  }),
  component: TablesPage,
});

const STATUS_OPTIONS: { value: TableStatus; label: string }[] = [
  { value: "empty", label: "Bàn trống" },
  { value: "playing", label: "Đang chơi" },
  { value: "support", label: "Cần hỗ trợ" },
  { value: "issue", label: "Có sự cố" },
  { value: "cleaning", label: "Đang dọn" },
];

function TablesPage() {
  useMinuteRefresh();
  const { tables, games, staff, setTableStatus, updateTable, endSession, deliverGame } = useStore();
  const [endingTableId, setEndingTableId] = useState<string | null>(null);
  const [editingTableId, setEditingTableId] = useState<string | null>(null);
  const endingTable = tables.find((table) => table.id === endingTableId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bàn chơi"
        description="Theo dõi và cập nhật trạng thái từng bàn trong quán."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tables.map((t) => {
          const game = games.find((g) => g.id === t.gameId);
          const member = staff.find((s) => s.id === t.staffId);
          return (
            <div
              key={t.id}
              className={`card-soft overflow-hidden border-t-4 ${
                t.status === "issue"
                  ? "border-t-destructive"
                  : t.status === "support"
                    ? "border-t-warning"
                    : t.status === "playing"
                      ? "border-t-primary"
                      : t.status === "empty"
                        ? "border-t-success"
                        : "border-t-muted-foreground/40"
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xl font-semibold">{t.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Sức chứa {t.seats} khách</p>
                  </div>
                  <TableStatusBadge status={t.status} />
                </div>

                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                      <Gamepad2 className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-xs text-muted-foreground">Game đang chơi</dt>
                      <dd className="truncate font-medium">{game?.name ?? "Chưa có game"}</dd>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <UsersRound className="h-4 w-4 text-muted-foreground" />
                      <span>{t.guests > 0 ? `${t.guests}/${t.seats} khách` : "Chưa có khách"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-muted-foreground" />
                      <span suppressHydrationWarning>
                        {t.startedAt ? `${minutesSince(t.startedAt)} phút` : "Chưa bắt đầu"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    <span className="truncate">{member?.name ?? "Chưa gán nhân viên"}</span>
                  </div>
                </dl>
              </div>

              {editingTableId === t.id ? (
                <div className="space-y-2 border-t border-border bg-muted/35 p-4">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Cập nhật nhanh
                  </p>
                  <Select
                    value={t.status}
                    onValueChange={(v) => {
                      setTableStatus(t.id, v as TableStatus);
                      toast.success(`${t.name} đã cập nhật trạng thái`);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={t.gameId ?? ""}
                    onValueChange={(v) => {
                      deliverGame(v, t.id, t.staffId ?? staff[2]?.id ?? staff[0].id);
                      toast.success("Đã gán game cho bàn");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Gán game cho bàn" />
                    </SelectTrigger>
                    <SelectContent>
                      {games
                        .filter((g) => g.status === "available" || g.id === t.gameId)
                        .map((g) => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-2 border-t border-border p-4">
                {t.status === "empty" ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      updateTable(t.id, {
                        status: "playing",
                        guests: 2,
                        startedAt: new Date().toISOString(),
                      });
                      toast.success("Đã tạo phiên chơi mới");
                    }}
                  >
                    Tạo phiên chơi
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setEndingTableId(t.id)}>
                    Kết thúc phiên
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setTableStatus(t.id, "support");
                    toast("Đã đánh dấu bàn cần hỗ trợ");
                  }}
                >
                  <LifeBuoy className="h-4 w-4" /> Hỗ trợ
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="ml-auto h-8 w-8"
                  onClick={() => setEditingTableId(editingTableId === t.id ? null : t.id)}
                  aria-label={`Chỉnh sửa ${t.name}`}
                >
                  <Settings2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmActionDialog
        open={!!endingTableId}
        onOpenChange={(nextOpen) => !nextOpen && setEndingTableId(null)}
        title={`Kết thúc phiên chơi tại ${endingTable?.name ?? "bàn"}?`}
        description="Game đang chơi sẽ chuyển sang chờ kiểm tra và bàn sẽ chuyển sang trạng thái đang dọn."
        confirmLabel="Kết thúc phiên"
        onConfirm={() => {
          if (!endingTable) return;
          endSession(endingTable.id);
          toast.success(`Đã kết thúc phiên chơi tại ${endingTable.name}`);
          setEndingTableId(null);
        }}
      />
    </div>
  );
}
