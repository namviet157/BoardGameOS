import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/bgos/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/bgos/store";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Cài đặt quán — BoardGameOS" },
      { name: "description", content: "Cấu hình thông tin quán, chi nhánh, tùy chọn thông báo và dữ liệu demo của BoardGameOS." },
      { property: "og:title", content: "Cài đặt quán — BoardGameOS" },
      { property: "og:description", content: "Thiết lập thông tin quán và tùy chọn hệ thống." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, updateSettings, resetData } = useStore();

  return (
    <div className="space-y-6">
      <PageHeader title="Cài đặt" description="Thông tin quán và tùy chọn hệ thống." />

      <Tabs defaultValue="store">
        <TabsList className="rounded-xl">
          <TabsTrigger value="store">Thông tin quán</TabsTrigger>
          <TabsTrigger value="branches">Chi nhánh</TabsTrigger>
          <TabsTrigger value="notify">Thông báo</TabsTrigger>
          <TabsTrigger value="data">Dữ liệu</TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="card-soft mt-4 grid gap-4 p-5 sm:grid-cols-2">
          <Field label="Tên quán" value={settings.storeName} onChange={(v) => updateSettings({ storeName: v })} />
          <Field label="Hotline" value={settings.hotline} onChange={(v) => updateSettings({ hotline: v })} />
          <Field label="Địa chỉ" value={settings.address} onChange={(v) => updateSettings({ address: v })} />
          <Field label="Giờ mở cửa" value={settings.openHours} onChange={(v) => updateSettings({ openHours: v })} />
          <div className="sm:col-span-2">
            <Button className="rounded-xl" onClick={() => toast.success("Đã lưu thông tin quán")}>Lưu thay đổi</Button>
          </div>
        </TabsContent>

        <TabsContent value="branches" className="mt-4 grid gap-4 sm:grid-cols-2">
          {settings.branches.map((b) => (
            <div key={b.id} className="card-soft p-5">
              <p className="font-medium">{b.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{b.address}</p>
              <p className="mt-2 text-sm text-muted-foreground">{b.tables} bàn chơi</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="notify" className="card-soft mt-4 space-y-4 p-5">
          <Toggle label="Cảnh báo thiếu linh kiện" checked={settings.notifyMissing} onChange={(v) => updateSettings({ notifyMissing: v })} />
          <Toggle label="Thông báo bàn cần hỗ trợ" checked={settings.notifySupport} onChange={(v) => updateSettings({ notifySupport: v })} />
          <Toggle label="Báo cáo tổng kết cuối ngày" checked={settings.notifyDailyReport} onChange={(v) => updateSettings({ notifyDailyReport: v })} />
          <Toggle label="Giao diện gọn cho máy tính bảng" checked={settings.compactMode} onChange={(v) => updateSettings({ compactMode: v })} />
        </TabsContent>

        <TabsContent value="data" className="card-soft mt-4 space-y-3 p-5">
          <p className="text-sm text-muted-foreground">
            Dữ liệu demo được lưu trên trình duyệt của bạn. Bạn có thể khôi phục về dữ liệu mẫu ban đầu bất cứ lúc nào.
          </p>
          <Button variant="destructive" className="rounded-xl" onClick={() => { resetData(); toast.success("Đã khôi phục dữ liệu mẫu"); }}>
            Khôi phục dữ liệu mẫu
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      <Input className="rounded-xl" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border p-3">
      <Label>{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
