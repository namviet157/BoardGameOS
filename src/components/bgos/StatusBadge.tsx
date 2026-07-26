import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  GAME_STATUS_CLASS,
  GAME_STATUS_LABEL,
  TABLE_STATUS_CLASS,
  TABLE_STATUS_LABEL,
} from "@/lib/bgos/helpers";
import type { GameStatus, TableStatus } from "@/lib/bgos/types";

export function GameStatusBadge({ status, className }: { status: GameStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn("rounded-lg font-medium", GAME_STATUS_CLASS[status], className)}>
      {GAME_STATUS_LABEL[status]}
    </Badge>
  );
}

export function TableStatusBadge({ status, className }: { status: TableStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn("rounded-lg font-medium", TABLE_STATUS_CLASS[status], className)}>
      {TABLE_STATUS_LABEL[status]}
    </Badge>
  );
}
