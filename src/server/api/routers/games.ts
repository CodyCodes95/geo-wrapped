import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  like,
  lte,
  not,
  or,
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
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        sortField: z
          .enum([
            "mapName",
            "mode",
            "type",
            "points",
            "distance",
            "date",
            "result",
            "score",
          ])
          .default("date"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
        search: z.string().optional(),
        groupByGame: z.boolean().default(false),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { start, end } = getMonthTimestampRange(input.selectedMonth);
      const offset = (input.page - 1) * input.limit;

      let orderBy;
      switch (input.sortField) {
        case "date":
          orderBy =
            input.sortOrder === "asc"
              ? asc(games.gameTimeStarted)
              : desc(games.gameTimeStarted);
          break;
        case "points":
          orderBy =
            input.sortOrder === "asc"
              ? asc(rounds.points)
              : desc(rounds.points);
          break;
        case "mapName":
          orderBy =
            input.sortOrder === "asc"
              ? asc(games.mapName)
              : desc(games.mapName);
          break;
        case "mode":
          orderBy =
            input.sortOrder === "asc" ? asc(games.mode) : desc(games.mode);
          break;
        case "type":
          orderBy =
            input.sortOrder === "asc" ? asc(games.type) : desc(games.type);
          break;
        default:
          orderBy = desc(games.gameTimeStarted);
      }

      let whereConditions = and(
        eq(games.playerId, input.playerId),
        gte(games.gameTimeStarted, start),
        lte(games.gameTimeStarted, end),
        not(eq(rounds.guessLat, 0)),
        not(eq(rounds.guessLng, 0)),
      );

      if (input.search) {
        whereConditions = and(
          whereConditions,
          or(
            like(games.mapName, `%${input.search}%`),
            like(games.mode, `%${input.search}%`),
            like(games.type, `%${input.search}%`),
            eq(games.totalPoints, Number(input.search)),
            like(rounds.guessCountryCode, `%${input.search}%`),
            like(rounds.answerCountryCode, `%${input.search}%`),
          ),
        );
      }

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
            answerId: rounds.roundId,
            lat: rounds.answerLat,
            lng: rounds.answerLng,
            countryCode: rounds.answerCountryCode,
            googlePanoId: rounds.googlePanoId,
            heading: rounds.heading,
            pitch: rounds.pitch,
            zoom: rounds.zoom,
          },
          guess: {
            guessId: rounds.roundId,
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
        .where(whereConditions)
        .orderBy(orderBy)
        .limit(input.limit)
        .offset(offset);
      // Get total count for pagination
      const countQuery = await ctx.db
        .select({ count: count(games.gameId) })
        .from(games)
        .innerJoin(rounds, eq(games.gameId, rounds.gameId))
        .where(whereConditions);

      return {
        items: query,
        total: countQuery[0]?.count ?? 0,
        pages: Math.ceil((countQuery[0]?.count ?? 0) / input.limit),
      };
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
      const crossesMeridian = input.bounds.sw.lng > input.bounds.ne.lng;

      // Get raw data with bounds filtering
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
            // Latitude bounds
            gte(rounds.guessLat, input.bounds.sw.lat),
            lte(rounds.guessLat, input.bounds.ne.lat),
            // Longitude bounds with meridian crossing check
            crossesMeridian
              ? or(
                  gte(rounds.guessLng, input.bounds.sw.lng),
                  lte(rounds.guessLng, input.bounds.ne.lng),
                )
              : and(
                  gte(rounds.guessLng, input.bounds.sw.lng),
                  lte(rounds.guessLng, input.bounds.ne.lng),
                ),
          ),
        )
        .limit(20000);

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
        maxZoom: 7,
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
