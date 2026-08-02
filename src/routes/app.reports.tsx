import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, StatCard } from "@/components/bgos/StatCard";
import { useStore } from "@/lib/bgos/store";
import { Activity, AlertTriangle, Clock, LayoutGrid } from "lucide-react";

export const Route = createFileRoute("/app/reports")({
  head: () => ({
    meta: [
      { title: "Báo cáo vận hành — BoardGameOS" },
      { name: "description", content: "Biểu đồ lượt chơi, tỉ lệ sử dụng bàn, sự cố linh kiện và bảng xếp hạng game phổ biến." },
      { property: "og:title", content: "Báo cáo vận hành — BoardGameOS" },
      { property: "og:description", content: "Thống kê hoạt động của quán board game theo thời gian." },
    ],
  }),
  component: ReportsPage,
});

const COLORS = ["#D97745", "#E8A87C", "#7C9A92", "#C4654A", "#B7A99A"];

function ReportsPage() {
  const { reports, games } = useStore();
  const totalSessions = reports.reduce((a, r) => a + r.sessions, 0);
  const totalIncidents = reports.reduce((a, r) => a + r.incidents, 0);
  const avgUsage = Math.round(reports.reduce((a, r) => a + r.tableUsage, 0) / Math.max(reports.length, 1));
  const avgMinutes = Math.round(reports.reduce((a, r) => a + r.avgMinutes, 0) / Math.max(reports.length, 1));
  const topGames = [...games].sort((a, b) => b.usage30d - a.usage30d).slice(0, 6);
  const byCategory = Object.entries(
    games.reduce<Record<string, number>>((acc, g) => ({ ...acc, [g.category]: (acc[g.category] ?? 0) + g.usage30d }), {}),
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <PageHeader title="Báo cáo" description="Tổng hợp hoạt động 30 ngày gần nhất của quán." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Activity} label="Tổng lượt chơi" value={String(totalSessions)} hint="30 ngày gần nhất" />
        <StatCard icon={LayoutGrid} label="Tỉ lệ dùng bàn" value={`${avgUsage}%`} hint="Trung bình mỗi ngày" />
        <StatCard icon={Clock} label="Thời lượng TB" value={`${avgMinutes} phút`} hint="Mỗi phiên chơi" />
        <StatCard icon={AlertTriangle} label="Sự cố linh kiện" value={String(totalIncidents)} hint="Cần theo dõi" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card-soft p-5">
          <p className="font-medium">Lượt chơi theo ngày</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reports}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(47,41,37,0.08)" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="sessions" stroke="#D97745" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-soft p-5">
          <p className="font-medium">Tỉ lệ sử dụng bàn (%)</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reports}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(47,41,37,0.08)" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="tableUsage" fill="#D97745" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-soft p-5">
          <p className="font-medium">Cơ cấu lượt chơi theo thể loại</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {byCategory.map((entry, i) => <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-soft p-5">
          <p className="font-medium">Top game được chơi nhiều nhất</p>
          <ul className="mt-4 space-y-3">
            {topGames.map((g, i) => (
              <li key={g.id} className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/12 text-xs font-semibold text-primary">{i + 1}</span>
                <span className="flex-1 text-sm">{g.name}</span>
                <span className="text-sm text-muted-foreground">{g.usage30d} lượt</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
