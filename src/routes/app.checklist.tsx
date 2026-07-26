import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ClipboardCheck, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, EmptyState } from "@/components/bgos/StatCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/lib/bgos/store";

export const Route = createFileRoute("/app/checklist")({
  head: () => ({
    meta: [
      { title: "Kiểm tra linh kiện — BoardGameOS" },
      { name: "description", content: "Checklist linh kiện theo từng bộ game, hỗ trợ kiểm soát linh kiện thiếu hoặc hư hỏng." },
      { property: "og:title", content: "Kiểm tra linh kiện — BoardGameOS" },
      { property: "og:description", content: "Checklist linh kiện cho từng bộ board game." },
    ],
  }),
  component: ChecklistPage,
});

function ChecklistPage() {
  const { games, saveComponents } = useStore();
  const [gameId, setGameId] = useState(games.find((g) => g.status === "pending_check")?.id ?? games[0]?.id ?? "");
  const game = games.find((g) => g.id === gameId);
  const [state, setState] = useState<Record<string, { ok: boolean; missing: number; note: string }>>({});
  const [level, setLevel] = useState("low");
  const [proof, setProof] = useState("");

  const get = (id: string, ok: boolean) => state[id] ?? { ok, missing: 0, note: "" };

  return (
    <div className="space-y-6">
      <PageHeader title="Kiểm tra linh kiện" description="Đối chiếu linh kiện thực tế với danh sách chuẩn của bộ game." />

      <div className="card-soft p-4">
        <Select value={gameId} onValueChange={(v) => { setGameId(v); setState({}); }}>
          <SelectTrigger className="rounded-xl sm:max-w-sm"><SelectValue placeholder="Chọn bộ game" /></SelectTrigger>
          <SelectContent>{games.map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {!game || game.components.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title="Chưa có checklist" description="Bộ game này chưa được cấu hình danh sách linh kiện." />
      ) : (
        <div className="card-soft space-y-4 p-5">
          <ul className="space-y-3">
            {game.components.map((c) => {
              const s = get(c.id, c.ok);
              return (
                <li key={c.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={s.ok} onCheckedChange={(v) => setState({ ...state, [c.id]: { ...s, ok: Boolean(v) } })} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">Số lượng chuẩn: {c.qty}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{s.ok ? "Đầy đủ" : "Thiếu"}</span>
                  </div>
                  {!s.ok ? (
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <Input type="number" min={1} placeholder="Số lượng thiếu" className="rounded-lg" value={s.missing || ""} onChange={(e) => setState({ ...state, [c.id]: { ...s, missing: Number(e.target.value) } })} />
                      <Input placeholder="Ghi chú hư hỏng" className="rounded-lg" value={s.note} onChange={(e) => setState({ ...state, [c.id]: { ...s, note: e.target.value } })} />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 text-sm font-medium">Mức độ sự cố</p>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Nhẹ</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Nghiêm trọng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="mb-1.5 text-sm font-medium">Ảnh minh chứng</p>
              <Button variant="outline" className="w-full rounded-xl" onClick={() => { setProof("anh-linh-kien.jpg"); toast.success("Đã tải ảnh minh chứng"); }}>
                <Upload className="h-4 w-4" /> {proof || "Chọn ảnh"}
              </Button>
            </div>
          </div>

          <Textarea placeholder="Ghi chú chung cho lần kiểm tra này" className="rounded-xl" />

          <Button
            className="rounded-xl"
            onClick={() => {
              const comps = game.components.map((c) => {
                const s = get(c.id, c.ok);
                return { ...c, ok: s.ok, missingQty: s.ok ? 0 : s.missing || 1, note: s.note || c.note };
              });
              saveComponents(game.id, comps);
              toast.success(comps.some((c) => !c.ok) ? "Đã ghi nhận thiếu linh kiện" : "Đã xác nhận đầy đủ linh kiện");
            }}
          >
            Xác nhận hoàn tất kiểm tra
          </Button>
        </div>
      )}
    </div>
  );
}
