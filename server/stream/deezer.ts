import fs from 'fs';
import { path } from './route';
import * as dfi from 'd-fi-core';

export const pluginName = "deezer";

const arl = process.env.ARL as string ?? null;

export default async function DeezerDownload(id: string) {
    if (!arl) throw new Error('No ARL');

    const track = await dfi.getTrackInfo(id);
    const trackUrl = await dfi.getTrackDownloadUrl(track, 3);

    if (!trackUrl) throw new Error('Failed to fetch track URL');

    const res = await fetch(trackUrl.trackUrl).then(res => res.arrayBuffer());
    const buffer = Buffer.from(new Uint8Array(res));
    const data: Buffer = trackUrl.isEncrypted ? dfi.decryptDownload(buffer, track.SNG_ID) : buffer;

    fs.writeFileSync(`${path}/${pluginName}/${id}.mp3`, data);
}

export async function init() {
    if (!arl) return;
    await dfi.initDeezerApi(arl);
    try {
        if (!fs.existsSync(path)) fs.mkdirSync(path);
        if (!fs.existsSync(`${path}/${pluginName}`)) fs.mkdirSync(`${path}/${pluginName}`);
        await dfi.getUser();
        console.log('Deezer Plugin Ready');
    } catch (e: any) {
        console.error(e.message);
    }
}

init();