import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { ConfirmActionDialog } from "@/components/bgos/ConfirmActionDialog";
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
      { name: "description", content: "Cấu hình thông tin quán, tùy chọn thông báo và dữ liệu demo của BoardGameOS." },
      { property: "og:title", content: "Cài đặt quán — BoardGameOS" },
      { property: "og:description", content: "Thiết lập thông tin quán và tùy chọn hệ thống." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, updateSettings, resetData } = useStore();
  const [resetOpen, setResetOpen] = useState(false);
  const [storeForm, setStoreForm] = useState(() => ({
    storeName: settings.storeName,
    hotline: settings.hotline,
    address: settings.address,
    openHours: settings.openHours,
  }));

  useEffect(() => {
    setStoreForm({
      storeName: settings.storeName,
      hotline: settings.hotline,
      address: settings.address,
      openHours: settings.openHours,
    });
  }, [settings.address, settings.hotline, settings.openHours, settings.storeName]);

  const hasStoreChanges =
    storeForm.storeName !== settings.storeName ||
    storeForm.hotline !== settings.hotline ||
    storeForm.address !== settings.address ||
    storeForm.openHours !== settings.openHours;
  const storeFormValid = Object.values(storeForm).every((value) => value.trim().length > 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Cài đặt" description="Thông tin quán và tùy chọn hệ thống." />

      <Tabs defaultValue="store">
        <TabsList className="rounded-xl">
          <TabsTrigger value="store">Thông tin quán</TabsTrigger>
          <TabsTrigger value="notify">Thông báo</TabsTrigger>
          <TabsTrigger value="data">Dữ liệu</TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="card-soft mt-4 grid gap-4 p-5 sm:grid-cols-2">
          <Field label="Tên quán" value={storeForm.storeName} onChange={(storeName) => setStoreForm((current) => ({ ...current, storeName }))} />
          <Field label="Hotline" value={storeForm.hotline} onChange={(hotline) => setStoreForm((current) => ({ ...current, hotline }))} />
          <Field label="Địa chỉ" value={storeForm.address} onChange={(address) => setStoreForm((current) => ({ ...current, address }))} />
          <Field label="Giờ mở cửa" value={storeForm.openHours} onChange={(openHours) => setStoreForm((current) => ({ ...current, openHours }))} />
          <div className="sm:col-span-2">
            <Button
              className="rounded-xl"
              disabled={!hasStoreChanges || !storeFormValid}
              onClick={() => {
                const savedSettings = {
                  storeName: storeForm.storeName.trim(),
                  hotline: storeForm.hotline.trim(),
                  address: storeForm.address.trim(),
                  openHours: storeForm.openHours.trim(),
                };
                updateSettings(savedSettings);
                setStoreForm(savedSettings);
                toast.success("Đã lưu thông tin quán");
              }}
            >
              Lưu thay đổi
            </Button>
          </div>
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
          <Button variant="destructive" className="rounded-xl" onClick={() => setResetOpen(true)}>
            Khôi phục dữ liệu mẫu
          </Button>
        </TabsContent>
      </Tabs>

      <ConfirmActionDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Khôi phục dữ liệu mẫu?"
        description="Toàn bộ thay đổi trong dữ liệu demo hiện tại sẽ bị xóa và không thể hoàn tác. Phiên đăng nhập của bạn vẫn được giữ nguyên."
        confirmLabel="Khôi phục"
        destructive
        onConfirm={() => {
          resetData();
          toast.success("Đã khôi phục dữ liệu mẫu");
        }}
      />
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
