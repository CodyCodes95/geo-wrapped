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
import { keepPreviousData } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";

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

  const { data } = api.games.getAllWithResults.useQuery(
    {
      playerId,
      selectedMonth,
      page,
      limit: itemsPerPage,
      sortField,
      sortOrder,
      search,
      groupByGame: true,
    },
    {
      enabled: !!playerId,
      // placeholderData: keepPreviousData
    },
  );

  if (!data?.items.length) {
    return <div>No games found</div>;
  }

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

  const isDuelGame = (game: (typeof data.items)[0]) => game.type === "Duel";

  const getGameResult = (game: (typeof data.items)[0]) => {
    if (!isDuelGame(game)) return null;
    return game.guess.healthAfter === 0 ? "L" : "W";
  };

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
          {data.items.map((game) => (
            <TableRow
              key={game.gameId}
              className="cursor-pointer hover:bg-muted"
              onClick={() => {
                const selectedRound: SelectedRound = {
                  id: game.roundId,
                  guess: {
                    lat: game.guess.lat,
                    lng: game.guess.lng,
                  },
                  answer: game.answer,
                };
                setSelectedRounds([selectedRound]);
                window.scrollTo({ top: 350, behavior: "smooth" });
              }}
            >
              <TableCell>{game.mapName}</TableCell>
              <TableCell>{game.type}</TableCell>
              <TableCell>{game.mode}</TableCell>
              <TableCell>
                {!isDuelGame(game) ? game.totalPoints : "-"}
              </TableCell>
              <TableCell>
                {isDuelGame(game) ? getGameResult(game) : "-"}
              </TableCell>
              <TableCell>
                {new Date(game.gameTimeStarted).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center gap-2">
        <Button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="disabled:opacity-50"
        >
          Previous
        </Button>
        <span className="px-3 py-2">
          Page {page} of {data.pages}
        </span>
        <Button
          onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
          disabled={page === data.pages}
          className="disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
