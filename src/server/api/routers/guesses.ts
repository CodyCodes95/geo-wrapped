import { and, avg, eq, not } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { games, guesses, rounds } from "~/server/db/schema";

export const guessRouter = createTRPCRouter({
  getAverageScore: publicProcedure
    .input(z.object({ playerId: z.string() }))
    .query(async ({ input, ctx }) => {
      const query = await ctx.db
        .select({
          scoreAverage: avg(guesses.points),
        })
        .from(guesses)
        .innerJoin(rounds, eq(guesses.roundId, rounds.roundId))
        .innerJoin(games, eq(rounds.gameId, games.gameId))
        .where(eq(games.playerId, input.playerId));

      return Math.round(Number(query[0]?.scoreAverage) ?? 0);
    }),
  getAll: publicProcedure
    .input(z.object({ geoGuessrId: z.string() }))
    .query(async ({ input, ctx }) => {
      const query = await ctx.db
        .select({
          points: guesses.points,
          lat: guesses.lat,
          lng: guesses.lng,
          id: guesses.guessId,
        })
        .from(guesses)
        .where(
          and(
            eq(guesses.geoguessrId, input.geoGuessrId),
            not(eq(guesses.lat, 0)),
            not(eq(guesses.lng, 0)),
          ),
        );
      return query.map((row) => ({
        location: { lng: row.lng, lat: row.lat },
        key: row.id,
      }));
    }),
});
