import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { CORSPlugin } from '@orpc/server/plugins';
import { db } from './db/client';
import { handleApiDocs, handleOpenApiSpec } from './docs';
import { appRouter } from './orpc/router';

const handler = new OpenAPIHandler(appRouter, {
	plugins: [new CORSPlugin()],
});

export default {
	async fetch(req, env, ctx): Promise<Response> {
		const { matched, response } = await handler.handle(req, {
			prefix: '/api',
			context: { req, env, cf_ctx: ctx, db },
		});

		if (matched) return response;

		switch (new URL(req.url).pathname) {
			case '/spec.json':
				return handleOpenApiSpec();
			case '/':
			case '/docs':
				return handleApiDocs();
			default:
				return new Response('No procedure found for this route', {
					status: 404,
				});
		}
	},
} satisfies ExportedHandler<Env>;
