import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Boxes,
  Building2,
  Check,
  CircleCheckBig,
  ClipboardCheck,
  Database,
  Eye,
  Grid2x2,
  Layers3,
  MapPinned,
  Menu,
  NotebookPen,
  QrCode,
  Send,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import heroImage from "@/assets/cafe-hero.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BoardGameOS - Quản lý vận hành Board Game Cafe" },
      {
        name: "description",
        content:
          "BoardGameOS tập trung kho game, linh kiện, bàn chơi, nhân viên và dữ liệu vận hành của quán board game cafe trên một hệ thống.",
      },
      { property: "og:title", content: "BoardGameOS - Quản lý vận hành Board Game Cafe" },
      {
        property: "og:description",
        content:
          "Trải nghiệm MVP quản lý kho game, bàn chơi, linh kiện và trợ lý vận hành AI dành cho board game cafe.",
      },
    ],
  }),
  component: Landing,
});

const navigation = [
  { href: "#san-pham", label: "Sản phẩm" },
  { href: "#quy-trinh", label: "Quy trình" },
  { href: "#gia-tri", label: "Giá trị" },
  { href: "#goi-dich-vu", label: "Gói dịch vụ" },
  { href: "#dang-ky", label: "Đăng ký" },
];

const problems = [
  {
    icon: MapPinned,
    title: "Khó theo dõi game đang ở đâu",
    text: "Nhân viên phải nhớ thủ công hoặc hỏi lại nhau khi khách cần đổi game.",
  },
  {
    icon: AlertTriangle,
    title: "Linh kiện dễ thiếu hoặc hư hỏng",
    text: "Thẻ bài và quân cờ thất lạc nhưng không có nơi ghi nhận thống nhất.",
  },
  {
    icon: NotebookPen,
    title: "Ghi nhận vận hành rời rạc",
    text: "Sổ tay và nhóm chat khiến thông tin khó tìm lại giữa các ca làm việc.",
  },
  {
    icon: Eye,
    title: "Chủ quán thiếu góc nhìn tổng thể",
    text: "Không có một nơi để xem nhanh tình trạng bàn, game và sự cố trong ngày.",
  },
];

const productViews = [
  {
    value: "overview",
    label: "Tổng quan",
    image: "/landing/overview.webp",
    alt: "Dashboard tổng quan vận hành của BoardGameOS",
    title: "Nhìn toàn bộ ca làm việc trong một màn hình",
    text: "KPI, cảnh báo, trạng thái bàn và hoạt động gần đây được sắp xếp theo mức độ ưu tiên.",
  },
  {
    value: "tables",
    label: "Bàn chơi",
    image: "/landing/tables.webp",
    alt: "Màn hình quản lý trạng thái bàn chơi trong BoardGameOS",
    title: "Theo dõi từng bàn theo thời gian thực",
    text: "Nhân viên biết bàn nào đang chơi, cần hỗ trợ, có sự cố hoặc đang sẵn sàng đón khách.",
  },
  {
    value: "inventory",
    label: "Kho và linh kiện",
    image: "/landing/inventory.webp",
    alt: "Kho board game với ảnh bìa và trạng thái trong BoardGameOS",
    title: "Quản lý game bằng hình ảnh và trạng thái rõ ràng",
    text: "Tìm game, xem vị trí, kiểm tra linh kiện và nhận biết ngay game nào có thể giao cho khách.",
  },
  {
    value: "ai",
    label: "AI chatbot",
    image: "/landing/ai-chatbot.webp",
    alt: "Chatbot trợ lý vận hành AI mở trên dashboard BoardGameOS",
    title: "Hỏi dữ liệu vận hành bằng ngôn ngữ tự nhiên",
    text: "Chatbot đọc snapshot hiện tại để hỗ trợ tra cứu, hướng dẫn luật và tư vấn game phù hợp.",
  },
];

const solutions = [
  { icon: Boxes, title: "Kho game", text: "Trạng thái, vị trí, ảnh bìa và lịch sử từng bộ game." },
  {
    icon: QrCode,
    title: "QR giao nhận",
    text: "Rút ngắn thao tác giao game và nhận lại từ bàn chơi.",
  },
  {
    icon: ClipboardCheck,
    title: "Checklist linh kiện",
    text: "Ghi rõ linh kiện đầy đủ, thiếu số lượng hoặc hư hỏng.",
  },
  {
    icon: Grid2x2,
    title: "Sơ đồ bàn",
    text: "Theo dõi khách, thời gian chơi, game và nhân viên phụ trách.",
  },
  {
    icon: TrendingUp,
    title: "Báo cáo",
    text: "Tổng hợp lượt chơi, mức dùng bàn và sự cố theo thời gian.",
  },
];

