import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import * as relations from './relations';

const sqlite = new Database(process.env.DATABASE_URL ? (process.env.DATABASE_URL.replace(/\/?$/, '/') ?? "") + "database.db" : "database.db");
export const db = drizzle(sqlite, { schema: { ...schema, ...relations } });