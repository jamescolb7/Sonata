import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { lucia } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { generateId } from 'lucia';
import { cookies } from "next/headers";
import Form from '@/components/form';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm';
import { user } from '@/drizzle/schema';
import { Metadata } from 'next';
import { hash, verify } from '@node-rs/argon2';

export const metadata: Metadata = {
	title: "Login - Sonata",
	description: "Your self-hosted music streaming platform."
}

export default function Login() {
	return (
		<div className="container relative flex-col items-center justify-center md:grid w-full">
			<div className="lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="text-2xl font-semibold tracking-tight">
							Log in
						</h1>
						<p className="text-sm text-muted-foreground">
							Accessing this page requires authentication. Please enter your email below to login to your existing account, or to create one.
						</p>
					</div>
					<div className="grid gap-6">
						<Form action={login}>
							<div className="grid gap-2">
								<div className="grid gap-1">
									<Label className="sr-only" htmlFor="email">
										Email
									</Label>
									<Input id="email" name="email" placeholder="Email" type="email" autoCapitalize="none" autoComplete="off" autoCorrect="off"
									/>
									<Label className="sr-only" htmlFor="password">
										Password
									</Label>
									<Input id="password" name="password" placeholder="Password" type="password" autoCapitalize="none" autoComplete="off" autoCorrect="off"
									/>
								</div>
								<Button>
									Submit
								</Button>
							</div>
						</Form>
					</div>
				</div>
			</div>
		</div>
	)
}

async function login(_: unknown, formData: FormData): Promise<{ error: string | null }> {
	"use server";
	const email = formData.get("email");

	if (typeof email !== "string" || email.length < 3 || email.length > 31 || !/.+@.+/.test(email)) {
		return {
			error: "Invalid email"
		};
	}

	const password = formData.get("password");

	if (typeof password !== "string" || password.length < 6 || password.length > 255) {
		return {
			error: "Invalid password"
		};
	}

	const existingUser = await db.query.user.findFirst({
		where: eq(user.email, email)
	})

	if (!existingUser) {
		//Prevent signups if disabled by instance owner
		const signupAllowed = process.env.SIGNUPS_ALLOWED === "true";
		if (!signupAllowed) return { error: "Invalid email or password" };

		//Password hashing
		const userId = generateId(15);
		const hashedPassword = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		})

		//Create a user where one does not exist
		await db.insert(user).values({
			id: userId,
			email: email,
			hashedPassword: hashedPassword
		})

		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		(await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	} else {
		const validPassword = await verify(password, existingUser.hashedPassword);
		if (!validPassword) return { error: "Invalid password or password" }

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		(await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	}

	return redirect('/');
}