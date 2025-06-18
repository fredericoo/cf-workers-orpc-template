import * as v from 'valibot';
import { publicProcedure } from '~/orpc/init';

export const healthRouter = {
	check: publicProcedure
		.route({
			path: '/health',
			method: 'GET',
			description: 'Health check endpoint',
			tags: ['Health'],
		})
		.output(
			v.object({
				timestamp: v.number(),
			}),
		)
		.handler(() => {
			return { timestamp: Date.now() };
		}),
};
