import { todosRouter } from '~/features/todos/todos.router';

export const appRouter = {
	todos: todosRouter,
};

export type AppRouter = typeof appRouter;
