import { and, avg, count, eq, gte, lte } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { games, rounds } from "~/server/db/schema";
import { getMonthTimestampRange } from "~/utils";

const moodengCenter = {
  lat: 13.216247039443203,
  lng: 101.05681153985368,
};

const obamaBoundingBox = {
  north: 35.5774,
  south: 35.3844,
  east: 135.8603,
  west: 135.5887,
};

// Radius of the Earth in kilometers
const EARTH_RADIUS = 6371;

type Point = {
  lat: number;
  lng: number;
};

function getDistanceInKm(point1: Point, point2: Point) {
  const lat1 = toRadians(point1.lat);
  const lat2 = toRadians(point2.lat);
  const deltaLat = toRadians(point2.lat - point1.lat);
  const deltaLng = toRadians(point2.lng - point1.lng);

  // Haversine formula
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS * c;
}

function toRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

function calculateBoundingBox(lat: number, lng: number, radiusKm: number) {
  // Convert radius from kilometers to degrees
  const latOffset = (radiusKm / EARTH_RADIUS) * (180 / Math.PI);
  const lngOffset =
    ((radiusKm / EARTH_RADIUS) * (180 / Math.PI)) /
    Math.cos((lat * Math.PI) / 180);

  return {
    minLat: lat - latOffset,
    maxLat: lat + latOffset,
    minLng: lng - lngOffset,
    maxLng: lng + lngOffset,
  };
}

