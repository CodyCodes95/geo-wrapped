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
  const { data: rounds } = api.games.getAllWithResults.useQuery(
    { playerId, selectedMonth },
    { enabled: !!playerId },
  );

  if (!rounds?.length) {
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

  const filteredAndSortedRounds = rounds
    .filter((round) =>
      Object.values(round).some((value) =>
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    )
    .sort((a, b) => {
      const modifier = sortOrder === "asc" ? 1 : -1;
      switch (sortField) {
        case "date":
          return (a.gameTimeStarted.getTime() - b.gameTimeStarted.getTime()) * modifier;
        case "points":
          return (a.guess.points - b.guess.points) * modifier;
        case "distance":
          return (getDistanceInKm(a.guess.lat, a.guess.lng, a.answer.lat, a.answer.lng) -
            getDistanceInKm(b.guess.lat, b.guess.lng, b.answer.lat, b.answer.lng)) * modifier;
        default:
          return String(a[sortField]).localeCompare(String(b[sortField])) * modifier;
      }
    });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />;
  };

  const paginatedRounds = filteredAndSortedRounds.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAndSortedRounds.length / itemsPerPage);

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
          {paginatedRounds.map((round) => (
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
