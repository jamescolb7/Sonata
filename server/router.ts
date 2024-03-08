import express, { Request, Response } from 'express';
import proxy from './proxy';

const router = express.Router();

router.get('/artist/:id', (req: Request, res: Response) => {
	return proxy("deezer", res, `/artist/${req.params.id}`)
})

router.get('/artist/:id/top', (req: Request, res: Response) => {
	return proxy("deezer", res, `/artist/${req.params.id}/top`)
})

router.get('/artist/:id/albums', (req: Request, res: Response) => {
	return proxy("deezer", res, `/artist/${req.params.id}/albums`)
})

router.get('/album/:id', (req: Request, res: Response) => {
	return proxy("deezer", res, `/album/${req.params.id}`)
})

export default router;