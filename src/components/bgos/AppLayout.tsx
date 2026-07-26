import { useState } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Boxes,
  ClipboardCheck,
  Grid2x2,
  LayoutDashboard,
  LogOut,
  Menu,
  QrCode,
  Repeat,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/bgos/store";
import { QrScanDialog } from "./QrScanDialog";

type NavItem = { to: string; label: string; icon: typeof Bell; exact?: boolean };

export const NAV_ITEMS: NavItem[] = [
  { to: "/app", label: "Tổng quan", icon: LayoutDashboard, exact: true },
  { to: "/app/games", label: "Kho game", icon: Boxes },
  { to: "/app/tables", label: "Bàn chơi", icon: Grid2x2 },
  { to: "/app/handover", label: "Giao nhận game", icon: Repeat },
  { to: "/app/checklist", label: "Kiểm tra linh kiện", icon: ClipboardCheck },
  { to: "/app/advisor", label: "Tư vấn game", icon: Sparkles },
  { to: "/app/staff", label: "Nhân viên", icon: Users },
  { to: "/app/reports", label: "Báo cáo", icon: TrendingUp },
  { to: "/app/notifications", label: "Thông báo", icon: Bell },
  { to: "/app/settings", label: "Cài đặt", icon: Settings },
];

const MOBILE_ITEMS = [NAV_ITEMS[0], NAV_ITEMS[1], NAV_ITEMS[3], NAV_ITEMS[2], NAV_ITEMS[8]];

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Grid2x2 className="h-4.5 w-4.5" />
      </span>
      <span className="text-base font-semibold tracking-tight">BoardGameOS</span>
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { notifications } = useStore();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <nav className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to as never}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
            )}
          >
            <item.icon className="h-4.5 w-4.5" />
            <span className="flex-1">{item.label}</span>
            {item.to === "/app/notifications" && unread > 0 ? (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                {unread}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppLayout() {
  const navigate = useNavigate();
  const { session, logout, settings, notifications } = useStore();
  const [scanOpen, setScanOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const unread = notifications.filter((n) => !n.read).length;

  const initials = (session?.user.name ?? "BG")
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("");

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <div className="px-2 py-2">
          <Brand />
        </div>
        <div className="mt-4 flex-1 overflow-y-auto">
          <NavList />
        </div>
        <Button variant="ghost" className="justify-start gap-3 rounded-xl text-muted-foreground" onClick={() => { logout(); navigate({ to: "/login" }); }}>
          <LogOut className="h-4.5 w-4.5" /> Đăng xuất
        </Button>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Mở menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-sidebar p-4">
                <div className="px-2 py-2">
                  <Brand />
                </div>
                <div className="mt-4">
                  <NavList onNavigate={() => setMobileOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>

            <div className="hidden min-w-0 flex-col sm:flex">
              <span className="truncate text-sm font-semibold">{settings.storeName}</span>
              <span className="truncate text-xs text-muted-foreground">{settings.branch}</span>
            </div>

            <div className="relative ml-auto hidden w-full max-w-xs md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm game, bàn, nhân viên..."
                className="rounded-xl pl-9"
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigate({ to: "/app/games" });
                }}
              />
            </div>

            <div className="ml-auto flex items-center gap-1.5 md:ml-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-xl" onClick={() => setScanOpen(true)} aria-label="Quét mã QR">
                    <QrCode className="h-4.5 w-4.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Quét mã QR bộ game</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative rounded-xl" asChild aria-label="Thông báo">
                    <Link to="/app/notifications">
                      <Bell className="h-4.5 w-4.5" />
                      {unread > 0 ? (
                        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
                      ) : null}
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Trung tâm thông báo</TooltipContent>
              </Tooltip>
              <div className="ml-1 flex items-center gap-2">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/12 text-xs font-semibold text-primary">{initials}</AvatarFallback>
                </Avatar>
                <div className="hidden leading-tight sm:block">
                  <p className="text-sm font-medium">{session?.user.name ?? "Khách demo"}</p>
                  <p className="text-xs text-muted-foreground">{session?.user.role ?? "Nhân viên"}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main key={pathname} className="page-enter px-4 pb-24 pt-6 sm:px-6 lg:pb-10">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur lg:hidden">
        <div className="grid grid-cols-5">
          {MOBILE_ITEMS.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to as never}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px]",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <QrScanDialog open={scanOpen} onOpenChange={setScanOpen} onScanned={(id) => navigate({ to: "/app/games/$gameId", params: { gameId: id } })} />
    </div>
  );
}
