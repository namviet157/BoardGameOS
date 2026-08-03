import { useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ClipboardCheck, Pencil, QrCode, Wrench } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, EmptyState } from "@/components/bgos/StatCard";
import { GameThumb } from "@/components/bgos/GameThumb";
import { GameImagePicker } from "@/components/bgos/GameImagePicker";
import { GameChecklistEditor } from "@/components/bgos/GameChecklistEditor";
import { ComponentInspectionForm } from "@/components/bgos/ComponentInspectionForm";
import { GameStatusBadge } from "@/components/bgos/StatusBadge";
import { ConfirmActionDialog } from "@/components/bgos/ConfirmActionDialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/bgos/store";
import { GAME_STATUS_LABEL, playersLabel, timeAgo } from "@/lib/bgos/helpers";
import type { GameStatus } from "@/lib/bgos/types";
import type { GameComponentItem, GameIncident } from "@/lib/bgos/types";
import {
  componentInspectionResult,
  createComponentInspectionDraft,
  validateComponentInspection,
} from "@/lib/bgos/component-inspection";
import {
  buildGameComponents,
  toGameComponentDrafts,
  validateGameComponentDrafts,
  type GameComponentDraft,
} from "@/lib/bgos/game-checklist";
import { useMinuteRefresh } from "@/hooks/use-minute-refresh";

export const Route = createFileRoute("/app/games/$gameId")({
  head: () => ({
    meta: [
      { title: "Chi tiết bộ game — BoardGameOS" },
      {
        name: "description",
        content:
          "Xem thông tin chi tiết, checklist linh kiện, lịch sử giao nhận và sự cố của từng bộ board game.",
      },
      { property: "og:title", content: "Chi tiết bộ game — BoardGameOS" },
      {
        property: "og:description",
        content: "Thông tin chi tiết và lịch sử vận hành của bộ game.",
      },
    ],
  }),
  component: GameDetail,
});

