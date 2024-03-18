import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { lucia } from '@/lib/Auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import { generateId } from 'lucia';
import { cookies } from "next/headers";
import Form from '@/components/Form';

export default function Auth() {
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
									<Input
										id="email"
										name="email"
										placeholder="Email"
										type="email"
										autoCapitalize="none"
										autoComplete="off"
										autoCorrect="off"
									/>
									<Label className="sr-only" htmlFor="password">
										Password
									</Label>
									<Input
										id="password"
										name="password"
										placeholder="Password"
										type="password"
										autoCapitalize="none"
										autoComplete="off"
										autoCorrect="off"
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

async function login(_: any, formData: FormData): Promise<any> {
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

	const hashedPassword = bcrypt.hashSync(password, 10);

	const userId = generateId(15);

	const client = new PrismaClient();

	const existingUser = await client.user.findFirst({
		where: {
			email: email as string
		}
	})

	if (!existingUser) {
		//Create a user where one does not exist
		await client.user.create({
			data: {
				id: userId,
				email: email,
				hashed_password: hashedPassword
			}
		})

		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	} else {
		const validPassword = bcrypt.compareSync(password, existingUser.hashed_password);
		if (!validPassword) return { error: "Invalid Password" }

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	}

	return redirect('/');
}