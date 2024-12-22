import { and, avg, count, desc, eq, gte, lte } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { answers, games, rounds } from "~/server/db/schema";
import { getMonthTimestampRange } from "~/utils";

export const answerRouter = createTRPCRouter({
  getTopCountries: publicProcedure
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
          country: answers.countryCode,
          count: count(answers.answerId),
        })
        .from(answers)
        .innerJoin(rounds, eq(rounds.answerId, answers.answerId))
        .innerJoin(games, eq(rounds.gameId, games.gameId))
        .where(
          and(
            eq(games.playerId, input.playerId),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
          ),
        )
        .groupBy(answers.countryCode)
        .orderBy(desc(count(answers.answerId)));
      return query;
    }),
});
