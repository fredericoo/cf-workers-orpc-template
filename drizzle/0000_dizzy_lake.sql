CREATE TABLE `todos` (
	`id` text(26) PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`completedAt` text
);
