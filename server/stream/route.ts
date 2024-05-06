import express, { Request, Response } from 'express';
import os from 'os';
import DeezerDownload from './deezer';
import fs from 'fs';
import { client } from '../db';

const router = express.Router();

const temp = os.tmpdir();
export const path = `${temp}/SonataServer`

router.get('/:plugin/:id', async (req: Request, res: Response) => {
    if (!res.locals.user) return res.sendStatus(403);

    let session = await client.streamSessions.findFirst({
        where: {
            trackId: req.params.id,
            userId: res.locals.user.id
        }
    })

    if (session) {
        return res.send({
            id: session.id,
            createdAt: session.createdAt,
            expiresAt: session.expiresAt
        });
    }

    let success = true;
    const filePath = `${path}/${req.params.plugin}/${req.params.id}`;

    if (!fs.existsSync(filePath)) {
        switch (req.params.plugin) {
            case 'deezer':
                await DeezerDownload(req.params.id).catch((e) => {
                    console.log(e);
                    return success = false;
                });
                break;
            default:
                return res.sendStatus(404);
        }
    }

    if (!success) return res.sendStatus(500);

    let newDate = new Date();
    newDate.setDate(newDate.getMinutes() + 10);

    let data = await client.streamSessions.create({
        data: {
            user: {
                connect: {
                    id: res.locals.user.id
                }
            },
            track: {
                connect: {
                    id: req.params.id
                }
            },
            path: filePath,
            expiresAt: newDate
        }
    })

    return res.send({
        id: data.id,
        createdAt: data.createdAt,
        expiresAt: data.expiresAt
    });
})

async function deleteToken(key: string) {
    return await client.streamSessions.delete({
        where: {
            id: key
        }
    })
}

router.get('/:key.mp3', async (req: Request, res: Response) => {
    try {
        const data = await client.streamSessions.findFirstOrThrow({
            where: {
                id: req.params.key
            }
        })

        //Delete old sessions
        if (new Date().getTime() - data.expiresAt.getTime() >= 86400000) {
            deleteToken(req.params.key);
            return res.status(401).send({
                error: "Token expired."
            });
        }

        if (fs.existsSync(data.path)) {
            res.setHeader('content-type', 'audio/mp3');
            return res.sendFile(data.path);
        } else {
            deleteToken(req.params.key);
            return res.sendStatus(500);
        }
    } catch (e) {
        deleteToken(req.params.key);
        return res.status(401).send({
            error: "Token expired."
        });
    }
})

export default router;