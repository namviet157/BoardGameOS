import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { ConfirmActionDialog } from "@/components/bgos/ConfirmActionDialog";
import { PageHeader } from "@/components/bgos/StatCard";
import { TableStatusBadge } from "@/components/bgos/StatusBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/lib/bgos/store";
import { minutesSince } from "@/lib/bgos/helpers";
import type { TableStatus } from "@/lib/bgos/types";
import { useMinuteRefresh } from "@/hooks/use-minute-refresh";

export const Route = createFileRoute("/app/tables")({
  head: () => ({
    meta: [
      { title: "Bàn chơi — BoardGameOS" },
      { name: "description", content: "Sơ đồ bàn chơi trực quan với trạng thái, game đang chơi và nhân viên phụ trách." },
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
  const endingTable = tables.find((table) => table.id === endingTableId);

  return (
    <div className="space-y-6">
      <PageHeader title="Bàn chơi" description="Theo dõi và cập nhật trạng thái từng bàn trong quán." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tables.map((t) => {
          const game = games.find((g) => g.id === t.gameId);
          const member = staff.find((s) => s.id === t.staffId);
          return (
            <div key={t.id} className="card-soft p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.guests > 0 ? `${t.guests}/${t.seats} khách` : `Sức chứa ${t.seats} khách`}
                  </p>
                </div>
                <TableStatusBadge status={t.status} />
              </div>

              <dl className="mt-4 space-y-1.5 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Game đang chơi</dt><dd>{game?.name ?? "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Bắt đầu</dt><dd>{t.startedAt ? `${minutesSince(t.startedAt)} phút trước` : "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Nhân viên</dt><dd>{member?.name ?? "Chưa gán"}</dd></div>
              </dl>

              <div className="mt-4 space-y-2">
                <Select value={t.status} onValueChange={(v) => { setTableStatus(t.id, v as TableStatus); toast.success(`${t.name} đã cập nhật trạng thái`); }}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUS_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>

                <Select
                  value={t.gameId ?? ""}
                  onValueChange={(v) => { deliverGame(v, t.id, t.staffId ?? staff[2].id); toast.success("Đã gán game cho bàn"); }}
                >
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Gán game cho bàn" /></SelectTrigger>
                  <SelectContent>
                    {games.filter((g) => g.status === "available" || g.id === t.gameId).map((g) => (
                      <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex flex-wrap gap-2">
                  {t.status === "empty" ? (
                    <Button size="sm" className="rounded-lg" onClick={() => { updateTable(t.id, { status: "playing", guests: 2, startedAt: new Date().toISOString() }); toast.success("Đã tạo phiên chơi mới"); }}>
                      Tạo phiên chơi
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="rounded-lg" onClick={() => setEndingTableId(t.id)}>
                      Kết thúc phiên
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="rounded-lg" onClick={() => { setTableStatus(t.id, "support"); toast("Đã đánh dấu bàn cần hỗ trợ"); }}>
                    Cần hỗ trợ
                  </Button>
                </div>
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
