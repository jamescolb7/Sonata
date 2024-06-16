import express, { Request, Response } from 'express';
import proxy from 'express-http-proxy';
import user from './user';
import playlists from './playlists';
import stream from './stream/route';
import lyrics from './lyrics';
import { GetTrack } from './fetch/track';
import { client } from './db';

const router = express.Router();

router.get('/health', async (req: Request, res: Response) => {
	const result = await client.$queryRaw`SELECT 1` as [];
	return res.send({
		healthy: result.length ? true : false
	})
})

router.get('/track/:id', async (req: Request, res: Response) => {
	let id = req.params.id;
	try {
		let track = await GetTrack(id)
		return res.send(track);
	} catch (e) {
		return res.sendStatus(404)
	}
})

router.use('/stream', stream);
router.use('/me', user);
router.use('/playlists', playlists)
router.use('/lyrics', lyrics)
router.use('', proxy('api.deezer.com'))

export default router;