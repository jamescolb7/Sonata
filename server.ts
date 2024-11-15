import 'dotenv/config';

import express from 'express';
import next from 'next';
import morgan from 'morgan';

import Image from './server/image';
import { Auth, CSRF } from './server/auth';
import Actions from './server/actions';
import StreamRoute from './server/stream';
import { init as deezerPluginInit } from './server/plugins/deezer';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const guestsAllowed = process.env.GUESTS_ALLOWED === "true";

const app = next({ dev, hostname: '127.0.0.1', port });

const handle = app.getRequestHandler();

app.prepare().then(() => {
	const server = express();

	//Production request logging
	server.use(morgan(dev ? 'tiny' : 'combined'));

	//API Middleware
	server.disable('x-powered-by');
	server.use(CSRF);
	server.use(Auth);

	//Auth Checking
	const allowedPaths = ["/login", "/assets/", "/public/", "/favicon.ico", "/_next/"];
	if (guestsAllowed) allowedPaths.push('/browse', '/track/', '/album/', '/artist/', '/image');

	server.use((req, res, next) => {
		if (res.locals.user) return next();

		if (req.path.startsWith('/api/')) return res.status(401).send({ error: "unauthorized" });

		const path = req.path ?? "";
		const guestPath = allowedPaths.findIndex(p => {
			if (path === "/" && guestsAllowed) return true;
			return path.startsWith(p);
		})

		if (guestPath >= 0) return next();

		return app.render(req, res, '/login');
	})

	//API Routes
	server.get('/image', Image);
	server.get('/api/stream/:plugin/:id', StreamRoute);
	server.use(express.static('public'));
	server.use('/api', Actions);

	server.all('*', (req, res) => {
		//Auth validation
		return handle(req, res);
	})

	server.listen(port, () => {
		console.log(`Ready on http://localhost:${port}`);
	})
})

deezerPluginInit();