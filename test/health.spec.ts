import { createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { beforeEach, describe, expect, it } from 'vitest';
import { getClient } from './setup';

describe('Health router', () => {
	let client: ReturnType<typeof getClient>;
	let ctx: ExecutionContext;

	beforeEach(() => {
		ctx = createExecutionContext();
		client = getClient(ctx);
	});

	it('/health returns the current timestamp', async () => {
		const result = await client.health.check();

		await waitOnExecutionContext(ctx);

		expect(result).toBeDefined();
		expect(typeof result.timestamp).toBe('number');
		// timestamp should be within reasonable range (±5s) from now
		const now = Date.now();
		expect(result.timestamp).toBeGreaterThanOrEqual(now - 5000);
		expect(result.timestamp).toBeLessThanOrEqual(now + 5000);
	});
});
