import type { Difficulty, GameStatus, TableStatus } from "./types";

export const GAME_STATUS_LABEL: Record<GameStatus, string> = {
  available: "Có sẵn",
  in_use: "Đang được sử dụng",
  pending_check: "Chờ kiểm tra",
  missing_parts: "Thiếu linh kiện",
  maintenance: "Đang bảo trì",
};

export const GAME_STATUS_CLASS: Record<GameStatus, string> = {
  available: "bg-success/12 text-success border-success/30",
  in_use: "bg-primary/12 text-primary border-primary/30",
  pending_check: "bg-gold/20 text-gold-foreground border-gold/50",
  missing_parts: "bg-destructive/12 text-destructive border-destructive/30",
  maintenance: "bg-muted text-muted-foreground border-border",
};

export const TABLE_STATUS_LABEL: Record<TableStatus, string> = {
  empty: "Bàn trống",
  playing: "Đang chơi",
  support: "Cần hỗ trợ",
  issue: "Có sự cố",
  cleaning: "Đang dọn",
};

export const TABLE_STATUS_CLASS: Record<TableStatus, string> = {
  empty: "bg-success/12 text-success border-success/30",
  playing: "bg-primary/12 text-primary border-primary/30",
  support: "bg-gold/25 text-gold-foreground border-gold/60",
  issue: "bg-destructive/12 text-destructive border-destructive/30",
  cleaning: "bg-muted text-muted-foreground border-border",
};

export const DIFFICULTIES: Difficulty[] = ["Dễ", "Trung bình", "Khó"];

export const TONE_CLASS: Record<number, string> = {
  1: "bg-primary/15 text-primary",
  2: "bg-success/15 text-success",
  3: "bg-gold/25 text-gold-foreground",
  4: "bg-destructive/12 text-destructive",
  5: "bg-muted text-muted-foreground",
};

export function timeAgo(iso: string): string {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const m = Math.round(diff / 60000);
  if (m < 1) return "vừa xong";
  if (m < 60) return `${m} phút trước`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} giờ trước`;
  return `${Math.round(h / 24)} ngày trước`;
}

export function formatTime(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

export function minutesSince(iso?: string): number {
  if (!iso) return 0;
  return Math.round((Date.now() - new Date(iso).getTime()) / 60000);
}

export function playersLabel(min: number, max: number) {
  return min === max ? `${min} người` : `${min}–${max} người`;
}
