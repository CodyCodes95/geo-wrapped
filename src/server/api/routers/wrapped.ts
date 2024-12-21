import {
  and,
  asc,
  avg,
  count,
  desc,
  eq,
  isNotNull,
  not,
  sql,
  sum,
} from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { answers, games, guesses, rounds } from "~/server/db/schema";
import { countryCodes } from "~/utils/countryCodes";

export const wrappedRouter = createTRPCRouter({
  topMap: publicProcedure
    .input(z.object({ playerId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { playerId } = input;
      // First get the top map by games played
      const topMapStats = await ctx.db
        .select({
          name: games.mapName,
          gamesPlayed: count(games.gameId),
          minutesPlayed: sum(games.totalTime),
          averageScore: avg(games.totalPoints),
        })
        .from(games)
        .where(eq(games.playerId, playerId))
        .groupBy(games.mapName)
        .orderBy(desc(count(games.gameId)))
        .limit(1);

      if (!topMapStats.length) {
        throw new Error("No top map found");
      }

      // Get the best games for this map
      const bestGames = await ctx.db
        .select({
          gameMode: games.mode,
          points: games.totalPoints,
          // You might need to construct this URL based on your application's needs
          summaryUrl: sql<string>`'/game/' || ${games.gameId}`,
        })
        .from(games)
        .where(
          and(
            eq(games.playerId, playerId),
            eq(games.mapName, topMapStats[0]!.name),
            isNotNull(games.totalPoints),
          ),
        )
        .orderBy(desc(games.totalPoints))
        .limit(3);

      // Combine the results
      return {
        name: topMapStats[0]!.name,
        gamesPlayed: Number(topMapStats[0]!.gamesPlayed), // Convert from BigInt if necessary
        minutesPlayed: Number(topMapStats[0]!.minutesPlayed),
        averageScore: Number(topMapStats[0]!.averageScore),
        bestGames: bestGames.map((game) => ({
          gameMode: game.gameMode,
          points: Number(game.points),
          summaryUrl: game.summaryUrl,
        })),
      };
    }),
  strongestCountries: publicProcedure
    .input(z.object({ playerId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { playerId } = input;
      // Create an array of conditions for each country code and its name
      const countryExclusions = sql.join(
        [
          ...Object.entries(countryCodes).map(
            ([code, name]) =>
              sql`(${answers.countryCode} = ${code.toLowerCase()} AND LOWER(${games.mapName}) NOT LIKE ${`%${name.toLowerCase()}%`})`,
          ),
          sql`(${answers.countryCode} = 'us' AND LOWER(${games.mapName}) NOT LIKE ${`%$us%`})`,
          sql`(${answers.countryCode} = 'us' AND LOWER(${games.mapName}) NOT LIKE ${`%$u.s%`})`,
        ],
        sql` OR `,
      );
      const query = await ctx.db
        .select({
          country: answers.countryCode,
          correctGuesses: sql<number>`count(case when ${answers.countryCode} = ${guesses.countryCode} then 1 end)`,
          totalGuesses: count(answers.answerId),
        })
        .from(answers)
        .innerJoin(rounds, eq(rounds.answerId, answers.answerId))
        .innerJoin(guesses, eq(rounds.roundId, guesses.roundId))
        .innerJoin(games, eq(rounds.gameId, games.gameId))
        .where(
          and(
            eq(games.playerId, playerId),
            not(eq(answers.countryCode, "Unknown")),
            sql`${countryExclusions}`,
          ),
        )
        .groupBy(answers.countryCode)
        .orderBy(
          desc(
            sql`count(case when ${answers.countryCode} = ${guesses.countryCode} then 1 end)`,
          ),
        )
        .limit(4);

      return query;
    }),

  weakestCountries: publicProcedure
    .input(z.object({ playerId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { playerId } = input;
      // Create an array of conditions for each country code and its name
      const countryExclusions = sql.join(
        [
          ...Object.entries(countryCodes).map(
            ([code, name]) =>
              sql`(${answers.countryCode} = ${code.toLowerCase()} AND LOWER(${games.mapName}) NOT LIKE ${`%${name.toLowerCase()}%`})`,
          ),
          sql`(${answers.countryCode} = 'us' AND LOWER(${games.mapName}) NOT LIKE ${`%$us%`})`,
          sql`(${answers.countryCode} = 'us' AND LOWER(${games.mapName}) NOT LIKE ${`%$u.s%`})`,
        ],
        sql` OR `,
      );
      return ctx.db
        .select({
          country: answers.countryCode,
          correctGuesses: sql<number>`count(case when ${answers.countryCode} = ${guesses.countryCode} then 1 end)`,
          totalGuesses: count(answers.answerId),
        })
        .from(answers)
        .innerJoin(rounds, eq(rounds.answerId, answers.answerId))
        .innerJoin(guesses, eq(rounds.roundId, guesses.roundId))
        .innerJoin(games, eq(rounds.gameId, games.gameId))
        .where(
          and(
            eq(games.playerId, playerId),
            not(eq(answers.countryCode, "Unknown")),
            sql`${countryExclusions}`,
          ),
        )
        .groupBy(answers.countryCode)
        .orderBy(
          asc(
            sql<number>`count(case when ${answers.countryCode} = ${guesses.countryCode} then 1 end)`,
          ),
        )
        .limit(4);
    }),
});
