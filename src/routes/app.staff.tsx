import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/bgos/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/lib/bgos/store";
import { timeAgo } from "@/lib/bgos/helpers";
import type { StaffRole } from "@/lib/bgos/types";

export const Route = createFileRoute("/app/staff")({
  head: () => ({
    meta: [
      { title: "Nhân viên — BoardGameOS" },
      { name: "description", content: "Quản lý tài khoản nhân viên, vai trò, ca làm việc và quyền thao tác trong quán." },
      { property: "og:title", content: "Nhân viên — BoardGameOS" },
      { property: "og:description", content: "Quản lý đội ngũ và phân quyền vận hành." },
    ],
  }),
  component: StaffPage,
});

const ROLES: StaffRole[] = ["Chủ quán", "Quản lý", "Thu ngân", "Nhân viên phục vụ", "Nhân viên kho"];

function StaffPage() {
  const { staff, addStaff, updateStaff } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "Nhân viên phục vụ" as StaffRole, shift: "Ca sáng (08:00 - 16:00)" });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nhân viên"
        description="Danh sách tài khoản và quyền hạn của đội ngũ."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="rounded-xl">Thêm nhân viên</Button></DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader><DialogTitle>Thêm nhân viên mới</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Họ và tên" className="rounded-xl" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input placeholder="Email" className="rounded-xl" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as StaffRole })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
                <Input placeholder="Ca làm việc" className="rounded-xl" value={form.shift} onChange={(e) => setForm({ ...form, shift: e.target.value })} />
              </div>
              <DialogFooter>
                <Button
                  className="rounded-xl"
                  disabled={!form.name || !form.email}
                  onClick={() => {
                    addStaff({ ...form, active: true, locked: false, permissions: ["Giao nhận game", "Cập nhật bàn"] });
                    toast.success("Đã thêm nhân viên");
                    setOpen(false);
                    setForm({ name: "", email: "", role: "Nhân viên phục vụ", shift: "Ca sáng (08:00 - 16:00)" });
                  }}
                >
                  Lưu nhân viên
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="card-soft overflow-x-auto p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nhân viên</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Ca làm</TableHead>
              <TableHead>Thao tác hôm nay</TableHead>
              <TableHead>Hoạt động cuối</TableHead>
              <TableHead className="text-right">Khóa tài khoản</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.email}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {s.permissions.map((p) => <Badge key={p} variant="secondary" className="rounded-lg text-[11px]">{p}</Badge>)}
                  </div>
                </TableCell>
                <TableCell>{s.role}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{s.shift}</TableCell>
                <TableCell>{s.actionsToday}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{timeAgo(s.lastActive)}</TableCell>
                <TableCell className="text-right">
                  <Switch checked={s.locked} onCheckedChange={(v) => { updateStaff(s.id, { locked: v, active: !v }); toast.success(v ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản"); }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
