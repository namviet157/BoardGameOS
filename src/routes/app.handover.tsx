import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { QrCode } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/bgos/StatCard";
import { QrScanDialog } from "@/components/bgos/QrScanDialog";
import { ConfirmActionDialog } from "@/components/bgos/ConfirmActionDialog";
import { ComponentInspectionForm } from "@/components/bgos/ComponentInspectionForm";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  componentInspectionResult,
  createComponentInspectionDraft,
  validateComponentInspection,
} from "@/lib/bgos/component-inspection";
import { useStore } from "@/lib/bgos/store";
import type { GameComponentItem, GameIncident } from "@/lib/bgos/types";

export const Route = createFileRoute("/app/handover")({
  head: () => ({
    meta: [
      { title: "Giao và nhận game — BoardGameOS" },
      {
        name: "description",
        content:
          "Quy trình theo bước giúp rút ngắn thao tác giao game cho bàn và nhận lại game về kho.",
      },
      { property: "og:title", content: "Giao và nhận game — BoardGameOS" },
      { property: "og:description", content: "Giao nhận game bằng mã QR theo từng bước." },
    ],
  }),
  component: HandoverPage,
});

function HandoverPage() {
  const { games, tables, staff, deliverGame, saveComponentInspection } = useStore();
  const [scanOpen, setScanOpen] = useState(false);
  const [gameId, setGameId] = useState("");
  const [tableId, setTableId] = useState("");
  const [staffId, setStaffId] = useState(staff[2]?.id ?? "");
  const [returnGameId, setReturnGameId] = useState("");
  const [inspectionDraft, setInspectionDraft] = useState<GameComponentItem[]>([]);
  const [inspectionLevel, setInspectionLevel] = useState<GameIncident["level"]>("low");
  const [inspectionNote, setInspectionNote] = useState("");
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);

  const returned = games.find((g) => g.id === returnGameId);

  const selectReturnGame = (id: string) => {
    const selected = games.find((game) => game.id === id);
    setReturnGameId(id);
    setInspectionDraft(createComponentInspectionDraft(selected?.components ?? []));
    setInspectionLevel("low");
    setInspectionNote("");
  };

  const resetReturn = () => {
    setReturnGameId("");
    setInspectionDraft([]);
    setInspectionLevel("low");
    setInspectionNote("");
  };

  const completeReturn = (forceMaintenance = false) => {
    if (!returned) return;
    const validationError = validateComponentInspection(inspectionDraft);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    saveComponentInspection({
      gameId: returned.id,
      components: inspectionDraft,
      level: inspectionLevel,
      note: inspectionNote,
      context: "return",
      forceMaintenance,
    });
    const result = componentInspectionResult(inspectionDraft);
    toast.success(
      forceMaintenance || result === "damaged"
        ? "Đã nhận game và chuyển sang bảo trì"
        : result === "missing"
          ? "Đã ghi nhận số lượng linh kiện thiếu"
          : inspectionDraft.length === 0
            ? "Đã nhận game, cần cấu hình checklist để kiểm tra"
            : "Game đã về kho và đầy đủ linh kiện",
    );
    resetReturn();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Giao nhận game"
        description="Thực hiện theo từng bước để hạn chế sai sót khi giao và nhận game."
        actions={
          <Button className="rounded-xl" onClick={() => setScanOpen(true)}>
            <QrCode className="h-4 w-4" /> Quét mã QR
          </Button>
        }
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
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Chọn bộ game" />
                </SelectTrigger>
                <SelectContent>
                  {games
                    .filter((g) => g.status === "available")
                    .map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.name} · {g.code}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="rounded-xl" onClick={() => setScanOpen(true)}>
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
          </Step>
          <Step n={2} title="Chọn bàn nhận game">
            <Select value={tableId} onValueChange={setTableId}>
              <SelectTrigger className="rounded-xl">
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
          </Step>
          <Step n={3} title="Xác nhận nhân viên giao">
            <Select value={staffId} onValueChange={setStaffId}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Chọn nhân viên" />
              </SelectTrigger>
              <SelectContent>
                {staff
                  .filter((s) => !s.locked)
                  .map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </Step>
          <Step n={4} title="Hoàn tất giao game">
            <Button
              className="rounded-xl"
              disabled={!gameId || !tableId || !staffId}
              onClick={() => {
                deliverGame(gameId, tableId, staffId);
                toast.success("Đã giao game cho bàn");
                setGameId("");
                setTableId("");
              }}
            >
              Xác nhận giao game
            </Button>
          </Step>
        </TabsContent>

        <TabsContent value="return" className="card-soft mt-4 space-y-5 p-5">
          <Step n={1} title="Quét QR game cần nhận lại">
            <div className="flex gap-2">
              <Select value={returnGameId} onValueChange={selectReturnGame}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Chọn bộ game" />
                </SelectTrigger>
                <SelectContent>
                  {games
                    .filter((g) => g.status === "in_use" || g.status === "pending_check")
                    .map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="rounded-xl" onClick={() => setScanOpen(true)}>
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
          </Step>
          <Step n={2} title="Thực hiện checklist linh kiện">
            {returned ? (
              <ComponentInspectionForm
                value={inspectionDraft}
                onChange={setInspectionDraft}
                level={inspectionLevel}
                onLevelChange={setInspectionLevel}
                generalNote={inspectionNote}
                onGeneralNoteChange={setInspectionNote}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Chọn game để hiển thị checklist linh kiện.
              </p>
            )}
          </Step>
          <Step n={3} title="Cập nhật trạng thái và đưa game về kho">
            <div className="flex flex-wrap gap-2">
              <Button className="rounded-xl" disabled={!returned} onClick={() => completeReturn()}>
                Hoàn tất nhận game
              </Button>
              <Button
                variant="outline"
                className="rounded-xl"
                disabled={!returned}
                onClick={() => {
                  const validationError = validateComponentInspection(inspectionDraft);
                  if (validationError) {
                    toast.error(validationError);
                    return;
                  }
                  setMaintenanceOpen(true);
                }}
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
          completeReturn(true);
        }}
      />

      <QrScanDialog
        open={scanOpen}
        onOpenChange={setScanOpen}
        onScanned={(id) => {
          setGameId(id);
          selectReturnGame(id);
          toast.success("Đã quét mã QR game");
        }}
      />
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-sm font-semibold text-primary">
        {n}
      </span>
      <div className="flex-1 space-y-3">
        <p className="font-medium">{title}</p>
        {children}
      </div>
    </div>
  );
}
