import { and, eq } from 'drizzle-orm';
import { db } from 'drizzle/db';
import { history, liked, playlists, playlistTracks, track } from 'drizzle/schema';
import express, { Request, Response } from 'express';
import { GetTrack } from './data/track';

const router = express.Router();

router.get('/liked/:id', async (req: Request, res: Response) => {
    if (!req.params.id || isNaN(Number(req.params.id))) return res.sendStatus(400);
    try {
        const data = await db.query.liked.findFirst({
            where: and(eq(liked.trackId, req.params.id), eq(liked.userId, res.locals.user.id))
        })
        if (data) {
            res.send({ liked: true });
        } else {
            res.send({ liked: false });
        }

    } catch (e) {
        res.send({ liked: false });
    }

    //Add to user history

    try {
        const track = await GetTrack(req.params.id).catch(() => { });
        await db.insert(history).values({
            trackId: track.id,
            userId: res.locals.user.id
        })
    } catch (e) {
        console.log(e);
    }
})

router.get('/like/:id', async (req, res) => {
    if (!req.params.id || isNaN(Number(req.params.id))) return res.sendStatus(400);
    const likedData = await db.query.liked.findFirst({
        where: and(eq(liked.trackId, req.params.id), eq(liked.userId, res.locals.user.id)),
        with: {
            track: true
        }
    })

    if (likedData) {
        //Remove from liked
        await db.delete(liked).where(and(eq(liked.trackId, req.params.id), eq(liked.userId, res.locals.user.id)));
        return res.sendStatus(200);
    } else {
        //Add to liked
        const trackData = await GetTrack(req.params.id).catch(() => { });

        if (!trackData) return res.sendStatus(404);

        await db.insert(liked).values({
            trackId: trackData.id,
            userId: res.locals.user.id
        });

        return res.sendStatus(201);
    }
})

router.get('/lyrics/:id', async (req, res) => {
    if (!req.params.id || isNaN(Number(req.params.id))) return res.sendStatus(400);

    const track = await GetTrack(req.params.id);
    if (!track) return res.sendStatus(400);

    const data = await fetch(`https://lrclib.net/api/get?artist_name=${encodeURI(track.artist.name)}&track_name=${encodeURI(track.title)}&album_name=${encodeURI(track.album.title)}&duration=${track.duration}`, {
        headers: {
            "user-agent": "Sonata v1.0.0 (https://github.com/directlycrazy/Sonata)"
        }
    });

    try {
        const json = await data.json();
        return res.send(json);
    } catch (e) {
        return res.sendStatus(404);
    }
})

//Playlist Controls

router.get('/playlists/list', async (req, res) => {
    const data = await db.query.playlists.findMany({
        where: eq(playlists.userId, res.locals.user.id)
    })

    if (!data) return res.send([]);

    return res.send(data);
})

router.get('/playlists/set/:id/:track', async (req, res) => {
    if (!req.params.id || !req.params.track) return res.sendStatus(400);

    const track = await GetTrack(req.params.track);
    if (!track) return res.sendStatus(404);

    const playlist = await db.query.playlists.findFirst({
        where: and(eq(playlists.userId, res.locals.user.id), eq(playlists.id, req.params.id))
    });
    if (!playlist) return res.sendStatus(404);

    try {
        //Check if already in playlist
        const exists = await db.query.playlistTracks.findFirst({
            where: and(eq(playlistTracks.playlistId, req.params.id), eq(playlistTracks.trackId, req.params.track))
        })

        if (exists) {
            //Remove from playlist
            const data = await db.delete(playlistTracks).where(and(eq(playlistTracks.playlistId, req.params.id), eq(playlistTracks.trackId, req.params.track)));

            if (data) return res.sendStatus(200);
            return res.sendStatus(500);
        } else {
            //Add to playlist
            const data = await db.insert(playlistTracks).values({
                playlistId: req.params.id,
                trackId: track.id
            });

            if (data) return res.sendStatus(201);
        }

    } catch (e) {
        return res.sendStatus(500);
    }
})

export default router;