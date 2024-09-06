import { createContext } from 'remix-create-express-app/context';
import { MiddlewareFunctionArgs } from 'remix-create-express-app/middleware';
import { type User } from 'lucia';
import { lucia } from '~/lib/auth';
import { json, redirect } from '@remix-run/node';

export const UserContext = createContext<User | null>();

export async function getAuth({ request, context, next }: MiddlewareFunctionArgs) {
  const sessionCookie = request.headers.get('Cookie');

  const sessionId = lucia.readSessionCookie(sessionCookie ?? "");

  if (!sessionId) {
    context.set(UserContext, null);

    const path = new URL(request.url).pathname;

    //Login page
    let guestPath = ['/track/', '/album/', '/artist/', '/login', '/assets/', '/public/', '/favicon.ico'].findIndex(p => {
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