import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Boxes, Grid2x2, Users } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { GAME_STATUS_LABEL, TABLE_STATUS_LABEL } from "@/lib/bgos/helpers";
import { useStore } from "@/lib/bgos/store";

interface GlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLocaleLowerCase("vi-VN");
}

function matchesSearch(query: string, values: Array<string | undefined>) {
  if (!query) return true;
  const searchable = normalizeSearch(values.filter(Boolean).join(" "));
  return searchable.includes(query);
}

export function GlobalSearchDialog({ open, onOpenChange }: GlobalSearchDialogProps) {
  const navigate = useNavigate();
  const { games, tables, staff, session } = useStore();
  const [query, setQuery] = useState("");
  const normalizedQuery = normalizeSearch(query.trim());
  const isOwner = session?.user.role === "Chủ quán";

  const gameResults = useMemo(
    () =>
      games
        .filter((game) =>
          matchesSearch(normalizedQuery, [
            game.name,
            game.code,
            game.category,
            game.location,
            GAME_STATUS_LABEL[game.status],
          ]),
        )
        .slice(0, 5),
    [games, normalizedQuery],
  );

  const tableResults = useMemo(
    () =>
      tables
        .filter((table) => {
          const game = games.find((item) => item.id === table.gameId);
          const member = staff.find((item) => item.id === table.staffId);
          return matchesSearch(normalizedQuery, [
            table.name,
            TABLE_STATUS_LABEL[table.status],
            game?.name,
            member?.name,
          ]);
        })
        .slice(0, 5),
    [games, normalizedQuery, staff, tables],
  );

  const staffResults = useMemo(
    () =>
      isOwner
        ? staff
            .filter((member) =>
              matchesSearch(normalizedQuery, [member.name, member.email, member.role]),
            )
            .slice(0, 5)
        : [],
    [isOwner, normalizedQuery, staff],
  );

  function closeAndReset() {
    onOpenChange(false);
    setQuery("");
  }

  function openGame(gameId: string) {
    closeAndReset();
    void navigate({ to: "/app/games/$gameId", params: { gameId } });
  }

  function openPage(to: "/app/tables" | "/app/staff") {
    closeAndReset();
    void navigate({ to });
  }

  const hasResults = gameResults.length + tableResults.length + staffResults.length > 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) setQuery("");
      }}
    >
      <DialogContent className="overflow-hidden p-0">
        <DialogTitle className="sr-only">Tìm kiếm toàn hệ thống</DialogTitle>
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Tìm game, bàn, nhân viên..."
          />
          <CommandList>
            {!hasResults ? <CommandEmpty>Không tìm thấy kết quả phù hợp.</CommandEmpty> : null}

            {gameResults.length > 0 ? (
              <CommandGroup heading="Game">
                {gameResults.map((game) => (
                  <CommandItem key={game.id} value={game.id} onSelect={() => openGame(game.id)}>
                    <Boxes />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{game.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {game.code} · {game.category} · {game.location}
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}

            {tableResults.length > 0 ? (
              <CommandGroup heading="Bàn chơi">
                {tableResults.map((table) => {
                  const game = games.find((item) => item.id === table.gameId);
                  const member = staff.find((item) => item.id === table.staffId);
                  return (
                    <CommandItem
                      key={table.id}
                      value={table.id}
                      onSelect={() => openPage("/app/tables")}
                    >
                      <Grid2x2 />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{table.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {[TABLE_STATUS_LABEL[table.status], game?.name, member?.name]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ) : null}

            {staffResults.length > 0 ? (
              <CommandGroup heading="Nhân viên">
                {staffResults.map((member) => (
                  <CommandItem
                    key={member.id}
                    value={member.id}
                    onSelect={() => openPage("/app/staff")}
                  >
                    <Users />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{member.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {member.email} · {member.role}
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
