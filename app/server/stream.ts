import { Request, Response } from "express";
import DeezerDownload from "./plugins/deezer";
import fs from 'fs';
import os from 'os';
import { lucia } from "~/lib/auth";

const temp = os.tmpdir();
export const path = `${temp}/SonataServer`

export default async function StreamRoute(req: Request, res: Response) {
    //Auth validation as middleware is skipped
    const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
    if (!sessionId) return res.sendStatus(401);
    const { session } = await lucia.validateSession(sessionId);
    if (!session) return res.sendStatus(401);

    const id = req.params.id.split('.')[0];
    if (isNaN(Number(id))) return res.sendStatus(400);

    const format = req.params.id.split('.')[1];
    if (!['mp3', 'flac'].includes(format)) return res.sendStatus(400);

    let quality = Number(req.query.quality as unknown) || 3;

    //Check if quality provided is valid
    if (quality) {
        if (isNaN(quality) || !([1, 3, 9].includes(quality))) return res.sendStatus(400);
    }

    let success = true;
    const filePath = `${path}/${req.params.plugin}/${id}_${quality}`;

    if (!fs.existsSync(filePath)) {
        switch (req.params.plugin) {
            case 'deezer':
                await DeezerDownload(id, quality).catch((e) => {
                    console.log(e);
                    return success = false;
                });
                break;
            default:
                return res.sendStatus(404);
        }
    }

    if (!success) return res.sendStatus(500);

    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    } else {
        return res.sendStatus(500);
    }
}