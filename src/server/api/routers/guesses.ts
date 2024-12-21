import {
  and,
  asc,
  avg,
  count,
  desc,
  eq,
  gte,
  ilike,
  like,
  lte,
  ne,
  not,
  notIlike,
  sql,
} from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { answers, games, guesses, rounds } from "~/server/db/schema";
import { getMonthTimestampRange } from "~/utils";
import { countryCodes, getCountryName } from "~/utils/countryCodes";

const moodengCenter = {
  lat: 13.216247039443203,
  lng: 101.05681153985368,
};

const obamaBoundingBox = {
  north: 35.5774,
  south: 35.3844,
  east: 135.8603,
  west: 135.5887,
};

// Radius of the Earth in kilometers
const EARTH_RADIUS = 6371;

type Point = {
  lat: number;
  lng: number;
};

function getDistanceInKm(point1: Point, point2: Point) {
  const lat1 = toRadians(point1.lat);
  const lat2 = toRadians(point2.lat);
  const deltaLat = toRadians(point2.lat - point1.lat);
  const deltaLng = toRadians(point2.lng - point1.lng);

  // Haversine formula
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS * c;
}

function toRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

function calculateBoundingBox(lat: number, lng: number, radiusKm: number) {
  const EARTH_RADIUS = 6371; // Earth's radius in kilometers

  // Convert radius from kilometers to degrees
  const latOffset = (radiusKm / EARTH_RADIUS) * (180 / Math.PI);
  const lngOffset =
    ((radiusKm / EARTH_RADIUS) * (180 / Math.PI)) /
    Math.cos((lat * Math.PI) / 180);

  return {
    minLat: lat - latOffset,
    maxLat: lat + latOffset,
    minLng: lng - lngOffset,
    maxLng: lng + lngOffset,
  };
}

