import type { AiDataSnapshot } from "./types";

type AiDataSource = AiDataSnapshot;

export function createAiDataSnapshot(source: AiDataSource): AiDataSnapshot {
  return {
    games: source.games,
    tables: source.tables,
    staff: source.staff,
    transactions: source.transactions,
    activities: source.activities,
    notifications: source.notifications,
    reports: source.reports,
    settings: source.settings,
  };
}
