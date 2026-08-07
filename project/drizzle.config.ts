import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Explicitly load .env.local
config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL environment variable is required");
}

export default defineConfig({
	out: "./migrations",
	schema: "./lib/db/schema",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
});
