import { NextFunction, Request, Response } from 'express';
import { lucia } from '~/lib/auth';

const guestsAllowed = process.env.GUESTS_ALLOWED || "false";

export default async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
    //API Variation of auth middleware
    if (guestsAllowed === "true" && req.path.startsWith('/search')) return next();
    const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
    if (!sessionId) return res.sendStatus(401);
    const { session, user } = await lucia.validateSession(sessionId);
    if (!session) return res.sendStatus(401);
    res.locals.session = session;
    res.locals.user = user;
    return next();
}