import { Request, Response } from "express";
import DeezerDownload, { enabled as deezerEnabled } from "./plugins/deezer";
import YouTubeDownload, { enabled as youtubeEnabled } from "./plugins/youtube";
import fs from 'fs';
import os from 'os';

const temp = os.tmpdir();
export const path = `${temp}/SonataServer`

if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });

export default async function StreamRoute(req: Request, res: Response) {
    const id = req.params.id.split('.')[0];
    if (isNaN(Number(id))) return res.sendStatus(400);

    const format = req.params.id.split('.')[1];
    if (!['mp3', 'flac'].includes(format)) return res.sendStatus(400);

    const quality = Number(req.query.quality as unknown) || 3;

    //Check if quality provided is valid
    if (quality) {
        if (isNaN(quality) || !([1, 3, 9].includes(quality))) return res.sendStatus(400);
    }

    let success = true;
    const filePath = `${path}/${req.params.plugin}/${id}_${quality}`;

    if (!fs.existsSync(filePath)) {
        switch (req.params.plugin) {
            case 'deezer':
                if (!deezerEnabled) {
                    success = false
                    break;
                };
                await DeezerDownload(id, quality).catch((e) => {
                    console.log(e);
                    return success = false;
                });
                break;
            case 'yt':
                if (!youtubeEnabled) {
                    success = false
                    break;
                };
                await YouTubeDownload(id, quality).catch((e) => {
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
        console.log("File not found when streaming to client.")
        return res.sendStatus(500);
    }
}