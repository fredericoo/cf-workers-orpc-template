import { defineConfig } from "drizzle-kit";

declare const process: {
	env: Record<string, string>;
};

export default defineConfig({
	dialect: "sqlite",
	driver: "d1-http",
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	migrations: {
		table: "migrations",
		schema: "drizzle",
	},
	dbCredentials: {
		accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? "",
		databaseId: process.env.CLOUDFLARE_DATABASE_ID ?? "",
		token: process.env.CLOUDFLARE_D1_TOKEN ?? "",
	},
});
