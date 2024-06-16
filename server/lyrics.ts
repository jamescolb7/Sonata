import express, { Request, Response } from "express";
import { Deezer } from "./proxy";

const router = express.Router();

router.get('/:id', async (req: Request, res: Response) => {
    if (!res.locals.user) return res.sendStatus(403);

    Deezer(`/track/${req.params.id}`).catch(() => {
        return res.sendStatus(404);
    }).then(async (data) => {
        const request = await fetch(`https://lrclib.net/api/get?artist_name=${encodeURI(data.artist.name)}&track_name=${encodeURI(data.title)}&album_name=${encodeURI(data.album.title)}&duration=${data.duration}`, {
            headers: {
                "user-agent": "Sonata v1.0.0 (https://github.com/directlycrazy/Sonata)"
            }
        })
        try {
            const json = await request.json();
            return res.send(json);
        } catch (e) {
            return res.sendStatus(404);
        }
    })
})

export default router;