import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Grid2x2, ClipboardCheck, QrCode, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useStore } from "@/lib/bgos/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Đăng nhập — BoardGameOS" },
      { name: "description", content: "Đăng nhập vào bảng điều khiển BoardGameOS để quản lý kho game, bàn chơi và nhân viên." },
      { property: "og:title", content: "Đăng nhập — BoardGameOS" },
      { property: "og:description", content: "Truy cập bảng điều khiển vận hành dành cho quán board game cafe." },
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
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-surface p-10 lg:flex">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Grid2x2 className="h-4.5 w-4.5" />
          </span>
          <span className="font-semibold tracking-tight">BoardGameOS</span>
        </Link>
        <div>
          <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-tight">
            Tập trung dữ liệu vận hành của quán board game
          </h2>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Kho game, linh kiện, bàn chơi và hoạt động nhân viên trong cùng một bảng điều khiển.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              { icon: QrCode, text: "Rút ngắn thao tác giao nhận bằng mã QR" },
              { icon: ClipboardCheck, text: "Hỗ trợ kiểm soát linh kiện theo checklist" },
              { icon: TrendingUp, text: "Theo dõi báo cáo vận hành hằng ngày" },
            ].map((i) => (
              <li key={i.text} className="flex items-center gap-3 text-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-card text-primary">
                  <i.icon className="h-4.5 w-4.5" />
                </span>
                {i.text}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">Bản demo phục vụ giới thiệu MVP.</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Grid2x2 className="h-4.5 w-4.5" />
            </span>
            <span className="font-semibold tracking-tight">BoardGameOS</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Quản lý quán board game dễ dàng hơn</h1>
          <p className="mt-2 text-sm text-muted-foreground">Đăng nhập để vào bảng điều khiển vận hành.</p>

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
            <Button type="submit" className="w-full rounded-xl">Đăng nhập</Button>
          </form>

          <div className="mt-8 rounded-xl border border-border bg-muted/50 p-4">
            <p className="text-sm font-medium">Tài khoản demo</p>
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
