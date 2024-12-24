import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { players } from "~/server/db/schema";

export const playerRouter = createTRPCRouter({
  getPlayer: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const player = await ctx.db.query.players.findFirst({
        where: eq(players.playerId, input.id),
      });
      return player;
    }),

  addEmailNotification: publicProcedure
    .input(z.object({ playerId: z.string(), email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(players)
        .set({ email: input.email })
        .where(eq(players.playerId, input.playerId));

      return { success: true };
    }),
});
