import path from "node:path";
import {
	defineWorkersProject,
	readD1Migrations,
} from "@cloudflare/vitest-pool-workers/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineWorkersProject(async () => {
	const migrationsPath = path.join(__dirname, "drizzle");
	const migrations = await readD1Migrations(migrationsPath);

	return {
		plugins: [tsconfigPaths()],
		test: {
			setupFiles: ["./test/apply-migrations.ts"],
			poolOptions: {
				workers: {
					singleWorker: true,
					wrangler: { configPath: "./wrangler.jsonc" },
					miniflare: {
						bindings: { TEST_MIGRATIONS: migrations },
					},
				},
			},
		},
	};
});