const steps = [
  {
    n: "01",
    title: "Khai báo game",
    text: "Tạo danh mục, vị trí lưu trữ và checklist linh kiện chuẩn.",
  },
  { n: "02", title: "Giao game", text: "Quét QR, chọn bàn và ghi nhận nhân viên thực hiện." },
  { n: "03", title: "Nhận và kiểm tra", text: "Đối chiếu linh kiện, ghi nhận thiếu hoặc hư hỏng." },
  {
    n: "04",
    title: "Theo dõi báo cáo",
    text: "Xem tình hình sử dụng, cảnh báo và hiệu suất vận hành.",
  },
];

const values = [
  {
    icon: UsersRound,
    audience: "Dành cho nhân viên",
    title: "Thao tác nhanh và nhất quán hơn",
    items: [
      "Biết game nào đang sẵn sàng để tư vấn khách.",
      "Giao nhận game theo một quy trình chung.",
      "Kiểm tra linh kiện với số lượng cụ thể.",
      "Giảm phụ thuộc vào kinh nghiệm cá nhân.",
    ],
  },
  {
    icon: Store,
    audience: "Dành cho chủ quán",
    title: "Nắm tình hình mà không cần hỏi từng người",
    items: [
      "Theo dõi tập trung game, bàn và nhân viên.",
      "Phát hiện sự cố cần ưu tiên xử lý.",
      "Phân quyền giao diện theo vai trò.",
      "Có dữ liệu để đánh giá hoạt động của quán.",
    ],
  },
];

const aiQuestions = [
  "Game nào đang thiếu linh kiện?",
  "Bàn nào đang cần hỗ trợ?",
  "Cách chơi Dixit như thế nào?",
  "Gợi ý game có sẵn cho nhóm 6 người.",
];

const plans = [
  {
    name: "Cơ bản",
    icon: Store,
    status: "Dùng thử MVP",
    desc: "Dành cho quán một chi nhánh mới bắt đầu số hóa kho game.",
    items: ["Kho game và checklist", "Sơ đồ bàn", "Giao nhận bằng QR"],
    action: "Chọn gói Cơ bản",
  },
  {
    name: "Tiêu chuẩn",
    icon: Sparkles,
    status: "Đề xuất",
    desc: "Dành cho quán đã vận hành ổn định, cần báo cáo và phân quyền.",
    items: ["Toàn bộ gói Cơ bản", "Báo cáo vận hành", "Phân quyền nhân viên"],
    action: "Chọn gói Tiêu chuẩn",
    featured: true,
  },
  {
    name: "Chuỗi",
    icon: Building2,
    status: "Liên hệ tư vấn",
    desc: "Dành cho chuỗi nhiều chi nhánh cần dữ liệu tập trung.",
    items: ["Toàn bộ gói Tiêu chuẩn", "Quản lý nhiều chi nhánh", "Hỗ trợ triển khai"],
    action: "Trao đổi về gói Chuỗi",
  },
];

type Submission = {
  contact: string;
  store: string;
  plan: string;
};

