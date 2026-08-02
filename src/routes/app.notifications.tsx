import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, EmptyState } from "@/components/bgos/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/bgos/store";
import { timeAgo } from "@/lib/bgos/helpers";
import type { AppNotification } from "@/lib/bgos/types";
import { useMinuteRefresh } from "@/hooks/use-minute-refresh";

export const Route = createFileRoute("/app/notifications")({
  head: () => ({
    meta: [
      { title: "Thông báo — BoardGameOS" },
      { name: "description", content: "Trung tâm cảnh báo về linh kiện thiếu, bàn cần hỗ trợ và các việc cần xử lý trong ca." },
      { property: "og:title", content: "Thông báo — BoardGameOS" },
      { property: "og:description", content: "Theo dõi cảnh báo vận hành theo thời gian thực." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  useMinuteRefresh();
  const { notifications, markNotification, markAllRead } = useStore();
  const groups: { key: string; label: string; items: AppNotification[] }[] = [
    { key: "all", label: "Tất cả", items: notifications },
    { key: "unread", label: "Chưa đọc", items: notifications.filter((n) => !n.read) },
    { key: "critical", label: "Khẩn cấp", items: notifications.filter((n) => n.level === "critical") },
    { key: "resolved", label: "Đã xử lý", items: notifications.filter((n) => n.resolved) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thông báo"
        description="Các cảnh báo cần chú ý trong ca làm việc."
        actions={<Button variant="outline" className="rounded-xl" onClick={() => { markAllRead(); toast.success("Đã đánh dấu tất cả là đã đọc"); }}>Đánh dấu đã đọc</Button>}
      />

      <Tabs defaultValue="all">
        <TabsList className="rounded-xl">
          {groups.map((g) => <TabsTrigger key={g.key} value={g.key}>{g.label}</TabsTrigger>)}
        </TabsList>
        {groups.map((g) => (
          <TabsContent key={g.key} value={g.key} className="mt-4 space-y-3">
            {g.items.length === 0 ? (
              <EmptyState icon={Bell} title="Không có thông báo" description="Mọi thứ đang trong tầm kiểm soát." />
            ) : (
              g.items.map((n) => (
                <div key={n.id} className="card-soft flex flex-wrap items-start gap-3 p-4">
                  <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${n.level === "critical" ? "bg-destructive" : n.level === "warning" ? "bg-primary" : "bg-muted-foreground"}`} />
                  <div className="min-w-56 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{n.title}</p>
                      <Badge variant="secondary" className="rounded-lg text-[11px]">{n.type}</Badge>
                      {!n.read ? <Badge className="rounded-lg text-[11px]">Mới</Badge> : null}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{timeAgo(n.at)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="rounded-lg" onClick={() => markNotification(n.id, { read: true })}>Đã đọc</Button>
                    <Button size="sm" variant="outline" className="rounded-lg" disabled={n.resolved} onClick={() => { markNotification(n.id, { resolved: true, read: true }); toast.success("Đã xử lý thông báo"); }}>
                      {n.resolved ? "Đã xử lý" : "Xử lý"}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
