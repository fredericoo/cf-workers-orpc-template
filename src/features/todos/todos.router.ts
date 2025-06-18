import { type SQL, desc, eq, isNotNull, isNull } from 'drizzle-orm';
import { takeFirst } from 'drizzle-toolbelt';
import * as v from 'valibot';
import { todos, todosInsertSchema, todosSelectSchema, todosUpdateSchema } from '~/db/schema';
import { publicProcedure } from '~/orpc/init';
import { ulid } from '../common/ulid';

export const todosRouter = {
	list: publicProcedure
		.route({
			path: '/todos',
			method: 'GET',
			description: 'Get all todos',
			tags: ['Todos'],
		})
		.input(
			v.object({
				show: v.optional(v.picklist(['all', 'completed', 'incomplete']), 'all'),
			}),
		)
		.output(v.array(todosSelectSchema))
		.handler(async ({ context: { db }, input }) => {
			const statusFilter: Record<typeof input.show, SQL | undefined> = {
				all: undefined,
				completed: isNotNull(todos.completedAt),
				incomplete: isNull(todos.completedAt),
			};

			const rows = await db
				.select()
				.from(todos)
				.where(statusFilter[input.show])
				.orderBy(desc(todos.createdAt))
				.execute();

			return rows;
		}),

	create: publicProcedure
		.route({
			path: '/todos',
			method: 'POST',
			description: 'Create a todo',
			tags: ['Todos'],
		})
		.input(v.pick(todosInsertSchema, ['title']))
		.output(todosSelectSchema)
		.errors({ NOT_FOUND: { message: 'Todo not found' } })
		.handler(async ({ context: { db }, input, errors }) => {
			const created = await db
				.insert(todos)
				.values({
					id: ulid(),
					title: input.title,
				})
				.returning()
				.then(takeFirst);

			if (!created) throw errors.NOT_FOUND;
			return created;
		}),

	update: publicProcedure
		.route({
			path: '/todos/{id}',
			method: 'PUT',
			description: 'Update a todo',
			tags: ['Todos'],
			/** this makes the input structure detailed, so we can validate path params etc */
			inputStructure: 'detailed',
		})
		.input(
			v.object({
				params: v.object({ id: v.string() }),
				body: v.partial(v.pick(todosUpdateSchema, ['title', 'completedAt'])),
			}),
		)
		.output(todosSelectSchema)
		.errors({ NOT_FOUND: { message: 'Todo not found' } })
		.handler(async ({ context: { db }, input, errors }) => {
			const updated = await db
				.update(todos)
				.set(input.body)
				.where(eq(todos.id, input.params.id))
				.returning()
				.then(takeFirst);
			if (!updated) throw errors.NOT_FOUND;
			return updated;
		}),
};
