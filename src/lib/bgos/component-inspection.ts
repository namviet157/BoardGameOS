import type { GameComponentItem } from "./types";

export function createComponentInspectionDraft(items: GameComponentItem[]) {
  return items.map((item) => ({ ...item }));
}

export function validateComponentInspection(items: GameComponentItem[]) {
  for (const item of items) {
    if (item.condition === "missing") {
      if (!Number.isInteger(item.missingQty) || item.missingQty < 1 || item.missingQty > item.qty) {
        return `Số lượng thiếu của ${item.name} phải là số nguyên từ 1 đến ${item.qty}.`;
      }
    }
    if (item.condition === "damaged" && !item.note?.trim()) {
      return `Vui lòng mô tả tình trạng hư hỏng của ${item.name}.`;
    }
  }
  return null;
}

export function componentInspectionResult(items: GameComponentItem[]) {
  if (items.some((item) => item.condition === "damaged")) return "damaged" as const;
  if (items.some((item) => item.condition === "missing")) return "missing" as const;
  return "ok" as const;
}
