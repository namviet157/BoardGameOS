import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { QrCode } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/bgos/StatCard";
import { QrScanDialog } from "@/components/bgos/QrScanDialog";
import { ConfirmActionDialog } from "@/components/bgos/ConfirmActionDialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useStore } from "@/lib/bgos/store";

export const Route = createFileRoute("/app/handover")({
  head: () => ({
    meta: [
      { title: "Giao và nhận game — BoardGameOS" },
      { name: "description", content: "Quy trình theo bước giúp rút ngắn thao tác giao game cho bàn và nhận lại game về kho." },
      { property: "og:title", content: "Giao và nhận game — BoardGameOS" },
      { property: "og:description", content: "Giao nhận game bằng mã QR theo từng bước." },
    ],
  }),
  component: HandoverPage,
});

function HandoverPage() {
  const { games, tables, staff, deliverGame, returnGame, saveComponents } = useStore();
  const [scanOpen, setScanOpen] = useState(false);
  const [gameId, setGameId] = useState("");
  const [tableId, setTableId] = useState("");
  const [staffId, setStaffId] = useState(staff[2]?.id ?? "");
  const [returnGameId, setReturnGameId] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);

  const returned = games.find((g) => g.id === returnGameId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Giao nhận game"
        description="Thực hiện theo từng bước để hạn chế sai sót khi giao và nhận game."
        actions={<Button className="rounded-xl" onClick={() => setScanOpen(true)}><QrCode className="h-4 w-4" /> Quét mã QR</Button>}
      />

      <Tabs defaultValue="deliver">
        <TabsList className="rounded-xl">
          <TabsTrigger value="deliver">Giao game</TabsTrigger>
          <TabsTrigger value="return">Nhận lại game</TabsTrigger>
        </TabsList>

        <TabsContent value="deliver" className="card-soft mt-4 space-y-5 p-5">
          <Step n={1} title="Chọn hoặc quét mã QR game">
            <div className="flex gap-2">
              <Select value={gameId} onValueChange={setGameId}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Chọn bộ game" /></SelectTrigger>
                <SelectContent>
                  {games.filter((g) => g.status === "available").map((g) => <SelectItem key={g.id} value={g.id}>{g.name} · {g.code}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" className="rounded-xl" onClick={() => setScanOpen(true)}><QrCode className="h-4 w-4" /></Button>
            </div>
          </Step>
          <Step n={2} title="Chọn bàn nhận game">
            <Select value={tableId} onValueChange={setTableId}>
              <SelectTrigger className="rounded-xl"><SelectValue placeholder="Chọn bàn" /></SelectTrigger>
              <SelectContent>{tables.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
            </Select>
          </Step>
          <Step n={3} title="Xác nhận nhân viên giao">
            <Select value={staffId} onValueChange={setStaffId}>
              <SelectTrigger className="rounded-xl"><SelectValue placeholder="Chọn nhân viên" /></SelectTrigger>
              <SelectContent>{staff.filter((s) => !s.locked).map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </Step>
          <Step n={4} title="Hoàn tất giao game">
            <Button
              className="rounded-xl"
              disabled={!gameId || !tableId || !staffId}
              onClick={() => { deliverGame(gameId, tableId, staffId); toast.success("Đã giao game cho bàn"); setGameId(""); setTableId(""); }}
            >
              Xác nhận giao game
            </Button>
          </Step>
        </TabsContent>

        <TabsContent value="return" className="card-soft mt-4 space-y-5 p-5">
          <Step n={1} title="Quét QR game cần nhận lại">
            <div className="flex gap-2">
              <Select value={returnGameId} onValueChange={(v) => { setReturnGameId(v); setChecked({}); }}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Chọn bộ game" /></SelectTrigger>
                <SelectContent>
                  {games.filter((g) => g.status === "in_use" || g.status === "pending_check").map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" className="rounded-xl" onClick={() => setScanOpen(true)}><QrCode className="h-4 w-4" /></Button>
            </div>
          </Step>
          <Step n={2} title="Thực hiện checklist linh kiện">
            {returned ? (
              <ul className="space-y-2">
                {returned.components.map((c) => (
                  <li key={c.id} className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm">
                    <Checkbox checked={checked[c.id] ?? c.ok} onCheckedChange={(v) => setChecked({ ...checked, [c.id]: Boolean(v) })} />
                    <span className="flex-1">{c.name}</span>
                    <span className="text-xs text-muted-foreground">x{c.qty}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Chọn game để hiển thị checklist linh kiện.</p>
            )}
          </Step>
          <Step n={3} title="Cập nhật trạng thái và đưa game về kho">
            <div className="flex flex-wrap gap-2">
              <Button
                className="rounded-xl"
                disabled={!returned}
                onClick={() => {
                  if (!returned) return;
                  const comps = returned.components.map((c) => ({ ...c, ok: checked[c.id] ?? c.ok }));
                  const missing = comps.some((c) => !c.ok);
                  saveComponents(returned.id, comps);
                  returnGame(returned.id, missing ? "missing_parts" : "available", missing ? "Nhận lại, thiếu linh kiện" : "Nhận lại, đầy đủ linh kiện");
                  toast.success(missing ? "Đã ghi nhận sự cố thiếu linh kiện" : "Game đã về kho");
                  setReturnGameId("");
                }}
              >
                Hoàn tất nhận game
              </Button>
              <Button
                variant="outline"
                className="rounded-xl"
                disabled={!returned}
                onClick={() => setMaintenanceOpen(true)}
              >
                Chuyển sang xử lý sự cố
              </Button>
            </div>
          </Step>
        </TabsContent>
      </Tabs>

      <ConfirmActionDialog
        open={maintenanceOpen}
        onOpenChange={setMaintenanceOpen}
        title={`Chuyển ${returned?.name ?? "game"} sang xử lý sự cố?`}
        description="Game sẽ được nhận lại và chuyển sang trạng thái bảo trì, không thể tiếp tục giao cho khách."
        confirmLabel="Chuyển sang bảo trì"
        onConfirm={() => {
          if (!returned) return;
          returnGame(returned.id, "maintenance", "Chuyển sang xử lý sự cố");
          toast.success("Đã chuyển game sang bảo trì");
          setReturnGameId("");
        }}
      />

      <QrScanDialog open={scanOpen} onOpenChange={setScanOpen} onScanned={(id) => { setGameId(id); setReturnGameId(id); toast.success("Đã quét mã QR game"); }} />
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-sm font-semibold text-primary">{n}</span>
      <div className="flex-1 space-y-3">
        <p className="font-medium">{title}</p>
        {children}
      </div>
    </div>
  );
}
