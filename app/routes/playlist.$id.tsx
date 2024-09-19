import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { and, eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { playlists, playlistTracks } from "drizzle/schema";
import { Track } from "types/Track";
import Header from "~/components/header";
import List from "~/components/list";
import { UserContext } from "~/middleware/middlewareAuth";

export const meta: MetaFunction = ({ data }) => {
    const title = (data as { playlist: { name: string } }).playlist.name;

    return [
        { title: `${title} - Sonata` },
        { name: "description", content: "Your self-hosted music streaming platform." },
    ];
};

export async function loader({ context, params }: LoaderFunctionArgs) {
    const ctx = context as Record<string, any>;
    const userData = ctx.get(UserContext);

    const transaction = await db.transaction(async t => {
        if (!params.id) return;

        const playlist = await t.query.playlists.findFirst({
            where: and(eq(playlists.userId, userData.id), eq(playlists.id, params.id))
        })

        if (!playlist) return;

        const tracks: Track[] = [];

        const tracksData = await t.query.playlistTracks.findMany({
            where: eq(playlistTracks.playlistId, params.id),
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

    return json(transaction);
}

export default function Playlist() {
    const data = useLoaderData<typeof loader>();

    return (
        <>
            <Header img="/playlist.png" title={data.playlist?.name} type="Playlist" tracks={data.tracks}></Header>
            <List data={data.tracks}></List>
        </>
    )
}