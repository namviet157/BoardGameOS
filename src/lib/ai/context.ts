import type { AiDataSnapshot } from "./types";
import type { Game } from "@/lib/bgos/types";

type AiDataSource = Omit<AiDataSnapshot, "games"> & { games: Game[] };

function removeGameImage({
  imageDataUrl: _imageDataUrl,
  coverImageUrl: _coverImageUrl,
  ...game
}: Game) {
  return game;
}

export function createAiDataSnapshot(source: AiDataSource): AiDataSnapshot {
  return {
    games: source.games.map(removeGameImage),
    tables: source.tables,
    staff: source.staff,
    transactions: source.transactions,
    activities: source.activities,
    notifications: source.notifications,
    reports: source.reports,
    settings: source.settings,
  };
}
