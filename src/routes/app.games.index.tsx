import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Boxes, Plus, QrCode, Search, Wrench } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, EmptyState } from "@/components/bgos/StatCard";
import { GameThumb } from "@/components/bgos/GameThumb";
import { GameImagePicker } from "@/components/bgos/GameImagePicker";
import { GameChecklistEditor } from "@/components/bgos/GameChecklistEditor";
import { GameStatusBadge } from "@/components/bgos/StatusBadge";
import { ConfirmActionDialog } from "@/components/bgos/ConfirmActionDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/lib/bgos/store";
import { GAME_STATUS_LABEL, playersLabel } from "@/lib/bgos/helpers";
import { GAME_CATEGORIES } from "@/lib/bgos/mock";
import type { Difficulty, GameStatus } from "@/lib/bgos/types";
import {
  buildGameComponents,
  validateGameComponentDrafts,
  type GameComponentDraft,
} from "@/lib/bgos/game-checklist";

export const Route = createFileRoute("/app/games/")({
  head: () => ({
    meta: [
      { title: "Kho game — BoardGameOS" },
      { name: "description", content: "Danh mục toàn bộ bộ board game của quán kèm trạng thái, vị trí lưu trữ và thao tác nhanh." },
      { property: "og:title", content: "Kho game — BoardGameOS" },
      { property: "og:description", content: "Quản lý danh mục và trạng thái từng bộ board game." },
    ],
  }),
  component: GamesPage,
});

