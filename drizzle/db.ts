import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import * as relations from './relations';

const sqlite = new Database("./database/database.db");
export const db = drizzle(sqlite, { schema: { ...schema, ...relations } });