import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { playerRouter } from "./routers/player";
import { gameRouter } from "./routers/games";
import { guessRouter } from "./routers/guesses";
import { answerRouter } from "./routers/answers";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  players: playerRouter,
  games: gameRouter,
  guesses: guessRouter,
  asnwers: answerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
