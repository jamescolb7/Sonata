import { sqliteTable, AnySQLiteColumn, text, numeric, integer, uniqueIndex, foreignKey } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export const artist = sqliteTable("Artist", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  pictureBig: text("picture_big").notNull(),
  createdAt: numeric("createdAt").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: numeric("updatedAt").notNull(),
},
  (table) => {
    return {
      idKey: uniqueIndex("Artist_id_key").on(table.id),
    }
  });

export const album = sqliteTable("Album", {
  id: text("id").primaryKey().notNull(),
  title: text("title").notNull(),
  artistId: text("artistId").references(() => artist.id, { onDelete: "set null", onUpdate: "cascade" }),
  coverBig: text("cover_big").notNull(),
  coverMedium: text("cover_medium").notNull(),
  coverSmall: text("cover_small").notNull(),
  createdAt: numeric("createdAt").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: numeric("updatedAt").notNull(),
},
  (table) => {
    return {
      idKey: uniqueIndex("Album_id_key").on(table.id),
    }
  });

export const track = sqliteTable("Track", {
  id: text("id").primaryKey().notNull(),
  title: text("title").notNull(),
  artistId: text("artistId").references(() => artist.id, { onDelete: "set null", onUpdate: "cascade" }),
  albumId: text("albumId").references(() => album.id, { onDelete: "set null", onUpdate: "cascade" }),
  duration: integer("duration").notNull(),
  preview: text("preview"),
  type: text("type").notNull(),
  createdAt: numeric("createdAt").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: numeric("updatedAt").notNull(),
},
  (table) => {
    return {
      idKey: uniqueIndex("Track_id_key").on(table.id),
    }
  });

export const session = sqliteTable("Session", {
  id: text("id").primaryKey().notNull(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  createdAt: numeric("createdAt").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  expiresAt: integer("expiresAt").notNull(),
});

export const user = sqliteTable("User", {
  id: text("id").primaryKey().notNull(),
  email: text("email").notNull(),
  hashedPassword: text("hashed_password").notNull(),
  createdAt: numeric("createdAt").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: numeric("updatedAt").notNull(),
},
  (table) => {
    return {
      emailKey: uniqueIndex("User_email_key").on(table.email),
    }
  });

export const liked = sqliteTable("Liked", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  trackId: text("trackId").notNull().references(() => track.id, { onDelete: "restrict", onUpdate: "cascade" }),
  createdAt: numeric("createdAt").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: numeric("updatedAt").notNull(),
},
  (table) => {
    return {
      idKey: uniqueIndex("Liked_id_key").on(table.id),
    }
  });

export const history = sqliteTable("History", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  trackId: text("trackId").notNull().references(() => track.id, { onDelete: "restrict", onUpdate: "cascade" }),
  createdAt: numeric("createdAt").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: numeric("updatedAt").notNull(),
},
  (table) => {
    return {
      idKey: uniqueIndex("History_id_key").on(table.id),
    }
  });

export const playlists = sqliteTable("Playlists", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  createdAt: numeric("createdAt").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: numeric("updatedAt").notNull(),
},
  (table) => {
    return {
      nameKey: uniqueIndex("Playlists_name_key").on(table.name),
      idKey: uniqueIndex("Playlists_id_key").on(table.id),
    }
  });

export const playlistTracks = sqliteTable("PlaylistTracks", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  playlistId: text("playlistId").notNull().references(() => playlists.id, { onDelete: "cascade", onUpdate: "cascade" }),
  trackId: text("trackId").notNull().references(() => track.id, { onDelete: "restrict", onUpdate: "cascade" }),
  createdAt: numeric("createdAt").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: numeric("updatedAt").notNull(),
},
  (table) => {
    return {
      idKey: uniqueIndex("PlaylistTracks_id_key").on(table.id),
    }
  });