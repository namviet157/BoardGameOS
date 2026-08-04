export type GameStatus = "available" | "in_use" | "pending_check" | "missing_parts" | "maintenance";

export type Difficulty = "Dễ" | "Trung bình" | "Khó";

export type ComponentCondition = "ok" | "missing" | "damaged";

export interface GameComponentItem {
  id: string;
  name: string;
  qty: number;
  condition: ComponentCondition;
  missingQty: number;
  note?: string;
}

export interface GameHistoryEntry {
  id: string;
  type: "deliver" | "return" | "check" | "status";
  label: string;
  staff: string;
  at: string;
}

export interface GameIncident {
  id: string;
  level: "low" | "medium" | "high";
  title: string;
  at: string;
  staff: string;
  resolved: boolean;
  kind?: "components";
  details?: string;
}

export interface GameRules {
  objective: string;
  setup: string[];
  gameplay: string[];
  ending: string;
  notes?: string[];
}

export interface Game {
  id: string;
  code: string;
  name: string;
  category: string;
  minPlayers: number;
  maxPlayers: number;
  duration: number;
  difficulty: Difficulty;
  status: GameStatus;
  location: string;
  description: string;
  rules?: GameRules;
  age: number;
  interaction: "Thấp" | "Vừa" | "Cao";
  mode: "Cạnh tranh" | "Hợp tác";
  beginnerFriendly: boolean;
  emoji: string;
  tone: 1 | 2 | 3 | 4 | 5;
  coverImageUrl?: string;
  imageDataUrl?: string;
  components: GameComponentItem[];
  history: GameHistoryEntry[];
  incidents: GameIncident[];
  notes: string;
  usage30d: number;
}

export type TableStatus = "empty" | "playing" | "support" | "issue" | "cleaning";

export interface PlayTable {
  id: string;
  name: string;
  seats: number;
  guests: number;
  status: TableStatus;
  gameId?: string;
  startedAt?: string;
  staffId?: string;
}

export type StaffRole = "Chủ quán" | "Quản lý" | "Thu ngân" | "Nhân viên phục vụ" | "Nhân viên kho";

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  shift: string;
  active: boolean;
  locked: boolean;
  actionsToday: number;
  lastActive: string;
  permissions: string[];
}

export interface Transaction {
  id: string;
  type: "deliver" | "return";
  gameId: string;
  tableId: string;
  staffId: string;
  at: string;
  note?: string;
}

export interface ActivityItem {
  id: string;
  kind: "deliver" | "return" | "missing" | "maintenance" | "table" | "checklist";
  text: string;
  at: string;
  staff: string;
}

export interface AppNotification {
  id: string;
  type: "Kiểm tra" | "Linh kiện" | "Bảo trì" | "Hỗ trợ" | "Tài khoản" | "Checklist";
  level: "info" | "warning" | "critical";
  title: string;
  body: string;
  at: string;
  read: boolean;
  resolved: boolean;
  to?: string;
  source?: "component_inspection";
  gameId?: string;
}

export interface ComponentInspectionInput {
  gameId: string;
  components: GameComponentItem[];
  level: GameIncident["level"];
  note?: string;
  context: "standalone" | "return";
  forceMaintenance?: boolean;
}

export interface ReportDay {
  date: string;
  sessions: number;
  incidents: number;
  tableUsage: number;
  avgMinutes: number;
}

export interface Session {
  user: { name: string; email: string; role: StaffRole };
}

export interface StoreSettings {
  storeName: string;
  branch: string;
  branches: { id: string; name: string; address: string; tables: number }[];
  address: string;
  hotline: string;
  openHours: string;
  notifyMissing: boolean;
  notifySupport: boolean;
  notifyDailyReport: boolean;
  compactMode: boolean;
}
