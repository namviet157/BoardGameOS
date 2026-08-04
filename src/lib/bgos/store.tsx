import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
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
  ComponentInspectionInput,
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
import { componentInspectionResult, validateComponentInspection } from "./component-inspection";

const KEY = "boardgameos-state-v2";
const SESSION_KEY = "boardgameos-session-v1";
const seedGameById = new Map(seedGames.map((game) => [game.id, game]));

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

type LegacyComponent = Partial<GameComponentItem> & { ok?: boolean };

function normalizeStoredState(stored: Partial<State>): State {
  const merged = { ...initialState, ...stored };
  return {
    ...merged,
    games: merged.games.map((game) => ({
      ...game,
      rules: game.rules ?? seedGameById.get(game.id)?.rules,
      coverImageUrl: game.coverImageUrl ?? seedGameById.get(game.id)?.coverImageUrl,
      components: game.components.map((component) => {
        const legacy = component as LegacyComponent;
        const condition =
          legacy.condition === "ok" ||
          legacy.condition === "missing" ||
          legacy.condition === "damaged"
            ? legacy.condition
            : legacy.ok === false
              ? (legacy.missingQty ?? 0) > 0
                ? "missing"
                : "damaged"
              : "ok";
        return {
          id: legacy.id ?? uid(),
          name: legacy.name ?? "Linh kiện",
          qty: legacy.qty ?? 1,
          condition,
          missingQty: condition === "missing" ? (legacy.missingQty ?? 0) : 0,
          note: condition === "ok" ? undefined : legacy.note,
        };
      }),
    })),
  };
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
  saveComponentInspection: (input: ComponentInspectionInput) => void;
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
      if (raw) setState(normalizeStoredState(JSON.parse(raw) as Partial<State>));
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
      activities: [{ ...item, id: uid(), at: new Date().toISOString() }, ...s.activities].slice(
        0,
        60,
      ),
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
        const member = state.staff.find(
          (s) => s.email.toLowerCase() === email.trim().toLowerCase(),
        );
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
        setState((s) => ({
          ...s,
          games: s.games.map((g) => (g.id === id ? { ...g, ...patch } : g)),
        })),
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
      saveComponentInspection: (input) => {
        const validationError = validateComponentInspection(input.components);
        if (validationError) throw new Error(validationError);

        const at = new Date().toISOString();
        const actor = session?.user.name ?? "Nhân viên";
        setState((s) => {
          const game = s.games.find((candidate) => candidate.id === input.gameId);
          if (!game) return s;

          const table = s.tables.find((candidate) => candidate.gameId === input.gameId);
          const result = componentInspectionResult(input.components);
          const hasIssue = result !== "ok";
          const details = input.components
            .filter((component) => component.condition !== "ok")
            .map((component) =>
              component.condition === "missing"
                ? `${component.name}: thiếu ${component.missingQty}/${component.qty}${component.note?.trim() ? ` (${component.note.trim()})` : ""}`
                : `${component.name}: hư hỏng (${component.note?.trim()})`,
            )
            .concat(input.note?.trim() ? [`Ghi chú chung: ${input.note.trim()}`] : [])
            .join(". ");
          const title =
            result === "damaged"
              ? input.components.some((component) => component.condition === "missing")
                ? "Thiếu và hư hỏng linh kiện"
                : "Phát hiện linh kiện hư hỏng"
              : result === "missing"
                ? `Thiếu linh kiện: ${input.components
                    .filter((component) => component.condition === "missing")
                    .map(
                      (component) => `${component.name} (${component.missingQty}/${component.qty})`,
                    )
                    .join(", ")}`
                : "Checklist linh kiện đầy đủ";

          const legacyIncidentPattern = /thiếu|linh kiện|hư hỏng|rách|cong/i;
          const componentIncidents = game.incidents.filter(
            (incident) =>
              !incident.resolved &&
              (incident.kind === "components" || legacyIncidentPattern.test(incident.title)),
          );
          const activeIncident = componentIncidents[0];
          let incidents = game.incidents.map((incident) => {
            if (!componentIncidents.some((candidate) => candidate.id === incident.id))
              return incident;
            if (hasIssue && incident.id === activeIncident?.id) {
              return {
                ...incident,
                kind: "components" as const,
                title,
                details,
                level: input.level,
                at,
                staff: actor,
                resolved: false,
              };
            }
            return { ...incident, resolved: true };
          });
          if (hasIssue && !activeIncident) {
            incidents = [
              {
                id: uid(),
                kind: "components",
                level: input.level,
                title,
                details,
                at,
                staff: actor,
                resolved: false,
              },
              ...incidents,
            ];
          }

          const notificationMatches = (notification: AppNotification) =>
            !notification.resolved &&
            ((notification.source === "component_inspection" && notification.gameId === game.id) ||
              (notification.type === "Linh kiện" && notification.to === `/app/games/${game.id}`));
          const activeNotification = s.notifications.find(notificationMatches);
          let notifications = s.notifications.map((notification) => {
            if (!notificationMatches(notification)) return notification;
            if (hasIssue && notification.id === activeNotification?.id) {
              return {
                ...notification,
                source: "component_inspection" as const,
                gameId: game.id,
                level: input.level === "high" ? ("critical" as const) : ("warning" as const),
                title: `${game.name}: ${title}`,
                body: details,
                at,
                read: false,
                resolved: false,
              };
            }
            return { ...notification, resolved: true };
          });
          if (hasIssue && !activeNotification) {
            notifications = [
              {
                id: uid(),
                type: "Linh kiện",
                level: input.level === "high" ? "critical" : "warning",
                title: `${game.name}: ${title}`,
                body: details,
                at,
                read: false,
                resolved: false,
                to: `/app/games/${game.id}`,
                source: "component_inspection",
                gameId: game.id,
              },
              ...notifications,
            ];
          }

          const nextStatus: GameStatus =
            input.forceMaintenance || result === "damaged"
              ? "maintenance"
              : result === "missing"
                ? "missing_parts"
                : input.context === "return"
                  ? input.components.length > 0
                    ? "available"
                    : "pending_check"
                  : game.status === "pending_check" || game.status === "missing_parts"
                    ? "available"
                    : game.status;
          const historyLabel =
            input.context === "return"
              ? input.components.length === 0
                ? "Nhận lại game, chưa có checklist linh kiện"
                : `Nhận lại game: ${title.toLowerCase()}`
              : `Kiểm tra linh kiện: ${title.toLowerCase()}`;
          const activityKind: ActivityItem["kind"] =
            input.context === "return"
              ? "return"
              : result === "damaged"
                ? "maintenance"
                : result === "missing"
                  ? "missing"
                  : "checklist";

          return {
            ...s,
            games: s.games.map((candidate) =>
              candidate.id === game.id
                ? {
                    ...candidate,
                    components: input.components,
                    status: nextStatus,
                    location: nextStatus === "maintenance" ? "Kho bảo trì" : candidate.location,
                    incidents,
                    history: [
                      {
                        id: uid(),
                        type: input.context === "return" ? ("return" as const) : ("check" as const),
                        label: historyLabel,
                        staff: actor,
                        at,
                      },
                      ...candidate.history,
                    ],
                  }
                : candidate,
            ),
            tables:
              input.context === "return"
                ? s.tables.map((candidate) =>
                    candidate.gameId === game.id ? { ...candidate, gameId: undefined } : candidate,
                  )
                : s.tables,
            transactions:
              input.context === "return" && table
                ? [
                    {
                      id: uid(),
                      type: "return",
                      gameId: game.id,
                      tableId: table.id,
                      staffId: table.staffId ?? "s3",
                      at,
                      note: historyLabel,
                    },
                    ...s.transactions,
                  ]
                : s.transactions,
            activities: [
              {
                id: uid(),
                kind: activityKind,
                text:
                  input.context === "return"
                    ? `Nhận lại ${game.name}${table ? ` từ ${table.name}` : ""}: ${title.toLowerCase()}`
                    : `${game.name}: ${title.toLowerCase()}`,
                at,
                staff: actor,
              },
              ...s.activities,
            ].slice(0, 60),
            notifications,
          };
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
                    {
                      id: uid(),
                      type: "deliver",
                      label: `Giao cho ${tableName(tableId)}`,
                      staff: staffName(staffId),
                      at,
                    },
                    ...g.history,
                  ],
                }
              : g,
          ),
          tables: s.tables.map((t) =>
            t.id === tableId
              ? {
                  ...t,
                  status: "playing",
                  gameId,
                  startedAt: t.startedAt ?? at,
                  staffId,
                  guests: guests ?? (t.guests || 2),
                }
              : t,
          ),
          transactions: [
            { id: uid(), type: "deliver", gameId, tableId, staffId, at },
            ...s.transactions,
          ],
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
                    {
                      id: uid(),
                      type: "return",
                      label: note ?? "Nhận lại game",
                      staff: session?.user.name ?? "Nhân viên",
                      at,
                    },
                    ...g.history,
                  ],
                }
              : g,
          ),
          tables: s.tables.map((t) => (t.gameId === gameId ? { ...t, gameId: undefined } : t)),
          transactions: table
            ? [
                {
                  id: uid(),
                  type: "return",
                  gameId,
                  tableId: table.id,
                  staffId: table.staffId ?? "s3",
                  at,
                  note,
                },
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
        setState((s) => ({
          ...s,
          tables: s.tables.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),
      setTableStatus: (id, status) => {
        const at = new Date().toISOString();
        const tracksSession = status === "playing" || status === "support" || status === "issue";
        setState((s) => ({
          ...s,
          tables: s.tables.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status,
                  guests: status === "empty" || status === "cleaning" ? 0 : t.guests,
                  gameId: status === "empty" ? undefined : t.gameId,
                  startedAt: tracksSession ? (t.startedAt ?? at) : undefined,
                }
              : t,
          ),
        }));
        pushActivity({
          kind: "table",
          text: `${tableName(id)} chuyển sang trạng thái mới`,
          staff: session?.user.name ?? "Nhân viên",
        });
      },
      endSession: (tableId) => {
        const table = state.tables.find((t) => t.id === tableId);
        setState((s) => ({
          ...s,
          tables: s.tables.map((t) =>
            t.id === tableId
              ? { ...t, status: "cleaning", guests: 0, gameId: undefined, startedAt: undefined }
              : t,
          ),
          games: s.games.map((g) =>
            g.id === table?.gameId ? { ...g, status: "pending_check" } : g,
          ),
        }));
        pushActivity({
          kind: "table",
          text: `Kết thúc phiên chơi tại ${tableName(tableId)}`,
          staff: session?.user.name ?? "Nhân viên",
        });
      },
      addStaff: (member) =>
        setState((s) => ({
          ...s,
          staff: [
            ...s.staff,
            { ...member, id: uid(), actionsToday: 0, lastActive: new Date().toISOString() },
          ],
        })),
      updateStaff: (id, patch) =>
        setState((s) => ({
          ...s,
          staff: s.staff.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),
      markNotification: (id, patch) =>
        setState((s) => ({
          ...s,
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, ...patch } : n)),
        })),
      markAllRead: () =>
        setState((s) => ({
          ...s,
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),
      updateSettings: (patch) => setState((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
      resetData: () => setState(initialState),
    };
  }, [state, session, hydrated, pushActivity]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore phải được dùng bên trong StoreProvider");
  return ctx;
}
