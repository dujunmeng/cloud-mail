import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const dailyCount = sqliteTable('daily_count', {
	date: text('date').primaryKey(),
	count: integer('count').notNull().default(0),
});
