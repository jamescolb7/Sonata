import { NextFunction, Request, Response } from "express";
import { lucia } from "@/lib/auth";
import { verifyRequestOrigin } from "lucia";

export function CSRF(req: Request, res: Response, next: NextFunction) {
	if (req.method === "GET") return next();
	const origin = req.headers.origin ?? null;
	const host = req.headers.host ?? null;
	if (!origin || !host || !verifyRequestOrigin(origin, [host])) {
		return res.sendStatus(403);
	} else {
		return next();
	};
}

export async function Auth(req: Request, res: Response, next: NextFunction) {
	let sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
	if (!sessionId) {
		sessionId = lucia.readBearerToken(req.headers.authorization ?? "");

		if (!sessionId) {
			res.locals.user = null;
			res.locals.session = null;
			return next();
		}
	}
	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		res.appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize());
	}
	if (!session) {
		res.appendHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize());
	}
	res.locals.session = session;
	res.locals.user = user;
	return next();
}