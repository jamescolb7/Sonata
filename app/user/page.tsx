import { Muted, Title } from "@/components/Text";
import { cookies } from "next/headers";
import { lucia } from '@/lib/Auth'
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

async function validateRequest() {
	let sessionId = cookies().get(lucia.sessionCookieName)?.value
	if (!sessionId) return { user: null, session: null };
	const user = await lucia.validateSession(sessionId);
	return user;
}

export default async function User() {
	const user = await validateRequest();

	return (
		<>
			<Title>{user.user?.email}</Title>
			<Muted>Created on {user.user?.createdAt.toString()}</Muted>
			<form action={logout}>
				<Button className="mt-5" variant="destructive" onClick={logout}>Log Out</Button>
			</form>
		</>
	)
}

async function logout() {
	"use server";
	const { session } = await validateRequest();

	if (!session) {
		return {
			error: "Unauthorized"
		};
	}

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return redirect("/login");
}