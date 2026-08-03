import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createGameComponentDraft, type GameComponentDraft } from "@/lib/bgos/game-checklist";

export function GameChecklistEditor({
  value,
  onChange,
  disabled = false,
}: {
  value: GameComponentDraft[];
  onChange: (value: GameComponentDraft[]) => void;
  disabled?: boolean;
}) {
  const updateItem = (id: string, patch: Partial<GameComponentDraft>) => {
    onChange(value.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  return (
    <div className="space-y-3">
      {value.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-3 py-4 text-center text-sm text-muted-foreground">
          Chưa có linh kiện nào trong danh sách chuẩn.
        </p>
      ) : (
        <div className="space-y-2">
          {value.map((item, index) => (
            <div
              key={item.id}
              className="grid gap-2 rounded-xl border border-border p-3 sm:grid-cols-[minmax(0,1fr)_8rem_2.25rem] sm:items-end"
            >
              <div>
                <Label htmlFor={`component-name-${item.id}`}>Tên linh kiện {index + 1}</Label>
                <Input
                  id={`component-name-${item.id}`}
                  className="mt-1.5 rounded-lg"
                  placeholder="Ví dụ: Thẻ bài"
                  value={item.name}
                  disabled={disabled}
                  onChange={(event) => updateItem(item.id, { name: event.target.value })}
                />
              </div>
              <div>
                <Label htmlFor={`component-qty-${item.id}`}>Số lượng</Label>
                <Input
                  id={`component-qty-${item.id}`}
                  type="number"
                  min={1}
                  step={1}
                  className="mt-1.5 rounded-lg"
                  value={item.qty}
                  disabled={disabled}
                  onChange={(event) => updateItem(item.id, { qty: event.target.value })}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={disabled}
                aria-label={`Xóa ${item.name.trim() || `linh kiện ${index + 1}`}`}
                onClick={() => onChange(value.filter((candidate) => candidate.id !== item.id))}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        className="rounded-xl"
        disabled={disabled}
        onClick={() => onChange([...value, createGameComponentDraft()])}
      >
        <Plus /> Thêm linh kiện
      </Button>
    </div>
  );
}
