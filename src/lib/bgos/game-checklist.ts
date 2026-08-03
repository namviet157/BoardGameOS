import type { GameComponentItem } from "./types";

export type GameComponentDraft = Omit<GameComponentItem, "qty"> & { qty: string };

export function createGameComponentDraft(): GameComponentDraft {
  return {
    id: crypto.randomUUID(),
    name: "",
    qty: "1",
    condition: "ok",
    missingQty: 0,
  };
}

export function toGameComponentDrafts(items: GameComponentItem[]): GameComponentDraft[] {
  return items.map((item) => ({ ...item, qty: String(item.qty) }));
}

export function validateGameComponentDrafts(items: GameComponentDraft[]) {
  for (const item of items) {
    if (!item.name.trim()) return "Vui lòng nhập tên cho tất cả linh kiện.";
    const quantity = Number(item.qty);
    if (!Number.isInteger(quantity) || quantity < 1) {
      return `Số lượng của ${item.name.trim()} phải là số nguyên từ 1 trở lên.`;
    }
    if (item.condition === "missing" && item.missingQty > quantity) {
      return `Số lượng chuẩn của ${item.name.trim()} không thể nhỏ hơn số lượng đang thiếu.`;
    }
  }
  return null;
}

export function buildGameComponents(items: GameComponentDraft[]): GameComponentItem[] {
  return items.map((item) => ({ ...item, name: item.name.trim(), qty: Number(item.qty) }));
}
