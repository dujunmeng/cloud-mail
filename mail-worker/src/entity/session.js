import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const session = sqliteTable('session', {
	userId: integer('user_id').primaryKey(),
	tokens: text('tokens').notNull().default('[]'),
	userData: text('user_data').notNull().default('{}'),
	refreshTime: text('refresh_time').notNull().default(''),
	expireTime: text('expire_time').notNull().default(''),
});
