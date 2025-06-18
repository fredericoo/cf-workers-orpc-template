import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-valibot';
import * as v from 'valibot';
import { vDateString } from '~/features/common/schema';

const uuid = text({ length: 26 }).primaryKey();

export const todos = sqliteTable('todos', {
	id: uuid,
	title: text('title').notNull(),
	createdAt: text('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
	completedAt: text('completedAt'),
});

export const todosSelectSchema = createSelectSchema(todos, {
	/** narrower validation so we don't accept any arbitrary strings as date */
	createdAt: vDateString,
	completedAt: v.nullable(vDateString),
});
export const todosUpdateSchema = createUpdateSchema(todos, {
	createdAt: vDateString,
	completedAt: v.nullable(vDateString),
});
export const todosInsertSchema = createInsertSchema(todos, {
	createdAt: vDateString,
	completedAt: v.nullable(vDateString),
});
