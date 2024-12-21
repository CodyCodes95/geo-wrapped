import { and, avg, count, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { answers, games, rounds } from "~/server/db/schema";

export const answerRouter = createTRPCRouter({
  getTopCountries: publicProcedure
    .input(z.object({ playerId: z.string() }))
    .query(async ({ input, ctx }) => {
      const query = await ctx.db
        .select({
          country: answers.countryCode,
          count: count(answers.answerId),
        })
        .from(answers)
        .innerJoin(rounds, eq(rounds.answerId, answers.answerId))
        .innerJoin(games, eq(rounds.gameId, games.gameId))
        .where(eq(games.playerId, input.playerId))
        .groupBy(answers.countryCode)
        .orderBy(desc(count(answers.answerId)));
      return query;
    }),
});
