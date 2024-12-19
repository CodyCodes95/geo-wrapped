import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { games } from "~/server/db/schema";

export const roundRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ playerId: z.string() }))
    .query(async ({ input, ctx }) => {
      const query = await ctx.db.query.games.findMany({
        where: eq(games.playerId, input.playerId),
        with: { rounds: { with: { answer: true, guess: true } } },
      });
      return query;
    }),
});
