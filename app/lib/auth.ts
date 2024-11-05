import { Lucia } from "lucia";
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from 'drizzle/db';
import { user, session } from "drizzle/schema";

const adapter = new DrizzleSQLiteAdapter(db, session, user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: process.env.NODE_ENV === "production"
		}
	},
	getUserAttributes: (attributes) => {
		return {
			email: attributes.email,
			createdAt: attributes.createdAt
		};
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia
		DatabaseUserAttributes: DatabaseUserAttributes
	}
}

interface DatabaseUserAttributes {
	email: string
	createdAt: Date
}