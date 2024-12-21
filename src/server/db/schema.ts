import {
  sqliteTable,
  text,
  integer,
  real,
  index,
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

// Enum-like tables
export const gameTypes = sqliteTable("game_types", {
  type: text("type").primaryKey(),
});

export const gameModes = sqliteTable("game_modes", {
  mode: text("mode").primaryKey(),
});

// Players table
export const players = sqliteTable("players", {
  playerId: text("player_id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  dataUrl: text("data_url"),
  processed: integer("processed", { mode: "boolean" }).notNull().default(false),
  geoguessrId: text("geoguessr_id"),
  nick: text("nick"),
  avatarUrl: text("avatar_url"),
  countryCode: text("country_code"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Games table
export const games = sqliteTable(
  "games",
  {
    gameId: text("game_id").primaryKey(),
    playerId: text("player_id")
      .notNull()
      .references(() => players.playerId),
    type: text("type")
      .notNull()
      .references(() => gameTypes.type),
    mode: text("mode")
      .notNull()
      .references(() => gameModes.mode),
    gameTimeStarted: integer("game_time_started", {
      mode: "timestamp",
    }).notNull(),
    totalTime: integer("total_time").notNull(),
    mapName: text("map_name").notNull(),
    mapId: text("map_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    playerIdIdx: index("games_player_id_idx").on(table.playerId),
    playerTimeIdx: index("games_player_time_idx").on(
      table.playerId,
      table.gameTimeStarted,
    ),
    gameTimeStartedIdx: index("games_game_time_started_idx").on(
      table.gameTimeStarted,
    ),
  }),
);

// Answers table
export const answers = sqliteTable("answers", {
  answerId: text("answer_id").primaryKey(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  countryCode: text("country_code").notNull(),
  googlePanoId: text("google_pano_id").notNull(),
  heading: real("heading").notNull(),
  pitch: real("pitch").notNull(),
  zoom: real("zoom").notNull(),
});

// Rounds table
export const rounds = sqliteTable(
  "rounds",
  {
    roundId: text("round_id").primaryKey(),
    gameId: text("game_id")
      .notNull()
      .references(() => games.gameId),
    answerId: text("answer_id")
      .notNull()
      .references(() => answers.answerId),
    roundNo: integer("round_no").notNull(),
    multiplier: real("multiplier"), // Optional for duels
  },
  (table) => ({
    gameIdIdx: index("rounds_game_id_idx").on(table.gameId),
  }),
);

// Guesses table - now with unique roundId to enforce one-to-one relationship
export const guesses = sqliteTable(
  "guesses",
  {
    guessId: text("guess_id").primaryKey(),
    roundId: text("round_id")
      .notNull()
      .unique() // This enforces one guess per round
      .references(() => rounds.roundId),
    geoguessrId: text("geoguessr_id").notNull(),
    lat: real("lat").notNull(),
    lng: real("lng").notNull(),
    countryCode: text("country_code"),
    timedOut: integer("timed_out", { mode: "boolean" }).notNull(),
    points: integer("points").notNull(),
    distanceInMeters: real("distance_in_meters").notNull(),
    timeInSeconds: integer("time_in_seconds").notNull(),
    healthBefore: real("health_before"), // Optional for duels
    healthAfter: real("health_after"), // Optional for duels
  },
  (table) => ({
    geoguessrIdIdx: index("guesses_geoguessr_id_idx").on(table.geoguessrId),
    roundIdIdx: index("guesses_round_id_idx").on(table.roundId),
  }),
);

export const failedGameImports = sqliteTable("failed_game_imports", {
  gameId: text("game_id").primaryKey(),
  playerId: text("player_id").notNull(),
});

// Relations
export const playersRelations = relations(players, ({ many }) => ({
  games: many(games, { relationName: "playerGames" }),
}));

export const gamesRelations = relations(games, ({ one, many }) => ({
  player: one(players, {
    fields: [games.playerId],
    references: [players.playerId],
    relationName: "playerGames",
  }),
  rounds: many(rounds, { relationName: "gameRounds" }),
}));

export const roundsRelations = relations(rounds, ({ one }) => ({
  game: one(games, {
    fields: [rounds.gameId],
    references: [games.gameId],
    relationName: "gameRounds",
  }),
  answer: one(answers, {
    fields: [rounds.answerId],
    references: [answers.answerId],
    relationName: "roundAnswer",
  }),
  guess: one(guesses, {
    fields: [rounds.roundId],
    references: [guesses.roundId],
  }),
}));

export const guessesRelations = relations(guesses, ({ one }) => ({
  round: one(rounds, {
    fields: [guesses.roundId],
    references: [rounds.roundId],
  }),
}));

export const answersRelations = relations(answers, ({ many }) => ({
  rounds: many(rounds, { relationName: "roundAnswer" }),
}));
