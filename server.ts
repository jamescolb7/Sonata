import express, { Request, Response } from "express";
import next from "next";
import morgan from 'morgan';
import router from './server/router';
import { CSRF, Auth } from "./server/auth";
import Image from "./server/image";

const port = parseInt(process.env.PORT as string, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const guestsAllowed = process.env.GUESTS_ALLOWED as string ?? false;

const app = next({ dev, hostname: '127.0.0.1', port });

const handle = app.getRequestHandler();

app.prepare().then(() => {
	const server = express();

	if (!dev) server.use(morgan('tiny'));
	server.use('/image', Image);
	server.use(CSRF);
	server.use(Auth);
	server.use('/api', router);

	server.all('*', (req: Request, res: Response) => {
		const path = req.path ?? "";
		//Static assets
		if (path.startsWith('/_next/')) return handle(req, res);
		//Guest access
		if ((path.startsWith('/track/') || path.startsWith('/album/') || path.startsWith('/artist/')) && !res.locals.user && guestsAllowed === "true") return handle(req, res);
		if (!res.locals.user) return app.render(req, res, '/login');
		//Only set the player url if the user is logged in
		req.headers['player_url'] = process.env.PLAYER_URL as string
		return handle(req, res);
	});

	server.listen(port, () => {
		console.log(`Ready on http://localhost:${port}`);
	});
});