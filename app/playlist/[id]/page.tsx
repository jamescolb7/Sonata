import Header from "@/components/header";
import List from "@/components/list";
import { db } from "@/drizzle/db";
import { playlists, playlistTracks } from "@/drizzle/schema";
import { lucia } from "@/lib/auth";
import { Track } from "@/types/Track";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

async function validateRequest() {
	const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value
	if (!sessionId) return { user: null, session: null };
	const user = await lucia.validateSession(sessionId);
	return user;
}

export default async function Playlist({ params }: { params: Promise<{ id: string }> }) {
	const user = await validateRequest();
	if (!user.user || user.user === null) return;

	const playlistId = (await params).id;

	async function getData() {
		const transaction = await db.transaction(async t => {
			if (!playlistId || user.user === null) return;

			const playlist = await t.query.playlists.findFirst({
				where: and(eq(playlists.userId, user.user.id), eq(playlists.id, playlistId))
			})

			if (!playlist) return;

			const tracks: Track[] = [];

			const tracksData = await t.query.playlistTracks.findMany({
				where: eq(playlistTracks.playlistId, playlistId),
				with: {
					track: {
						with: {
							artist: true,
							album: true
						}
					}
				}
			})

			for (let i = 0; i < tracksData.length; i++) {
				tracks.push(tracksData[i].track as unknown as Track);
			}

			return {
				playlist: playlist,
				tracks: tracks
			}
		})

		return transaction;
	}

	const data = await getData();
	if (data === undefined) return;
	const { playlist, tracks } = data;

	return (
		<>
			<Header img='/playlist.png' title={playlist.name} type="Playlist" tracks={tracks}></Header>
			<List data={tracks}></List>
		</>
	)
}