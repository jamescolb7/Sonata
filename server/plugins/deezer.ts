import fs from 'fs';
import { path } from '../stream';
import * as dfi from 'd-fi-core';
import { type trackType } from 'd-fi-core/dist/types';

export const pluginName = "deezer";

export const enabled = (process.env.DEEZER_ENABLED as string ?? "").toLowerCase() === "true";
const arl = process.env.DEEZER_ARL as string ?? null;

async function getUrl(track: trackType, quality: number): Promise<{ trackUrl: string; isEncrypted: boolean; fileSize: number; } | null> {
    try {
        const trackUrl = await dfi.getTrackDownloadUrl(track, quality);
        return trackUrl;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: unknown) {
        //Track unavailable in higher quality
        const trackUrl = await getUrl(track, quality === 9 ? 3 : 1);
        return trackUrl;
    }
}

export default async function DeezerDownload(id: string, quality: number) {
    if (!arl) throw new Error('[Deezer Plugin] No ARL');

    const track = await dfi.getTrackInfo(id);
    const trackUrl = await getUrl(track, quality);

    if (!trackUrl) throw new Error('[Deezer Plugin] Failed to fetch track URL');

    const res = await fetch(trackUrl.trackUrl).then(res => res.arrayBuffer());
    const buffer = Buffer.from(new Uint8Array(res));
    const data: Buffer = trackUrl.isEncrypted ? dfi.decryptDownload(buffer, track.SNG_ID) : buffer;

    fs.writeFileSync(`${path}/${pluginName}/${id}_${quality}`, data);
}

export async function init() {
    if (!enabled) return console.warn('[Deezer Plugin] Not Enabled')
    if (!arl) return console.error('[Deezer Plugin] Deezer ARL Not added as an env. Please check your configuration.');
    await dfi.initDeezerApi(arl);
    try {
        if (!fs.existsSync(path)) fs.mkdirSync(path);
        if (!fs.existsSync(`${path}/${pluginName}`)) fs.mkdirSync(`${path}/${pluginName}`, { recursive: true });
        await dfi.getUser();
        console.log('[Deezer Plugin] Plugin Ready');
    } catch (e: unknown) {
        console.error(e);
    }
}