import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader, StatCard } from "@/components/bgos/StatCard";
import { GameThumb } from "@/components/bgos/GameThumb";
import { useStore } from "@/lib/bgos/store";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Activity, AlertTriangle, Clock, LayoutGrid } from "lucide-react";

export const Route = createFileRoute("/app/reports")({
  head: () => ({
    meta: [
      { title: "Báo cáo vận hành — BoardGameOS" },
      {
        name: "description",
        content:
          "Biểu đồ lượt chơi, tỉ lệ sử dụng bàn, sự cố linh kiện và bảng xếp hạng game phổ biến.",
      },
      { property: "og:title", content: "Báo cáo vận hành — BoardGameOS" },
      {
        property: "og:description",
        content: "Thống kê hoạt động của quán board game theo thời gian.",
      },
    ],
  }),
  component: ReportsPage,
});

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid var(--color-border)",
  background: "var(--color-card)",
  boxShadow: "var(--shadow-lift)",
  fontSize: 12,
};

function compactDate(value: string) {
  const [, month, day] = value.split("-");
  return month && day ? `${day}/${month}` : value;
}

function ReportsPage() {
  const { reports, games } = useStore();
  const [selectedDays, setSelectedDays] = useState<7 | 14 | 30>(30);
  const filteredReports = reports.slice(-selectedDays);
  const totalSessions = filteredReports.reduce((a, r) => a + r.sessions, 0);
  const totalIncidents = filteredReports.reduce((a, r) => a + r.incidents, 0);
  const avgUsage = Math.round(
    filteredReports.reduce((a, r) => a + r.tableUsage, 0) / Math.max(filteredReports.length, 1),
  );
  const avgMinutes = Math.round(
    filteredReports.reduce((a, r) => a + r.avgMinutes, 0) / Math.max(filteredReports.length, 1),
  );
  const topGames = [...games].sort((a, b) => b.usage30d - a.usage30d).slice(0, 6);
  const byCategory = Object.entries(
    games.reduce<Record<string, number>>(
      (acc, g) => ({ ...acc, [g.category]: (acc[g.category] ?? 0) + g.usage30d }),
      {},
    ),
  ).map(([name, value]) => ({ name, value }));
  const totalCategoryUsage = byCategory.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo"
        description={`Tổng hợp hoạt động ${selectedDays} ngày gần nhất của quán.`}
        actions={
          <ToggleGroup
            type="single"
            value={String(selectedDays)}
            variant="outline"
            className="rounded-xl border border-border bg-background p-1"
            onValueChange={(value) => {
              if (value) setSelectedDays(Number(value) as 7 | 14 | 30);
            }}
          >
            {[7, 14, 30].map((days) => (
              <ToggleGroupItem
                key={days}
                value={String(days)}
                className="h-8 min-w-16 rounded-lg px-3"
              >
                {days} ngày
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Activity}
          label="Tổng lượt chơi"
          value={String(totalSessions)}
          hint={`${selectedDays} ngày gần nhất`}
        />
        <StatCard
          icon={LayoutGrid}
          label="Tỉ lệ dùng bàn"
          value={`${avgUsage}%`}
          hint="Trung bình mỗi ngày"
        />
        <StatCard
          icon={Clock}
          label="Thời lượng TB"
          value={`${avgMinutes} phút`}
          hint="Mỗi phiên chơi"
        />
        <StatCard
          icon={AlertTriangle}
          label="Sự cố linh kiện"
          value={String(totalIncidents)}
          hint="Cần theo dõi"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card-soft p-5">
          <p className="font-medium">Lượt chơi theo ngày</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredReports}>
                <CartesianGrid vertical={false} stroke="var(--color-border)" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  tickFormatter={compactDate}
                  minTickGap={24}
                />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelFormatter={(label) => `Ngày ${compactDate(String(label))}`}
                  formatter={(value) => [`${value} lượt`, "Lượt chơi"]}
                />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-soft p-5">
          <p className="font-medium">Tỉ lệ sử dụng bàn (%)</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredReports}>
                <CartesianGrid vertical={false} stroke="var(--color-border)" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  tickFormatter={compactDate}
                  minTickGap={24}
                />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelFormatter={(label) => `Ngày ${compactDate(String(label))}`}
                  formatter={(value) => [`${value}%`, "Sử dụng bàn"]}
                />
                <Bar dataKey="tableUsage" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-soft p-5">
          <div>
            <p className="font-medium">Cơ cấu lượt chơi theo thể loại</p>
            <p className="text-xs text-muted-foreground">30 ngày gần nhất</p>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byCategory}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {byCategory.map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value, name) => [`${value} lượt`, String(name)]}
                />
                <text
                  x="50%"
                  y="46%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground text-xl font-semibold"
                >
                  {totalCategoryUsage}
                </text>
                <text
                  x="50%"
                  y="56%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-muted-foreground text-[11px]"
                >
                  lượt chơi
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-soft p-5">
          <div>
            <p className="font-medium">Top game được chơi nhiều nhất</p>
            <p className="text-xs text-muted-foreground">30 ngày gần nhất</p>
          </div>
          <ul className="mt-4 space-y-3">
            {topGames.map((g, i) => (
              <li
                key={g.id}
                className="flex items-center gap-3 rounded-lg border border-transparent p-1.5 transition-colors hover:border-border hover:bg-muted/40"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/12 text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <GameThumb
                  emoji={g.emoji}
                  tone={g.tone}
                  imageDataUrl={g.imageDataUrl}
                  coverImageUrl={g.coverImageUrl}
                  alt={`Ảnh bìa ${g.name}`}
                  size="sm"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{g.name}</span>
                  <span className="block text-xs text-muted-foreground">{g.category}</span>
                </span>
                <span className="text-sm text-muted-foreground">{g.usage30d} lượt</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
