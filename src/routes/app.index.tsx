import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Boxes,
  ClipboardCheck,
  Grid2x2,
  Repeat,
  Sparkles,
  Wrench,
} from "lucide-react";
import { StatCard, PageHeader, EmptyState } from "@/components/bgos/StatCard";
import { TableStatusBadge } from "@/components/bgos/StatusBadge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/bgos/store";
import { TABLE_STATUS_LABEL, minutesSince, timeAgo } from "@/lib/bgos/helpers";
import { useMinuteRefresh } from "@/hooks/use-minute-refresh";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Tổng quan vận hành — BoardGameOS" },
      {
        name: "description",
        content:
          "Theo dõi nhanh số lượng game, bàn chơi, sự cố linh kiện và hoạt động nhân viên trong ngày.",
      },
      { property: "og:title", content: "Tổng quan vận hành — BoardGameOS" },
      {
        property: "og:description",
        content: "Bảng điều khiển tổng quan cho quán board game cafe.",
      },
    ],
  }),
  component: Overview,
});

function Overview() {
  useMinuteRefresh();
  const { games, tables, activities } = useStore();

  const available = games.filter((g) => g.status === "available").length;
  const pending = games.filter((g) => g.status === "pending_check").length;
  const activeTables = tables.filter(
    (t) => t.status === "playing" || t.status === "support",
  ).length;
  const openIncidents = games.reduce(
    (n, g) => n + g.incidents.filter((i) => !i.resolved).length,
    0,
  );

  const alerts = [
    ...tables
      .filter((t) => t.status === "playing" && minutesSince(t.startedAt) > 90)
      .map((t) => ({
        id: `over-${t.id}`,
        level: "warning" as const,
        text: `${t.name} đã chơi quá 90 phút`,
        to: "/app/tables",
      })),
    ...games
      .filter((g) => g.status === "pending_check")
      .map((g) => ({
        id: `check-${g.id}`,
        level: "warning" as const,
        text: `${g.name} trả về chưa kiểm tra`,
        to: "/app/checklist",
      })),
    ...games
      .filter((g) => g.status === "missing_parts")
      .map((g) => ({
        id: `miss-${g.id}`,
        level: "critical" as const,
        text: `${g.name} đang thiếu linh kiện`,
        to: "/app/games",
      })),
    ...tables
      .filter((t) => t.status === "support" || t.status === "issue")
      .map((t) => ({
        id: `sup-${t.id}`,
        level: "critical" as const,
        text: `${t.name}: ${TABLE_STATUS_LABEL[t.status]}`,
        to: "/app/tables",
      })),
  ].sort((a, b) => (a.level === b.level ? 0 : a.level === "critical" ? -1 : 1));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tổng quan"
        description="Bức tranh vận hành của quán trong ca hiện tại."
        actions={
          <>
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/app/tables">Sơ đồ bàn</Link>
            </Button>
            <Button asChild className="rounded-xl">
              <Link to="/app/handover">Giao nhận game</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Boxes}
          label="Game sẵn sàng"
          value={`${available}/${games.length}`}
          tone="success"
          hint="Có thể giao ngay cho khách"
        />
        <StatCard
          icon={Grid2x2}
          label="Bàn đang hoạt động"
          value={`${activeTables}/${tables.length}`}
          tone="primary"
          hint="Trong ca hiện tại"
        />
        <StatCard
          icon={ClipboardCheck}
          label="Chờ kiểm tra"
          value={pending}
          tone="warning"
          hint="Cần đối chiếu linh kiện"
        />
        <StatCard
          icon={Wrench}
          label="Sự cố đang mở"
          value={openIncidents}
          tone="danger"
          hint="Cần ưu tiên xử lý"
        />
      </div>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Thao tác nhanh</h2>
            <p className="text-xs text-muted-foreground">
              Các quy trình thường dùng trong ca làm việc.
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { to: "/app/handover", label: "Giao game", detail: "Gán game cho bàn", icon: Repeat },
            {
              to: "/app/handover",
              label: "Nhận game",
              detail: "Nhận lại và kiểm tra",
              icon: Boxes,
            },
            {
              to: "/app/checklist",
              label: "Kiểm tra linh kiện",
              detail: `${pending} game đang chờ`,
              icon: ClipboardCheck,
            },
            {
              to: "/app/advisor",
              label: "Tư vấn khách",
              detail: "Lọc game phù hợp",
              icon: Sparkles,
            },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.to as never}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3.5 transition-colors hover:border-primary/35 hover:bg-accent/40"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <action.icon className="h-4.5 w-4.5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{action.label}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {action.detail}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Cảnh báo cần xử lý</h2>
            <p className="text-xs text-muted-foreground">Sắp xếp theo mức độ ưu tiên.</p>
          </div>
          {alerts.length > 0 ? (
            <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive">
              {alerts.length} cảnh báo
            </span>
          ) : null}
        </div>
        {alerts.length === 0 ? (
          <EmptyState
            icon={ClipboardCheck}
            title="Không có cảnh báo"
            description="Toàn bộ game và bàn chơi đang ở trạng thái bình thường."
          />
        ) : (
          <ul className="grid gap-3 lg:grid-cols-2">
            {alerts.slice(0, 8).map((alert) => (
              <li
                key={alert.id}
                className={`flex items-center gap-3 rounded-lg border p-3.5 ${
                  alert.level === "critical"
                    ? "border-destructive/25 bg-destructive/5"
                    : "border-warning/30 bg-warning/5"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    alert.level === "critical"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-warning/15 text-warning-foreground"
                  }`}
                >
                  <AlertTriangle className="h-4.5 w-4.5" />
                </span>
                <p className="min-w-0 flex-1 text-sm font-medium">{alert.text}</p>
                <Button asChild size="sm" variant="ghost">
                  <Link to={alert.to as never}>Xem</Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold tracking-tight">Sơ đồ trạng thái bàn</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tables.map((t) => {
            const game = games.find((g) => g.id === t.gameId);
            return (
              <Link
                key={t.id}
                to="/app/tables"
                className={`card-soft card-hover block border-t-4 p-4 ${
                  t.status === "issue"
                    ? "border-t-destructive"
                    : t.status === "support"
                      ? "border-t-warning"
                      : t.status === "playing"
                        ? "border-t-primary"
                        : t.status === "empty"
                          ? "border-t-success"
                          : "border-t-muted-foreground/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{t.name}</span>
                  <TableStatusBadge status={t.status} />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {t.guests > 0 ? `${t.guests}/${t.seats} khách` : `Sức chứa ${t.seats} khách`}
                </p>
                <p className="mt-1 text-sm">{game ? game.name : "Chưa có game"}</p>
                {t.startedAt ? (
                  <p className="mt-1 text-xs text-muted-foreground" suppressHydrationWarning>
                    Đã chơi {minutesSince(t.startedAt)} phút
                  </p>
                ) : null}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="card-soft p-5">
        <h2 className="text-lg font-semibold tracking-tight">Hoạt động gần đây</h2>
        <ul className="mt-4 grid gap-x-8 gap-y-4 lg:grid-cols-2">
          {activities.slice(0, 8).map((a) => (
            <li key={a.id} className="flex gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <div>
                <p className="text-sm">{a.text}</p>
                <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                  {a.staff} · {timeAgo(a.at)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
