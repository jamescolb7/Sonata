import express, { Request, Response } from 'express';
import proxy from 'express-http-proxy';

const router = express.Router();

router.use('', proxy('api.deezer.com'))

export default router;