import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { history, liked, playlists } from "drizzle/schema";
import { CardCollection, ScrollCard } from "~/components/cards";
import { Muted, Title } from "~/components/text";
import { Separator } from "~/components/ui/separator";
import { UserContext } from "~/middleware/middlewareAuth";

export async function loader({ context }: LoaderFunctionArgs) {
    const ctx = context as Record<string, any>;
    const userData = ctx.get(UserContext);

    const likedData = await db.query.liked.findMany({
        limit: 7,
        with: {
            track: {
                with: {
                    album: true,
                    artist: true
                }
            },
        },
        orderBy: (a, { desc }) => [desc(a.createdAt)],
        where: eq(liked.userId, userData.id)
    })

    const playlistsData = await db.query.playlists.findMany({
        where: eq(playlists.userId, userData.id),
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
        where: eq(history.userId, userData.id),
        orderBy: (a, { desc }) => [desc(a.createdAt)]
    })

    return {
        liked: likedData,
        playlists: playlistsData,
        history: historyData
    };
}

export default function Library() {
    const data = useLoaderData<typeof loader>();

    return (
        <>
            <Title>Library</Title>
            <div className="space-y-4">
                <div>
                    <Title className="!text-xl">Recently Played</Title>
                    <Muted className="-mt-4 mb-4">Your most recently played songs.</Muted>
                    <Separator className="my-4" />
                    <CardCollection>
                        {!data.history.length && <Muted className="text-center">Play some songs and they will appear here.</Muted>}
                        {data.history.map((item, index) => {
                            return (
                                <Link to={`/track/${item.trackId}`} key={index}>
                                    <ScrollCard title={item.track.title} image={item.track.album?.coverMedium} subtitle={item.track.artist?.name} width={220} height={220}></ScrollCard>
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
                        {!data.liked.length && <Muted className="text-center">Like some songs and they will appear here.</Muted>}
                        {data.liked.length !== 0 && <Link to={`/library/liked`}>
                            <ScrollCard title="View All" image="/arrow.png" subtitle="Show your liked songs" width={220} height={220}></ScrollCard>
                        </Link>}
                        {data.liked.map((item, index) => {
                            return (
                                <Link to={`/track/${item.trackId}`} key={index}>
                                    <ScrollCard title={item.track.title} image={item.track.album?.coverMedium} subtitle={item.track.artist?.name} width={220} height={220}></ScrollCard>
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
                        {data.playlists && data.playlists.map((item, index) => {
                            return (
                                <Link to={`/library/playlist/${item.id}`} key={index}>
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