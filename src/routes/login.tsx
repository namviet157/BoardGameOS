import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Grid2x2, ClipboardCheck, QrCode, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useStore } from "@/lib/bgos/store";
import heroImage from "@/assets/cafe-hero.jpg";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Đăng nhập — BoardGameOS" },
      {
        name: "description",
        content:
          "Đăng nhập vào bảng điều khiển BoardGameOS để quản lý kho game, bàn chơi và nhân viên.",
      },
      { property: "og:title", content: "Đăng nhập — BoardGameOS" },
      {
        property: "og:description",
        content: "Truy cập bảng điều khiển vận hành dành cho quán board game cafe.",
      },
    ],
  }),
  component: LoginPage,
});

const demoAccounts = [
  { email: "owner@boardgameos.vn", role: "Chủ quán" },
  { email: "staff@boardgameos.vn", role: "Nhân viên" },
];

function LoginPage() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("owner@boardgameos.vn");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }
    if (!login(email)) {
      setError("Tài khoản không tồn tại hoặc đang bị khóa. Hãy dùng tài khoản demo bên dưới.");
      return;
    }
    toast.success("Đăng nhập thành công");
    navigate({ to: "/app" });
  };

  return (
    <div className="grid min-h-screen bg-card lg:grid-cols-[1.08fr_0.92fr]">
      <div
        className="relative hidden overflow-hidden bg-cover bg-center text-white lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-14"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <Link to="/" className="relative z-10 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-primary shadow-lg">
            <Grid2x2 className="h-4.5 w-4.5" />
          </span>
          <span className="font-semibold">BoardGameOS</span>
        </Link>
        <div className="relative z-10">
          <p className="mb-3 text-xs font-semibold uppercase text-white/70">
            Vận hành thông minh hơn
          </p>
          <h2 className="max-w-lg text-4xl font-semibold leading-tight">
            Tập trung dữ liệu vận hành của quán board game
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-6 text-white/75">
            Kho game, linh kiện, bàn chơi và hoạt động nhân viên trong cùng một bảng điều khiển.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              { icon: QrCode, text: "Rút ngắn thao tác giao nhận bằng mã QR" },
              { icon: ClipboardCheck, text: "Hỗ trợ kiểm soát linh kiện theo checklist" },
              { icon: TrendingUp, text: "Theo dõi báo cáo vận hành hằng ngày" },
            ].map((i) => (
              <li key={i.text} className="flex items-center gap-3 text-sm text-white/90">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/12 text-white backdrop-blur-sm">
                  <i.icon className="h-4.5 w-4.5" />
                </span>
                {i.text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative z-10 text-xs text-white/60">BoardGameOS · Bản demo MVP</p>
      </div>

      <div className="flex items-center justify-center bg-card px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Grid2x2 className="h-4.5 w-4.5" />
            </span>
            <span className="font-semibold tracking-tight">BoardGameOS</span>
          </div>
          <p className="text-xs font-semibold uppercase text-primary">Chào mừng trở lại</p>
          <h1 className="mt-2 text-2xl font-semibold">Đăng nhập BoardGameOS</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Đăng nhập để vào bảng điều khiển vận hành.
          </p>

          <form className="mt-8 space-y-4" onSubmit={submit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 rounded-xl"
                placeholder="ten@boardgameos.vn"
              />
            </div>
            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox defaultChecked /> Ghi nhớ đăng nhập
              </label>
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => toast("Vui lòng liên hệ quản lý quán để đặt lại mật khẩu.")}
              >
                Quên mật khẩu?
              </button>
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="w-full rounded-xl">
              Đăng nhập
            </Button>
          </form>

          <div className="mt-8 border-t border-border pt-6">
            <p className="text-sm font-semibold">Tài khoản demo</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Chọn nhanh một vai trò để trình bày hệ thống.
            </p>
            <div className="mt-3 space-y-2">
              {demoAccounts.map((a) => (
                <button
                  key={a.email}
                  type="button"
                  onClick={() => {
                    setEmail(a.email);
                    setPassword("demo1234");
                    setError("");
                  }}
                  className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-left text-sm transition-colors hover:border-primary/40"
                >
                  <span>{a.email}</span>
                  <span className="text-xs text-muted-foreground">{a.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
