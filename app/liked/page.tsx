import Header from "@/components/header";
import List from "@/components/list";
import { db } from "@/drizzle/db";
import { liked } from "@/drizzle/schema";
import { lucia } from "@/lib/auth";
import { Track } from "@/types/Track";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
	title: "Liked - Sonata",
	description: "Your self-hosted music streaming platform."
}

async function validateRequest() {
	const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value
	if (!sessionId) return { user: null, session: null };
	const user = await lucia.validateSession(sessionId);
	return user;
}

export default async function Liked() {
	const user = await validateRequest();
	if (!user.user || user.user === null) return;

	async function getData() {
		if (user.user === null) return;

		const tracks = [];

		const likedData = await db.query.liked.findMany({
			with: {
				track: {
					with: {
						album: true,
						artist: true
					}
				},
			},
			where: eq(liked.userId, user.user.id)
		})

		for (let i = 0; i < likedData.length; i++) {
			tracks.push(likedData[i].track);
		}

		return tracks;
	}

	const tracks = await getData() as unknown as Track[];

	return (
		<>
			<Header img='/heart.png' title="Liked" type="Playlist" tracks={tracks}></Header>
			<List data={tracks}></List>
		</>
	)
}