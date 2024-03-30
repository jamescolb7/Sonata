import { Track } from "@/types/Track";
import { client } from "../db";
import { Deezer } from "../proxy";

export async function GetTrack(id: string): Promise<any> {
	let resp = await client.track.findFirst({
		where: {
			id: id
		},
		include: {
			artist: true,
			album: true
		}
	})
	if (!resp) {
		let res = await Deezer(`/track/${id}`)

		if (res?.error) throw new Error('Not Found');

		let data = res as Track;

		let artist = {
			id: String(data.artist.id),
			name: data.artist.name,
			picture_big: data.artist.picture_big
		}

		let album = {
			id: String(data.album.id),
			title: data.album.title,
			cover_big: data.album.cover_big,
			cover_medium: data.album.cover_medium,
			cover_small: data.album.cover_small,
		}

		await client.track.create({
			data: {
				id: String(data.id),
				title: data.title,
				artist: {
					connectOrCreate: {
						where: {
							id: String(data.artist.id)
						},
						create: artist
					}
				},
				album: {
					connectOrCreate: {
						where: {
							id: String(data.album.id)
						},
						create: {
							...album,
							artist: {
								connectOrCreate: {
									where: {
										id: String(data.artist.id)
									},
									create: artist
								}
							}
						}
					}
				},
				duration: data.duration,
				preview: data.preview,
				type: "deezer"
			},
			include: {
				artist: true,
				album: true
			}
		});
		return data;
	} else {
		return resp;
	}
}