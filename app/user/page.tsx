import { Muted, Title } from "@/components/text";
import { lucia } from "@/lib/auth";
import { Metadata } from "next";
import { cookies } from "next/headers";

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
			<Title>{user.user.email}</Title>
			<Muted>User since {user.user.createdAt.toString()}</Muted>
		</>
	)
}