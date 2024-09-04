import { Request, Response, NextFunction } from "express";
import { lucia } from "~/lib/auth";

export default async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
  if (!sessionId) {
    res.locals.user = null;
    res.locals.session = null;

    //Login page
    let guestPath = ['/track/', '/album/', '/artist/', '/login', '/assets/', '/public/', '/favicon.ico'].findIndex(p => {
      return req.path.startsWith(p);
    })

    if (req.path.startsWith('/api/')) return res.sendStatus(401);

    if (guestPath < 0) return res.redirect('/login');

    return next();
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