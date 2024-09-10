import { defineConfig } from "drizzle-kit";
import 'dotenv/config';

export default defineConfig({
    dialect: "sqlite",
    schema: "./drizzle/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: "file:" + (process.env.DATABASE_URL ? (process.env.DATABASE_URL.replace(/\/?$/, '/') ?? "") + "database.db" : "database.db")
    }
});