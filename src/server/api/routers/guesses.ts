import { avg, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { guesses } from "~/server/db/schema";

export const guessRouter = createTRPCRouter({
  getAverageScore: publicProcedure
    .input(z.object({ geoGuessrId: z.string() }))
    .query(async ({ input, ctx }) => {
      const query = await ctx.db
        .select({ scoreAverage: avg(guesses.points) })
        .from(guesses)
        .where(eq(guesses.geoguessrId, input.geoGuessrId));

      return Math.round(Number(query[0]?.scoreAverage) ?? 0);
    }),
});
