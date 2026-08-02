import type {
  ActivityItem,
  AppNotification,
  Game,
  PlayTable,
  ReportDay,
  Staff,
  StoreSettings,
  Transaction,
} from "@/lib/bgos/types";

export interface AiDataSnapshot {
  games: Game[];
  tables: PlayTable[];
  staff: Staff[];
  transactions: Transaction[];
  activities: ActivityItem[];
  notifications: AppNotification[];
  reports: ReportDay[];
  settings: StoreSettings;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface OperationsChatRequest {
  question: string;
  currentPath: string;
  history: ChatMessage[];
  data: AiDataSnapshot;
}

export interface OperationsChatResponse {
  answer: string;
  suggestedQuestions: string[];
}
