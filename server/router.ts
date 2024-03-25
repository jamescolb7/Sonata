import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import proxy from 'express-http-proxy';
import { Deezer } from './proxy';
import { Track } from '@/types/Track';

const client = new PrismaClient();

const router = express.Router();

router.get('/track/:id', async (req, res) => {
	let id = Number(req.params.id);
	if (isNaN(id)) return res.sendStatus(401);
	let resp = await client.track.findFirst({
		where: {
			id: req.params.id
		},
		include: {
			artist: true,
			album: true
		}
	})
	if (!resp) {
		let data = await Deezer(`/track/${req.params.id}`) as Track

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
		return res.send(data);
	} else {
		return res.send(resp);
	}
})

router.use('', proxy('api.deezer.com'))

export default router;