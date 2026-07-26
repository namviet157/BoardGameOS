import { useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, QrCode, Wrench } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, EmptyState } from "@/components/bgos/StatCard";
import { GameThumb } from "@/components/bgos/GameThumb";
import { GameStatusBadge } from "@/components/bgos/StatusBadge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/bgos/store";
import { GAME_STATUS_LABEL, playersLabel, timeAgo } from "@/lib/bgos/helpers";
import type { GameStatus } from "@/lib/bgos/types";

export const Route = createFileRoute("/app/games/$gameId")({
  head: () => ({
    meta: [
      { title: "Chi tiết bộ game — BoardGameOS" },
      { name: "description", content: "Xem thông tin chi tiết, checklist linh kiện, lịch sử giao nhận và sự cố của từng bộ board game." },
      { property: "og:title", content: "Chi tiết bộ game — BoardGameOS" },
      { property: "og:description", content: "Thông tin chi tiết và lịch sử vận hành của bộ game." },
    ],
  }),
  component: GameDetail,
});

function GameDetail() {
  const { gameId } = useParams({ from: "/app/games/$gameId" });
  const { games, tables, setGameStatus, saveComponents, deliverGame, updateGame, staff } = useStore();
  const game = games.find((g) => g.id === gameId);
  const [tableId, setTableId] = useState("");
  const [note, setNote] = useState(game?.notes ?? "");

  if (!game) {
    return (
      <EmptyState
        icon={QrCode}
        title="Không tìm thấy bộ game"
        description="Bộ game này có thể đã bị xóa khỏi kho."
        action={<Button asChild className="rounded-xl"><Link to="/app/games">Về kho game</Link></Button>}
      />
    );
  }

  const toggleComponent = (id: string, ok: boolean) => {
    saveComponents(
      game.id,
      game.components.map((c) => (c.id === id ? { ...c, ok, missingQty: ok ? 0 : c.missingQty || 1 } : c)),
    );
    toast.success("Đã cập nhật checklist linh kiện");
  };

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="rounded-lg -ml-2">
        <Link to="/app/games"><ArrowLeft className="h-4 w-4" /> Kho game</Link>
      </Button>

      <PageHeader
        title={game.name}
        description={`${game.code} · ${game.category} · ${game.location}`}
        actions={
          <>
            <Select value={game.status} onValueChange={(v) => { setGameStatus(game.id, v as GameStatus, `Cập nhật thành ${GAME_STATUS_LABEL[v as GameStatus]}`); toast.success("Đã cập nhật trạng thái"); }}>
              <SelectTrigger className="w-48 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(GAME_STATUS_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" className="rounded-xl" onClick={() => { setGameStatus(game.id, "maintenance", "Chuyển sang bảo trì"); toast.success("Đã chuyển sang bảo trì"); }}>
              <Wrench className="h-4 w-4" /> Bảo trì
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          <div className="card-soft p-5">
            <GameThumb emoji={game.emoji} tone={game.tone} size="lg" />
            <div className="mt-4 flex items-center justify-between">
              <GameStatusBadge status={game.status} />
              <span className="text-sm text-muted-foreground">{game.usage30d} lượt / 30 ngày</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{game.description}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-muted-foreground">Số người chơi</dt><dd>{playersLabel(game.minPlayers, game.maxPlayers)}</dd></div>
              <div><dt className="text-muted-foreground">Thời lượng</dt><dd>{game.duration} phút</dd></div>
              <div><dt className="text-muted-foreground">Độ khó</dt><dd>{game.difficulty}</dd></div>
              <div><dt className="text-muted-foreground">Độ tuổi</dt><dd>Từ {game.age} tuổi</dd></div>
            </dl>
          </div>

          <div className="card-soft p-5 text-center">
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-xl border border-border bg-muted">
              <QrCode className="h-20 w-20" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Mã QR: {game.code}</p>
          </div>

          <div className="card-soft p-5">
            <p className="font-medium">Gán game cho bàn</p>
            <Select value={tableId} onValueChange={setTableId}>
              <SelectTrigger className="mt-3 rounded-xl"><SelectValue placeholder="Chọn bàn" /></SelectTrigger>
              <SelectContent>
                {tables.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button
              className="mt-3 w-full rounded-xl"
              disabled={!tableId}
              onClick={() => { deliverGame(game.id, tableId, staff[2]?.id ?? staff[0].id); toast.success("Đã gán game cho bàn"); }}
            >
              Giao game cho bàn
            </Button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="components">
            <TabsList className="rounded-xl">
              <TabsTrigger value="components">Checklist linh kiện</TabsTrigger>
              <TabsTrigger value="history">Lịch sử giao nhận</TabsTrigger>
              <TabsTrigger value="incidents">Sự cố</TabsTrigger>
              <TabsTrigger value="notes">Ghi chú</TabsTrigger>
            </TabsList>

            <TabsContent value="components" className="card-soft mt-4 p-5">
              {game.components.length === 0 ? (
                <EmptyState icon={QrCode} title="Chưa có checklist" description="Bổ sung danh sách linh kiện để nhân viên kiểm tra khi nhận lại game." />
              ) : (
                <ul className="space-y-3">
                  {game.components.map((c) => (
                    <li key={c.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                      <Checkbox checked={c.ok} onCheckedChange={(v) => toggleComponent(c.id, Boolean(v))} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Số lượng chuẩn: {c.qty}
                          {!c.ok && c.missingQty ? ` · Thiếu ${c.missingQty}` : ""}
                          {c.note ? ` · ${c.note}` : ""}
                        </p>
                      </div>
                      {!c.ok ? (
                        <Input
                          type="number"
                          min={1}
                          value={c.missingQty}
                          className="w-20 rounded-lg"
                          onChange={(e) =>
                            saveComponents(game.id, game.components.map((x) => (x.id === c.id ? { ...x, missingQty: Number(e.target.value) } : x)))
                          }
                        />
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
              <Button asChild variant="outline" className="mt-4 rounded-xl">
                <Link to="/app/checklist">Mở trang kiểm tra linh kiện</Link>
              </Button>
            </TabsContent>

            <TabsContent value="history" className="card-soft mt-4 p-5">
              {game.history.length === 0 ? (
                <EmptyState icon={QrCode} title="Chưa có lịch sử" description="Lịch sử giao nhận sẽ hiển thị sau thao tác đầu tiên." />
              ) : (
                <ul className="space-y-3">
                  {game.history.map((h) => (
                    <li key={h.id} className="rounded-xl border border-border p-3">
                      <p className="text-sm">{h.label}</p>
                      <p className="text-xs text-muted-foreground">{h.staff} · {timeAgo(h.at)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="incidents" className="card-soft mt-4 p-5">
              {game.incidents.length === 0 ? (
                <EmptyState icon={QrCode} title="Không có sự cố" description="Bộ game này chưa ghi nhận sự cố nào." />
              ) : (
                <ul className="space-y-3">
                  {game.incidents.map((i) => (
                    <li key={i.id} className="rounded-xl border border-border p-3">
                      <p className="text-sm font-medium">{i.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Mức độ {i.level === "high" ? "nghiêm trọng" : i.level === "medium" ? "trung bình" : "nhẹ"} · {i.staff} · {timeAgo(i.at)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="notes" className="card-soft mt-4 p-5">
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} className="min-h-32 rounded-xl" placeholder="Ghi chú của nhân viên về bộ game này" />
              <Button className="mt-3 rounded-xl" onClick={() => { updateGame(game.id, { notes: note }); toast.success("Đã lưu ghi chú"); }}>Lưu ghi chú</Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
