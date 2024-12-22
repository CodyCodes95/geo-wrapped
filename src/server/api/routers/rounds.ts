import { and, avg, count, eq, gte, lte, not } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { answers, games, rounds } from "~/server/db/schema";
import { getMonthTimestampRange } from "~/utils";

export const roundRouter = createTRPCRouter({
  roundsInObama: publicProcedure
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
        .where(
          and(
            eq(games.playerId, input.playerId),
            gte(answers.lng, 135.685842),
            lte(answers.lng, 135.8448),
            gte(answers.lat, 35.45665),
            lte(answers.lat, 35.535195),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
          ),
        )
        .innerJoin(games, eq(rounds.gameId, games.gameId))
        .innerJoin(answers, eq(rounds.answerId, answers.answerId));
      return query[0]?.count ?? 0;
    }),
  totalRoundCount: publicProcedure
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
        .where(
          and(
            eq(games.playerId, input.playerId),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
          ),
        )
        .innerJoin(games, eq(rounds.gameId, games.gameId));
      return query[0]?.count ?? 0;
    }),
});
