import {
  and,
  asc,
  avg,
  count,
  desc,
  eq,
  gt,
  isNotNull,
  not,
  sql,
  sum,
} from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { games, rounds } from "~/server/db/schema";
import { countryCodes } from "~/utils/countryCodes";

export const wrappedRouter = createTRPCRouter({
  totalGamesSummary: publicProcedure
    .input(z.object({ playerId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { playerId } = input;

      const totalSummaryQuery = ctx.db
        .select({
          totalGamesPlayed: count(games.gameId),
          totalMinutesPlayed: sum(games.totalTime),
        })
        .from(games)
        .where(eq(games.playerId, playerId));

      const favouriteMapQuery = ctx.db
        .select({
          mapName: games.mapName,
          gamesPlayed: count(games.gameId),
        })
        .from(games)
        .where(eq(games.playerId, playerId))
        .groupBy(games.mapName)
        .orderBy(desc(count(games.gameId)))
        .limit(1);

      const favouriteModeQuery = ctx.db
        .select({
          mode: games.mode,
          gamesPlayed: count(games.gameId),
        })
        .from(games)
        .where(eq(games.playerId, playerId))
        .groupBy(games.mode)
        .orderBy(desc(count(games.mode)))
        .limit(1);

      const [totalSummary, favouriteMap, favouriteMode] = await Promise.all([
        totalSummaryQuery,
        favouriteMapQuery,
        favouriteModeQuery,
      ]);

      if (
        !favouriteMap.length ||
        !favouriteMode.length ||
        !totalSummary.length
      ) {
        throw new Error("Bad data");
      }

      return {
        totalGamesPlayed: Number(totalSummary[0]!.totalGamesPlayed),
        totalMinutesPlayed: Number(totalSummary[0]!.totalMinutesPlayed),
        favouriteMap: favouriteMap[0]!.mapName,
        favouriteMapGamesPlayed: favouriteMap[0]!.gamesPlayed,
        favouriteMode: favouriteMode[0]!.mode,
      };
    }),

  bestGames: publicProcedure
    .input(z.object({ playerId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { playerId } = input;

      const bestGames = await ctx.db
        .select({
          gameMode: games.mode,
          points: games.totalPoints,
          mapName: games.mapName,
          summaryId: games.gameId,
        })
        .from(games)
        .where(and(eq(games.playerId, playerId), isNotNull(games.totalPoints)))
        .orderBy(desc(games.totalPoints))
        .limit(3);

      return bestGames;
    }),

  topMap: publicProcedure
    .input(z.object({ playerId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { playerId } = input;

      const topMapStats = await ctx.db
        .select({
          name: games.mapName,
          gamesPlayed: count(games.gameId),
          minutesPlayed: sum(games.totalTime),
          averageScore: avg(games.totalPoints),
        })
        .from(games)
        .where(eq(games.playerId, playerId))
        .groupBy(games.mapName)
        .orderBy(desc(count(games.gameId)))
        .limit(1);

      if (!topMapStats.length) {
        throw new Error("No top map found");
      }

      const bestGames = await ctx.db
        .select({
          gameMode: games.mode,
          points: games.totalPoints,
          summaryUrl: sql<string>`'/game/' || ${games.geoguessrGameId}`,
        })
        .from(games)
        .where(
          and(
            eq(games.playerId, playerId),
            eq(games.mapName, topMapStats[0]!.name),
            isNotNull(games.totalPoints),
          ),
        )
        .orderBy(desc(games.totalPoints))
        .limit(3);

      return {
        name: topMapStats[0]!.name,
        gamesPlayed: Number(topMapStats[0]!.gamesPlayed),
        minutesPlayed: Number(topMapStats[0]!.minutesPlayed),
        averageScore: Number(topMapStats[0]!.averageScore),
        bestGames: bestGames.map((game) => ({
          gameMode: game.gameMode,
          points: Number(game.points),
          summaryUrl: game.summaryUrl,
        })),
      };
    }),

  strongestCountries: publicProcedure
    .input(z.object({ playerId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { playerId } = input;

      const countryExclusions = sql.join(
        [
          ...Object.entries(countryCodes).map(
            ([code, name]) =>
              sql`(${rounds.answerCountryCode} = ${code.toLowerCase()} AND LOWER(${games.mapName}) NOT LIKE ${`%${name.toLowerCase()}%`})`,
          ),
          sql`(${rounds.answerCountryCode} = 'us' AND LOWER(${games.mapName}) NOT LIKE ${`%$us%`})`,
          sql`(${rounds.answerCountryCode} = 'us' AND LOWER(${games.mapName}) NOT LIKE ${`%$u.s%`})`,
        ],
        sql` OR `,
      );

      const query = await ctx.db
        .select({
          country: rounds.answerCountryCode,
          correctGuesses: sql<number>`count(case when ${rounds.answerCountryCode} = ${rounds.guessCountryCode} then 1 end)`,
          totalGuesses: count(rounds.roundId),
          percentage: sql<number>`ROUND(CAST(COUNT(CASE WHEN ${rounds.answerCountryCode} = ${rounds.guessCountryCode} THEN 1 END) AS FLOAT) / COUNT(*) * 100, 2)`,
          score: sql<number>`(
            CAST(COUNT(CASE WHEN ${rounds.answerCountryCode} = ${rounds.guessCountryCode} THEN 1 END) AS FLOAT) / COUNT(*)
          ) + (
            CASE 
              WHEN COUNT(CASE WHEN ${rounds.answerCountryCode} = ${rounds.guessCountryCode} THEN 1 END) = 0 
              THEN -1.0 * COUNT(*) / 100.0
              ELSE 0 
            END
          )`,
        })
        .from(rounds)
        .innerJoin(games, eq(rounds.gameId, games.gameId))
        .where(
          and(
            eq(games.playerId, playerId),
            not(eq(rounds.answerCountryCode, "Unknown")),
            sql`${countryExclusions}`,
          ),
        )
        .groupBy(rounds.answerCountryCode)
        .orderBy(
          desc(
            sql<number>`(
              CAST(COUNT(CASE WHEN ${rounds.answerCountryCode} = ${rounds.guessCountryCode} THEN 1 END) AS FLOAT) / COUNT(*)
            ) + (
              CASE 
                WHEN COUNT(CASE WHEN ${rounds.answerCountryCode} = ${rounds.guessCountryCode} THEN 1 END) = 0 
                THEN -1.0 * COUNT(*) / 100.0
                ELSE 0 
              END
            )`,
          ),
        )
        .limit(4);
      return query;
    }),

  weakestCountries: publicProcedure
    .input(z.object({ playerId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { playerId } = input;

      const countryExclusions = sql.join(
        [
          ...Object.entries(countryCodes).map(
            ([code, name]) =>
              sql`(${rounds.answerCountryCode} = ${code.toLowerCase()} AND LOWER(${games.mapName}) NOT LIKE ${`%${name.toLowerCase()}%`})`,
          ),
          sql`(${rounds.answerCountryCode} = 'us' AND LOWER(${games.mapName}) NOT LIKE ${`%$us%`})`,
          sql`(${rounds.answerCountryCode} = 'us' AND LOWER(${games.mapName}) NOT LIKE ${`%$u.s%`})`,
        ],
        sql` OR `,
      );

      const query = await ctx.db
        .select({
          country: rounds.answerCountryCode,
          correctGuesses: sql<number>`count(case when ${rounds.answerCountryCode} = ${rounds.guessCountryCode} then 1 end)`,
          totalGuesses: count(rounds.roundId),
          percentage: sql<number>`ROUND(CAST(COUNT(CASE WHEN ${rounds.answerCountryCode} = ${rounds.guessCountryCode} THEN 1 END) AS FLOAT) / COUNT(*) * 100, 2)`,
          score: sql<number>`(
            CAST(COUNT(CASE WHEN ${rounds.answerCountryCode} = ${rounds.guessCountryCode} THEN 1 END) AS FLOAT) / COUNT(*)
          ) + (
            CASE 
              WHEN COUNT(CASE WHEN ${rounds.answerCountryCode} = ${rounds.guessCountryCode} THEN 1 END) = 0 
              THEN -1.0 * COUNT(*) / 100.0
              ELSE 0 
            END
          )`,
        })
        .from(rounds)
        .innerJoin(games, eq(rounds.gameId, games.gameId))
        .where(
          and(
            eq(games.playerId, playerId),
            not(eq(rounds.answerCountryCode, "Unknown")),
            sql`${countryExclusions}`,
          ),
        )
        .groupBy(rounds.answerCountryCode)
        .orderBy(
          asc(
            sql<number>`(
              CAST(COUNT(CASE WHEN ${rounds.answerCountryCode} = ${rounds.guessCountryCode} THEN 1 END) AS FLOAT) / COUNT(*)
            ) + (
              CASE 
                WHEN COUNT(CASE WHEN ${rounds.answerCountryCode} = ${rounds.guessCountryCode} THEN 1 END) = 0 
                THEN -1.0 * COUNT(*) / 100.0
                ELSE 0 
              END
            )`,
          ),
        )
        .limit(4);
      return query;
    }),

  scoreStats: publicProcedure
    .input(z.object({ playerId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { playerId } = input;

      const stats = await ctx.db
        .select({
          perfectScores: sql<number>`COUNT(CASE WHEN ${rounds.points} = 5000 AND ${rounds.timedOut} = 0 THEN 1 END)`,
          zeroScores: sql<number>`COUNT(CASE WHEN ${rounds.points} = 0 THEN 1 END)`,
          avgScore: avg(rounds.points),
          avgTime: avg(rounds.timeInSeconds),
          avgDistance: sql<number>`AVG(CASE WHEN ${rounds.timedOut} = 0 THEN ${rounds.distanceInMeters} END)`,
          timedOutGuesses: sql<number>`COUNT(CASE WHEN ${rounds.timedOut} = 1 THEN 1 END)`,
        })
        .from(rounds)
        .innerJoin(games, eq(games.gameId, rounds.gameId))
        .where(eq(games.playerId, playerId));

      const topGuesses = await ctx.db
        .select({
          points: rounds.points,
          distanceInMeters: rounds.distanceInMeters,
          mapName: games.mapName,
          gameMode: games.mode,
          gameType: games.type,
          gameUrl: sql<string>`CASE 
            WHEN ${games.type} = 'Standard' THEN '/results/' || ${games.geoguessrGameId}
            ELSE '/duels/' || ${games.geoguessrGameId} || '/summary'
          END`,
          timeInSeconds: rounds.timeInSeconds,
        })
        .from(rounds)
        .innerJoin(games, eq(games.gameId, rounds.gameId))
        .where(and(eq(games.playerId, playerId), eq(rounds.timedOut, false)))
        .orderBy(desc(rounds.points), asc(rounds.distanceInMeters))
        .limit(3);

      return {
        timedOutGuesses: Number(stats[0]?.timedOutGuesses ?? 0),
        perfectScores: Number(stats[0]?.perfectScores ?? 0),
        zeroScores: Number(stats[0]?.zeroScores ?? 0),
        avgScore: Number(stats[0]?.avgScore ?? 0),
        avgTime: Number(stats[0]?.avgTime ?? 0),
        avgDistance: Number(stats[0]?.avgDistance ?? 0) / 1000,
        topGuesses,
      };
    }),

  competitiveStats: publicProcedure
    .input(z.object({ playerId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { playerId } = input;

      const duelStats = await ctx.db
        .select({
          totalDuels: count(games.gameId),
          totalDuelsWon: sql<number>`count(case when ${games.wonDuel} then 1 end)`,
          averageScore: avg(rounds.points),
          flawlessVictories: sql<number>`count(case when ${games.isFlawLess} then 1 end)`,
        })
        .from(games)
        .where(and(eq(games.playerId, playerId), eq(games.type, "Duel")))
        .innerJoin(rounds, eq(rounds.gameId, games.gameId));

      // Top 3 toughest won duels
      const toughestWonDuels = await ctx.db
        .select({
          gameId: games.gameId,
          mapName: games.mapName,
          roundCount: count(rounds.roundId),
          totalPoints: games.totalPoints,
          healthAfter: rounds.healthAfter,
        })
        .from(games)
        .innerJoin(rounds, eq(rounds.gameId, games.gameId))
        .where(
          and(
            eq(games.playerId, playerId),
            eq(games.type, "Duel"),
            gt(rounds.healthAfter, 0),
          ),
        )
        .groupBy(games.gameId)
        .orderBy(desc(count(rounds.roundId)), desc(games.totalPoints))
        .limit(3);

      const stats = duelStats[0];
      if (!stats) throw new Error("No duel stats found");

      return {
        totalDuels: Number(stats.totalDuels),
        totalDuelsWon: Number(stats.totalDuelsWon),
        winPercentage: Math.round(
          (Number(stats.totalDuelsWon) / Number(stats.totalDuels)) * 100,
        ),
        flawlessVictories: Number(stats.flawlessVictories),
        avgScore: Math.round(Number(stats.averageScore)),
        toughestWonDuels: toughestWonDuels.map((duel) => ({
          mapName: duel.mapName,
          roundCount: Number(duel.roundCount),
          totalPoints: Number(duel.totalPoints),
          gameUrl: `/duels/${duel.gameId}/summary`,
        })),
      };
    }),
});