export const guessRouter = createTRPCRouter({
  getAverageScore: publicProcedure
    .input(z.object({ playerId: z.string(), selectedMonth: z.string() }))
    .query(async ({ input, ctx }) => {
      const { start, end } = getMonthTimestampRange(input.selectedMonth);

      const query = await ctx.db
        .select({
          scoreAverage: avg(guesses.points),
        })
        .from(guesses)
        .innerJoin(rounds, eq(guesses.roundId, rounds.roundId))
        .innerJoin(games, eq(rounds.gameId, games.gameId))
        .where(
          and(
            eq(games.playerId, input.playerId),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
          ),
        );

      return Math.round(Number(query[0]?.scoreAverage) ?? 0);
    }),
  fiveKGuesses: publicProcedure
    .input(z.object({ playerId: z.string(), selectedMonth: z.string() }))
    .query(async ({ input, ctx }) => {
      const { start, end } = getMonthTimestampRange(input.selectedMonth);
      const query = await ctx.db
        .select({
          count: count(guesses.guessId),
        })
        .from(guesses)
        .where(
          and(
            eq(games.playerId, input.playerId),
            eq(guesses.points, 5000),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
          ),
        )
        .innerJoin(rounds, eq(guesses.roundId, rounds.roundId))
        .innerJoin(games, eq(rounds.gameId, games.gameId));
      return query;
    }),
  zeroScoreGuesses: publicProcedure
    .input(z.object({ playerId: z.string(), selectedMonth: z.string() }))
    .query(async ({ input, ctx }) => {
      const { start, end } = getMonthTimestampRange(input.selectedMonth);
      const query = await ctx.db
        .select({
          count: count(guesses.guessId),
        })
        .from(guesses)
        .where(
          and(
            eq(games.playerId, input.playerId),
            eq(guesses.points, 0),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
          ),
        )
        .innerJoin(rounds, eq(guesses.roundId, rounds.roundId))
        .innerJoin(games, eq(rounds.gameId, games.gameId));
      return query;
    }),
  correctCountryGuesses: publicProcedure
    .input(z.object({ playerId: z.string(), selectedMonth: z.string() }))
    .query(async ({ input, ctx }) => {
      const { start, end } = getMonthTimestampRange(input.selectedMonth);
      const query = await ctx.db
        .select({
          count: count(guesses.guessId),
        })
        .from(guesses)
        .where(
          and(
            eq(games.playerId, input.playerId),
            eq(guesses.countryCode, answers.countryCode),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
          ),
        )
        .innerJoin(rounds, eq(guesses.roundId, rounds.roundId))
        .innerJoin(games, eq(rounds.gameId, games.gameId))
        .innerJoin(answers, eq(rounds.answerId, answers.answerId));
      return query;
    }),
  timedOutGuesses: publicProcedure
    .input(z.object({ playerId: z.string(), selectedMonth: z.string() }))
    .query(async ({ input, ctx }) => {
      const { start, end } = getMonthTimestampRange(input.selectedMonth);
      const query = await ctx.db
        .select({
          count: count(guesses.guessId),
        })
        .from(guesses)
        .where(
          and(
            eq(games.playerId, input.playerId),
            eq(guesses.timedOut, true),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
          ),
        )
        .innerJoin(rounds, eq(guesses.roundId, rounds.roundId))
        .innerJoin(games, eq(rounds.gameId, games.gameId));
      return query;
    }),
  guessesInObama: publicProcedure
    .input(z.object({ playerId: z.string(), selectedMonth: z.string() }))
    .query(async ({ input, ctx }) => {
      const { start, end } = getMonthTimestampRange(input.selectedMonth);
      const query = await ctx.db
        .select({
          count: count(guesses.guessId),
        })
        .from(guesses)
        .where(
          and(
            eq(games.playerId, input.playerId),
            gte(guesses.lng, 135.685842),
            lte(guesses.lng, 135.8448),
            gte(guesses.lat, 35.45665),
            lte(guesses.lat, 35.535195),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
          ),
        )
        .innerJoin(rounds, eq(guesses.roundId, rounds.roundId))
        .innerJoin(games, eq(rounds.gameId, games.gameId));
      return query;
    }),
  guessesNearMoodeng: publicProcedure
    .input(z.object({ playerId: z.string(), selectedMonth: z.string() }))
    .query(async ({ input, ctx }) => {
      const { start, end } = getMonthTimestampRange(input.selectedMonth);
      const mooDengBoundingBox = calculateBoundingBox(
        moodengCenter.lat,
        moodengCenter.lng,
        1,
      );

      const mooDeng10kmBoundingBox = calculateBoundingBox(
        moodengCenter.lat,
        moodengCenter.lng,
        10,
      );

      const mooDeng50kmBoundingBox = calculateBoundingBox(
        moodengCenter.lat,
        moodengCenter.lng,
        50,
      );
      const query = await ctx.db
        .select({
          lat: guesses.lat,
          lng: guesses.lng,
        })
        .from(guesses)
        .where(
          and(
            eq(games.playerId, input.playerId),
            eq(guesses.countryCode, "th"),
          ),
        )
        .innerJoin(rounds, eq(guesses.roundId, rounds.roundId))
        .innerJoin(games, eq(rounds.gameId, games.gameId));

      const mooDengGuesses = query.filter((row) => {
        const lat = row.lat;
        const lng = row.lng;
        return (
          lat >= mooDengBoundingBox.minLat &&
          lat <= mooDengBoundingBox.maxLat &&
          lng >= mooDengBoundingBox.minLng &&
          lng <= mooDengBoundingBox.maxLng
        );
      });

      const mooDeng10kmGuesses = query.filter((row) => {
        const lat = row.lat;
        const lng = row.lng;
        return (
          lat >= mooDeng10kmBoundingBox.minLat &&
          lat <= mooDeng10kmBoundingBox.maxLat &&
          lng >= mooDeng10kmBoundingBox.minLng &&
          lng <= mooDeng10kmBoundingBox.maxLng
        );
      });

      const mooDeng50kmGuesses = query.filter((row) => {
        const lat = row.lat;
        const lng = row.lng;
        return (
          lat >= mooDeng50kmBoundingBox.minLat &&
          lat <= mooDeng50kmBoundingBox.maxLat &&
          lng >= mooDeng50kmBoundingBox.minLng &&
          lng <= mooDeng50kmBoundingBox.maxLng
        );
      });

      return {
        mooDengGuesses: mooDengGuesses.length,
        mooDeng10kmGuesses: mooDeng10kmGuesses.length,
        mooDeng50kmGuesses: mooDeng50kmGuesses.length,
      };
    }),
  thailandRegionGuesses: publicProcedure
    .input(z.object({ playerId: z.string(), selectedMonth: z.string() }))
    .query(async ({ input, ctx }) => {
      const { start, end } = getMonthTimestampRange(input.selectedMonth);
      const thailandGuesses = await ctx.db
        .select({
          guess: guesses,
          answer: answers,
          points: guesses.points,
        })
        .from(guesses)
        .where(
          and(
            eq(games.playerId, input.playerId),
            eq(guesses.countryCode, "th"),
            gte(games.gameTimeStarted, start),
            lte(games.gameTimeStarted, end),
          ),
        )
        .innerJoin(rounds, eq(guesses.roundId, rounds.roundId))
        .innerJoin(games, eq(rounds.gameId, games.gameId))
        .innerJoin(answers, eq(rounds.answerId, answers.answerId));

      const guessesWithDistance = thailandGuesses.map((row) => {
        const distance = getDistanceInKm(
          { lat: row.answer.lat, lng: row.answer.lng },
          { lat: row.guess.lat, lng: row.guess.lng },
        );
        return {
          ...row,
          distance,
        };
      });

      const fiveK = guessesWithDistance.filter((row) => row.points === 5000);
      const fiftyKm = guessesWithDistance.filter((row) => row.distance <= 50);
      const hundredKm = guessesWithDistance.filter(
        (row) => row.distance <= 100,
      );

      return {
        fiveK,
        fiftyKm,
        hundredKm,
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
