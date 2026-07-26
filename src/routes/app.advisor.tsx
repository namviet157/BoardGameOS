import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, EmptyState } from "@/components/bgos/StatCard";
import { GameThumb } from "@/components/bgos/GameThumb";
import { GameStatusBadge } from "@/components/bgos/StatusBadge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/lib/bgos/store";
import { playersLabel } from "@/lib/bgos/helpers";
import { GAME_CATEGORIES } from "@/lib/bgos/mock";

export const Route = createFileRoute("/app/advisor")({
  head: () => ({
    meta: [
      { title: "Tư vấn game cho khách — BoardGameOS" },
      { name: "description", content: "Lọc nhanh bộ game phù hợp theo số người chơi, thời lượng, độ khó và sở thích của khách." },
      { property: "og:title", content: "Tư vấn game cho khách — BoardGameOS" },
      { property: "og:description", content: "Gợi ý bộ game phù hợp cho từng nhóm khách." },
    ],
  }),
  component: AdvisorPage,
});

function AdvisorPage() {
  const { games, tables, staff, deliverGame } = useStore();
  const [players, setPlayers] = useState("4");
  const [duration, setDuration] = useState("60");
  const [difficulty, setDifficulty] = useState("all");
  const [category, setCategory] = useState("all");
  const [age, setAge] = useState("all");
  const [interaction, setInteraction] = useState("all");
  const [mode, setMode] = useState("all");
  const [beginner, setBeginner] = useState(false);

  const results = useMemo(
    () =>
      games
        .filter((g) => {
          const p = Number(players);
          if (p < g.minPlayers || p > g.maxPlayers) return false;
          if (g.duration > Number(duration)) return false;
          if (difficulty !== "all" && g.difficulty !== difficulty) return false;
          if (category !== "all" && g.category !== category) return false;
          if (age !== "all" && g.age > Number(age)) return false;
          if (interaction !== "all" && g.interaction !== interaction) return false;
          if (mode !== "all" && g.mode !== mode) return false;
          if (beginner && !g.beginnerFriendly) return false;
          return true;
        })
        .sort((a, b) => b.usage30d - a.usage30d),
    [games, players, duration, difficulty, category, age, interaction, mode, beginner],
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Tư vấn game" description="Chọn tiêu chí của nhóm khách để tìm bộ game phù hợp." />

      <div className="card-soft grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Số người chơi">
          <Select value={players} onValueChange={setPlayers}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>{[2,3,4,5,6,8,10].map((n) => <SelectItem key={n} value={String(n)}>{n} người</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Thời lượng tối đa">
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>{[20,30,45,60,90,120].map((n) => <SelectItem key={n} value={String(n)}>{n} phút</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Độ khó">
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {["Dễ","Trung bình","Khó"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Thể loại">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {GAME_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Độ tuổi">
          <Select value={age} onValueChange={setAge}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Mọi độ tuổi</SelectItem>
              {[6,8,10,12].map((n) => <SelectItem key={n} value={String(n)}>Từ {n} tuổi</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Mức độ tương tác">
          <Select value={interaction} onValueChange={setInteraction}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {["Thấp","Vừa","Cao"].map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Kiểu chơi">
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Cạnh tranh">Cạnh tranh</SelectItem>
              <SelectItem value="Hợp tác">Hợp tác</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <div className="flex items-center gap-3 pt-6">
          <Switch id="beginner" checked={beginner} onCheckedChange={setBeginner} />
          <Label htmlFor="beginner">Phù hợp người mới</Label>
        </div>
      </div>

      {results.length === 0 ? (
        <EmptyState icon={Sparkles} title="Chưa có game phù hợp" description="Thử nới rộng thời lượng hoặc bỏ bớt tiêu chí lọc." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((g) => (
            <div key={g.id} className="card-soft card-hover flex flex-col p-5">
              <div className="flex items-start gap-3">
                <GameThumb emoji={g.emoji} tone={g.tone} />
                <div className="flex-1">
                  <p className="font-medium">{g.name}</p>
                  <p className="text-xs text-muted-foreground">{playersLabel(g.minPlayers, g.maxPlayers)} · {g.duration} phút · {g.difficulty}</p>
                  <div className="mt-2"><GameStatusBadge status={g.status} /></div>
                </div>
              </div>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">
                Lý do đề xuất: phù hợp nhóm {players} người, thời lượng dưới {duration} phút{g.beginnerFriendly ? ", dễ hướng dẫn cho khách mới" : ""}.
              </p>
              <Select onValueChange={(tableId) => { deliverGame(g.id, tableId, staff[2].id); toast.success(`Đã gán ${g.name} cho bàn`); }}>
                <SelectTrigger className="mt-4 rounded-xl"><SelectValue placeholder="Gán game cho bàn" /></SelectTrigger>
                <SelectContent>{tables.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium">{label}</p>
      {children}
    </div>
  );
}
