import { CardCollection, ScrollCard } from "@/components/cards"
import { Muted, Title } from "@/components/text"
import { Separator } from "@/components/ui/separator"
import { db } from "@/drizzle/db"
import { history, liked, playlists } from "@/drizzle/schema"
import { lucia } from "@/lib/auth"
import { eq } from "drizzle-orm"
import { Metadata } from "next"
import { cookies } from "next/headers"
import Link from "next/link"

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
	title: "Library - Sonata",
	description: "Your self-hosted music streaming platform."
}

async function validateRequest() {
	const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value
	if (!sessionId) return { user: null, session: null };
	const user = await lucia.validateSession(sessionId);
	return user;
}

export default async function Library() {
	const user = await validateRequest();
	if (!user.user) return;

	const userId = user.user.id;

	async function getData() {
		const likedData = await db.query.liked.findMany({
			limit: 6,
			with: {
				track: {
					with: {
						album: true,
						artist: true
					}
				},
			},
			orderBy: (a, { desc }) => [desc(a.createdAt)],
			where: eq(liked.userId, userId)
		})

		const playlistsData = await db.query.playlists.findMany({
			where: eq(playlists.userId, userId),
			orderBy: (a, { desc }) => [desc(a.createdAt)]
		})

		const historyData = await db.query.history.findMany({
			limit: 7,
			with: {
				track: {
					with: {
						album: true,
						artist: true
					}
				}
			},
			where: eq(history.userId, userId),
			orderBy: (a, { desc }) => [desc(a.createdAt)]
		})

		return {
			likedData: likedData,
			playlistsData: playlistsData,
			historyData: historyData
		}
	}

	const { likedData, playlistsData, historyData } = await getData();

	return (
		<>
			<Title>Library</Title>
			<div className="space-y-4">
				<div>
					<Title className="!text-xl">Recently Played</Title>
					<Muted className="-mt-4 mb-4">Your most recently played songs.</Muted>
					<Separator className="my-4" />
					<CardCollection>
						{!historyData.length && <Muted className="text-center">Play some songs and they will appear here.</Muted>}
						{historyData.map((item, index) => {
							return (
								<Link href={`/track/${item.trackId}`} key={index}>
									<ScrollCard title={item.track.title} image={item.track.album?.cover_medium} subtitle={item.track.artist?.name} width={220} height={220}></ScrollCard>
								</Link>
							)
						})}
					</CardCollection>
				</div>
				<div>
					<Title className="!text-xl">Liked Songs</Title>
					<Muted className="-mt-4 mb-4">Your currently liked songs.</Muted>
					<Separator className="my-4" />
					<CardCollection>
						{!likedData.length && <Muted className="text-center">Like some songs and they will appear here.</Muted>}
						{likedData.length !== 0 && <Link href={`/liked`}>
							<ScrollCard title="View All" image="/arrow.png" subtitle="Show your liked songs" width={220} height={220}></ScrollCard>
						</Link>}
						{likedData.map((item, index) => {
							return (
								<Link href={`/track/${item.trackId}`} key={index}>
									<ScrollCard title={item.track.title} image={item.track.album?.cover_medium} subtitle={item.track.artist?.name} width={220} height={220}></ScrollCard>
								</Link>
							)
						})}
					</CardCollection>
				</div>
				<div>
					<Title className="!text-xl">Playlists</Title>
					<Muted className="-mt-4 mb-4">See all of your playlists.</Muted>
					<Separator className="my-4" />
					<CardCollection>
						<div className="cursor-pointer">
							{/* <PlaylistCreate /> */}
						</div>
						{playlistsData && playlistsData.map((item, index) => {
							return (
								<Link href={`/playlist/${item.id}`} key={index}>
									<ScrollCard title={item.name} image="/playlist.png" subtitle="Playlist" width={220} height={220}></ScrollCard>
								</Link>
							)
						})}
					</CardCollection>
				</div>
			</div>
		</>
	)
}