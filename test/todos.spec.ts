import { createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { beforeEach, describe, expect, it } from 'vitest';
import { getClient } from './setup';

describe('User router', () => {
	let client: ReturnType<typeof getClient>;
	let ctx: ExecutionContext;

	beforeEach(async () => {
		ctx = createExecutionContext();
		client = getClient(ctx);
	});

	it('/todos responds with todos', async () => {
		const result = await client.todos.list({ show: 'all' });

		await waitOnExecutionContext(ctx);
		expect(Array.isArray(result)).toBe(true);
	});
});