export const guessRouter = createTRPCRouter({
  getAverageScore: publicProcedure
    .input(
      z.object({
        playerId: z.string(),
        selectedMonth: z.union([z.string(), z.null()]),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { start, end } = getMonthTimestampRange(input.selectedMonth);

      const query = await ctx.db
        .select({
          scoreAverage: avg(rounds.points),
        })
        .from(rounds)
        .innerJoin(games, eq(rounds.gameId, games.gameId))
        .where(
          and(
            eq(games.playerId, input.playerId),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
          ),
        );

      return Math.round(Number(query[0]?.scoreAverage) ?? 0);
    }),

  fiveKGuesses: publicProcedure
    .input(
      z.object({
        playerId: z.string(),
        selectedMonth: z.union([z.string(), z.null()]),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { start, end } = getMonthTimestampRange(input.selectedMonth);
      const query = await ctx.db
        .select({
          count: count(rounds.roundId),
        })
        .from(rounds)
        .innerJoin(games, eq(rounds.gameId, games.gameId))
        .where(
          and(
            eq(games.playerId, input.playerId),
            eq(rounds.points, 5000),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
          ),
        );
      return query;
    }),

  zeroScoreGuesses: publicProcedure
    .input(
      z.object({
        playerId: z.string(),
        selectedMonth: z.union([z.string(), z.null()]),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { start, end } = getMonthTimestampRange(input.selectedMonth);
      const query = await ctx.db
        .select({
          count: count(rounds.roundId),
        })
        .from(rounds)
        .innerJoin(games, eq(rounds.gameId, games.gameId))
        .where(
          and(
            eq(games.playerId, input.playerId),
            eq(rounds.points, 0),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
          ),
        );
      return query;
    }),

  correctCountryGuesses: publicProcedure
    .input(
      z.object({
        playerId: z.string(),
        selectedMonth: z.union([z.string(), z.null()]),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { start, end } = getMonthTimestampRange(input.selectedMonth);
      const query = await ctx.db
        .select({
          count: count(rounds.roundId),
        })
        .from(rounds)
        .innerJoin(games, eq(rounds.gameId, games.gameId))
        .where(
          and(
            eq(games.playerId, input.playerId),
            eq(rounds.guessCountryCode, rounds.answerCountryCode),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
          ),
        );
      return query;
    }),

  timedOutGuesses: publicProcedure
    .input(
      z.object({
        playerId: z.string(),
        selectedMonth: z.union([z.string(), z.null()]),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { start, end } = getMonthTimestampRange(input.selectedMonth);
      const query = await ctx.db
        .select({
          count: count(rounds.roundId),
        })
        .from(rounds)
        .innerJoin(games, eq(rounds.gameId, games.gameId))
        .where(
          and(
            eq(games.playerId, input.playerId),
            eq(rounds.timedOut, true),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
          ),
        );
      return query;
    }),

  guessesInObama: publicProcedure
    .input(
      z.object({
        playerId: z.string(),
        selectedMonth: z.union([z.string(), z.null()]),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { start, end } = getMonthTimestampRange(input.selectedMonth);
      const query = await ctx.db
        .select({
          count: count(rounds.roundId),
        })
        .from(rounds)
        .innerJoin(games, eq(rounds.gameId, games.gameId))
        .where(
          and(
            eq(games.playerId, input.playerId),
            gte(rounds.guessLng, 135.685842),
            lte(rounds.guessLng, 135.8448),
            gte(rounds.guessLat, 35.45665),
            lte(rounds.guessLat, 35.535195),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
          ),
        );
      return query;
    }),

  guessesNearMoodeng: publicProcedure
    .input(
      z.object({
        playerId: z.string(),
        selectedMonth: z.union([z.string(), z.null()]),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { start, end } = getMonthTimestampRange(input.selectedMonth);
      const mooDengBoundingBox = calculateBoundingBox(
        moodengCenter.lat,
        moodengCenter.lng,
        1,
      );

      const mooDeng10kmBoundingBox = calculateBoundingBox(
        moodengCenter.lat,
        moodengCenter.lng,
        10,
      );

      const mooDeng50kmBoundingBox = calculateBoundingBox(
        moodengCenter.lat,
        moodengCenter.lng,
        50,
      );

      const query = await ctx.db
        .select({
          lat: rounds.guessLat,
          lng: rounds.guessLng,
        })
        .from(rounds)
        .innerJoin(games, eq(rounds.gameId, games.gameId))
        .where(
          and(
            eq(games.playerId, input.playerId),
            eq(rounds.guessCountryCode, "th"),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
          ),
        );

      const mooDengGuesses = query.filter((row) => {
        const lat = row.lat;
        const lng = row.lng;
        return (
          lat >= mooDengBoundingBox.minLat &&
          lat <= mooDengBoundingBox.maxLat &&
          lng >= mooDengBoundingBox.minLng &&
          lng <= mooDengBoundingBox.maxLng
        );
      });

      const mooDeng10kmGuesses = query.filter((row) => {
        const lat = row.lat;
        const lng = row.lng;
        return (
          lat >= mooDeng10kmBoundingBox.minLat &&
          lat <= mooDeng10kmBoundingBox.maxLat &&
          lng >= mooDeng10kmBoundingBox.minLng &&
          lng <= mooDeng10kmBoundingBox.maxLng
        );
      });

      const mooDeng50kmGuesses = query.filter((row) => {
        const lat = row.lat;
        const lng = row.lng;
        return (
          lat >= mooDeng50kmBoundingBox.minLat &&
          lat <= mooDeng50kmBoundingBox.maxLat &&
          lng >= mooDeng50kmBoundingBox.minLng &&
          lng <= mooDeng50kmBoundingBox.maxLng
        );
      });

      return {
        mooDengGuesses: mooDengGuesses.length,
        mooDeng10kmGuesses: mooDeng10kmGuesses.length,
        mooDeng50kmGuesses: mooDeng50kmGuesses.length,
      };
    }),

  thailandRegionGuesses: publicProcedure
    .input(
      z.object({
        playerId: z.string(),
        selectedMonth: z.union([z.string(), z.null()]),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { start, end } = getMonthTimestampRange(input.selectedMonth);
      const thailandGuesses = await ctx.db
        .select({
          guess: {
            lat: rounds.guessLat,
            lng: rounds.guessLng,
          },
          answer: {
            lat: rounds.answerLat,
            lng: rounds.answerLng,
          },
          points: rounds.points,
        })
        .from(rounds)
        .innerJoin(games, eq(rounds.gameId, games.gameId))
        .where(
          and(
            eq(games.playerId, input.playerId),
            eq(rounds.guessCountryCode, "th"),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
          ),
        );

      const guessesWithDistance = thailandGuesses.map((row) => {
        const distance = getDistanceInKm(
          { lat: row.answer.lat, lng: row.answer.lng },
          { lat: row.guess.lat, lng: row.guess.lng },
        );
        return {
          ...row,
          distance,
        };
      });

      const fiveK = guessesWithDistance.filter((row) => row.points === 5000);
      const fiftyKm = guessesWithDistance.filter((row) => row.distance <= 50);
      const hundredKm = guessesWithDistance.filter(
        (row) => row.distance <= 100,
      );

      return {
        fiveK,
        fiftyKm,
        hundredKm,
      };
    }),
});