function GamesPage() {
  const { games, addGame, setGameStatus } = useStore();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");
  const [players, setPlayers] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [qrGame, setQrGame] = useState<string | null>(null);
  const [maintenanceGameId, setMaintenanceGameId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      games.filter((g) => {
        if (q && !`${g.name} ${g.code}`.toLowerCase().includes(q.toLowerCase())) return false;
        if (cat !== "all" && g.category !== cat) return false;
        if (status !== "all" && g.status !== status) return false;
        if (players !== "all") {
          const p = Number(players);
          if (p < g.minPlayers || p > g.maxPlayers) return false;
        }
        return true;
      }),
    [games, q, cat, status, players],
  );

  const qrTarget = games.find((g) => g.id === qrGame);
  const maintenanceGame = games.find((g) => g.id === maintenanceGameId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kho game"
        description={`${games.length} bộ game đang được quản lý.`}
        actions={
          <Button className="rounded-xl" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" /> Thêm game mới
          </Button>
        }
      />

      <div className="card-soft grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo tên hoặc mã" className="rounded-xl pl-9" />
        </div>
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger className="rounded-xl"><SelectValue placeholder="Thể loại" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả thể loại</SelectItem>
            {GAME_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="rounded-xl"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {Object.entries(GAME_STATUS_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={players} onValueChange={setPlayers}>
          <SelectTrigger className="rounded-xl"><SelectValue placeholder="Số người chơi" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Mọi số người chơi</SelectItem>
            {[2, 3, 4, 5, 6, 8].map((n) => <SelectItem key={n} value={String(n)}>{n} người</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Boxes} title="Không tìm thấy game phù hợp" description="Thử đổi từ khóa hoặc bỏ bớt bộ lọc để xem thêm kết quả." />
      ) : (
        <>
          <div className="card-soft hidden overflow-hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Game</TableHead>
                  <TableHead>Mã</TableHead>
                  <TableHead>Thể loại</TableHead>
                  <TableHead>Số người</TableHead>
                  <TableHead>Thời lượng</TableHead>
                  <TableHead>Độ khó</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <GameThumb emoji={g.emoji} tone={g.tone} imageDataUrl={g.imageDataUrl} alt={`Ảnh bìa ${g.name}`} size="sm" />
                        <span className="font-medium">{g.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{g.code}</TableCell>
                    <TableCell>{g.category}</TableCell>
                    <TableCell>{playersLabel(g.minPlayers, g.maxPlayers)}</TableCell>
                    <TableCell>{g.duration} phút</TableCell>
                    <TableCell>{g.difficulty}</TableCell>
                    <TableCell><GameStatusBadge status={g.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{g.location}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" className="rounded-lg" onClick={() => setQrGame(g.id)}>
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-lg"
                          onClick={() => setMaintenanceGameId(g.id)}
                        >
                          <Wrench className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-lg" onClick={() => navigate({ to: "/app/games/$gameId", params: { gameId: g.id } })}>
                          Chi tiết
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
            {filtered.map((g) => (
              <Link key={g.id} to="/app/games/$gameId" params={{ gameId: g.id }} className="card-soft card-hover flex gap-3 p-4">
                <GameThumb emoji={g.emoji} tone={g.tone} imageDataUrl={g.imageDataUrl} alt={`Ảnh bìa ${g.name}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">{g.name}</p>
                    <GameStatusBadge status={g.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{g.code} · {g.category}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {playersLabel(g.minPlayers, g.maxPlayers)} · {g.duration} phút · {g.difficulty}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{g.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      <Dialog open={!!qrGame} onOpenChange={(v) => !v && setQrGame(null)}>
        <DialogContent className="max-w-sm rounded-2xl text-center">
          <DialogHeader>
            <DialogTitle>Mã QR bộ game</DialogTitle>
            <DialogDescription>Dán mã này lên hộp game để quét khi giao nhận.</DialogDescription>
          </DialogHeader>
          <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-xl border border-border bg-muted">
            <QrCode className="h-24 w-24 text-foreground" />
          </div>
          <p className="font-medium">{qrTarget?.name}</p>
          <p className="text-sm text-muted-foreground">{qrTarget?.code}</p>
          <Button variant="outline" className="rounded-xl" onClick={() => toast.success("Đã gửi lệnh in mã QR")}>In mã QR</Button>
        </DialogContent>
      </Dialog>

      <ConfirmActionDialog
        open={!!maintenanceGameId}
        onOpenChange={(nextOpen) => !nextOpen && setMaintenanceGameId(null)}
        title={`Chuyển ${maintenanceGame?.name ?? "game"} sang bảo trì?`}
        description="Game sẽ không còn được xem là sẵn sàng để giao cho khách cho đến khi trạng thái được cập nhật lại."
        confirmLabel="Chuyển sang bảo trì"
        onConfirm={() => {
          if (!maintenanceGame) return;
          setGameStatus(maintenanceGame.id, "maintenance", "Chuyển sang bảo trì");
          toast.success(`${maintenanceGame.name} đã chuyển sang bảo trì`);
          setMaintenanceGameId(null);
        }}
      />

      <AddGameDialog open={addOpen} onOpenChange={setAddOpen} onAdd={addGame} />
    </div>
  );
}

function AddGameDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: ReturnType<typeof useStore>["addGame"];
}) {
  const emptyForm = () => ({
    name: "",
    code: "",
    category: GAME_CATEGORIES[0],
    minPlayers: "2",
    maxPlayers: "4",
    duration: "45",
    difficulty: "Dễ" as Difficulty,
    location: "",
    description: "",
  });
  const [form, setForm] = useState(emptyForm);
  const [imageDataUrl, setImageDataUrl] = useState<string>();
  const [imageFileName, setImageFileName] = useState("");
  const [imageProcessing, setImageProcessing] = useState(false);
  const [components, setComponents] = useState<GameComponentDraft[]>([]);
  const [emptyChecklistOpen, setEmptyChecklistOpen] = useState(false);

  const resetForm = () => {
    setForm(emptyForm());
    setImageDataUrl(undefined);
    setImageFileName("");
    setImageProcessing(false);
    setComponents([]);
    setEmptyChecklistOpen(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  };

  const saveGame = () => {
    onAdd({
      name: form.name.trim(),
      code: form.code.trim(),
      category: form.category,
      minPlayers: Number(form.minPlayers),
      maxPlayers: Number(form.maxPlayers),
      duration: Number(form.duration),
      difficulty: form.difficulty,
      status: "available" as GameStatus,
      location: form.location.trim(),
      description: form.description.trim(),
      age: 8,
      interaction: "Vừa",
      mode: "Cạnh tranh",
      beginnerFriendly: true,
      emoji: "🎲",
      tone: 2,
      imageDataUrl,
      components: buildGameComponents(components),
      notes: "",
    });
    toast.success("Đã thêm game mới vào kho");
    resetForm();
    onOpenChange(false);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.code.trim() || !form.location.trim()) {
      toast.error("Vui lòng nhập tên game, mã game và vị trí lưu trữ.");
      return;
    }
    const checklistError = validateGameComponentDrafts(components);
    if (checklistError) {
      toast.error(checklistError);
      return;
    }
    if (components.length === 0) {
      setEmptyChecklistOpen(true);
      return;
    }
    saveGame();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>Thêm game mới</DialogTitle>
          <DialogDescription>Nhập thông tin game và khai báo danh sách linh kiện chuẩn nếu đã có.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-3 sm:grid-cols-2" onSubmit={submit}>
          <div className="sm:col-span-2">
            <Label>Ảnh bìa</Label>
            <GameImagePicker
              className="mt-1.5"
              imageDataUrl={imageDataUrl}
              fileName={imageFileName}
              onImageChange={(nextImage, nextFileName) => {
                setImageDataUrl(nextImage);
                setImageFileName(nextFileName);
              }}
              onRemove={() => {
                setImageDataUrl(undefined);
                setImageFileName("");
              }}
              onProcessingChange={setImageProcessing}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="g-name">Tên game *</Label>
            <Input id="g-name" className="mt-1.5 rounded-xl" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="g-code">Mã game *</Label>
            <Input id="g-code" className="mt-1.5 rounded-xl" placeholder="BG-013" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="g-loc">Vị trí *</Label>
            <Input id="g-loc" className="mt-1.5 rounded-xl" placeholder="Kệ B - Ngăn 3" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <Label>Thể loại</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>{GAME_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Độ khó</Label>
            <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v as Difficulty })}>
              <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>{["Dễ", "Trung bình", "Khó"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="g-min">Số người tối thiểu</Label>
            <Input id="g-min" type="number" min={1} className="mt-1.5 rounded-xl" value={form.minPlayers} onChange={(e) => setForm({ ...form, minPlayers: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="g-max">Số người tối đa</Label>
            <Input id="g-max" type="number" min={1} className="mt-1.5 rounded-xl" value={form.maxPlayers} onChange={(e) => setForm({ ...form, maxPlayers: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="g-dur">Thời lượng (phút)</Label>
            <Input id="g-dur" type="number" min={5} className="mt-1.5 rounded-xl" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="g-desc">Mô tả ngắn</Label>
            <Textarea id="g-desc" className="mt-1.5 rounded-xl" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <div>
              <Label>Checklist linh kiện</Label>
              <p className="text-xs text-muted-foreground">Danh sách chuẩn để nhân viên đối chiếu khi nhận lại game.</p>
            </div>
            <GameChecklistEditor value={components} onChange={setComponents} />
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => handleOpenChange(false)}>Hủy</Button>
            <Button type="submit" className="rounded-xl" disabled={imageProcessing}>Lưu game</Button>
          </DialogFooter>
        </form>
        </DialogContent>
      </Dialog>
      <ConfirmActionDialog
        open={emptyChecklistOpen}
        onOpenChange={setEmptyChecklistOpen}
        title="Game chưa có checklist linh kiện"
        description="Bạn vẫn có thể tạo game và bổ sung danh sách linh kiện chuẩn tại trang chi tiết sau."
        cancelLabel="Quay lại"
        confirmLabel="Vẫn lưu game"
        onConfirm={saveGame}
      />
    </>
  );
}
