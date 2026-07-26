import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Boxes,
  ClipboardCheck,
  Grid2x2,
  QrCode,
  TrendingUp,
  AlertTriangle,
  NotebookPen,
  MapPinned,
  Eye,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import heroImage from "@/assets/cafe-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BoardGameOS — Quản lý vận hành Board Game Cafe" },
      {
        name: "description",
        content:
          "Nền tảng theo dõi kho game, linh kiện, bàn chơi và hoạt động nhân viên cho quán board game cafe bằng quy trình đơn giản, trực quan.",
      },
      { property: "og:title", content: "BoardGameOS — Quản lý vận hành Board Game Cafe" },
      {
        property: "og:description",
        content: "Nền tảng theo dõi kho game, linh kiện, bàn chơi và hoạt động nhân viên cho quán board game cafe bằng quy trình đơn giản, trực quan.",
      },
    ],
  }),
  component: Landing,
});

const problems = [
  { icon: MapPinned, title: "Khó theo dõi game đang ở bàn nào", text: "Nhân viên phải nhớ thủ công hoặc hỏi lại nhau mỗi khi khách cần đổi game." },
  { icon: AlertTriangle, title: "Linh kiện dễ bị thiếu hoặc hư hỏng", text: "Thẻ bài, quân cờ thất lạc sau mỗi ca nhưng không có nơi ghi nhận thống nhất." },
  { icon: NotebookPen, title: "Nhân viên ghi chép không đồng nhất", text: "Mỗi người dùng một cuốn sổ hoặc nhóm chat khác nhau, dữ liệu rời rạc." },
  { icon: Eye, title: "Chủ quán khó theo dõi từ xa", text: "Không có bức tranh tổng quan về bàn, game và sự cố trong ngày." },
];

const solutions = [
  { icon: Boxes, title: "Quản lý kho game", text: "Danh mục game kèm trạng thái, vị trí và lịch sử sử dụng." },
  { icon: QrCode, title: "QR giao nhận", text: "Rút ngắn thao tác giao nhận game giữa kho và bàn chơi." },
  { icon: ClipboardCheck, title: "Checklist linh kiện", text: "Hỗ trợ kiểm soát linh kiện mỗi lần nhận lại game." },
  { icon: Grid2x2, title: "Sơ đồ bàn", text: "Xem nhanh bàn trống, bàn đang chơi và bàn cần hỗ trợ." },
  { icon: TrendingUp, title: "Báo cáo tập trung", text: "Tập trung dữ liệu vận hành để quản lý quán hiệu quả hơn." },
];

const steps = [
  { n: "01", title: "Tạo dữ liệu game", text: "Nhập danh mục game, checklist linh kiện và vị trí lưu trữ." },
  { n: "02", title: "Quét QR để giao game", text: "Chọn bàn, xác nhận nhân viên giao và hoàn tất trong vài thao tác." },
  { n: "03", title: "Kiểm tra khi nhận lại", text: "Đối chiếu checklist, ghi nhận linh kiện thiếu hoặc hư hỏng." },
  { n: "04", title: "Theo dõi báo cáo", text: "Xem lượt sử dụng, sự cố và hiệu suất bàn theo thời gian." },
];

const plans = [
  { name: "Cơ bản", desc: "Dành cho quán một chi nhánh mới bắt đầu số hóa kho game.", items: ["Kho game và checklist", "Sơ đồ bàn", "Giao nhận bằng QR"], tag: "Đang thử nghiệm" },
  { name: "Tiêu chuẩn", desc: "Dành cho quán đã vận hành ổn định, cần báo cáo và phân quyền.", items: ["Toàn bộ gói Cơ bản", "Báo cáo vận hành", "Phân quyền nhân viên"], tag: "Liên hệ", featured: true },
  { name: "Chuỗi", desc: "Dành cho chuỗi nhiều chi nhánh cần dữ liệu tập trung.", items: ["Toàn bộ gói Tiêu chuẩn", "Quản lý nhiều chi nhánh", "Hỗ trợ triển khai"], tag: "Liên hệ" },
];

