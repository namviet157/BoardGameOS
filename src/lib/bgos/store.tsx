import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  seedActivities,
  seedGames,
  seedNotifications,
  seedReports,
  seedSettings,
  seedStaff,
  seedTables,
  seedTransactions,
} from "./mock";
import type {
  ActivityItem,
  AppNotification,
  Game,
  GameComponentItem,
  GameStatus,
  PlayTable,
  ReportDay,
  Session,
  Staff,
  StoreSettings,
  TableStatus,
  Transaction,
} from "./types";

const KEY = "boardgameos-state-v1";
const SESSION_KEY = "boardgameos-session-v1";

interface State {
  games: Game[];
  tables: PlayTable[];
  staff: Staff[];
  transactions: Transaction[];
  activities: ActivityItem[];
  notifications: AppNotification[];
  reports: ReportDay[];
  settings: StoreSettings;
}

const initialState: State = {
  games: seedGames,
  tables: seedTables,
  staff: seedStaff,
  transactions: seedTransactions,
  activities: seedActivities,
  notifications: seedNotifications,
  reports: seedReports,
  settings: seedSettings,
};

interface StoreValue extends State {
  hydrated: boolean;
  session: Session | null;
  login: (email: string) => boolean;
  logout: () => void;
  addGame: (game: Omit<Game, "id" | "history" | "incidents" | "usage30d">) => void;
  updateGame: (id: string, patch: Partial<Game>) => void;
  setGameStatus: (id: string, status: GameStatus, note?: string) => void;
  saveComponents: (id: string, components: GameComponentItem[]) => void;
  deliverGame: (gameId: string, tableId: string, staffId: string, guests?: number) => void;
  returnGame: (gameId: string, status: GameStatus, note?: string) => void;
  updateTable: (id: string, patch: Partial<PlayTable>) => void;
  setTableStatus: (id: string, status: TableStatus) => void;
  endSession: (tableId: string) => void;
  addStaff: (staff: Omit<Staff, "id" | "actionsToday" | "lastActive">) => void;
  updateStaff: (id: string, patch: Partial<Staff>) => void;
  markNotification: (id: string, patch: Partial<AppNotification>) => void;
  markAllRead: () => void;
  updateSettings: (patch: Partial<StoreSettings>) => void;
  resetData: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as State) });
      const rawSession = localStorage.getItem(SESSION_KEY);
      if (rawSession) setSession(JSON.parse(rawSession));
    } catch {
      /* ignore corrupted storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }, [session, hydrated]);

  const pushActivity = useCallback((item: Omit<ActivityItem, "id" | "at">) => {
    setState((s) => ({
      ...s,
      activities: [{ ...item, id: uid(), at: new Date().toISOString() }, ...s.activities].slice(0, 60),
    }));
  }, []);

  const pushNotification = useCallback((n: Omit<AppNotification, "id" | "at" | "read" | "resolved">) => {
    setState((s) => ({
      ...s,
      notifications: [
        { ...n, id: uid(), at: new Date().toISOString(), read: false, resolved: false },
        ...s.notifications,
      ],
    }));
  }, []);

  const value = useMemo<StoreValue>(() => {
    const staffName = (id: string) => state.staff.find((x) => x.id === id)?.name ?? "Nhân viên";
    const gameName = (id: string) => state.games.find((x) => x.id === id)?.name ?? "Game";
    const tableName = (id: string) => state.tables.find((x) => x.id === id)?.name ?? "Bàn";

    return {
      ...state,
      hydrated,
      session,
      login: (email) => {
        const member = state.staff.find((s) => s.email.toLowerCase() === email.trim().toLowerCase());
        if (!member || member.locked) return false;
        setSession({ user: { name: member.name, email: member.email, role: member.role } });
        return true;
      },
      logout: () => setSession(null),
      addGame: (game) =>
        setState((s) => ({
          ...s,
          games: [{ ...game, id: uid(), history: [], incidents: [], usage30d: 0 }, ...s.games],
        })),
      updateGame: (id, patch) =>
        setState((s) => ({ ...s, games: s.games.map((g) => (g.id === id ? { ...g, ...patch } : g)) })),
      setGameStatus: (id, status, note) => {
        setState((s) => ({
          ...s,
          games: s.games.map((g) =>
            g.id === id
              ? {
                  ...g,
                  status,
                  location: status === "maintenance" ? "Kho bảo trì" : g.location,
                  history: [
                    {
                      id: uid(),
                      type: "status" as const,
                      label: note ?? `Cập nhật trạng thái`,
                      staff: session?.user.name ?? "Hệ thống",
                      at: new Date().toISOString(),
                    },
                    ...g.history,
                  ],
                }
              : g,
          ),
        }));
        pushActivity({
          kind: status === "maintenance" ? "maintenance" : "checklist",
          text: `${gameName(id)}: ${note ?? "cập nhật trạng thái"}`,
          staff: session?.user.name ?? "Hệ thống",
        });
      },
      saveComponents: (id, components) => {
        const missing = components.some((c) => !c.ok);
        setState((s) => ({
          ...s,
          games: s.games.map((g) =>
            g.id === id
              ? {
                  ...g,
                  components,
                  status: missing ? "missing_parts" : g.status === "missing_parts" ? "available" : g.status,
                  incidents: missing
                    ? [
                        {
                          id: uid(),
                          level: "medium" as const,
                          title: `Thiếu linh kiện: ${components.filter((c) => !c.ok).map((c) => c.name).join(", ")}`,
                          at: new Date().toISOString(),
                          staff: session?.user.name ?? "Nhân viên",
                          resolved: false,
                        },
                        ...g.incidents,
                      ]
                    : g.incidents,
                }
              : g,
          ),
        }));
        pushActivity({
          kind: missing ? "missing" : "checklist",
          text: missing ? `Báo thiếu linh kiện của ${gameName(id)}` : `Hoàn tất checklist ${gameName(id)}`,
          staff: session?.user.name ?? "Nhân viên",
        });
        if (missing)
          pushNotification({
            type: "Linh kiện",
            level: "critical",
            title: `${gameName(id)} thiếu linh kiện`,
            body: "Checklist ghi nhận linh kiện chưa đầy đủ, cần xử lý trước khi đưa lại vào kho.",
            to: `/app/games/${id}`,
          });
      },
      deliverGame: (gameId, tableId, staffId, guests) => {
        const at = new Date().toISOString();
        setState((s) => ({
          ...s,
          games: s.games.map((g) =>
            g.id === gameId
              ? {
                  ...g,
                  status: "in_use",
                  usage30d: g.usage30d + 1,
                  history: [
                    { id: uid(), type: "deliver", label: `Giao cho ${tableName(tableId)}`, staff: staffName(staffId), at },
                    ...g.history,
                  ],
                }
              : g,
          ),
          tables: s.tables.map((t) =>
            t.id === tableId
              ? { ...t, status: "playing", gameId, startedAt: t.startedAt ?? at, staffId, guests: guests ?? (t.guests || 2) }
              : t,
          ),
          transactions: [{ id: uid(), type: "deliver", gameId, tableId, staffId, at }, ...s.transactions],
        }));
        pushActivity({
          kind: "deliver",
          text: `Giao ${gameName(gameId)} cho ${tableName(tableId)}`,
          staff: staffName(staffId),
        });
      },
      returnGame: (gameId, status, note) => {
        const at = new Date().toISOString();
        const table = state.tables.find((t) => t.gameId === gameId);
        setState((s) => ({
          ...s,
          games: s.games.map((g) =>
            g.id === gameId
              ? {
                  ...g,
                  status,
                  history: [
                    { id: uid(), type: "return", label: note ?? "Nhận lại game", staff: session?.user.name ?? "Nhân viên", at },
                    ...g.history,
                  ],
                }
              : g,
          ),
          tables: s.tables.map((t) => (t.gameId === gameId ? { ...t, gameId: undefined } : t)),
          transactions: table
            ? [
                { id: uid(), type: "return", gameId, tableId: table.id, staffId: table.staffId ?? "s3", at, note },
                ...s.transactions,
              ]
            : s.transactions,
        }));
        pushActivity({
          kind: "return",
          text: `Nhận lại ${gameName(gameId)}${table ? ` từ ${table.name}` : ""}`,
          staff: session?.user.name ?? "Nhân viên",
        });
      },
      updateTable: (id, patch) =>
        setState((s) => ({ ...s, tables: s.tables.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
      setTableStatus: (id, status) => {
        setState((s) => ({
          ...s,
          tables: s.tables.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status,
                  guests: status === "empty" || status === "cleaning" ? 0 : t.guests,
                  gameId: status === "empty" ? undefined : t.gameId,
                  startedAt: status === "empty" ? undefined : t.startedAt,
                }
              : t,
          ),
        }));
        pushActivity({ kind: "table", text: `${tableName(id)} chuyển sang trạng thái mới`, staff: session?.user.name ?? "Nhân viên" });
      },
      endSession: (tableId) => {
        const table = state.tables.find((t) => t.id === tableId);
        setState((s) => ({
          ...s,
          tables: s.tables.map((t) =>
            t.id === tableId ? { ...t, status: "cleaning", guests: 0, gameId: undefined, startedAt: undefined } : t,
          ),
          games: s.games.map((g) => (g.id === table?.gameId ? { ...g, status: "pending_check" } : g)),
        }));
        pushActivity({ kind: "table", text: `Kết thúc phiên chơi tại ${tableName(tableId)}`, staff: session?.user.name ?? "Nhân viên" });
      },
      addStaff: (member) =>
        setState((s) => ({
          ...s,
          staff: [...s.staff, { ...member, id: uid(), actionsToday: 0, lastActive: new Date().toISOString() }],
        })),
      updateStaff: (id, patch) =>
        setState((s) => ({ ...s, staff: s.staff.map((m) => (m.id === id ? { ...m, ...patch } : m)) })),
      markNotification: (id, patch) =>
        setState((s) => ({ ...s, notifications: s.notifications.map((n) => (n.id === id ? { ...n, ...patch } : n)) })),
      markAllRead: () =>
        setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      updateSettings: (patch) => setState((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
      resetData: () => setState(initialState),
    };
  }, [state, session, hydrated, pushActivity, pushNotification]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore phải được dùng bên trong StoreProvider");
  return ctx;
}
