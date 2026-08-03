import { AlertTriangle, CheckCircle2, PackageMinus, Wrench } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ComponentCondition, GameComponentItem, GameIncident } from "@/lib/bgos/types";

const CONDITION_OPTIONS: Array<{
  value: ComponentCondition;
  label: string;
  icon: typeof CheckCircle2;
}> = [
  { value: "ok", label: "Đầy đủ", icon: CheckCircle2 },
  { value: "missing", label: "Thiếu", icon: PackageMinus },
  { value: "damaged", label: "Hư hỏng", icon: Wrench },
];

export function ComponentInspectionForm({
  value,
  onChange,
  level,
  onLevelChange,
  generalNote,
  onGeneralNoteChange,
}: {
  value: GameComponentItem[];
  onChange: (value: GameComponentItem[]) => void;
  level: GameIncident["level"];
  onLevelChange: (value: GameIncident["level"]) => void;
  generalNote: string;
  onGeneralNoteChange: (value: string) => void;
}) {
  const updateItem = (id: string, patch: Partial<GameComponentItem>) => {
    onChange(value.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const setCondition = (item: GameComponentItem, condition: ComponentCondition) => {
    updateItem(item.id, {
      condition,
      missingQty: condition === "missing" ? item.missingQty : 0,
      note: condition === "ok" ? undefined : item.note,
    });
  };

  if (value.length === 0) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Game chưa có checklist linh kiện. Khi nhận lại, game sẽ được chuyển sang trạng thái chờ
          kiểm tra.
        </AlertDescription>
      </Alert>
    );
  }

  const hasIssue = value.some((item) => item.condition !== "ok");

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {value.map((item) => (
          <div key={item.id} className="space-y-3 rounded-xl border border-border p-3">
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">Số lượng chuẩn: {item.qty}</p>
            </div>
            <RadioGroup
              value={item.condition}
              onValueChange={(condition) => setCondition(item, condition as ComponentCondition)}
              className="grid grid-cols-3 gap-2"
            >
              {CONDITION_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <Label
                    key={option.value}
                    htmlFor={`${item.id}-${option.value}`}
                    className="flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border px-2 text-center text-xs has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/8 has-[[data-state=checked]]:text-primary sm:text-sm"
                  >
                    <RadioGroupItem
                      id={`${item.id}-${option.value}`}
                      value={option.value}
                      className="sr-only"
                    />
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{option.label}</span>
                  </Label>
                );
              })}
            </RadioGroup>
            {item.condition === "missing" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor={`${item.id}-missing`}>Số lượng thiếu</Label>
                  <Input
                    id={`${item.id}-missing`}
                    type="number"
                    min={1}
                    max={item.qty}
                    step={1}
                    className="mt-1.5 rounded-lg"
                    placeholder={`Từ 1 đến ${item.qty}`}
                    value={item.missingQty || ""}
                    onChange={(event) =>
                      updateItem(item.id, { missingQty: Number(event.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`${item.id}-missing-note`}>Ghi chú (không bắt buộc)</Label>
                  <Input
                    id={`${item.id}-missing-note`}
                    className="mt-1.5 rounded-lg"
                    placeholder="Ví dụ: thất lạc sau ca tối"
                    value={item.note ?? ""}
                    onChange={(event) => updateItem(item.id, { note: event.target.value })}
                  />
                </div>
              </div>
            ) : null}
            {item.condition === "damaged" ? (
              <div>
                <Label htmlFor={`${item.id}-damage-note`}>Mô tả hư hỏng</Label>
                <Input
                  id={`${item.id}-damage-note`}
                  className="mt-1.5 rounded-lg"
                  placeholder="Ví dụ: thẻ bị cong góc"
                  value={item.note ?? ""}
                  onChange={(event) => updateItem(item.id, { note: event.target.value })}
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {hasIssue ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label>Mức độ sự cố</Label>
            <Select
              value={level}
              onValueChange={(next) => onLevelChange(next as GameIncident["level"])}
            >
              <SelectTrigger className="mt-1.5 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Nhẹ</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="high">Nghiêm trọng</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="component-inspection-note">Ghi chú chung</Label>
            <Textarea
              id="component-inspection-note"
              className="mt-1.5 min-h-10 rounded-xl"
              placeholder="Thông tin chung của lần kiểm tra"
              value={generalNote}
              onChange={(event) => onGeneralNoteChange(event.target.value)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