function Landing() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Grid2x2 className="h-4.5 w-4.5" />
            </span>
            <span className="font-semibold tracking-tight">BoardGameOS</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#giai-phap" className="transition-colors hover:text-foreground">Giải pháp</a>
            <a href="#quy-trinh" className="transition-colors hover:text-foreground">Quy trình</a>
            <a href="#goi-dich-vu" className="transition-colors hover:text-foreground">Gói dịch vụ</a>
            <a href="#dang-ky" className="transition-colors hover:text-foreground">Đăng ký demo</a>
          </nav>
          <Button asChild className="rounded-xl">
            <Link to="/login">Xem bản demo</Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              Nền tảng vận hành cho Board Game Cafe
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Quản lý Board Game Cafe trên một nền tảng duy nhất
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              Theo dõi game, linh kiện, bàn chơi và hoạt động nhân viên bằng quy trình đơn giản, trực quan.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-xl">
                <Link to="/login">
                  Xem bản demo <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl">
                <a href="#dang-ky">Đăng ký dùng thử</a>
              </Button>
            </div>
            <dl className="mt-9 grid max-w-md grid-cols-3 gap-4 text-sm">
              {[
                ["Kho game", "Trạng thái theo thời gian thực"],
                ["Linh kiện", "Checklist từng bộ game"],
                ["Bàn chơi", "Sơ đồ trực quan"],
              ].map(([t, d]) => (
                <div key={t}>
                  <dt className="font-medium">{t}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{d}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="card-soft overflow-hidden p-2">
            <img
              src={heroImage}
              alt="Không gian board game cafe với kệ gỗ chứa nhiều bộ board game"
              width={1280}
              height={960}
              className="h-full w-full rounded-xl object-cover"
            />
          </div>
        </section>

        <section className="border-y border-border bg-surface/60 py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Vấn đề thường gặp tại quán</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {problems.map((p) => (
                <div key={p.title} className="card-soft card-hover p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-medium">{p.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="giai-phap" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Giải pháp của BoardGameOS</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Năm nhóm chức năng cốt lõi giúp tập trung dữ liệu vận hành của quán về một nơi.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s) => (
              <div key={s.title} className="card-soft card-hover p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-medium">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="quy-trinh" className="border-y border-border bg-surface/60 py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Quy trình hoạt động</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {steps.map((s) => (
                <div key={s.n} className="card-soft p-5">
                  <span className="text-sm font-semibold text-primary">{s.n}</span>
                  <h3 className="mt-3 font-medium">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="goi-dich-vu" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Gói dịch vụ</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sản phẩm đang trong giai đoạn thử nghiệm cùng các quán đối tác.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`card-soft p-6 ${p.featured ? "border-primary/40 ring-1 ring-primary/20" : ""}`}
              >
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {p.items.map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-success" /> {i}
                    </li>
                  ))}
                </ul>
                <Button asChild variant={p.featured ? "default" : "outline"} className="mt-6 w-full rounded-xl">
                  <a href="#dang-ky">{p.tag}</a>
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section id="dang-ky" className="border-t border-border bg-surface/60 py-14">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Đăng ký nhận bản demo</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Điền thông tin để nhóm triển khai liên hệ và hướng dẫn dùng thử.
            </p>
            <form
              className="card-soft mt-8 grid gap-4 p-6 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                toast.success("Đã gửi thông tin đăng ký demo");
              }}
            >
              <Field id="contact" label="Tên người liên hệ" required />
              <Field id="store" label="Tên quán" required />
              <Field id="phone" label="Số điện thoại" type="tel" required />
              <Field id="email" label="Email" type="email" required />
              <Field id="city" label="Thành phố" required />
              <Field id="games" label="Số lượng game" type="number" placeholder="Ví dụ: 60" />
              <Field id="branches" label="Số chi nhánh" type="number" placeholder="Ví dụ: 1" />
              <div className="sm:col-span-2">
                <Label htmlFor="need">Nhu cầu chính</Label>
                <Textarea
                  id="need"
                  className="mt-1.5 rounded-xl"
                  placeholder="Ví dụ: kiểm soát linh kiện và theo dõi bàn chơi"
                />
              </div>
              <div className="flex items-center gap-3 sm:col-span-2">
                <Button type="submit" className="rounded-xl">Gửi đăng ký</Button>
                {sent ? <span className="text-sm text-success">Cảm ơn bạn, chúng tôi sẽ liên hệ sớm.</span> : null}
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Grid2x2 className="h-4.5 w-4.5" />
              </span>
              <span className="font-semibold tracking-tight">BoardGameOS</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Nền tảng quản lý vận hành dành cho quán board game cafe: kho game, linh kiện, bàn chơi và nhân viên.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Sản phẩm</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="#giai-phap" className="hover:text-foreground">Giải pháp</a></li>
              <li><a href="#quy-trinh" className="hover:text-foreground">Quy trình</a></li>
              <li><Link to="/login" className="hover:text-foreground">Bản demo</Link></li>
              <li><a href="#dang-ky" className="hover:text-foreground">Chính sách bảo mật</a></li>
              <li><a href="#dang-ky" className="hover:text-foreground">Điều khoản sử dụng</a></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium">Liên hệ</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>hello@boardgameos.vn</li>
              <li>0909 123 456</li>
              <li>24 Lê Thánh Tôn, Quận 1, TP.HCM</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} BoardGameOS. Sản phẩm đang trong giai đoạn thử nghiệm.
        </div>
      </footer>
    </div>
  );
}

function Field({
  id,
  label,
  type = "text",
  required,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <Label htmlFor={id}>
        {label} {required ? <span className="text-destructive">*</span> : null}
      </Label>
      <Input id={id} type={type} required={required} placeholder={placeholder} className="mt-1.5 rounded-xl" />
    </div>
  );
}
