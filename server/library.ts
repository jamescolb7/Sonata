import express, { Request, Response } from 'express';
import { Track as PrismaTrack } from '@prisma/client';
import { client } from './db';

const router = express.Router();

router.use((req, res, next) => {
    if (!res.locals.user) return res.sendStatus(403);
    return next();
})

router.get('/liked', async (req: Request, res: Response) => {
    try {
        const limit = req.query.limit ? Number(req.query.limit) : undefined;
        const order = limit ? "desc" : "asc";

        let data = await client.liked.findMany({
            take: limit,
            where: {
                userId: res.locals.user.id
            },
            orderBy: [
                { createdAt: order }
            ],
            include: {
                track: {
                    include: {
                        album: true,
                        artist: limit === undefined
                    }
                }
            }
        })

        let tracks: PrismaTrack[] = [];

        for (let i = 0; i < data.length; i++) {
            let track = data[i].track;
            tracks.push(track);
        }

        return res.send(tracks);
    } catch (e) {
        return res.sendStatus(500);
    }
})

router.get('/history', async (req: Request, res: Response) => {
    try {
        let data = await client.history.findMany({
            take: 7,
            orderBy: [
                {
                    createdAt: 'desc'
                }
            ],
            where: {
                userId: res.locals.user.id
            },
            include: {
                track: {
                    include: {
                        album: true
                    }
                }
            }
        })

        return res.send(data);
    } catch (e) {
        return res.sendStatus(500);
    }
})

export default router;