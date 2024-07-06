import express, { Request, Response } from 'express';
import { client } from './db';
import { GetTrack } from './fetch/track';

const router = express.Router();

router.use((req, res, next) => {
	if (!res.locals.user) return res.sendStatus(403);
	return next();
})

router.get('/list', async (req: Request, res: Response) => {
	const data = await client.playlists.findMany({
		orderBy: [
			{
				createdAt: "desc"
			}
		],
		where: {
			userId: res.locals.user.id
		}
	})
	return res.send(data);
})

router.get('/create/:name', async (req: Request, res: Response) => {
	if (!req.params.name) return res.sendStatus(400);

	try {
		const data = await client.playlists.create({
			data: {
				name: req.params.name,
				user: {
					connect: {
						id: res.locals.user.id,
						email: res.locals.user.email
					}
				}
			}
		})

		if (data) return res.sendStatus(201);
	} catch (e) {
		return res.sendStatus(500);
	}
})

router.get('/set/:id/:track', async (req: Request, res: Response) => {
	const track = await GetTrack(req.params.track);
	try {
		await client.playlistTracks.findFirstOrThrow({
			where: {
				playlistId: req.params.id,
				trackId: track.id
			}
		})
		const data = await client.playlistTracks.deleteMany({
			where: {
				playlistId: req.params.id,
				trackId: track.id
			}
		})
		if (data) return res.sendStatus(202);
	} catch (e) {
		const data = await client.playlistTracks.create({
			data: {
				playlist: {
					connect: {
						id: req.params.id
					}
				},
				track: {
					connect: {
						id: track.id
					}
				}
			}
		})
		if (data) return res.sendStatus(201);
	}
})

export default router;