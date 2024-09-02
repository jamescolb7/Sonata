import { relations } from "drizzle-orm/relations";
import { artist, album, track, user, session, liked, history, playlists, playlistTracks } from "./schema";

export const albumRelations = relations(album, ({ one, many }) => ({
  artist: one(artist, {
    fields: [album.artistId],
    references: [artist.id]
  }),
  tracks: many(track),
}));

export const artistRelations = relations(artist, ({ many }) => ({
  albums: many(album),
  tracks: many(track),
}));

export const trackRelations = relations(track, ({ one, many }) => ({
  album: one(album, {
    fields: [track.albumId],
    references: [album.id]
  }),
  artist: one(artist, {
    fields: [track.artistId],
    references: [artist.id]
  }),
  likeds: many(liked),
  histories: many(history),
  playlistTracks: many(playlistTracks),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id]
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  likeds: many(liked),
  histories: many(history),
  playlists: many(playlists),
}));

export const likedRelations = relations(liked, ({ one }) => ({
  track: one(track, {
    fields: [liked.trackId],
    references: [track.id]
  }),
  user: one(user, {
    fields: [liked.userId],
    references: [user.id]
  }),
}));

export const historyRelations = relations(history, ({ one }) => ({
  track: one(track, {
    fields: [history.trackId],
    references: [track.id]
  }),
  user: one(user, {
    fields: [history.userId],
    references: [user.id]
  }),
}));

export const playlistsRelations = relations(playlists, ({ one, many }) => ({
  user: one(user, {
    fields: [playlists.userId],
    references: [user.id]
  }),
  playlistTracks: many(playlistTracks),
}));

export const playlistTracksRelations = relations(playlistTracks, ({ one }) => ({
  track: one(track, {
    fields: [playlistTracks.trackId],
    references: [track.id]
  }),
  playlist: one(playlists, {
    fields: [playlistTracks.playlistId],
    references: [playlists.id]
  }),
}));