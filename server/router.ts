import express, { Request, Response } from 'express';
import proxy from 'express-http-proxy';
import user from './user';
import playlists from './playlists';
import { GetTrack } from './fetch/track';

const router = express.Router();

router.get('/track/:id', async (req: Request, res: Response) => {
	let id = req.params.id;
	try {
		let track = await GetTrack(id)
		return res.send(track);
	} catch (e) {
		return res.sendStatus(404)
	}
})

router.use('/me', user);
router.use('/playlists', playlists)
router.use('', proxy('api.deezer.com'))

export default router;