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

const getDistanceInKm = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

type SortField = "mapName" | "mode" | "type" | "points" | "distance" | "date";
type SortOrder = "asc" | "desc";

export const RoundTable = () => {
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
      groupByGame: false,
    },
    {
      enabled: !!playerId,
      placeholderData: keepPreviousData
    },
  );

  if (!data?.items.length) {
    return <div>No rounds found</div>;
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
              onClick={() => handleSort("mode")}
              className="cursor-pointer"
            >
              Mode <SortIcon field="mode" />
            </TableHead>
            <TableHead
              onClick={() => handleSort("type")}
              className="cursor-pointer"
            >
              Type <SortIcon field="type" />
            </TableHead>
            <TableHead
              onClick={() => handleSort("points")}
              className="cursor-pointer"
            >
              Points <SortIcon field="points" />
            </TableHead>
            <TableHead>Guessed</TableHead>
            <TableHead>Actual</TableHead>
            <TableHead
              onClick={() => handleSort("distance")}
              className="cursor-pointer"
            >
              Distance (km) <SortIcon field="distance" />
            </TableHead>
            <TableHead
              onClick={() => handleSort("date")}
              className="cursor-pointer"
            >
              Date <SortIcon field="date" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map((round) => (
            <TableRow
              key={round.roundId}
              className="cursor-pointer hover:bg-muted"
              onClick={() => {
                const selectedRound: SelectedRound = {
                  id: round.roundId,
                  guess: {
                    lat: round.guess.lat,
                    lng: round.guess.lng,
                  },
                  answer: round.answer,
                };
                setSelectedRounds([selectedRound]);
                window.scrollTo({ top: 350, behavior: "smooth" });
              }}
            >
              <TableCell>{round.mapName}</TableCell>
              <TableCell>{round.mode}</TableCell>
              <TableCell>{round.type}</TableCell>
              <TableCell>{round.guess.points}</TableCell>
              <TableCell>{round.guess.countryCode?.toUpperCase()}</TableCell>
              <TableCell>{round.answer.countryCode.toUpperCase()}</TableCell>
              <TableCell>
                {getDistanceInKm(
                  round.guess.lat,
                  round.guess.lng,
                  round.answer.lat,
                  round.answer.lng,
                ).toFixed(2)}
              </TableCell>
              <TableCell>
                {new Date(round.gameTimeStarted).toLocaleString()}
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
