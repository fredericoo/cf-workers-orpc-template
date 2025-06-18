import { env } from 'cloudflare:test';
import { createRouterClient } from '@orpc/server';
import { db } from '~/db/client';
import { appRouter } from '~/orpc/router';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

export function getClient(ctx: ExecutionContext) {
	return createRouterClient(appRouter, {
		context: {
			db,
			env,
			req: new IncomingRequest('http://localhost:8080'),
			cf_ctx: ctx,
		},
	});
}
