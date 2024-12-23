import { and, count, eq, gte, lte } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { games, rounds } from "~/server/db/schema";
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
            gte(rounds.answerLng, 135.685842),
            lte(rounds.answerLng, 135.8448),
            gte(rounds.answerLat, 35.45665),
            lte(rounds.answerLat, 35.535195),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
          ),
        )
        .innerJoin(games, eq(rounds.gameId, games.gameId));
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
