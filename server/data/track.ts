import { Track } from "@/types/Track";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { track, artist, album } from "@/drizzle/schema";

async function getFromDB(id: string) {
    const resp = await db.query.track.findFirst({
        where: eq(track.id, id),
        with: {
            artist: true,
            album: true
        }
    })
    return resp;
}

export async function GetTrack(id: string) {
    let resp = await getFromDB(id);

    if (!resp) {
        const res = await (await fetch(`https://api.deezer.com/track/${id}`)).json();

        if (res?.error) throw new Error('Not Found');

        resp = await getFromDB(id);
        if (resp) return resp;

        const data = res as Track;

        await db.transaction(async (t) => {
            await t.insert(artist).values({
                id: String(data.artist.id),
                name: data.artist.name,
                picture_big: data.artist.picture_big
            }).onConflictDoNothing();

            await t.insert(album).values({
                id: String(data.album.id),
                title: data.album.title,
                cover_big: data.album.cover_big,
                cover_medium: data.album.cover_medium,
                cover_small: data.album.cover_small,
                artistId: String(data.artist.id)
            }).onConflictDoNothing();

            await db.insert(track).values({
                id: String(data.id),
                title: data.title,
                artistId: String(data.artist.id),
                albumId: String(data.album.id),
                duration: data.duration,
                preview: data.preview,
                type: "deezer"
            }).onConflictDoNothing();
        })

        resp = await getFromDB(id);
        return resp;
    } else {
        return resp;
    }
}