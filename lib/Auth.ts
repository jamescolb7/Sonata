import { Lucia, Session, User } from "lucia";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";

import { webcrypto } from "crypto";
globalThis.crypto = webcrypto as Crypto;

const client = new PrismaClient();

const adapter = new PrismaAdapter(client.session, client.user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: process.env.NODE_ENV === "production"
		}
	},
	getUserAttributes: (attributes) => {
		return {
			email: attributes.email
		};
	}
});

interface ValidatedRequest {
	user: User | null,
	session: Session | null
}

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia
	}
}