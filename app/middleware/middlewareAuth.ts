import { createContext } from 'remix-create-express-app/context';
import { MiddlewareFunctionArgs } from 'remix-create-express-app/middleware';
import { type User } from 'lucia';
import { lucia } from '~/lib/auth';
import { json, redirect } from '@remix-run/node';

export const UserContext = createContext<User | null>();

const guestsAllowed = process.env.GUESTS_ALLOWED || "false";

export async function getAuth({ request, context, next }: MiddlewareFunctionArgs) {
  const sessionCookie = request.headers.get('Cookie');

  const sessionId = lucia.readSessionCookie(sessionCookie ?? "");

  if (!sessionId) {
    context.set(UserContext, null);

    const path = new URL(request.url).pathname;
    let allowedPaths = ['/login', '/assets/', '/public/', '/favicon.ico']

    if (guestsAllowed === "true") allowedPaths.push('/browse', '/editorial/', '/track/', '/album/', '/artist/');

    //Login page
    let guestPath = allowedPaths.findIndex(p => {
      if (guestsAllowed === "true" && path === "/") return true;
      return path.startsWith(p);
    })

    if (path.startsWith('/api/')) return json({ error: "unauthorized" }, { status: 401 });
    if (guestPath < 0) return redirect('/login');

    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  context.set(UserContext, user);

  const response = await next();

  if (session && session.fresh) {
    response.headers.append("Set-Cookie", lucia.createSessionCookie(session.id).serialize());
  }
  if (!session) {
    response.headers.append("Set-Cookie", lucia.createBlankSessionCookie().serialize());
  }

  return response;
}