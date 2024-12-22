"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Search } from "./Search";
import { api } from "~/trpc/react";
import { usePlayerId } from "../dashboard/_hooks/usePlayerId";
import { useMonth } from "../_layout/MonthSelector";
import { useMapStore, type SelectedRound } from "~/store/mapStore";

type SortField = "mapName" | "type" | "mode" | "score" | "date" | "result";
type SortOrder = "asc" | "desc";

export const GameTable = () => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;
  const playerId = usePlayerId()!;
  const { selectedMonth } = useMonth();
  const { setSelectedRounds } = useMapStore();
  const { data: games } = api.games.getAllWithResults.useQuery(
    { playerId, selectedMonth },
    { enabled: !!playerId },
  );

  if (!games?.length) {
    return <div>No games found</div>;
  }

  const groupedGames = games.reduce((acc, round) => {
    const game = acc.get(round.gameId) ?? [];
    game.push(round);
    acc.set(round.gameId, game);
    return acc;
  }, new Map<string, typeof games>());

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="inline h-4 w-4" />
    ) : (
      <ChevronDown className="inline h-4 w-4" />
    );
  };

  const isDuelGame = (game: (typeof games)[0]) => game.type === "Duel";

  const getGameResult = (rounds: typeof games) => {
    if (!isDuelGame(rounds[0]!)) return null;
    const lastRound = rounds[rounds.length - 1];
    return lastRound!.guess.healthAfter === 0 ? "L" : "W";
  };

  const groupedAndSortedGames = Array.from(groupedGames.entries())
    .filter(([_, rounds]) => {
      const game = rounds[0];
      return Object.values(game!).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase()),
      );
    })
    .sort(([, a], [, b]) => {
      const gameA = a[0];
      const gameB = b[0];
      const modifier = sortOrder === "asc" ? 1 : -1;

      switch (sortField) {
        case "date":
          return (
            (gameA!.gameTimeStarted.getTime() -
              gameB!.gameTimeStarted.getTime()) *
            modifier
          );
        case "score":
          return (
            (a.reduce((sum, r) => sum + r.guess.points, 0) -
              b.reduce((sum, r) => sum + r.guess.points, 0)) *
            modifier
          );
        default:
          return (
            String(gameA![sortField]).localeCompare(String(gameB![sortField])) *
            modifier
          );
      }
    });

  const paginatedGames = groupedAndSortedGames.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const totalPages = Math.ceil(groupedAndSortedGames.length / itemsPerPage);

  return (
    <div className="space-y-4">
      <Search value={search} onChange={setSearch} />
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead
              onClick={() => handleSort("mapName")}
              className="cursor-pointer"
            >
              Map <SortIcon field="mapName" />
            </TableHead>
            <TableHead
              onClick={() => handleSort("type")}
              className="cursor-pointer"
            >
              Type <SortIcon field="type" />
            </TableHead>
            <TableHead
              onClick={() => handleSort("mode")}
              className="cursor-pointer"
            >
              Mode <SortIcon field="mode" />
            </TableHead>
            <TableHead
              onClick={() => handleSort("score")}
              className="cursor-pointer"
            >
              Score <SortIcon field="score" />
            </TableHead>
            <TableHead>Result</TableHead>
            <TableHead
              onClick={() => handleSort("date")}
              className="cursor-pointer"
            >
              Played <SortIcon field="date" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedGames.map(([gameId, rounds]) => {
            const game = rounds[0];
            const isDuel = isDuelGame(game!);
            return (
              <TableRow
                key={gameId}
                className="cursor-pointer hover:bg-muted"
                onClick={() => {
                  const selectedRounds: SelectedRound[] = rounds.map((r) => ({
                    id: r.roundId,
                    guess: {
                      lat: r.guess.lat,
                      lng: r.guess.lng,
                    },
                    answer: r.answer,
                  }));
                  setSelectedRounds(selectedRounds);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <TableCell>{game?.mapName}</TableCell>
                <TableCell>{game?.type}</TableCell>
                <TableCell>{game?.mode}</TableCell>
                <TableCell>
                  {!isDuel
                    ? rounds.reduce((sum, r) => sum + r.guess.points, 0)
                    : "-"}
                </TableCell>
                <TableCell>{isDuel ? getGameResult(rounds) : "-"}</TableCell>
                <TableCell>
                  {new Date(game?.gameTimeStarted ?? "").toLocaleString()}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-2 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-3 py-2">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
