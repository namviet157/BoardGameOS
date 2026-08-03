import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/bgos/StatCard";
import { ConfirmActionDialog } from "@/components/bgos/ConfirmActionDialog";
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
import { useMinuteRefresh } from "@/hooks/use-minute-refresh";

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

type EditableStaffRole = Exclude<StaffRole, "Chủ quán">;

const EDITABLE_ROLES: EditableStaffRole[] = ["Quản lý", "Thu ngân", "Nhân viên phục vụ", "Nhân viên kho"];

const ROLE_PERMISSIONS: Record<EditableStaffRole, string[]> = {
  "Quản lý": ["Kho game", "Bàn chơi", "Giao nhận game", "Kiểm tra linh kiện", "Tư vấn game"],
  "Thu ngân": ["Bàn chơi", "Tư vấn game"],
  "Nhân viên phục vụ": ["Giao nhận game", "Bàn chơi", "Kiểm tra linh kiện"],
  "Nhân viên kho": ["Kho game", "Kiểm tra linh kiện"],
};

function StaffPage() {
  useMinuteRefresh();
  const { staff, session, addStaff, updateStaff } = useStore();
  const [open, setOpen] = useState(false);
  const [lockingStaffId, setLockingStaffId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "Nhân viên phục vụ" as EditableStaffRole, shift: "Ca sáng (08:00 - 16:00)" });
  const lockingStaff = staff.find((member) => member.id === lockingStaffId);

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
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as EditableStaffRole })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{EDITABLE_ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
                <Input placeholder="Ca làm việc" className="rounded-xl" value={form.shift} onChange={(e) => setForm({ ...form, shift: e.target.value })} />
              </div>
              <DialogFooter>
                <Button
                  className="rounded-xl"
                  disabled={!form.name || !form.email}
                  onClick={() => {
                    addStaff({ ...form, active: true, locked: false, permissions: ROLE_PERMISSIONS[form.role] });
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
                <TableCell>
                  {s.role === "Chủ quán" ? (
                    <span className="text-sm font-medium">{s.role}</span>
                  ) : (
                    <Select
                      value={s.role}
                      onValueChange={(value) => {
                        const role = value as EditableStaffRole;
                        updateStaff(s.id, { role, permissions: ROLE_PERMISSIONS[role] });
                        toast.success(`Đã cập nhật vai trò của ${s.name}`);
                      }}
                    >
                      <SelectTrigger className="w-44 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {EDITABLE_ROLES.map((role) => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{s.shift}</TableCell>
                <TableCell>{s.actionsToday}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{timeAgo(s.lastActive)}</TableCell>
                <TableCell className="text-right">
                  <Switch
                    checked={s.locked}
                    disabled={s.email === session?.user.email && s.role === "Chủ quán"}
                    aria-label={`${s.locked ? "Mở khóa" : "Khóa"} tài khoản ${s.name}`}
                    onCheckedChange={(locked) => {
                      if (locked) {
                        setLockingStaffId(s.id);
                        return;
                      }
                      updateStaff(s.id, { locked: false, active: true });
                      toast.success(`Đã mở khóa tài khoản ${s.name}`);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmActionDialog
        open={!!lockingStaffId}
        onOpenChange={(nextOpen) => !nextOpen && setLockingStaffId(null)}
        title={`Khóa tài khoản ${lockingStaff?.name ?? "nhân viên"}?`}
        description="Tài khoản này sẽ không thể đăng nhập cho đến khi chủ quán mở khóa lại."
        confirmLabel="Khóa tài khoản"
        destructive
        onConfirm={() => {
          if (!lockingStaff) return;
          updateStaff(lockingStaff.id, { locked: true, active: false });
          toast.success(`Đã khóa tài khoản ${lockingStaff.name}`);
          setLockingStaffId(null);
        }}
      />
    </div>
  );
}
