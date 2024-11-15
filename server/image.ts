import { Request, Response } from 'express';
import { Readable } from 'stream';
import type { ReadableStream } from 'node:stream/web';

const guestsAllowed = process.env.GUESTS_ALLOWED === "true";

export default async function ImageRoute(req: Request, res: Response) {
    if (!guestsAllowed && !res.locals.user) return res.sendStatus(403);
    try {
        const url = new URL(req.query.q as string);
        if (url.host !== "e-cdns-images.dzcdn.net" && url.host !== "cdn-images.dzcdn.net") return res.sendStatus(403);
        const data = await fetch(url.toString());
        res.setHeader('Cache-Control', "public, max-age=604800, immutable");
        if (data.body !== null) return Readable.fromWeb(data.body as unknown as ReadableStream<Uint8Array>).pipe(res);
    } catch (e: unknown) {
        console.log(e);
        return res.sendStatus(500);
    }
}