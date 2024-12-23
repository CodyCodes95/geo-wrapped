import {
  and,
  count,
  desc,
  eq,
  gte,
  lte,
  not,
} from "drizzle-orm";
import { z } from "zod";
import Supercluster from "supercluster";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { games, rounds } from "~/server/db/schema";
import { getMonthTimestampRange } from "~/utils";
import { type RoundAnswer } from "~/store/mapStore";

export const gameRouter = createTRPCRouter({
  getTotalGamesCount: publicProcedure
    .input(
      z.object({
        id: z.string(),
        selectedMonth: z.union([z.string(), z.null()]),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { start, end } = getMonthTimestampRange(input.selectedMonth);
      const gamesCount = await ctx.db
        .select({ count: count() })
        .from(games)
        .where(
          and(
            eq(games.playerId, input.id),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
          ),
        );

      return gamesCount[0]?.count;
    }),

  gameTypes: publicProcedure
    .input(
      z.object({
        id: z.string(),
        selectedMonth: z.union([z.string(), z.null()]),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { start, end } = getMonthTimestampRange(input.selectedMonth);
      const query = await ctx.db
        .select({
          count: count(games.gameId),
          type: games.type,
        })
        .from(games)
        .where(
          and(
            eq(games.playerId, input.id),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
          ),
        )
        .groupBy(games.type)
        .orderBy(desc(count(games.type)));

      return {
        standard: query.find((t) => t.type === "Standard")?.count ?? 0,
        duel: query.find((t) => t.type === "Duel")?.count ?? 0,
      };
    }),

  gameModes: publicProcedure
    .input(
      z.object({
        id: z.string(),
        selectedMonth: z.union([z.string(), z.null()]),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { start, end } = getMonthTimestampRange(input.selectedMonth);
      const query = await ctx.db
        .select({
          count: count(games.gameId),
          mode: games.mode,
        })
        .from(games)
        .where(
          and(
            eq(games.playerId, input.id),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
          ),
        )
        .groupBy(games.mode)
        .orderBy(desc(count(games.mode)));

      return {
        standard: query.find((t) => t.mode === "Moving")?.count ?? 0,
        noMove: query.find((t) => t.mode === "No Move")?.count ?? 0,
        nmpz: query.find((t) => t.mode === "NMPZ")?.count ?? 0,
      };
    }),

  getFavouriteMaps: publicProcedure
    .input(
      z.object({
        id: z.string(),
        selectedMonth: z.union([z.string(), z.null()]),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { start, end } = getMonthTimestampRange(input.selectedMonth);
      const gamesCount = await ctx.db
        .select({ count: count(games.gameId), mapName: games.mapName })
        .from(games)
        .where(
          and(
            eq(games.playerId, input.id),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
          ),
        )
        .groupBy(games.mapName)
        .orderBy(desc(count(games.mapName)));

      return gamesCount;
    }),

  getAllWithResults: publicProcedure
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
          gameId: games.gameId,
          mapName: games.mapName,
          type: games.type,
          mode: games.mode,
          gameTimeStarted: games.gameTimeStarted,
          roundId: rounds.roundId,
          totalPoints: games.totalPoints,
          answer: {
            answerId: rounds.roundId, // Using roundId as answerId for compatibility
            lat: rounds.answerLat,
            lng: rounds.answerLng,
            countryCode: rounds.answerCountryCode,
            googlePanoId: rounds.googlePanoId,
            heading: rounds.heading,
            pitch: rounds.pitch,
            zoom: rounds.zoom,
          },
          guess: {
            guessId: rounds.roundId, // Using roundId as guessId for compatibility
            lat: rounds.guessLat,
            lng: rounds.guessLng,
            countryCode: rounds.guessCountryCode,
            timedOut: rounds.timedOut,
            points: rounds.points,
            distanceInMeters: rounds.distanceInMeters,
            timeInSeconds: rounds.timeInSeconds,
            healthBefore: rounds.healthBefore,
            healthAfter: rounds.healthAfter,
          },
        })
        .from(games)
        .innerJoin(rounds, eq(games.gameId, rounds.gameId))
        .where(
          and(
            eq(games.playerId, input.playerId),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
            not(eq(rounds.guessLat, 0)),
            not(eq(rounds.guessLng, 0)),
          ),
        );

      return query;
    }),

  getClusteredMarkers: publicProcedure
    .input(
      z.object({
        playerId: z.string(),
        selectedMonth: z.union([z.string(), z.null()]),
        bounds: z.object({
          sw: z.object({ lat: z.number(), lng: z.number() }),
          ne: z.object({ lat: z.number(), lng: z.number() }),
        }),
        zoom: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { start, end } = getMonthTimestampRange(input.selectedMonth);

      // Get raw data
      const rawData = await ctx.db
        .select({
          roundId: rounds.roundId,
          guess: {
            lat: rounds.guessLat,
            lng: rounds.guessLng,
          },
          answer: {
            lat: rounds.answerLat,
            lng: rounds.answerLng,
            countryCode: rounds.answerCountryCode,
            googlePanoId: rounds.googlePanoId,
            heading: rounds.heading,
            pitch: rounds.pitch,
            zoom: rounds.zoom,
          },
        })
        .from(games)
        .innerJoin(rounds, eq(games.gameId, rounds.gameId))
        .where(
          and(
            eq(games.playerId, input.playerId),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
            not(eq(rounds.guessLat, 0)),
            not(eq(rounds.guessLng, 0)),
          ),
        );

      // Convert to GeoJSON features
      const features = rawData.map((round) => ({
        type: "Feature",
        properties: {
          roundId: round.roundId,
          guess: round.guess,
          answer: round.answer,
        },
        geometry: {
          type: "Point",
          coordinates: [round.guess.lng, round.guess.lat],
        },
      }));

      // Create supercluster instance
      const index = new Supercluster<{
        roundId: string;
        guess: { lat: number; lng: number };
        answer: RoundAnswer;
        point_count: number;
        cluster: boolean;
      }>({
        radius: 55,
        minZoom: 2,
        maxZoom: 6,
        // @ts-expect-error: bad types on supercluster lib
      }).load(features);

      // Get clusters
      const clusters = index.getClusters(
        [
          input.bounds.sw.lng,
          input.bounds.sw.lat,
          input.bounds.ne.lng,
          input.bounds.ne.lat,
        ],
        Math.floor(input.zoom),
      );

      return clusters;
    }),
});
