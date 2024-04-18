import Header from "@/components/Header";
import List from "@/components/List";
import { client } from '@/lib/db'
import { cookies } from "next/headers";
import { lucia } from "@/lib/Auth";
import { type Playlists, type Track } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function validateRequest() {
    let sessionId = cookies().get(lucia.sessionCookieName)?.value
    if (!sessionId) return { user: null, session: null };
    const user = await lucia.validateSession(sessionId);
    return user;
}

async function getPlaylist(id: string): Promise<Playlists> {
    const playlist = await client.playlists.findFirstOrThrow({
        where: {
            id: id
        }
    });
    return playlist;
}

async function getTracks(id: string): Promise<Track[] | void> {
    const data = await client.playlistTracks.findMany({
        where: {
            playlistId: id
        },
        orderBy: [
            { createdAt: "asc" }
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

    let tracks: Track[] = [];

    for (let i = 0; i < data.length; i++) {
        let track = data[i].track;
        tracks.push(track);
    }

    return tracks;
}

interface Props {
    params: {
        id: string
    }
}

export default async function Playlist({ params }: Props) {
    const user = await validateRequest();

    if (user.user === null) return;

    const playlist = await getPlaylist(params.id);
    const tracks = await getTracks(params.id);

    if (!tracks) return;

    return (
        <>
            <Header title={playlist.name} img="/playlist.png" type="Playlist" subtitle="Created by you"></Header>
            <List data={tracks}></List>
        </>
    )
}