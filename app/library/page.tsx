import { CardCollection, ScrollCard } from "@/components/Cards";
import { Muted, Title } from "@/components/Text";
import { cookies } from "next/headers";
import { lucia } from '@/lib/Auth'
import { Separator } from "@/components/ui/separator";
import { client } from "@/lib/db";
import Link from "next/link";
import { Session, User } from "lucia";

export const dynamic = 'force-dynamic'
export const revalidate = 0;

async function validateRequest() {
	let sessionId = cookies().get(lucia.sessionCookieName)?.value
	if (!sessionId) return { user: null, session: null };
	const user = await lucia.validateSession(sessionId);
	return user;
}

async function getLiked(user: { user: User, session: Session }) {
	return await client.liked.findMany({
		take: 6,
		orderBy: [
			{
				createdAt: 'desc'
			}
		],
		where: {
			userId: user.user.id
		},
		include: {
			track: {
				include: {
					album: true
				}
			}
		}
	})
}

async function getHistory(user: { user: User, session: Session }) {
	return await client.history.findMany({
		take: 10,
		orderBy: [
			{
				createdAt: 'desc'
			}
		],
		where: {
			userId: user.user.id
		},
		include: {
			track: {
				include: {
					album: true
				}
			}
		}
	})
}

export default async function Library() {
	const user = await validateRequest();

	if (user.user === null) return;

	const likedData = getLiked(user);
	const historyData = getHistory(user);

	const [liked, history] = await Promise.all([likedData, historyData]);

	return (
		<>
			<Title>Library</Title>
			<div className="space-y-4">
				<div>
					<Title className="!text-xl">Recently Played</Title>
					<Muted className="-mt-4 mb-4">Your most recently played songs.</Muted>
					<Separator className="my-4" />
					<CardCollection>
						{history.map((item, index) => {
							return (
								<Link href={`/track/${item.track.id}`} key={index}>
									<ScrollCard title={item.track.title} image={item.track.album?.cover_medium} subtitle={"Track"} width={220} height={220}></ScrollCard>
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
						<Link href={`/library/liked`}>
							<ScrollCard title="View All" image="/arrow.png" subtitle="Show your liked songs" width={220} height={220}></ScrollCard>
						</Link>
						{liked.map((item, index) => {
							return (
								<Link href={`/track/${item.track.id}`} key={index}>
									<ScrollCard title={item.track.title} image={item.track.album?.cover_medium} subtitle={"Track"} width={220} height={220}></ScrollCard>
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
						<Link href={`/library/playlists`}>
							<ScrollCard title="View All" image="/arrow.png" subtitle="Show your playlists" width={220} height={220}></ScrollCard>
						</Link>
					</CardCollection>
				</div>
			</div>
		</>
	)
}