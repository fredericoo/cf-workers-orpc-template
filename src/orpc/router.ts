import { healthRouter } from '~/features/health/health.router';
import { todosRouter } from '~/features/todos/todos.router';

export const appRouter = {
	health: healthRouter,
	todos: todosRouter,
};

export type AppRouter = typeof appRouter;