function GameDetail() {
  useMinuteRefresh();
  const { gameId } = useParams({ from: "/app/games/$gameId" });
  const { games, tables, setGameStatus, saveComponentInspection, deliverGame, updateGame, staff } =
    useStore();
  const game = games.find((g) => g.id === gameId);
  const [tableId, setTableId] = useState("");
  const [note, setNote] = useState(game?.notes ?? "");
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [removeImageOpen, setRemoveImageOpen] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [checklistDrafts, setChecklistDrafts] = useState<GameComponentDraft[]>([]);
  const [inspectionOpen, setInspectionOpen] = useState(false);
  const [inspectionDraft, setInspectionDraft] = useState<GameComponentItem[]>([]);
  const [inspectionLevel, setInspectionLevel] = useState<GameIncident["level"]>("low");
  const [inspectionNote, setInspectionNote] = useState("");

  if (!game) {
    return (
      <EmptyState
        icon={QrCode}
        title="Không tìm thấy bộ game"
        description="Bộ game này có thể đã bị xóa khỏi kho."
        action={
          <Button asChild className="rounded-xl">
            <Link to="/app/games">Về kho game</Link>
          </Button>
        }
      />
    );
  }

  const openChecklistEditor = () => {
    setChecklistDrafts(toGameComponentDrafts(game.components));
    setChecklistOpen(true);
  };

  const saveChecklist = () => {
    const checklistError = validateGameComponentDrafts(checklistDrafts);
    if (checklistError) {
      toast.error(checklistError);
      return;
    }
    updateGame(game.id, { components: buildGameComponents(checklistDrafts) });
    setChecklistOpen(false);
    toast.success("Đã lưu danh sách linh kiện chuẩn");
  };

  const openInspection = () => {
    setInspectionDraft(createComponentInspectionDraft(game.components));
    setInspectionLevel("low");
    setInspectionNote("");
    setInspectionOpen(true);
  };

  const completeInspection = () => {
    const validationError = validateComponentInspection(inspectionDraft);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    saveComponentInspection({
      gameId: game.id,
      components: inspectionDraft,
      level: inspectionLevel,
      note: inspectionNote,
      context: "standalone",
    });
    const result = componentInspectionResult(inspectionDraft);
    toast.success(
      result === "damaged"
        ? "Đã ghi nhận linh kiện hư hỏng"
        : result === "missing"
          ? "Đã ghi nhận số lượng linh kiện thiếu"
          : "Đã xác nhận đầy đủ linh kiện",
    );
    setInspectionOpen(false);
  };

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="rounded-lg -ml-2">
        <Link to="/app/games">
          <ArrowLeft className="h-4 w-4" /> Kho game
        </Link>
      </Button>

      <PageHeader
        title={game.name}
        description={`${game.code} · ${game.category} · ${game.location}`}
        actions={
          <>
            <Select
              value={game.status}
              onValueChange={(v) => {
                if (v === "maintenance") {
                  setMaintenanceOpen(true);
                  return;
                }
                setGameStatus(
                  game.id,
                  v as GameStatus,
                  `Cập nhật thành ${GAME_STATUS_LABEL[v as GameStatus]}`,
                );
                toast.success("Đã cập nhật trạng thái");
              }}
            >
              <SelectTrigger className="w-48 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(GAME_STATUS_LABEL).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setMaintenanceOpen(true)}
            >
              <Wrench className="h-4 w-4" /> Bảo trì
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          <div className="card-soft p-5">
            <GameThumb
              emoji={game.emoji}
              tone={game.tone}
              imageDataUrl={game.imageDataUrl}
              alt={`Ảnh bìa ${game.name}`}
              size="lg"
            />
            <GameImagePicker
              className="mt-3"
              imageDataUrl={game.imageDataUrl}
              showPreview={false}
              onImageChange={(imageDataUrl) => {
                updateGame(game.id, { imageDataUrl });
                toast.success(game.imageDataUrl ? "Đã thay ảnh bìa" : "Đã tải ảnh bìa");
              }}
              onRemove={() => setRemoveImageOpen(true)}
            />
            <div className="mt-4 flex items-center justify-between">
              <GameStatusBadge status={game.status} />
              <span className="text-sm text-muted-foreground">{game.usage30d} lượt / 30 ngày</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{game.description}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Số người chơi</dt>
                <dd>{playersLabel(game.minPlayers, game.maxPlayers)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Thời lượng</dt>
                <dd>{game.duration} phút</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Độ khó</dt>
                <dd>{game.difficulty}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Độ tuổi</dt>
                <dd>Từ {game.age} tuổi</dd>
              </div>
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
              <SelectTrigger className="mt-3 rounded-xl">
                <SelectValue placeholder="Chọn bàn" />
              </SelectTrigger>
              <SelectContent>
                {tables.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="mt-3 w-full rounded-xl"
              disabled={!tableId}
              onClick={() => {
                deliverGame(game.id, tableId, staff[2]?.id ?? staff[0].id);
                toast.success("Đã gán game cho bàn");
              }}
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
                <EmptyState
                  icon={ClipboardCheck}
                  title="Chưa có checklist"
                  description="Bổ sung danh sách linh kiện chuẩn để nhân viên kiểm tra khi nhận lại game."
                  action={
                    <Button className="rounded-xl" onClick={openChecklistEditor}>
                      Tạo checklist
                    </Button>
                  }
                />
              ) : (
                <>
                  <ul className="space-y-3">
                    {game.components.map((c) => (
                      <li
                        key={c.id}
                        className="flex items-center gap-3 rounded-xl border border-border p-3"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Số lượng chuẩn: {c.qty}
                            {c.condition === "missing" ? ` · Thiếu ${c.missingQty}` : ""}
                            {c.note ? ` · ${c.note}` : ""}
                          </p>
                        </div>
                        <span
                          className={
                            c.condition === "ok"
                              ? "text-xs font-medium text-emerald-700"
                              : c.condition === "missing"
                                ? "text-xs font-medium text-amber-700"
                                : "text-xs font-medium text-destructive"
                          }
                        >
                          {c.condition === "ok"
                            ? "Đầy đủ"
                            : c.condition === "missing"
                              ? "Thiếu"
                              : "Hư hỏng"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {game.components.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button className="rounded-xl" onClick={openInspection}>
                    <ClipboardCheck /> Kiểm tra linh kiện
                  </Button>
                  <Button variant="outline" className="rounded-xl" onClick={openChecklistEditor}>
                    <Pencil /> Chỉnh sửa checklist
                  </Button>
                  <Button asChild variant="outline" className="rounded-xl">
                    <Link to="/app/checklist" search={{ gameId: game.id }}>
                      Mở trang kiểm tra linh kiện
                    </Link>
                  </Button>
                </div>
              ) : null}
            </TabsContent>

            <TabsContent value="history" className="card-soft mt-4 p-5">
              {game.history.length === 0 ? (
                <EmptyState
                  icon={QrCode}
                  title="Chưa có lịch sử"
                  description="Lịch sử giao nhận sẽ hiển thị sau thao tác đầu tiên."
                />
              ) : (
                <ul className="space-y-3">
                  {game.history.map((h) => (
                    <li key={h.id} className="rounded-xl border border-border p-3">
                      <p className="text-sm">{h.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {h.staff} · {timeAgo(h.at)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="incidents" className="card-soft mt-4 p-5">
              {game.incidents.length === 0 ? (
                <EmptyState
                  icon={QrCode}
                  title="Không có sự cố"
                  description="Bộ game này chưa ghi nhận sự cố nào."
                />
              ) : (
                <ul className="space-y-3">
                  {game.incidents.map((i) => (
                    <li key={i.id} className="rounded-xl border border-border p-3">
                      <p className="text-sm font-medium">{i.title}</p>
                      {i.details ? (
                        <p className="mt-1 text-sm text-muted-foreground">{i.details}</p>
                      ) : null}
                      <p className="text-xs text-muted-foreground">
                        {i.resolved ? "Đã xử lý" : "Đang xử lý"} · Mức độ{" "}
                        {i.level === "high"
                          ? "nghiêm trọng"
                          : i.level === "medium"
                            ? "trung bình"
                            : "nhẹ"}{" "}
                        · {i.staff} · {timeAgo(i.at)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="notes" className="card-soft mt-4 p-5">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-32 rounded-xl"
                placeholder="Ghi chú của nhân viên về bộ game này"
              />
              <Button
                className="mt-3 rounded-xl"
                onClick={() => {
                  updateGame(game.id, { notes: note });
                  toast.success("Đã lưu ghi chú");
                }}
              >
                Lưu ghi chú
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={checklistOpen} onOpenChange={setChecklistOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {game.components.length === 0
                ? "Tạo checklist linh kiện"
                : "Chỉnh sửa checklist linh kiện"}
            </DialogTitle>
            <DialogDescription>
              Quản lý tên và số lượng chuẩn của các linh kiện trong bộ game.
            </DialogDescription>
          </DialogHeader>
          <GameChecklistEditor value={checklistDrafts} onChange={setChecklistDrafts} />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => setChecklistOpen(false)}
            >
              Hủy
            </Button>
            <Button type="button" className="rounded-xl" onClick={saveChecklist}>
              Lưu checklist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={inspectionOpen} onOpenChange={setInspectionOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Kiểm tra linh kiện {game.name}</DialogTitle>
            <DialogDescription>
              Đối chiếu thực tế và chỉ lưu kết quả sau khi hoàn tất kiểm tra.
            </DialogDescription>
          </DialogHeader>
          <ComponentInspectionForm
            value={inspectionDraft}
            onChange={setInspectionDraft}
            level={inspectionLevel}
            onLevelChange={setInspectionLevel}
            generalNote={inspectionNote}
            onGeneralNoteChange={setInspectionNote}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => setInspectionOpen(false)}
            >
              Hủy
            </Button>
            <Button type="button" className="rounded-xl" onClick={completeInspection}>
              Hoàn tất kiểm tra
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmActionDialog
        open={maintenanceOpen}
        onOpenChange={setMaintenanceOpen}
        title={`Chuyển ${game.name} sang bảo trì?`}
        description="Game sẽ không còn được xem là sẵn sàng để giao cho khách cho đến khi trạng thái được cập nhật lại."
        confirmLabel="Chuyển sang bảo trì"
        onConfirm={() => {
          setGameStatus(game.id, "maintenance", "Chuyển sang bảo trì");
          toast.success("Đã chuyển sang bảo trì");
        }}
      />
      <ConfirmActionDialog
        open={removeImageOpen}
        onOpenChange={setRemoveImageOpen}
        title={`Xóa ảnh bìa của ${game.name}?`}
        description="Ảnh đã lưu sẽ bị xóa và game quay về hình xúc xắc mặc định."
        confirmLabel="Xóa ảnh"
        destructive
        onConfirm={() => {
          updateGame(game.id, { imageDataUrl: undefined });
          toast.success("Đã xóa ảnh bìa");
        }}
      />
    </div>
  );
}
