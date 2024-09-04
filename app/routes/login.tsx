import { useActionData, useBlocker } from "@remix-run/react"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Form } from '@remix-run/react';
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { db } from "drizzle/db";
import { eq } from "drizzle-orm";
import { user } from "drizzle/schema";
import { Muted } from "~/components/text";
import { generateId } from 'lucia';
import { hash, verify } from "@node-rs/argon2";
import { lucia } from "~/lib/auth";
import { createCookie, json } from "@remix-run/node";

export default function Login() {
  const blocker = useBlocker(({ currentLocation, nextLocation }) => currentLocation.pathname !== nextLocation.pathname)

  const formResData = useActionData<typeof action>();

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
            <Form method="post">
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
            {formResData && <Muted>{formResData.error}</Muted>}
            {/* {signupAllowed === "false" && <Muted>Signups have been disabled on this instance.</Muted>} */}
          </div>
        </div>
      </div>
    </div>
  )
}

export async function action({
  request
}: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  if (typeof email !== "string" || email.length < 3 || email.length > 31 || !/.+@.+/.test(email)) {
    return {
      error: "Invalid email"
    };
  }

  if (typeof password !== "string" || password.length < 6 || password.length > 255) {
    return {
      error: "Invalid password"
    };
  }

  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, email)
  })

  console.log(existingUser);

  if (!existingUser) {
    //Create user

    const userId = generateId(15);

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    })

    await db.insert(user).values({
      id: userId,
      email: email,
      hashedPassword: passwordHash
    })

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    const cookieHeaders = new Headers();
    cookieHeaders.append('Set-Cookie', sessionCookie.serialize())
    cookieHeaders.append('Location', '/');

    return json({ error: "" }, { headers: cookieHeaders });
  } else {
    //Login user

    const validPassword = await verify(existingUser.hashedPassword, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });

    if (!validPassword) {
      return {
        error: "Invalid email or password"
      }
    }

    const session = await lucia.createSession(existingUser.id, {});

    const cookieHeaders = new Headers();
    cookieHeaders.append('Set-Cookie', lucia.createSessionCookie(session.id).serialize())
    cookieHeaders.append('Location', '/');

    return json({ error: "" }, { headers: cookieHeaders });
  }
}