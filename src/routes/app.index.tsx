import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Boxes,
  ClipboardCheck,
  Grid2x2,
  PackageSearch,
  PlayCircle,
  Wrench,
} from "lucide-react";
import { StatCard, PageHeader, EmptyState } from "@/components/bgos/StatCard";
import { TableStatusBadge } from "@/components/bgos/StatusBadge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/bgos/store";
import { TABLE_STATUS_LABEL, minutesSince, timeAgo } from "@/lib/bgos/helpers";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Tổng quan vận hành — BoardGameOS" },
      { name: "description", content: "Theo dõi nhanh số lượng game, bàn chơi, sự cố linh kiện và hoạt động nhân viên trong ngày." },
      { property: "og:title", content: "Tổng quan vận hành — BoardGameOS" },
      { property: "og:description", content: "Bảng điều khiển tổng quan cho quán board game cafe." },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { games, tables, activities } = useStore();

  const inUse = games.filter((g) => g.status === "in_use").length;
  const pending = games.filter((g) => g.status === "pending_check").length;
  const missing = games.filter((g) => g.status === "missing_parts").length;
  const maintenance = games.filter((g) => g.status === "maintenance").length;
  const activeTables = tables.filter((t) => t.status === "playing" || t.status === "support").length;
  const openIncidents = games.reduce((n, g) => n + g.incidents.filter((i) => !i.resolved).length, 0);

  const alerts = [
    ...tables
      .filter((t) => t.status === "playing" && minutesSince(t.startedAt) > 90)
      .map((t) => ({ id: `over-${t.id}`, level: "warning" as const, text: `${t.name} đã chơi quá 90 phút`, to: "/app/tables" })),
    ...games
      .filter((g) => g.status === "pending_check")
      .map((g) => ({ id: `check-${g.id}`, level: "warning" as const, text: `${g.name} trả về chưa kiểm tra`, to: "/app/checklist" })),
    ...games
      .filter((g) => g.status === "missing_parts")
      .map((g) => ({ id: `miss-${g.id}`, level: "critical" as const, text: `${g.name} đang thiếu linh kiện`, to: "/app/games" })),
    ...tables
      .filter((t) => t.status === "support" || t.status === "issue")
      .map((t) => ({ id: `sup-${t.id}`, level: "critical" as const, text: `${t.name}: ${TABLE_STATUS_LABEL[t.status]}`, to: "/app/tables" })),
  ];

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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={Boxes} label="Tổng số bộ game" value={games.length} tone="primary" hint="Đang quản lý trong kho" />
        <StatCard icon={PlayCircle} label="Game đang được sử dụng" value={inUse} tone="primary" />
        <StatCard icon={Grid2x2} label="Bàn đang hoạt động" value={`${activeTables}/${tables.length}`} tone="success" />
        <StatCard icon={ClipboardCheck} label="Game cần kiểm tra" value={pending} tone="warning" />
        <StatCard icon={PackageSearch} label="Linh kiện bị thiếu" value={missing} tone="danger" />
        <StatCard icon={Wrench} label="Sự cố chưa xử lý" value={openIncidents} tone="danger" hint={`${maintenance} game đang bảo trì`} />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold tracking-tight">Sơ đồ trạng thái bàn</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tables.map((t) => {
            const game = games.find((g) => g.id === t.gameId);
            return (
              <Link
                key={t.id}
                to="/app/tables"
                className="card-soft card-hover block p-4"
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
                  <p className="mt-1 text-xs text-muted-foreground">Đã chơi {minutesSince(t.startedAt)} phút</p>
                ) : null}
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card-soft p-5">
          <h2 className="text-lg font-semibold tracking-tight">Hoạt động gần đây</h2>
          <ul className="mt-4 space-y-4">
            {activities.slice(0, 8).map((a) => (
              <li key={a.id} className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="text-sm">{a.text}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.staff} · {timeAgo(a.at)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card-soft p-5">
          <h2 className="text-lg font-semibold tracking-tight">Cảnh báo cần xử lý</h2>
          {alerts.length === 0 ? (
            <div className="mt-4">
              <EmptyState icon={ClipboardCheck} title="Không có cảnh báo" description="Toàn bộ game và bàn chơi đang ở trạng thái bình thường." />
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {alerts.slice(0, 8).map((a) => (
                <li key={a.id} className="flex items-start gap-3 rounded-xl border border-border p-3">
                  <AlertTriangle
                    className={`mt-0.5 h-4.5 w-4.5 shrink-0 ${a.level === "critical" ? "text-destructive" : "text-warning"}`}
                  />
                  <p className="flex-1 text-sm">{a.text}</p>
                  <Button asChild size="sm" variant="ghost" className="rounded-lg">
                    <Link to={a.to as never}>Xem</Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
