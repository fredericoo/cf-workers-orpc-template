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

	it('/todos creates a new todo', async () => {
		const title = `Test todo ${Date.now()}`;
		const created = await client.todos.create({ title });

		await waitOnExecutionContext(ctx);

		expect(created).toBeDefined();
		expect(created.title).toBe(title);
		expect(typeof created.id).toBe('string');
		expect(created.completedAt).toBeNull();
	});

	it('/todos/{id} updates an existing todo', async () => {
		// First, create a todo that we can update
		const initialTitle = `Initial ${Date.now()}`;
		const created = await client.todos.create({ title: initialTitle });

		await waitOnExecutionContext(ctx);

		const updatedTitle = `${initialTitle} - updated`;
		const updated = await client.todos.update({
			params: { id: created.id },
			body: { title: updatedTitle },
		});

		await waitOnExecutionContext(ctx);

		expect(updated).toBeDefined();
		expect(updated.id).toBe(created.id);
		expect(updated.title).toBe(updatedTitle);
	});
});
