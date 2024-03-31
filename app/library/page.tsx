import { Card, CardCollection } from "@/components/Cards";
import { Muted, Title } from "@/components/Text";
import { cookies } from "next/headers";
import { lucia } from '@/lib/Auth'
import { Separator } from "@/components/ui/separator";
import { client } from "@/lib/db";
import Link from "next/link";

export const dynamic = 'force-dynamic'
export const revalidate = 0;

async function validateRequest() {
	let sessionId = cookies().get(lucia.sessionCookieName)?.value
	if (!sessionId) return { user: null, session: null };
	const user = await lucia.validateSession(sessionId);
	return user;
}

export default async function Library() {
	const user = await validateRequest();

	if (user.user === null) return;

	let data = await client.liked.findMany({
		take: 5,
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

	return (
		<>
			<Title>Library</Title>
			<div className="space-y-4">
				<div>
					<Title className="!text-xl">Liked Songs</Title>
					<Muted className="-mt-4 mb-4">Your currently liked songs.</Muted>
					<Separator className="my-4" />
					<CardCollection>
						<Link href={`/library/liked`}>
							<Card title="View All" image="/arrow.png" subtitle="Show your liked songs" width={220} height={220}></Card>
						</Link>
						{data.map((item, index) => {
							return (
								<Link href={`/track/${item.track.id}`} key={index}>
									<Card title={item.track.title} image={item.track.album?.cover_medium} subtitle={"Track"} width={220} height={220}></Card>
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
							<Card title="View All" image="/arrow.png" subtitle="Show your playlists" width={220} height={220}></Card>
						</Link>
					</CardCollection>
				</div>
			</div>
		</>
	)
}