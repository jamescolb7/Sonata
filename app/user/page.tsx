import { Muted, Title } from "@/components/text";
import { Button } from "@/components/ui/button";
import { lucia } from "@/lib/auth";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "User - Sonata",
	description: "Your self-hosted music streaming platform."
}

async function validateRequest() {
	const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value
	if (!sessionId) return { user: null, session: null };
	const user = await lucia.validateSession(sessionId);
	return user;
}

export default async function User() {
	const user = await validateRequest();
	if (!user.user) return;

	return (
		<>
			<Title>Hi, {user.user.email}.</Title>
			<Muted>User since {user.user.createdAt.toString()}</Muted>
			<div className="flex gap-x-2 mt-4">
				<Button variant="destructive" onClick={logout}>Logout</Button>
			</div>
		</>
	)
}

async function logout() {
	'use server';

	const { session } = await validateRequest();

	if (!session) return { error: "Unauthorized" };

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	(await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return redirect("/login");
}