import SearchClient from 'ytmusic-api';
import { GetTrack } from '../data/track';
import { path } from '../stream';
import ytdl from '@distube/ytdl-core';
import fs from 'fs';

export const pluginName = "yt";

export const enabled = (process.env.YOUTUBE_ENABLED as string ?? "").toLowerCase() === "true";

let client: SearchClient | null;

async function SearchSong(id: string) {
	const trackData = await GetTrack(id);

	if (!client || !trackData) return;

	const search = await client.search(`${trackData.title} ${trackData.artist?.name} lyrics`) as unknown as { name: string, type: string, videoId: string }[];

	let bestID = "";

	for (let i = 0; i < search.length; i++) {
		if (search[i].type === "VIDEO") bestID = search[i].videoId;
		if (search[i].name.toLowerCase().includes("lyrics")) return search[i].videoId;
	}

	return bestID;
}

function Download(id: string, videoID: string, quality: number) {
	return new Promise((res, rej) => {
		const stream = ytdl(`https://www.youtube.com/watch?v=${videoID}`, {
			quality: "highest",
			filter: (format) => {
				if (format.mimeType?.startsWith("audio/mp4")) return true;
				return false;
			}
		});

		const writeStream = fs.createWriteStream(`${path}/${pluginName}/${id}_${quality}`);

		stream.pipe(writeStream);

		stream.on('end', () => res(true))

		stream.on('error', (e: unknown) => {
			console.log(e);
			//Delete the empty file
			if (fs.existsSync(`${path}/${pluginName}/${id}_${quality}`)) fs.rmSync(`${path}/${pluginName}/${id}_${quality}`);
			rej();
			throw new Error("[YouTube Plugin] Failed to write video");
		})
	})
}

export default async function YouTubeDownload(id: string, quality: number) {
	const videoID = await SearchSong(id);
	if (!videoID) throw new Error("[YouTube Plugin] Failed to find a video ID");
	await Download(id, videoID, quality).catch(() => {
		throw new Error("[YouTube Plugin] Failed to write video");
	});
}

export async function init() {
	if (!enabled) return console.warn('[YouTube Plugin] Not Enabled');

	try {
		if (!fs.existsSync(path)) fs.mkdirSync(path);
		if (!fs.existsSync(`${path}/${pluginName}`)) fs.mkdirSync(`${path}/${pluginName}`, { recursive: true });

		client = new SearchClient();
		await client.initialize();

		return console.log('[YouTube Plugin] Plugin Ready')
	} catch (e: unknown) {
		console.error(e);
	}
}