import Header from "@/components/Header";
import List from "@/components/List";
import { lucia } from "@/lib/Auth";
import { client } from "@/lib/db";
import { cookies } from "next/headers";
import { Track as PrismaTrack } from '@prisma/client';

export const dynamic = 'force-dynamic'
export const revalidate = 0;

async function validateRequest() {
	let sessionId = cookies().get(lucia.sessionCookieName)?.value
	if (!sessionId) return { user: null, session: null };
	const user = await lucia.validateSession(sessionId);
	return user;
}

async function getData(id: string): Promise<PrismaTrack[] | void> {
	const user = await validateRequest();

	if (user.user === null) return;

	let data = await client.liked.findMany({
		where: {
			userId: user.user.id
		},
		orderBy: [
			{ createdAt: 'asc' }
		],
		include: {
			track: {
				include: {
					album: true,
					artist: true
				}
			}
		}
	})

	let tracks: PrismaTrack[] = [];

	for (let i = 0; i < data.length; i++) {
		let track = data[i].track;
		tracks.push(track);
	}

	return tracks;
}

export default async function Liked({ params }: { params: { id: string } }) {
	let data = await getData(params.id);

	if (!data) return;

	return (
		<>
			<Header img="/heart.png" title="Liked" type="Playlist" tracks={data}></Header>
			<List data={data}></List>
		</>
	)
}