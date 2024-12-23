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
    geoguessrGameId: text("geoguessr_game_id").notNull(),
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
    totalPoints: integer("total_points"),
    wonDuel: integer("timed_out", { mode: "boolean" }).notNull().default(false),
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

// Consolidated Rounds table
export const rounds = sqliteTable(
  "rounds",
  {
    roundId: text("round_id").primaryKey(),
    gameId: text("game_id")
      .notNull()
      .references(() => games.gameId),
    roundNo: integer("round_no").notNull(),
    multiplier: real("multiplier"), // Optional for duels

    // Answer data
    answerLat: real("answer_lat").notNull(),
    answerLng: real("answer_lng").notNull(),
    answerCountryCode: text("answer_country_code").notNull(),
    googlePanoId: text("google_pano_id").notNull(),
    heading: real("heading").notNull(),
    pitch: real("pitch").notNull(),
    zoom: real("zoom").notNull(),

    // Guess data
    guessLat: real("guess_lat").notNull(),
    guessLng: real("guess_lng").notNull(),
    guessCountryCode: text("guess_country_code"),
    timedOut: integer("timed_out", { mode: "boolean" }).notNull(),
    points: integer("points").notNull(),
    distanceInMeters: real("distance_in_meters").notNull(),
    timeInSeconds: integer("time_in_seconds").notNull(),
    healthBefore: real("health_before"), // Optional for duels
    healthAfter: real("health_after"), // Optional for duels
  },
  (table) => ({
    gameIdIdx: index("rounds_game_id_idx").on(table.gameId),
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
}));