function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Tiêu chuẩn");
  const [submission, setSubmission] = useState<Submission | null>(null);

  const scrollToRegistration = (plan: string) => {
    setSelectedPlan(plan);
    setSubmission(null);
    window.requestAnimationFrame(() => {
      document.getElementById("dang-ky")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    });
  };

  const submitRegistration = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSubmission({
      contact: String(formData.get("contact") ?? ""),
      store: String(formData.get("store") ?? ""),
      plan: selectedPlan,
    });
    toast.success("Đã mô phỏng tiếp nhận đăng ký demo");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Brand />

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild className="hidden sm:inline-flex">
              <Link to="/login">Mở bản demo</Link>
            </Button>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Mở menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(320px,85vw)] bg-card">
                <SheetHeader className="text-left">
                  <SheetTitle>BoardGameOS</SheetTitle>
                  <SheetDescription>Đi tới nội dung bạn muốn xem.</SheetDescription>
                </SheetHeader>
                <nav className="mt-8 space-y-1">
                  {navigation.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="block rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
                <Button asChild className="mt-6 w-full">
                  <Link to="/login">Trải nghiệm bản demo</Link>
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>
        <section className="relative flex min-h-[80svh] items-center overflow-hidden bg-foreground text-white">
          <img
            src={heroImage}
            alt="Không gian board game cafe với kệ game và bàn chơi"
            width={1920}
            height={1280}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/65" />
          <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <p className="text-sm font-semibold uppercase text-white/75">
              Nền tảng vận hành cho Board Game Cafe
            </p>
            <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">BoardGameOS</h1>
            <p className="mt-5 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">
              Quản lý quán board game trên một nền tảng duy nhất
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              Theo dõi kho game, linh kiện, bàn chơi và hoạt động nhân viên bằng quy trình rõ ràng,
              tập trung và dễ sử dụng trong mỗi ca làm việc.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/login">
                  Trải nghiệm bản demo <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/5 text-white hover:bg-white hover:text-foreground"
              >
                <a href="#quy-trinh">Xem cách hoạt động</a>
              </Button>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/70">
              {["Demo MVP", "Không cần cài đặt", "Có vai trò Chủ quán và Nhân viên"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" /> {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-card py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionIntro
              eyebrow="Bài toán vận hành"
              title="Những khoảng trống xuất hiện trong mỗi ca làm việc"
              description="Khi dữ liệu nằm trong trí nhớ, sổ tay và nhóm chat, một thao tác đơn giản cũng có thể mất nhiều thời gian hơn cần thiết."
            />
            <div className="mt-10 grid border-t border-border md:grid-cols-2">
              {problems.map((problem, index) => (
                <div
                  key={problem.title}
                  className={`flex gap-4 border-b border-border py-6 md:px-6 ${
                    index % 2 === 0 ? "md:border-r md:pl-0" : "md:pr-0"
                  }`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                    <problem.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{problem.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{problem.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="san-pham" className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionIntro
              eyebrow="Sản phẩm đang hoạt động"
              title="Không chỉ là ý tưởng, đây là trải nghiệm có thể sử dụng"
              description="Các màn hình dưới đây được chụp trực tiếp từ BoardGameOS với dữ liệu demo hiện tại."
            />
            <Tabs defaultValue="overview" className="mt-10">
              <TabsList className="grid h-auto w-full grid-cols-2 gap-1 bg-muted p-1 lg:inline-grid lg:w-auto lg:grid-cols-4">
                {productViews.map((view) => (
                  <TabsTrigger key={view.value} value={view.value} className="h-10">
                    {view.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {productViews.map((view) => (
                <TabsContent key={view.value} value={view.value} className="mt-5">
                  <figure className="overflow-hidden rounded-lg border border-border bg-card shadow-soft">
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img
                        src={view.image}
                        alt={view.alt}
                        width={1200}
                        height={675}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <figcaption className="border-t border-border p-5 sm:flex sm:items-start sm:justify-between sm:gap-8">
                      <h3 className="font-semibold sm:max-w-sm">{view.title}</h3>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:mt-0">
                        {view.text}
                      </p>
                    </figcaption>
                  </figure>
                </TabsContent>
              ))}
            </Tabs>

            <div className="mt-14 grid border-y border-border sm:grid-cols-2 lg:grid-cols-5">
              {solutions.map((solution, index) => (
                <div
                  key={solution.title}
                  className={`py-6 sm:px-5 ${index > 0 ? "lg:border-l lg:border-border" : ""}`}
                >
                  <solution.icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-3 text-sm font-semibold">{solution.title}</h3>
                  <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{solution.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="quy-trinh"
          className="scroll-mt-20 border-y border-border bg-surface py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionIntro
              eyebrow="Quy trình hoạt động"
              title="Một vòng đời game được ghi nhận từ đầu đến cuối"
              description="Mọi thao tác quan trọng đều quay về cùng một nguồn dữ liệu để ca sau có thể tiếp tục ngay."
            />
            <ol className="relative mt-12 grid gap-0 md:grid-cols-4 md:border-t md:border-border">
              {steps.map((step) => (
                <li
                  key={step.n}
                  className="relative border-l border-border pb-10 pl-8 last:pb-0 md:border-l-0 md:px-4 md:pb-0 md:pt-8"
                >
                  <span className="absolute -left-3 top-0 flex h-6 w-6 items-center justify-center rounded-full border border-primary bg-background text-[10px] font-semibold text-primary md:-top-3 md:left-4">
                    {step.n}
                  </span>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="gia-tri" className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionIntro
              eyebrow="Giá trị mang lại"
              title="Tốt hơn cho người trực tiếp làm việc và người quản lý"
              description="BoardGameOS tập trung vào những quyết định nhỏ nhưng lặp lại liên tục trong vận hành quán."
            />
            <div className="mt-10 grid border-y border-border lg:grid-cols-2">
              {values.map((value, index) => (
                <div
                  key={value.audience}
                  className={`py-8 lg:px-10 ${index === 0 ? "border-b border-border lg:border-b-0 lg:border-r lg:pl-0" : "lg:pr-0"}`}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <value.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-5 text-xs font-semibold uppercase text-primary">
                    {value.audience}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">{value.title}</h3>
                  <ul className="mt-5 space-y-3">
                    {value.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm text-muted-foreground"
                      >
                        <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-foreground py-16 text-white sm:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-white">
                <Bot className="h-5 w-5" />
              </span>
              <p className="mt-6 text-xs font-semibold uppercase text-white/60">
                Trợ lý vận hành AI
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                Hỏi dữ liệu của quán bằng ngôn ngữ tự nhiên
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/65">
                Gemini chỉ trả lời dựa trên snapshot dữ liệu BoardGameOS hiện tại. Chatbot hỗ trợ
                tra cứu trạng thái, luật cơ bản và tư vấn game trong phạm vi dữ liệu demo.
              </p>
              <ul className="mt-7 divide-y divide-white/10 border-y border-white/10">
                {aiQuestions.map((question) => (
                  <li key={question} className="flex items-center gap-3 py-3 text-sm text-white/80">
                    <Sparkles className="h-4 w-4 shrink-0 text-primary" /> {question}
                  </li>
                ))}
              </ul>
            </div>
            <figure className="overflow-hidden rounded-lg border border-white/15 bg-white/5 p-2 shadow-lift">
              <img
                src="/landing/ai-chatbot.webp"
                alt="Chatbot AI đang mở trên dashboard BoardGameOS"
                width={1200}
                height={675}
                loading="lazy"
                className="aspect-video w-full rounded-lg object-cover"
              />
            </figure>
          </div>
        </section>

        <section id="goi-dich-vu" className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionIntro
              eyebrow="Gói dịch vụ"
              title="Bắt đầu theo đúng quy mô vận hành"
              description="Các gói đang được dùng để kiểm chứng nhu cầu trong giai đoạn MVP và chưa công bố mức giá thương mại."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {plans.map((plan) => (
                <article
                  key={plan.name}
                  className={`flex min-h-[390px] flex-col rounded-lg border bg-card p-6 ${
                    plan.featured ? "border-primary ring-1 ring-primary/20" : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${plan.featured ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
                    >
                      <plan.icon className="h-5 w-5" />
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${plan.featured ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                    >
                      {plan.status}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{plan.name}</h3>
                  <p className="mt-2 min-h-16 text-sm leading-6 text-muted-foreground">
                    {plan.desc}
                  </p>
                  <ul className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
                    {plan.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {item}
                      </li>
                    ))}
                  </ul>
                  <Button
                    type="button"
                    variant={plan.featured ? "default" : "outline"}
                    className="mt-auto w-full"
                    onClick={() => scrollToRegistration(plan.name)}
                  >
                    {plan.action}
                  </Button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="dang-ky"
          className="scroll-mt-20 border-t border-border bg-surface py-16 sm:py-20"
        >
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-semibold uppercase text-primary">Đăng ký nhận bản demo</p>
              <h2 className="mt-2 text-3xl font-semibold">
                Trao đổi về cách BoardGameOS phù hợp với quán của bạn
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Form này mô phỏng luồng tiếp nhận nhu cầu trong MVP. Dữ liệu không được gửi tới
                backend, email hoặc lưu trên trình duyệt.
              </p>
              <div className="mt-8 space-y-5 border-t border-border pt-6">
                {[
                  {
                    icon: Layers3,
                    title: "Chọn gói quan tâm",
                    text: "Bắt đầu từ nhu cầu và quy mô hiện tại.",
                  },
                  {
                    icon: Send,
                    title: "Điền thông tin quán",
                    text: "Mô phỏng dữ liệu cần có cho một yêu cầu tư vấn.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Xác nhận ngay trên trang",
                    text: "Không có request hoặc dữ liệu nào được lưu lại.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {submission ? (
              <div
                className="flex min-h-[480px] flex-col items-center justify-center rounded-lg border border-success/30 bg-card p-8 text-center shadow-soft"
                aria-live="polite"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/12 text-success">
                  <CircleCheckBig className="h-7 w-7" />
                </span>
                <p className="mt-6 text-xs font-semibold uppercase text-success">
                  Mô phỏng tiếp nhận thành công
                </p>
                <h3 className="mt-2 text-2xl font-semibold">Cảm ơn {submission.contact}</h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                  BoardGameOS đã mô phỏng tiếp nhận yêu cầu của{" "}
                  <strong className="text-foreground">{submission.store}</strong> cho gói{" "}
                  <strong className="text-foreground">{submission.plan}</strong>.
                </p>
                <div className="mt-6 max-w-md rounded-lg border border-border bg-muted/45 p-4 text-sm text-muted-foreground">
                  Đây là bản demo frontend. Thông tin vừa nhập không được gửi tới backend và không
                  được lưu lại.
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-7"
                  onClick={() => setSubmission(null)}
                >
                  Gửi đăng ký khác
                </Button>
              </div>
            ) : (
              <form
                className="rounded-lg border border-border bg-card p-5 shadow-soft sm:p-7"
                onSubmit={submitRegistration}
              >
                <div className="border-b border-border pb-5">
                  <h3 className="font-semibold">Thông tin đăng ký</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Các trường có dấu * là bắt buộc.
                  </p>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field id="contact" label="Tên người liên hệ" required />
                  <Field id="store" label="Tên quán" required />
                  <Field
                    id="phone"
                    label="Số điện thoại"
                    type="tel"
                    inputMode="tel"
                    pattern={"\\+?[0-9][0-9\\x20\\x28\\x29\\x2D]{7,17}"}
                    title="Số điện thoại cần có từ 8 đến 18 ký tự hợp lệ."
                    required
                  />
                  <Field id="email" label="Email" type="email" required />
                  <Field id="city" label="Thành phố" required />
                  <div>
                    <Label htmlFor="plan">Gói quan tâm</Label>
                    <Select name="plan" value={selectedPlan} onValueChange={setSelectedPlan}>
                      <SelectTrigger id="plan" className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.map((plan) => (
                          <SelectItem key={plan.name} value={plan.name}>
                            {plan.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Field
                    id="games"
                    label="Số lượng game"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={5000}
                    placeholder="Ví dụ: 60"
                  />
                  <Field
                    id="branches"
                    label="Số chi nhánh"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={100}
                    placeholder="Ví dụ: 1"
                  />
                  <div className="sm:col-span-2">
                    <Label htmlFor="need">Nhu cầu chính</Label>
                    <Textarea
                      id="need"
                      name="need"
                      className="mt-1.5 min-h-28"
                      placeholder="Ví dụ: kiểm soát linh kiện và theo dõi bàn chơi"
                    />
                  </div>
                </div>
                <Button type="submit" className="mt-6 w-full sm:w-auto">
                  <Send className="h-4 w-4" /> Gửi đăng ký mô phỏng
                </Button>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Brand />
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              Demo MVP môn Khởi nghiệp, tập trung số hóa quy trình vận hành cho quán board game
              cafe.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {["React", "TanStack Start", "Gemini", "Vercel"].map((tech) => (
                <span key={tech} className="rounded-full border border-border px-2.5 py-1">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold">Khám phá</p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {navigation.slice(0, 4).map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="hover:text-foreground">
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/login" className="hover:text-foreground">
                  Mở bản demo
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Liên hệ demo</p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>hello@boardgameos.vn</li>
              <li>0909 123 456</li>
              <li>24 Lê Thánh Tôn, Quận 1, TP.HCM</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
          <span suppressHydrationWarning>© {new Date().getFullYear()} BoardGameOS.</span> Bản demo
          phục vụ mục đích học tập.
        </div>
      </footer>
    </div>
  );
}

function Brand() {
  return (
    <Link to="/" className="inline-flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Grid2x2 className="h-4.5 w-4.5" />
      </span>
      <span className="font-semibold">BoardGameOS</span>
    </Link>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
    </div>
  );
}

function Field({
  id,
  label,
  type = "text",
  required,
  placeholder,
  inputMode,
  pattern,
  title,
  min,
  max,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  pattern?: string;
  title?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <Label htmlFor={id}>
        {label} {required ? <span className="text-destructive">*</span> : null}
      </Label>
      <Input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        inputMode={inputMode}
        pattern={pattern}
        title={title}
        min={min}
        max={max}
        className="mt-1.5"
      />
    </div>
  );
}
