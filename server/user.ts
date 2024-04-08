import express, { Request, Response } from 'express';
import { GetTrack } from './fetch/track';
import { client } from './db';

const router = express.Router();

router.use((req, res, next) => {
	if (!res.locals.user) return res.sendStatus(403);
	return next();
})

router.get('/like/:id', async (req: Request, res: Response) => {
	try {
		let data = await client.liked.findFirstOrThrow({
			where: {
				userId: res.locals.user.id,
				trackId: req.params.id
			}
		})
		//Track is already liked, delete
		await client.liked.deleteMany({
			where: {
				userId: res.locals.user.id,
				trackId: req.params.id
			}
		})
		return res.sendStatus(202);
	} catch (e) {
		let track = await GetTrack(req.params.id).catch(() => { return res.sendStatus(500) });
		//Like the track
		await client.liked.create({
			data: {
				track: {
					connect: {
						id: String(track.id)
					}
				},
				user: {
					connect: {
						id: res.locals.user.id
					}
				}
			}
		})
		return res.sendStatus(201);
	}
})

router.get('/liked/:id', async (req: Request, res: Response) => {
	try {
		let data = await client.liked.findFirstOrThrow({
			where: {
				userId: res.locals.user.id,
				trackId: req.params.id
			}
		})
		res.status(200).send({ liked: true });
	} catch (e) {
		res.status(404).send({ liked: false });
	}

	//Also add the track to the user's history, if they are checking if it is liked

	try {
		let track = await GetTrack(req.params.id).catch(() => { return res.sendStatus(500) });
		await client.history.create({
			data: {
				track: {
					connect: {
						id: String(track.id)
					}
				},
				user: {
					connect: {
						id: res.locals.user.id
					}
				}
			}
		})
	} catch (e) { }
})

export default router;