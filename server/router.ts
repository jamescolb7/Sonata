import express, { Request, Response } from 'express';
import proxy from './proxy';

const router = express.Router();

router.get('/artist/:id', (req: Request, res: Response) => {
	return proxy(res, `https://api.deezer.com/artist/${req.params.id}`)
})

export default router;