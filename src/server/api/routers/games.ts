import { and, count, countDistinct, desc, eq, not } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { answers, games, guesses, rounds } from "~/server/db/schema";

export const gameRouter = createTRPCRouter({
  getTotalGamesCount: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const gamesCount = await ctx.db
        .select({ count: count() })
        .from(games)
        .where(eq(games.playerId, input.id));

      return gamesCount[0]?.count;
    }),
  getFavouriteMaps: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const gamesCount = await ctx.db
        .select({ count: count(games.gameId), mapName: games.mapName })
        .from(games)
        .where(eq(games.playerId, input.id))
        .groupBy(games.mapName)
        .orderBy(desc(count(games.mapName)));

      return gamesCount;
    }),
  getAll: publicProcedure
    .input(z.object({ playerId: z.string() }))
    .query(async ({ input, ctx }) => {
      const query = await ctx.db.query.games.findMany({
        where: eq(games.playerId, input.playerId),
      });
      return query;
    }),

  getAllWithResults: publicProcedure
    .input(z.object({ playerId: z.string() }))
    .query(async ({ input, ctx }) => {
      const query = await ctx.db
        .select({
          gameId: games.gameId,
          roundId: rounds.roundId,
          answerId: answers.answerId,
          guessId: guesses.guessId,
          answer: answers,
          guess: guesses,
        })
        .from(games)
        .innerJoin(rounds, eq(games.gameId, rounds.gameId))
        .innerJoin(answers, eq(rounds.answerId, answers.answerId))
        .innerJoin(guesses, eq(rounds.roundId, guesses.roundId))
        .where(
          and(
            eq(games.playerId, input.playerId),
            not(eq(guesses.lat, 0)),
            not(eq(guesses.lng, 0)),
          ),
        );

      return query;
    }),
});
