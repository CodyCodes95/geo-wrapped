import { count, countDistinct, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { games } from "~/server/db/schema";

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
  getFavouriteMap: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const gamesCount = await ctx.db
        .select({ count: countDistinct(games.mapName), mapName: games.mapName })
        .from(games)
        .where(eq(games.playerId, input.id));
        
        

      const highestCount = gamesCount.reduce((a, b) => {
        return a.count > b.count ? a : b;
      });

      return highestCount.mapName;
    }),
});
