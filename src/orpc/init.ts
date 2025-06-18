import { os } from '@orpc/server';
import type { Database } from '~/db/client';

export interface AppContext {
	req: Request;
	env: Env;
	cf_ctx: ExecutionContext;
	db: Database;
}

const base = os.$context<AppContext>().errors({
	INTERNAL_SERVER_ERROR: { message: 'Internal server error' },
});

export const publicProcedure = base;
