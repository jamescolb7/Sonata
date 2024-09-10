import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "sqlite",
    schema: "./drizzle/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: "file:" + (process.env.DATABASE_URL ? (process.env.DATABASE_URL.replace(/\/?$/, '/') ?? "") + "database.db" : "database.db")
    }
});